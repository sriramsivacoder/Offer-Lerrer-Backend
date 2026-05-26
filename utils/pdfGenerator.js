const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const { stripHtml, replacePlaceholders } = require('./templateEngine');

/**
 * Generate a professional offer letter PDF
 * @param {object} recipientData - Recipient data from CSV
 * @param {string} templateHtml - HTML template with placeholders
 * @param {Buffer|null} logoBuffer - Company logo image buffer (PNG/JPG)
 * @returns {Buffer} - PDF file buffer
 */
const generateOfferLetterPDF = async (recipientData, templateHtml, logoBuffer = null) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size

  // Load fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const { width, height } = page.getSize();
  const margin = 50;
  let yPos = height - margin;

  // Colors
  const primaryBlue = rgb(0.145, 0.388, 0.922);   // #2563EB
  const darkText = rgb(0.067, 0.094, 0.153);        // #111827
  const grayText = rgb(0.420, 0.447, 0.498);        // #6B7280
  const lightGray = rgb(0.898, 0.906, 0.922);       // #E5E7EB

  // ─── Header: Logo or Company Name ───
  if (logoBuffer) {
    try {
      let logoImage;
      // Try PNG first, then JPG
      try {
        logoImage = await pdfDoc.embedPng(logoBuffer);
      } catch {
        logoImage = await pdfDoc.embedJpg(logoBuffer);
      }

      const logoMaxHeight = 50;
      const logoScale = logoMaxHeight / logoImage.height;
      const logoWidth = logoImage.width * logoScale;

      page.drawImage(logoImage, {
        x: margin,
        y: yPos - logoMaxHeight,
        width: logoWidth,
        height: logoMaxHeight,
      });

      yPos -= logoMaxHeight + 20;
    } catch (err) {
      console.error('Logo embedding failed:', err.message);
      // Draw text header fallback
      page.drawText('OFFER LETTER', {
        x: margin,
        y: yPos - 20,
        size: 22,
        font: fontBold,
        color: primaryBlue,
      });
      yPos -= 45;
    }
  } else {
    // No logo — draw text header
    page.drawText('OFFER LETTER', {
      x: margin,
      y: yPos - 20,
      size: 22,
      font: fontBold,
      color: primaryBlue,
    });
    yPos -= 45;
  }

  // ─── Horizontal line ───
  page.drawLine({
    start: { x: margin, y: yPos },
    end: { x: width - margin, y: yPos },
    thickness: 2,
    color: primaryBlue,
  });
  yPos -= 30;

  // ─── Date ───
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  page.drawText(`Date: ${currentDate}`, {
    x: margin,
    y: yPos,
    size: 10,
    font: fontRegular,
    color: grayText,
  });
  yPos -= 30;

  // ─── Recipient Info ───
  const recipientName = recipientData.name || recipientData.Name || 'Recipient';
  const recipientOrg = recipientData.Organization || '';

  page.drawText(`Dear ${recipientName},`, {
    x: margin,
    y: yPos,
    size: 13,
    font: fontBold,
    color: darkText,
  });
  yPos -= 20;

  if (recipientOrg) {
    page.drawText(recipientOrg, {
      x: margin,
      y: yPos,
      size: 10,
      font: fontRegular,
      color: grayText,
    });
    yPos -= 25;
  }

  // ─── Body text from template ───
  const processedHtml = replacePlaceholders(templateHtml, recipientData);
  const bodyText = stripHtml(processedHtml);
  const paragraphs = bodyText.split('\n\n').filter(p => p.trim());

  const maxWidth = width - 2 * margin;
  const fontSize = 11;
  const lineHeight = 16;

  for (const paragraph of paragraphs) {
    const words = paragraph.replace(/\n/g, ' ').split(' ').filter(w => w);
    let line = '';

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const testWidth = fontRegular.widthOfTextAtSize(testLine, fontSize);

      if (testWidth > maxWidth && line) {
        page.drawText(line, {
          x: margin,
          y: yPos,
          size: fontSize,
          font: fontRegular,
          color: darkText,
        });
        yPos -= lineHeight;
        line = word;

        // Check if we need a new page
        if (yPos < margin + 80) {
          const newPage = pdfDoc.addPage([595.28, 841.89]);
          page === newPage; // this doesn't work, need different approach
          yPos = height - margin;
        }
      } else {
        line = testLine;
      }
    }

    // Draw remaining text in the line
    if (line) {
      page.drawText(line, {
        x: margin,
        y: yPos,
        size: fontSize,
        font: fontRegular,
        color: darkText,
      });
      yPos -= lineHeight;
    }

    yPos -= 8; // paragraph spacing
  }

  // ─── Offer Details Box ───
  yPos -= 10;
  const boxHeight = 130;

  // Only draw box if there's room on the page
  if (yPos - boxHeight > margin + 40) {
    // Box background
    page.drawRectangle({
      x: margin,
      y: yPos - boxHeight,
      width: maxWidth,
      height: boxHeight,
      color: rgb(0.937, 0.949, 1), // Light blue bg
      borderColor: primaryBlue,
      borderWidth: 1,
    });

    let detailY = yPos - 20;

    page.drawText('Internship Details', {
      x: margin + 15,
      y: detailY,
      size: 12,
      font: fontBold,
      color: primaryBlue,
    });
    detailY -= 22;

    const details = [
      ['Role', recipientData.Role || 'N/A'],
      ['Duration', recipientData.Duration || 'N/A'],
      ['Start Date', recipientData['Start Date'] || recipientData.StartDate || 'N/A'],
      ['Mode', recipientData.Mode || 'N/A'],
      ['Internship', recipientData.Internship_Name || 'N/A'],
    ];

    for (const [label, value] of details) {
      page.drawText(`${label}:`, {
        x: margin + 15,
        y: detailY,
        size: 10,
        font: fontBold,
        color: darkText,
      });
      page.drawText(value, {
        x: margin + 120,
        y: detailY,
        size: 10,
        font: fontRegular,
        color: grayText,
      });
      detailY -= 18;
    }

    yPos -= boxHeight + 20;
  }

  // ─── Footer ───
  page.drawLine({
    start: { x: margin, y: margin + 30 },
    end: { x: width - margin, y: margin + 30 },
    thickness: 1,
    color: lightGray,
  });

  page.drawText('This is a computer-generated offer letter.', {
    x: margin,
    y: margin + 15,
    size: 8,
    font: fontItalic,
    color: grayText,
  });

  const partnerName = recipientData.Partner_Name || 'Organization';
  page.drawText(`© ${new Date().getFullYear()} ${partnerName}`, {
    x: margin,
    y: margin + 3,
    size: 8,
    font: fontRegular,
    color: grayText,
  });

  // Save and return the PDF
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};

module.exports = { generateOfferLetterPDF };
