const mongoose = require('mongoose');

/**
 * Template Schema
 * Stores offer letter email templates with HTML content
 */
const templateSchema = new mongoose.Schema(
  {
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
