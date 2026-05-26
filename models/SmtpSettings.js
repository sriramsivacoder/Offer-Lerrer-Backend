const mongoose = require('mongoose');

/**
 * SmtpSettings Schema
 * Stores SMTP configuration for sending emails
 * Only one active configuration at a time
 */
const smtpSettingsSchema = new mongoose.Schema(
  {
    host: {
      type: String,
      required: true,
      default: 'smtp.gmail.com',
    },
    port: {
      type: Number,
      required: true,
      default: 587,
    },
    secure: {
      type: Boolean,
      default: false,
    },
    user: {
      type: String,
      required: [true, 'SMTP user email is required'],
    },
    pass: {
      type: String,
      required: [true, 'SMTP password/app password is required'],
    },
    fromName: {
      type: String,
      default: 'Offer Letter Dispatcher',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SmtpSettings', smtpSettingsSchema);
