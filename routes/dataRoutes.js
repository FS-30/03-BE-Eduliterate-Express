const express = require('express');
const User = require('../models/user');
const { isAdmin } = require('../middlewares/authMiddleware');

const dataRouter = express.Router();

// Create a new user (accessible only by admin)
dataRouter.post('/users', isAdmin, async (req, res) => {
    try {
        const { email, username, password, role, is_subscribed } = req.body;

        const newUser = new User({
            email,
            username,
            password,
            role: role || 'user',
            is_subscribed: is_subscribed || false 
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
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
dataRouter.put('/users/:id', isAdmin, async (req, res) => {
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

module.exports = dataRouter;