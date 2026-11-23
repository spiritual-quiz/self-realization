import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export interface CertificateData {
  certificateId: string;
  participantName: string;
  quizTitle: string;
  score: number;
  totalMarks: number;
  percentage: number;
  dateStr: string;
}

export async function generateQuizCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  // Create a Landscape A4 PDF Document (841.89 x 595.28 pt)
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]);
  const { width, height } = page.getSize();

  // Embed standard professional fonts
  const fontTimesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontTimes = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontTimesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Colors
  const goldColor = rgb(0.85, 0.47, 0.02);       // #D97706
  const darkMaroon = rgb(0.27, 0.10, 0.02);      // #451A03
  const darkSlate = rgb(0.12, 0.12, 0.14);       // #1F1F24
  const lightSand = rgb(0.99, 0.98, 0.95);       // Soft background

  // 1. Outer Background
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: lightSand,
  });

  // 2. Double Golden Border with corner flourishes
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: goldColor,
    borderWidth: 3,
  });

  page.drawRectangle({
    x: 28,
    y: 28,
    width: width - 56,
    height: height - 56,
    borderColor: rgb(0.92, 0.70, 0.25),
    borderWidth: 1,
  });

  // 3. Sacred Top Emblems & Header
  const orgName = "SELFREALIZATION • DIGITAL OUTREACH PLATFORM";
  const orgWidth = fontHelveticaBold.widthOfTextAtSize(orgName, 11);
  page.drawText(orgName, {
    x: (width - orgWidth) / 2,
    y: height - 65,
    size: 11,
    font: fontHelveticaBold,
    color: goldColor,
  });

  const titleText = "CERTIFICATE OF DEVOTIONAL EXCELLENCE";
  const titleWidth = fontTimesBold.widthOfTextAtSize(titleText, 26);
  page.drawText(titleText, {
    x: (width - titleWidth) / 2,
    y: height - 105,
    size: 26,
    font: fontTimesBold,
    color: darkMaroon,
  });

  // Subtitle
  const subText = "This is proudly presented to";
  const subWidth = fontTimesItalic.widthOfTextAtSize(subText, 14);
  page.drawText(subText, {
    x: (width - subWidth) / 2,
    y: height - 145,
    size: 14,
    font: fontTimesItalic,
    color: darkSlate,
  });

  // 4. Participant Name (Grand Display)
  const nameText = data.participantName.trim() || "Devotee Participant";
  const nameWidth = fontTimesBold.widthOfTextAtSize(nameText, 32);
  page.drawText(nameText, {
    x: (width - nameWidth) / 2,
    y: height - 200,
    size: 32,
    font: fontTimesBold,
    color: goldColor,
  });

  // Underline beneath name
  page.drawLine({
    start: { x: (width - nameWidth) / 2 - 20, y: height - 212 },
    end: { x: (width + nameWidth) / 2 + 20, y: height - 212 },
    thickness: 1.5,
    color: goldColor,
  });

  // 5. Achievement Description
  const desc1 = `for successfully passing and demonstrating spiritual understanding in`;
  const desc1Width = fontTimes.widthOfTextAtSize(desc1, 14);
  page.drawText(desc1, {
    x: (width - desc1Width) / 2,
    y: height - 248,
    size: 14,
    font: fontTimes,
    color: darkSlate,
  });

  const quizTitle = `“${data.quizTitle}”`;
  const quizWidth = fontTimesBold.widthOfTextAtSize(quizTitle, 18);
  page.drawText(quizTitle, {
    x: (width - quizWidth) / 2,
    y: height - 280,
    size: 18,
    font: fontTimesBold,
    color: darkMaroon,
  });

  const scoreText = `Securing a score of ${data.score} / ${data.totalMarks} (${data.percentage.toFixed(1)}%) with great dedication and sincere inquiry.`;
  const scoreWidth = fontTimes.widthOfTextAtSize(scoreText, 13);
  page.drawText(scoreText, {
    x: (width - scoreWidth) / 2,
    y: height - 315,
    size: 13,
    font: fontTimes,
    color: darkSlate,
  });

  // 6. Sacred Prabhupada Quote
  const quote = `“Chant Hare Kṛṣṇa and be happy. Human life is meant for understanding God.”`;
  const quoteWidth = fontTimesItalic.widthOfTextAtSize(quote, 12);
  page.drawText(quote, {
    x: (width - quoteWidth) / 2,
    y: height - 370,
    size: 12,
    font: fontTimesItalic,
    color: rgb(0.4, 0.4, 0.45),
  });

  // 7. Footer Details: Date, Verification ID, Signatures
  // Left: Date & Certificate ID
  page.drawText(`Date of Issue: ${data.dateStr}`, {
    x: 60,
    y: 80,
    size: 10,
    font: fontHelvetica,
    color: darkSlate,
  });

  page.drawText(`Certificate ID: ${data.certificateId}`, {
    x: 60,
    y: 65,
    size: 9,
    font: fontHelvetica,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Center: Sacred Seal / Lotus Emblem
  const sealText = "SEAL OF EXCELLENCE";
  const sealWidth = fontHelveticaBold.widthOfTextAtSize(sealText, 8);
  page.drawText(sealText, {
    x: (width - sealWidth) / 2,
    y: 70,
    size: 8,
    font: fontHelveticaBold,
    color: goldColor,
  });

  // Right: Signature line
  page.drawLine({
    start: { x: width - 240, y: 95 },
    end: { x: width - 60, y: 95 },
    thickness: 1,
    color: darkMaroon,
  });

  const sigTitle = "Director of Spiritual Outreach";
  const sigWidth = fontHelveticaBold.widthOfTextAtSize(sigTitle, 10);
  page.drawText(sigTitle, {
    x: width - 150 - sigWidth / 2,
    y: 80,
    size: 10,
    font: fontHelveticaBold,
    color: darkMaroon,
  });

  const sigSub = "SelfRealization Platform";
  const sigSubWidth = fontHelvetica.widthOfTextAtSize(sigSub, 9);
  page.drawText(sigSub, {
    x: width - 150 - sigSubWidth / 2,
    y: 67,
    size: 9,
    font: fontHelvetica,
    color: darkSlate,
  });

  return await pdfDoc.save();
}
