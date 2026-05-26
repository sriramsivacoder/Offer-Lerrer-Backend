const mongoose = require('mongoose');

/**
 * EmailHistory Schema
 * Tracks all sent emails with delivery status and metadata
 */
const emailHistorySchema = new mongoose.Schema(
  {
    recipientName: {
      type: String,
      required: true,
    },
    recipientEmail: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['sent', 'failed', 'pending', 'retrying'],
      default: 'pending',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    sentAt: {
      type: Date,
    },
    templateName: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('EmailHistory', emailHistorySchema);
