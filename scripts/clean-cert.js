const sharp = require('sharp');
const fs = require('fs');

async function cleanCert() {
  const { width, height } = await sharp('public/images/certificate-template.jpg').metadata();
  console.log('Template size:', width, height);

  // We want to clean the entire middle area where the mock text was:
  // - "This is proudly presented to" (y ~ 360)
  // - "fgsafds" (y ~ 410)
  // - "for successfully passing..." (y ~ 480)
  // - "Bhagavad-gita Wisdom Challenge" (y ~ 520)
  // - "securing a score of 22 / 90" (y ~ 560)
  // - and bottom-left "Date: 24 November 2026", "ID: SR-222215" (x: 120-330, y: 560-600)
  
  // Notice that bottom-left date & ID was also baked into the template!
  // In the user's screenshot media_1795510361586_53c0b767.jpg, the dynamic date "24 November 2026" was rendered OVER the baked-in date!
  // So we must cleanly remove the baked-in date and ID as well!

  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="58%" r="48%" fx="50%" fy="58%">
          <stop offset="0%" stop-color="#FFFBF0" stop-opacity="1" />
          <stop offset="35%" stop-color="#FEF5D8" stop-opacity="0.99" />
          <stop offset="70%" stop-color="#FDEEC2" stop-opacity="0.97" />
          <stop offset="90%" stop-color="#FCE5AC" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#F8DC9B" stop-opacity="0.9" />
        </radialGradient>

        <linearGradient id="datePatch" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FCE1A2" stop-opacity="0.98" />
          <stop offset="50%" stop-color="#FCE9B8" stop-opacity="0.98" />
          <stop offset="100%" stop-color="#FDF0C8" stop-opacity="0.98" />
        </linearGradient>

        <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="microBlur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <!-- Center text area patch (eliminating presented to, name, passing in, challenge, score) -->
      <!-- Soft feathered background -->
      <ellipse cx="512" cy="460" rx="310" ry="145" fill="url(#sunGlow)" filter="url(#softBlur)" />
      <!-- Solid smooth parchment fill -->
      <ellipse cx="512" cy="460" rx="285" ry="125" fill="url(#sunGlow)" />

      <!-- Left Date & ID baked-in text patch (x: 120 to 330, y: 560 to 600) -->
      <rect x="120" y="555" width="220" height="50" rx="8" fill="url(#datePatch)" filter="url(#microBlur)" />

      <!-- Center-bottom baked-in logo text patch (around x: 410 to 614, y: 575 to 605) -->
      <rect x="410" y="575" width="204" height="30" rx="6" fill="#FDF3CE" filter="url(#microBlur)" />
    </svg>
  `);

  await sharp('public/images/certificate-template.jpg')
    .composite([{ input: svgOverlay, top: 0, left: 0 }])
    .jpeg({ quality: 98 })
    .toFile('public/images/certificate-bg-pure.jpg');

  console.log('Generated certificate-bg-pure.jpg successfully!');
}

cleanCert().catch(console.error);
