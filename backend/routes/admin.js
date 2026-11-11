const express = require('express');
const router = express.Router();
const { supabase, getSiteContent, updateSiteContent } = require('../config/supabase');

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const content = await getSiteContent();

        if (
            username === content.admin_username &&
            password === content.admin_password
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
        const { data, count, error } = await supabase
            .from('messages')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .limit(5);
        if (error) throw error;

        // Same shape the admin page expects (it was built for MongoDB)
        const recentMessages = data.map(m => ({
            _id: m.id,
            name: m.name,
            email: m.email,
            subject: m.subject,
            message: m.message,
            timestamp: m.created_at
        }));

        res.json({
            visitors: 0,
            messages: count,
            recentMessages
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete message
router.delete('/messages/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', req.params.id);
        if (error) throw error;
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

        const content = await getSiteContent();

        if (
            currentUsername !== content.admin_username ||
            currentPassword !== content.admin_password
        ) {
            return res.status(401).json({ error: 'Current credentials are incorrect' });
        }

        await updateSiteContent({
            admin_username: newUsername,
            admin_password: newPassword
        });

        res.json({ success: true, message: 'Admin credentials updated successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
