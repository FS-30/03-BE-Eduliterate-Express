const mongoose = require('mongoose');
require('dotenv').config();

const DB_URL = process.env.DB_URL;

const db = mongoose.connect(DB_URL)

module.exports = db