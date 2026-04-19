const express = require('express');
const router = express.Router();
const SiteContent = require('../models/SiteContent');
const Message = require('../models/Message');

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const content = await SiteContent.findOne();

        if (!content) {
            return res.status(401).json({ error: 'Admin not initialized' });
        }

        if (
            username === content.admin.username &&
            password === content.admin.password
        ) {
            return res.json({ success: true, message: 'Login successful' });
        }

        return res.status(401).json({ error: 'Invalid credentials' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get stats
router.get('/stats', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: -1 }).limit(5);
        const total = await Message.countDocuments();

        res.json({
            visitors: 0,
            messages: total,
            recentMessages: messages
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete message
router.delete('/messages/:id', async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update credentials
router.put('/credentials', async (req, res) => {
    try {
        const { currentUsername, currentPassword, newUsername, newPassword } = req.body;

        if (!currentUsername || !currentPassword || !newUsername || !newPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const content = await SiteContent.findOne();

        if (
            currentUsername !== content.admin.username ||
            currentPassword !== content.admin.password
        ) {
            return res.status(401).json({ error: 'Current credentials are incorrect' });
        }

        content.admin.username = newUsername;
        content.admin.password = newPassword;
        await content.save();

        res.json({ success: true, message: 'Admin credentials updated successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
