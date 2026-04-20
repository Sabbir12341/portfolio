const express = require('express');
const router = express.Router();
const { IncomingForm } = require('formidable');
const fs = require('fs').promises;
const path = require('path');

// Upload profile image
router.post('/profile-image', async (req, res) => {
    try {
        const uploadDir = path.join(__dirname, '../uploads');

        // Ensure uploads directory exists
        await fs.mkdir(uploadDir, { recursive: true });

        const form = new IncomingForm({
            uploadDir,
            keepExtensions: true,
            maxFileSize: 5 * 1024 * 1024 // 5MB
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({ error: 'File upload failed' });
            }

            let file = files.profileImage;
            if (Array.isArray(file)) {
                file = file[0];
            }

            if (!file) {
                return res.status(400).json({ error: 'No file provided' });
            }

            // Validate file type
            if (!file.mimetype || !file.mimetype.startsWith('image/')) {
                await fs.unlink(file.filepath).catch(() => {});
                return res.status(400).json({ error: 'File must be an image' });
            }

            const fileBuffer = await fs.readFile(file.filepath);
            const mimeType = file.mimetype || 'image/jpeg';
            const imageUrl = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

            await fs.unlink(file.filepath).catch(() => {});
            res.json({ imageUrl, success: true });
        });

    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
