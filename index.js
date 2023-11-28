const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT || 3000;
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const cloudinary = require('cloudinary');

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