const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const rateLimit = require('express-rate-limit');
const User = require('../models/user');

const authRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Too many login attempts, please try again in 15 minutes.' },
});

const registerSchema = Joi.object({
    email: Joi.string().email().max(254).required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).max(128).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
        .messages({ 'any.only': 'Passwords do not match' }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().max(254).required(),
    password: Joi.string().max(128).required(),
});

authRouter.post('/register', authLimiter, async (req, res) => {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: error.details.map(d => d.message).join('; ') });
    }

    try {
        const { email, username, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            const field = existingUser.email === email ? 'email' : 'username';
            return res.status(409).json({ message: `This ${field} is already registered` });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        await new User({ email, username, password: hashedPassword }).save();

        res.status(201).json({ message: 'Registration successful. Please log in.' });
    } catch {
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

authRouter.post('/login', authLimiter, async (req, res) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: error.details.map(d => d.message).join('; ') });
    }

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            token,
            is_subscribed: user.is_subscribed,
            id: user._id,
        });
    } catch {
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});

authRouter.get('/me', async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId, 'is_subscribed role');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ is_subscribed: user.is_subscribed === true, role: user.role });
    } catch {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});

module.exports = authRouter;
