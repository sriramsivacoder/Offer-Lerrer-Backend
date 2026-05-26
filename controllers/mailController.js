const { createTransport, sendEmail, verifyConnection } = require('../services/mailService');
const { replacePlaceholders } = require('../utils/templateEngine');
const { generateOfferLetterPDF } = require('../utils/pdfGenerator');
const EmailHistory = require('../models/EmailHistory');
const SmtpSettings = require('../models/SmtpSettings');
const fs = require('fs');
const path = require('path');

/**
 * Mail Controller
 * Handles sending bulk emails with PDF attachments
 */

/**
 * POST /api/send-mails
 * Send offer letters to selected recipients
 */
const sendMails = async (req, res, next) => {
  try {
    const { recipients, template, smtpConfig, logoUrl } = req.body;

    if (!recipients || !recipients.length) {
      return res.status(400).json({ success: false, message: 'No recipients provided' });
    }

    if (!template || !template.html) {
      return res.status(400).json({ success: false, message: 'Template is required' });
    }

    if (!smtpConfig || !smtpConfig.user || !smtpConfig.pass) {
      return res.status(400).json({ success: false, message: 'SMTP configuration is required' });
    }

    // Create mail transport
    const transport = createTransport(smtpConfig);

    // Verify SMTP connection first
    const verification = await verifyConnection(smtpConfig);
    if (!verification.success) {
      return res.status(400).json({
        success: false,
        message: `SMTP verification failed: ${verification.message}`,
      });
    }

    // Save SMTP settings to DB
    await SmtpSettings.findOneAndUpdate(
      { user: smtpConfig.user },
      { ...smtpConfig, isActive: true },
      { upsert: true, new: true }
    );

    // Load logo if provided
    let logoBuffer = null;
    if (logoUrl) {
      try {
        const logoPath = path.join(__dirname, '..', logoUrl);
        if (fs.existsSync(logoPath)) {
          logoBuffer = fs.readFileSync(logoPath);
        }
      } catch (err) {
        console.warn('Could not load logo:', err.message);
      }
    }

    const results = [];
    const fromAddress = `${smtpConfig.fromName || 'Offer Letter Dispatcher'} <${smtpConfig.user}>`;

    // Send emails one-by-one
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      const recipientEmail = recipient.email || recipient.Email;
      const recipientName = recipient.name || recipient.Name || 'Recipient';

      if (!recipientEmail) {
        results.push({
          index: i,
          name: recipientName,
          email: recipientEmail,
          status: 'failed',
          error: 'No email address',
        });
        continue;
      }

      // Replace placeholders in template
      const personalizedHtml = replacePlaceholders(template.html, recipient);
      const personalizedSubject = replacePlaceholders(
        template.subject || 'Offer Letter',
        recipient
      );

      // Generate PDF
      let pdfBuffer;
      try {
        pdfBuffer = await generateOfferLetterPDF(recipient, template.html, logoBuffer);
      } catch (pdfErr) {
        console.error(`PDF generation failed for ${recipientName}:`, pdfErr.message);
        results.push({
          index: i,
          name: recipientName,
          email: recipientEmail,
          status: 'failed',
          error: `PDF generation failed: ${pdfErr.message}`,
        });
        continue;
      }

      // Send email with retry logic
      let sendResult;
      let retryCount = 0;
      const maxRetries = 2;

      while (retryCount <= maxRetries) {
        sendResult = await sendEmail(transport, {
          from: fromAddress,
          to: recipientEmail,
          subject: personalizedSubject,
          html: personalizedHtml,
          pdfBuffer: pdfBuffer,
          pdfFilename: `Offer_Letter_${recipientName.replace(/\s+/g, '_')}.pdf`,
        });

        if (sendResult.success) break;
        retryCount++;

        // Wait before retry
        if (retryCount <= maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      // Log email to database
      await EmailHistory.create({
        recipientName,
        recipientEmail,
        subject: personalizedSubject,
        status: sendResult.success ? 'sent' : 'failed',
        errorMessage: sendResult.error || '',
        retryCount,
        sentAt: sendResult.success ? new Date() : null,
        templateName: template.name || 'Custom',
        metadata: {
          role: recipient.Role,
          organization: recipient.Organization,
        },
      });

      results.push({
        index: i,
        name: recipientName,
        email: recipientEmail,
        status: sendResult.success ? 'sent' : 'failed',
        error: sendResult.error || null,
        messageId: sendResult.messageId || null,
        retryCount,
      });
    }

    const sentCount = results.filter(r => r.status === 'sent').length;
    const failedCount = results.filter(r => r.status === 'failed').length;

    res.json({
      success: true,
      message: `Sent ${sentCount} of ${recipients.length} emails`,
      summary: { total: recipients.length, sent: sentCount, failed: failedCount },
      results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/verify-smtp
 * Verify SMTP credentials
 */
const verifySmtp = async (req, res, next) => {
  try {
    const { host, port, secure, user, pass } = req.body;
    const result = await verifyConnection({ host, port, secure, user, pass });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/smtp-settings
 * Get saved SMTP settings (without password)
 */
const getSmtpSettings = async (req, res, next) => {
  try {
    const settings = await SmtpSettings.findOne({ isActive: true }).select('-pass');
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMails, verifySmtp, getSmtpSettings };
