const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Audio-Book', 'E-Book'],
        required: true
    },
    price: {
        type: String,
        enum: ['Free', 'SUBSCRIBE NEEDED'],
        required: true
    },
    icon: {
        type: String
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;