const express = require('express');
const router = express.Router();
const SiteContent = require('../models/SiteContent');
const Message = require('../models/Message');

// Get all content
router.get('/', async (req, res) => {
    try {
        let content = await SiteContent.findOne();

        if (!content) {
            content = await SiteContent.create({});
        }

        const { admin, ...publicData } = content.toObject();
        res.json(publicData);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update content section
router.put('/', async (req, res) => {
    try {
        const { section, data } = req.body;
        const allowedSections = ['hero', 'about', 'skills', 'projects', 'contact'];

        if (!section) {
            return res.status(400).json({ error: "Section required" });
        }

        if (!allowedSections.includes(section)) {
            return res.status(400).json({ error: "Invalid section" });
        }

        if (data === undefined || data === null) {
            return res.status(400).json({ error: "Data required" });
        }

        let content = await SiteContent.findOne();
        if (!content) content = new SiteContent();

        if (Array.isArray(data) || typeof data !== 'object' || data === null) {
            content[section] = data;
        } else {
            content[section] = {
                ...content[section],
                ...data
            };
        }

        await content.save();

        res.json({ success: true });

    } catch (err) {
        console.error("UPDATE ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// Submit contact form
router.post('/contact', async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        await newMessage.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
