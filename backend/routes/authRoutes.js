const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../schemas/userSchema.js');
const authenticateToken = require('../middleware/authenticateToken.js');

const router = express.Router();



router.post('/login', async (req, res) => {
    try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, 'secret-key', { expiresIn: '1h' });

    res.json({message: "Login successfull", token });
    } catch (error) {
        console.error('Error logging in: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword
        });

        newUser.favorites = [];

        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/user', authenticateToken, async (req, res) => {
 try {
    const user = req.user;
    return res.json({ user });
 } catch (error) {
    console.error('Error fetching user data: ', error);
    return res.status(500).json({ message: 'Internal server error' });
 } 
});

module.exports = router;