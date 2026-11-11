const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// ====================== IMPORTS ======================
const { checkConnection } = require('./config/supabase');
const { requireAdmin } = require('./middleware/auth');

// ====================== ROUTES ======================
const adminRoutes = require('./routes/admin');
const contentRoutes = require('./routes/content');
const uploadRoutes = require('./routes/upload');

// ====================== EXPRESS APP ======================
const app = express();
const port = process.env.PORT || 3001;

// Render sits behind one proxy: use the real client IP (for the login rate limit)
app.set('trust proxy', 1);

// ====================== MIDDLEWARE ======================
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.url}`);
    next();
});

// Serve static files from uploads (located at root level)
app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));

// ====================== ROUTES ======================
app.use('/api/admin', adminRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', requireAdmin, uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// ====================== FRONTEND ======================
// Serve frontend files
const frontendPath = path.join(__dirname, '../frontend/public');
app.use(express.static(frontendPath));

// Catch-all for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// ====================== INIT ADMIN & START SERVER ======================
const startServer = async () => {
    try {
        // Connect to Supabase (also creates the content row on first run)
        await checkConnection();

        // Start server
        app.listen(port, () => {
            console.log(`🚀 Server running → http://localhost:${port}`);
            console.log(`🔐 Admin Panel → http://localhost:${port}/admin`);
            console.log(`📱 API Health → http://localhost:${port}/api/health`);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message || err);
        console.error('   Did you run backend/supabase/schema.sql in the Supabase SQL Editor?');
        process.exit(1);
    }
};

startServer();
