const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Upload Controller
 * Handles file uploads (CSV, logos) and sample CSV download
 */

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
const logosDir = path.join(uploadsDir, 'logos');
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// Multer config for logo uploads
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, logosDir),
  filename: (req, file, cb) => {
    const uniqueName = `logo_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const uploadLogo = multer({
  storage: logoStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|svg|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, GIF, SVG, WebP) are allowed'));
    }
  },
}).single('logo');

/**
 * POST /api/upload-logo
 * Upload a company logo for the offer letter
 */
const handleLogoUpload = (req, res, next) => {
  uploadLogo(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const logoPath = `/uploads/logos/${req.file.filename}`;
    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        path: logoPath,
        url: logoPath,
        size: req.file.size,
      },
    });
  });
};

/**
 * GET /api/logos
 * Get list of uploaded logos
 */
const getLogos = (req, res) => {
  try {
    const files = fs.readdirSync(logosDir);
    const logos = files
      .filter(f => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(f))
      .map(f => ({
        filename: f,
        path: `/uploads/logos/${f}`,
        url: `/uploads/logos/${f}`,
      }));

    res.json({ success: true, data: logos });
  } catch (error) {
    res.json({ success: true, data: [] });
  }
};

/**
 * GET /api/sample-csv
 * Download a sample CSV file
 */
const downloadSampleCSV = (req, res) => {
  const csvContent = `name,email,Phone,Organization,Registration Date,Payment Status,Attendance Status,Status,AICTE_Code,Role,Duration,Start Date,Mode,Internship_Name,Partner_Name
JOHN,john@gmail.com,1234567890,Sri Venkateswara College of Engineering,3/15/2026,Free Event,Registered,registered,1-3456785,Full Stack Developer Intern,8 Weeks,15th March 2026,Remote,AICTE,AICTE
JANE,jane@gmail.com,9876543210,MIT Pune,3/20/2026,Paid,Attended,confirmed,2-7891234,Data Science Intern,12 Weeks,20th March 2026,Hybrid,AICTE,AICTE
ALEX,alex@gmail.com,5551234567,IIT Madras,4/01/2026,Free Event,Registered,registered,3-4567890,Frontend Developer Intern,6 Weeks,1st April 2026,Remote,AICTE,AICTE`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="sample_recipients.csv"');
  res.send(csvContent);
};

/**
 * POST /api/upload-csv
 * Validate uploaded CSV data (parsed on frontend, validated on backend)
 */
const validateCSV = (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ success: false, message: 'No CSV data provided' });
    }

    const requiredColumns = ['name', 'email'];
    const columns = Object.keys(data[0]);
    const missingColumns = requiredColumns.filter(c => !columns.includes(c));

    if (missingColumns.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required columns: ${missingColumns.join(', ')}`,
      });
    }

    // Validate emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validRows = data.filter(row => emailRegex.test(row.email));
    const invalidRows = data.filter(row => !emailRegex.test(row.email));

    res.json({
      success: true,
      data: {
        totalRows: data.length,
        validEmails: validRows.length,
        invalidEmails: invalidRows.length,
        columns,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { handleLogoUpload, getLogos, downloadSampleCSV, validateCSV };
