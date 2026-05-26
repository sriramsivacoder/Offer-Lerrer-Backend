const nodemailer = require('nodemailer');

/**
 * Mail Service
 * Handles SMTP transport creation and email sending with Nodemailer
 */

/**
 * Create a Nodemailer transport with provided SMTP settings
 * @param {object} smtpConfig - SMTP configuration
 * @returns {object} - Nodemailer transport
 */
const createTransport = (smtpConfig) => {
  return nodemailer.createTransport({
    host: smtpConfig.host || 'smtp.gmail.com',
    port: smtpConfig.port || 587,
    secure: smtpConfig.secure || false,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass,
    },
  });
};

/**
 * Send a single email with optional PDF attachment
 * @param {object} transport - Nodemailer transport
 * @param {object} options - Email options
 * @param {string} options.from - Sender email/name
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML email body
 * @param {Buffer} [options.pdfBuffer] - PDF attachment buffer
 * @param {string} [options.pdfFilename] - PDF attachment filename
 * @returns {object} - Send result with success/error info
 */
const sendEmail = async (transport, options) => {
  const mailOptions = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  // Attach PDF if provided
  if (options.pdfBuffer) {
    mailOptions.attachments = [
      {
        filename: options.pdfFilename || 'Offer_Letter.pdf',
        content: options.pdfBuffer,
        contentType: 'application/pdf',
      },
    ];
  }

  try {
    const info = await transport.sendMail(mailOptions);
    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Verify SMTP connection
 * @param {object} smtpConfig - SMTP configuration
 * @returns {boolean} - Whether connection is valid
 */
const verifyConnection = async (smtpConfig) => {
  const transport = createTransport(smtpConfig);
  try {
    await transport.verify();
    return { success: true, message: 'SMTP connection verified' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = { createTransport, sendEmail, verifyConnection };
