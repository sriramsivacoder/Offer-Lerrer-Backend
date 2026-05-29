const mongoose = require('mongoose');

/**
 * Template Schema
 * Stores offer letter email templates with HTML content
 * Each template belongs to a specific user (userId)
 * System defaults are cloned per user on first login
 */
const templateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Template name is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Email subject is required'],
      trim: true,
      default: 'Offer Letter - {Internship_Name}',
    },
    html: {
      type: String,
      required: [true, 'Template HTML content is required'],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    logoUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Template', templateSchema);
