const { generateOfferLetterPDF } = require('../utils/pdfGenerator');
const { replacePlaceholders } = require('../utils/templateEngine');
const fs = require('fs');
const path = require('path');

/**
 * PDF Controller
 * Handles PDF generation and preview
 */

/**
 * POST /api/generate-pdf
 * Generate a PDF offer letter for a single recipient
 * Returns the PDF as a downloadable file
 */
const generatePDF = async (req, res, next) => {
  try {
    const { recipient, templateHtml, logoUrl } = req.body;

    if (!recipient || !templateHtml) {
      return res.status(400).json({
        success: false,
        message: 'Recipient data and template HTML are required',
      });
    }

    // Load logo if provided
    let logoBuffer = null;
    if (logoUrl) {
      try {
        const logoPath = path.join(__dirname, '..', logoUrl);
        if (fs.existsSync(logoPath)) {
          logoBuffer = fs.readFileSync(logoPath);
        }
      } catch (err) {
        console.warn('Logo not found:', err.message);
      }
    }

    // Generate PDF
    const pdfBuffer = await generateOfferLetterPDF(recipient, templateHtml, logoBuffer);

    // Send PDF as response
    const recipientName = recipient.name || recipient.Name || 'Recipient';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Offer_Letter_${recipientName.replace(/\s+/g, '_')}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/preview-pdf
 * Generate a PDF preview (returns base64)
 */
const previewPDF = async (req, res, next) => {
  try {
    const { recipient, templateHtml, logoUrl } = req.body;

    if (!recipient || !templateHtml) {
      return res.status(400).json({
        success: false,
        message: 'Recipient data and template HTML are required',
      });
    }

    // Load logo if provided
    let logoBuffer = null;
    if (logoUrl) {
      try {
        const logoPath = path.join(__dirname, '..', logoUrl);
        if (fs.existsSync(logoPath)) {
          logoBuffer = fs.readFileSync(logoPath);
        }
      } catch (err) {
        console.warn('Logo not found:', err.message);
      }
    }

    const pdfBuffer = await generateOfferLetterPDF(recipient, templateHtml, logoBuffer);
    const base64 = pdfBuffer.toString('base64');

    res.json({
      success: true,
      data: base64,
      mimeType: 'application/pdf',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { generatePDF, previewPDF };
