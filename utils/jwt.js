const jwt = require('jsonwebtoken');

/**
 * JWT Utility
 * Generates access tokens for authenticated users
 */

const JWT_SECRET = process.env.JWT_SECRET || 'offer-letter-dispatcher-secret-key-2024';
const JWT_EXPIRES_IN = '7d';

/**
 * Generate a JWT access token
 * @param {string} userId - MongoDB user ID
 * @returns {string} - Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token string
 * @returns {object} - Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken, JWT_SECRET };
