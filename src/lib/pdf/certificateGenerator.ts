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
  // Create an exact aspect ratio PDF Document (842 x 506 pt) matching 1024x615 certificate
  const pdfDoc = await PDFDocument.create();
  const certWidth = 842;
  const certHeight = 506;
  const page = pdfDoc.addPage([certWidth, certHeight]);
  const { width, height } = page.getSize();

  // Embed standard professional fonts
  const fontTimesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontTimes = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Colors matching official certificate
  const nameColor = rgb(0.24, 0.08, 0.04);      // Deep rich maroon/brown #3d140a
  const titleColor = rgb(0.55, 0.08, 0.08);     // Scriptural crimson #8c1414
  const darkSlate = rgb(0.18, 0.18, 0.20);      // #2e2e33
  const metaColor = rgb(0.25, 0.12, 0.05);      // Date & ID color

  // 1. Try embedding the pure clean certificate artwork background
  try {
    const res = await fetch("/images/certificate-bg-pure.jpg");
    if (res.ok) {
      const bgImgBytes = await res.arrayBuffer();
      const bgImage = await pdfDoc.embedJpg(bgImgBytes);
      page.drawImage(bgImage, {
        x: 0,
        y: 0,
        width,
        height,
      });
    }
  } catch (err) {
    console.warn("Could not fetch certificate background image, falling back to vector borders:", err);
    // Fallback: draw gold gradient background & borders
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(0.99, 0.98, 0.95),
    });
    page.drawRectangle({
      x: 20,
      y: 20,
      width: width - 40,
      height: height - 40,
      borderColor: rgb(0.85, 0.47, 0.02),
      borderWidth: 3,
    });
  }

  // 2. Participant Name (Exact center positioning matching template)
  const nameText = data.participantName.trim() || "Devotee Participant";
  const nameSize = nameText.length > 20 ? 24 : 28;
  const nameWidth = fontTimesBold.widthOfTextAtSize(nameText, nameSize);
  page.drawText(nameText, {
    x: (width - nameWidth) / 2,
    y: height - 230,
    size: nameSize,
    font: fontTimesBold,
    color: nameColor,
  });

  // 3. Quiz Title in quotes
  const quizTitle = `“${data.quizTitle}”`;
  const quizSize = quizTitle.length > 35 ? 15 : 17;
  const quizWidth = fontTimesBold.widthOfTextAtSize(quizTitle, quizSize);
  page.drawText(quizTitle, {
    x: (width - quizWidth) / 2,
    y: height - 295,
    size: quizSize,
    font: fontTimesBold,
    color: titleColor,
  });

  // 4. Score & Percentage
  const scoreText = `securing a score of ${data.score} / ${data.totalMarks} (${data.percentage.toFixed(1)}%).`;
  const scoreWidth = fontTimes.widthOfTextAtSize(scoreText, 13);
  page.drawText(scoreText, {
    x: (width - scoreWidth) / 2,
    y: height - 325,
    size: 13,
    font: fontTimes,
    color: darkSlate,
  });

  // 5. Date & Certificate ID (Bottom Left Metadata)
  const dateStr = `Date: ${data.dateStr}`;
  page.drawText(dateStr, {
    x: 130,
    y: 95,
    size: 10,
    font: fontHelveticaBold,
    color: metaColor,
  });

  const idStr = `ID: ${data.certificateId}`;
  page.drawText(idStr, {
    x: 130,
    y: 78,
    size: 10,
    font: fontHelveticaBold,
    color: metaColor,
  });

  return await pdfDoc.save();
}
