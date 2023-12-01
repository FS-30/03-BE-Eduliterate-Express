const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const cloudinary = require('cloudinary');
const User = require('../models/user');
const Book = require('../models/book');
const Payment = require('../models/payment');
const { isAdmin } = require('../middlewares/authMiddleware');

const dataRouter = express.Router();

// Create a new user (accessible only by admin)
dataRouter.post('/users', isAdmin, async (req, res) => {
    try {
        const { email, username, password, role, is_subscribed } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            username,
            password: hashedPassword,
            role: role || 'user',
            is_subscribed: is_subscribed || false 
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error});
    }
});

// Read all users (accessible only by admin)
dataRouter.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// Update a user by ID (accessible only by admin)
dataRouter.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, username, password, role, is_subscribed } = req.body;

        const updateFields = {};
        if (email) updateFields.email = email;
        if (username) updateFields.username = username;
        if (password) updateFields.password = password;
        if (role) updateFields.role = role;
        if (is_subscribed !== undefined) updateFields.is_subscribed = is_subscribed;

        const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
});

// Delete a user by ID (accessible only by admin)
dataRouter.delete('/users/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

// Create a new book (accessible only by admin)
dataRouter.post('/books', isAdmin, async (req, res) => {
    try {
        const {
            title,
            author,
            description,
            content,
            image,
            type,
            price,
            icon
        } = req.body;

        const newBook = new Book({
            title,
            author,
            description,
            content,
            image,
            type,
            price,
            icon
        });

        await newBook.save();
        res.status(201).json({ message: 'Book created successfully', book: newBook });
    } catch (error) {
        res.status(500).json({ message: 'Error creating book', error });
    }
});

// Read all books (accessible by all users)
dataRouter.get('/books', async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
});

// Update a book by ID (accessible only by admin)
dataRouter.put('/books/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            author,
            description,
            content,
            image,
            type,
            price,
            icon
        } = req.body;

        const updateFields = {
            title,
            author,
            description,
            content,
            image,
            type,
            price,
            icon
        };

        const updatedBook = await Book.findByIdAndUpdate(id, updateFields, { new: true });

        res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
    } catch (error) {
        res.status(500).json({ message: 'Error updating book', error });
    }
});

// Delete a book by ID (accessible only by admin)
dataRouter.delete('/books/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        await Book.findByIdAndDelete(id);
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error });
    }
});

// Get details of a book by ID
dataRouter.get('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized, token missing' });
        }

        if (book.price === 'SUBSCRIBE NEEDED') {
            const decoded = jwt.verify(token, JWT_SECRET);
            const userId = decoded?.userId;
            
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized, subscription required' });
            }

            const user = await User.findById(userId);
            if (!user || !user.is_subscribed) {
                return res.status(403).json({ message: 'Subscription required to access this book' });
            }
        }

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book details', error });
    }
});

// Endpoint for payment image upload
dataRouter.post('/payment/upload', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized, token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized, invalid token' });
        }

        const user = await User.findById(userId);
        if (user && user.is_subscribed) {
            return res.status(403).json({ message: 'Subscription already active, payment not required' });
        }

        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: 'Image file not found' });
        }

        const imageFile = req.files.image;

        if (!imageFile.tempFilePath) {
            const tempPath = `/tmp/${imageFile.name}`;
            await imageFile.mv(tempPath);
            imageFile.tempFilePath = tempPath;
        }

        console.log('Before Cloudinary upload:', imageFile);

        const result = await cloudinary.v2.uploader.upload(imageFile.tempFilePath, {
            folder: 'samples'
        });

        console.log('After Cloudinary upload:', result);

        const newPayment = new Payment({
            user: userId,
            image: result.secure_url
        });

        await newPayment.save();
        res.status(200).json({ message: 'Image uploaded successfully', imageUrl: result.secure_url });
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({ message: 'Error processing payment', error: error.message });
    }
});

module.exports = dataRouter;