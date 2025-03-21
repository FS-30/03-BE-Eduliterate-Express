const express = require('express');
const app = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT || 3000;
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const cloudinary = require('cloudinary');
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

// Cloudinary Configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Middleware - express-fileupload
app.use(fileUpload({
    createParentPath: true
}));

app.use(express.json());

//Data Sanitize
app.use(mongoSanitize());
app.use(xss());

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB
db.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log('Server Listening on Port ' + PORT);
    });
})
.catch((err) => {
    console.log(err);
});

// Routes
app.use('/auth', authRoutes);
app.use('/data', dataRoutes);