const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Register endpoint
authRouter.post('/register', async (req, res) => {
try {
    const { email, username, password, confirmPassword} = req.body;

    if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
    email,
    username,
    password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
} catch (error) {
    res.status(500).json({ message: 'Error registering user' });
}
});
  

// Login endpoint
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = authRouter;
