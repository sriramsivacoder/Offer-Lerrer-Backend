/**
 * Template Engine Utility
 * Replaces placeholders in template HTML with actual recipient data
 */

// Map of CSV column names to placeholder keys
const PLACEHOLDER_MAP = {
  name: 'name',
  email: 'email',
  Phone: 'Phone',
  Organization: 'Organization',
  'Registration Date': 'RegistrationDate',
  'Payment Status': 'PaymentStatus',
  'Attendance Status': 'AttendanceStatus',
  Status: 'Status',
  AICTE_Code: 'AICTE_Code',
  Role: 'Role',
  Duration: 'Duration',
  'Start Date': 'StartDate',
  Mode: 'Mode',
  Internship_Name: 'Internship_Name',
  Partner_Name: 'Partner_Name',
};

/**
 * Replace all placeholders in template with recipient data
 * @param {string} template - HTML template string with {placeholder} syntax
 * @param {object} data - Recipient data object
 * @returns {string} - Template with placeholders replaced
 */
const replacePlaceholders = (template, data) => {
  let result = template;

  // Replace using placeholder map (handles spaces in CSV column names)
  Object.entries(PLACEHOLDER_MAP).forEach(([csvKey, placeholder]) => {
    const regex = new RegExp(`\\{${placeholder}\\}`, 'g');
    const value = data[csvKey] || data[placeholder] || '';
    result = result.replace(regex, value);
  });

  return result;
};

/**
 * Strip HTML tags and return plain text
 * Used for PDF text content extraction
 */
const stripHtml = (html) => {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

module.exports = { replacePlaceholders, stripHtml, PLACEHOLDER_MAP };
