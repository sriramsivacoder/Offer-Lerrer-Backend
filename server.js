const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');


dotenv.config();


connectDB();

const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Auth routes (public + protected)
app.use('/api', require('./routes/authRoutes'));

// Protected routes
app.use('/api', require('./routes/templateRoutes'));
app.use('/api', require('./routes/mailRoutes'));
app.use('/api', require('./routes/pdfRoutes'));
app.use('/api', require('./routes/uploadRoutes'));


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Offer Letter Dispatcher API is running' });
});


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
