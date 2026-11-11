const express = require('express');
const router = express.Router();
const { supabase, PUBLIC_SECTIONS, getSiteContent, updateSiteContent } = require('../config/supabase');

// Get all content
router.get('/', async (req, res) => {
    try {
        const content = await getSiteContent();
        const publicData = {};
        for (const section of PUBLIC_SECTIONS) {
            publicData[section] = content[section];
        }
        res.json(publicData);
    } catch (err) {
        console.error('GET CONTENT ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update content section
router.put('/', async (req, res) => {
    try {
        const { section, data } = req.body;

        if (!section) {
            return res.status(400).json({ error: "Section required" });
        }

        if (!PUBLIC_SECTIONS.includes(section)) {
            return res.status(400).json({ error: "Invalid section" });
        }

        if (data === undefined || data === null) {
            return res.status(400).json({ error: "Data required" });
        }

        const content = await getSiteContent();

        // Arrays (skills, projects) are replaced; objects are merged into what is saved
        const value = Array.isArray(data) || typeof data !== 'object'
            ? data
            : { ...(content[section] || {}), ...data };

        await updateSiteContent({ [section]: value });

        res.json({ success: true });

    } catch (err) {
        console.error("UPDATE ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// Submit contact form
router.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body || {};
        const { error } = await supabase
            .from('messages')
            .insert({ name, email, subject, message });
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        console.error('CONTACT ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
