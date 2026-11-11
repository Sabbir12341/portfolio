const express = require('express');
const router = express.Router();
const { supabase, getSiteContent, updateSiteContent } = require('../config/supabase');
const {
    hashPassword,
    verifyPassword,
    issueToken,
    requireAdmin,
    loginBlocked,
    recordFailedLogin,
    clearFailedLogins
} = require('../middleware/auth');

// Admin login -> returns a token for the other admin endpoints
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        if (loginBlocked(req.ip)) {
            return res.status(429).json({ error: 'Too many failed attempts. Try again in 15 minutes.' });
        }

        const content = await getSiteContent();
        const { ok, needsUpgrade } = verifyPassword(password, content.admin_password);

        if (username !== content.admin_username || !ok) {
            recordFailedLogin(req.ip);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        clearFailedLogins(req.ip);

        // Replace an old plain-text password with a hash on first login
        let storedPassword = content.admin_password;
        if (needsUpgrade) {
            storedPassword = hashPassword(password);
            await updateSiteContent({ admin_password: storedPassword });
        }

        const { token, expiresAt } = issueToken(content.admin_username, storedPassword);
        return res.json({ success: true, message: 'Login successful', token, expiresAt });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Everything below needs a valid token
router.use(requireAdmin);

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

// Update credentials (also invalidates every existing token)
router.put('/credentials', async (req, res) => {
    try {
        const { currentUsername, currentPassword, newUsername, newPassword } = req.body || {};

        if (!currentUsername || !currentPassword || !newUsername || !newPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'New password must be at least 8 characters' });
        }

        const content = await getSiteContent();
        const { ok } = verifyPassword(currentPassword, content.admin_password);

        if (currentUsername !== content.admin_username || !ok) {
            return res.status(401).json({ error: 'Current credentials are incorrect' });
        }

        await updateSiteContent({
            admin_username: newUsername,
            admin_password: hashPassword(newPassword)
        });

        res.json({ success: true, message: 'Admin credentials updated successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
