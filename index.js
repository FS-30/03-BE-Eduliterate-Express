require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cloudinary = require('cloudinary');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// CORS — restrict to known origins when ALLOWED_ORIGINS env var is set;
// otherwise allow all (safe default for projects without env vars configured)
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;
const corsOptions = allowedOriginsEnv
    ? {
          origin: (origin, callback) => {
              const allowed = allowedOriginsEnv.split(',').map(o => o.trim());
              if (!origin || allowed.includes(origin)) return callback(null, true);
              callback(new Error('Not allowed by CORS'));
          },
          credentials: true,
      }
    : {};

app.use(cors(corsOptions));

// Rate limiting — global
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' },
}));

app.use(fileUpload({ createParentPath: true, limits: { fileSize: 5 * 1024 * 1024 } }));
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());

// Routes — auth limiter is applied per-route inside authRoutes.js
app.use('/auth', authRoutes);
app.use('/data', dataRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ message: 'CORS policy violation' });
    }
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

db.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
});
