const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// ====================== IMPORTS ======================
const connectDB = require('./config/database');
const SiteContent = require('./models/SiteContent');

// ====================== ROUTES ======================
const adminRoutes = require('./routes/admin');
const contentRoutes = require('./routes/content');
const uploadRoutes = require('./routes/upload');

// ====================== EXPRESS APP ======================
const app = express();
const port = process.env.PORT || 3001;

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
app.use('/api/upload', uploadRoutes);

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
        // Connect to MongoDB
        await connectDB();

        // Initialize admin if not exists
        const content = await SiteContent.findOne();
        if (!content) {
            await SiteContent.create({
                hero: {
                    title: "Sabbir Ahmed",
                    subtitle: "AI Automation Engineer",
                    tagline: "Building intelligent systems",
                    profileImage: "/api/uploads/profile-placeholder.png"
                },
                about: { paragraph1: "", paragraph2: "", paragraph3: "" },
                skills: [],
                projects: [],
                contact: {
                    email: "your-email@example.com",
                    linkedin: "",
                    github: ""
                },
                admin: {
                    username: "admin",
                    password: "admin123"
                }
            });
            console.log("✅ Default Admin Created → admin / admin123");
        } else {
            console.log("ℹ️ Admin already exists");
        }

        // Start server
        app.listen(port, () => {
            console.log(`🚀 Server running → http://localhost:${port}`);
            console.log(`🔐 Admin Panel → http://localhost:${port}/admin`);
            console.log(`📱 API Health → http://localhost:${port}/api/health`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
