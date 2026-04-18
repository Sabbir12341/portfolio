const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3001;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Check if file is an image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Simple in-memory storage for demo (replace with database in production)
let adminData = {
    visitors: 0,
    messages: []
};

// Content data for the website
let siteContent = {
    hero: {
        title: 'Sabbir Ahmed',
        subtitle: 'AI Automation Engineer | n8n | API Integration',
        tagline: 'I build intelligent automation systems using n8n, APIs, and AI to streamline business workflows.',
        profileImage: '/uploads/profile-placeholder.png'
    },
    about: {
        paragraph1: 'I\'m a Computer Science and Engineering (CSE) student and a passionate automation enthusiast. With a deep interest in workflow automation and AI integration, I specialize in creating intelligent systems that solve real-world business problems.',
        paragraph2: 'My expertise lies in building robust automation workflows using n8n, integrating APIs, and leveraging webhooks to connect disparate systems. I\'m proficient in JavaScript and Python, which allows me to create custom solutions tailored to specific automation needs.',
        paragraph3: 'I believe in the power of automation to transform businesses by reducing manual work, minimizing errors, and enabling teams to focus on high-value tasks. Every project I undertake is driven by the goal of delivering measurable business impact.'
    },
    skills: [
        { title: 'Automation', icon: 'fa-cogs', items: ['n8n', 'Zapier', 'Make (Integromat)', 'Workflow Design'] },
        { title: 'Programming', icon: 'fa-code', items: ['JavaScript (ES6+)', 'Python', 'C++', 'Node.js'] },
        { title: 'Integration', icon: 'fa-link', items: ['REST APIs', 'Webhooks', 'JSON', 'OAuth 2.0'] },
        { title: 'Database', icon: 'fa-database', items: ['MySQL', 'MongoDB', 'Firebase', 'PostgreSQL'] }
    ],
    projects: [
        {
            icon: 'fa-robot',
            title: 'AI Lead Qualification & Auto Booking',
            description: 'An intelligent n8n workflow that automatically qualifies leads using AI, segments them by qualification score, and seamlessly books meetings through Calendly integration.',
            badges: ['n8n', 'AI/ML', 'Calendly API', 'Webhook'],
            github: 'https://github.com/Sabbir12341',
            demo: 'https://github.com/Sabbir12341'
        },
        {
            icon: 'fa-exchange-alt',
            title: 'Multi-Platform Data Automation',
            description: 'A comprehensive workflow that syncs data across multiple platforms (CRM, Email, Spreadsheets) in real-time, eliminating manual data entry and ensuring data consistency.',
            badges: ['n8n', 'REST APIs', 'Database', 'JavaScript'],
            github: 'https://github.com/Sabbir12341',
            demo: 'https://github.com/Sabbir12341'
        },
        {
            icon: 'fa-bell',
            title: 'API Monitoring & Alert System',
            description: 'A real-time monitoring solution that tracks API health, response times, and error rates. Sends instant alerts via Slack and email when issues are detected.',
            badges: ['Node.js', 'REST API', 'MongoDB', 'Slack API'],
            github: 'https://github.com/Sabbir12341',
            demo: 'https://github.com/Sabbir12341'
        },
        {
            icon: 'fa-chart-line',
            title: 'HAR Optimization using Custom SVM',
            description: 'An advanced machine learning model using Support Vector Machines to optimize HTTP Archive (HAR) files for web performance, reducing load times and bandwidth usage.',
            badges: ['Python', 'Machine Learning', 'SVM', 'Data Analysis'],
            github: 'https://github.com/Sabbir12341',
            demo: 'https://github.com/Sabbir12341'
        }
    ],
    contact: {
        email: 'khandokarsabbirahmed12@gmail.com',
        linkedin: 'https://www.linkedin.com/in/sabbir-ahmed-9537231ba/',
        github: 'https://github.com/Sabbir12341'
    },
    admin: {
        username: 'admin',
        password: 'admin123'
    }
};

// Middleware
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(uploadsDir));
app.use(express.json());

// Track visitors
app.use((req, res, next) => {
    if (!req.path.startsWith('/admin') && !req.path.startsWith('/api/admin')) {
        adminData.visitors++;
    }
    next();
});

// Public API endpoints
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running!' });
});

app.post('/api/contact', express.json(), (req, res) => {
    const { name, email, message } = req.body;
    const newMessage = { id: Date.now(), name, email, message, timestamp: new Date() };
    adminData.messages.push(newMessage);
    console.log('Contact form submission:', newMessage);
    res.json({ success: true, message: 'Message received!' });
});

// Admin panel routes
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/api/admin/stats', (req, res) => {
    res.json({
        visitors: adminData.visitors,
        messages: adminData.messages.length,
        recentMessages: adminData.messages.slice(-5)
    });
});

app.get('/api/admin/messages', (req, res) => {
    res.json(adminData.messages);
});

app.delete('/api/admin/messages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    adminData.messages = adminData.messages.filter(msg => msg.id !== id);
    res.json({ success: true });
});
// Content management endpoints
app.get('/api/content', (req, res) => {
    // Return all content except admin credentials
    const responseData = {
        ...siteContent,
        admin: undefined  // Don't expose admin credentials
    };
    delete responseData.admin;
    res.json(responseData);
});

app.put('/api/content', express.json(), (req, res) => {
    const { section, data } = req.body;

    if (!section || !data) {
        return res.status(400).json({ error: 'Section and data are required' });
    }

    // Prevent modification of admin section through this endpoint
    if (section === 'admin') {
        return res.status(403).json({ error: 'Admin section cannot be modified through this endpoint' });
    }

    // Update the specific section
    if (siteContent[section]) {
        siteContent[section] = { ...siteContent[section], ...data };
        console.log(`Updated ${section}:`, siteContent[section]);
        res.json({ success: true, message: `${section} updated successfully` });
    } else {
        res.status(400).json({ error: 'Invalid section' });
    }
});

// File upload route for profile images
app.post('/api/upload/profile-image', (req, res) => {
    upload.single('profileImage')(req, res, (err) => {
        if (err) {
            console.error('Multer upload error:', err);
            return res.status(400).json({ error: err.message || 'Failed to upload image' });
        }

        if (!req.file) {
            console.log('No file uploaded in request');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        console.log('Profile image uploaded:', imageUrl, 'original name:', req.file.originalname);

        res.json({
            success: true,
            message: 'Profile image uploaded successfully',
            imageUrl: imageUrl
        });
    });
});

// Admin credentials management
app.put('/api/admin/credentials', express.json(), (req, res) => {
    const { currentUsername, currentPassword, newUsername, newPassword } = req.body;

    // Verify current credentials
    if (currentUsername !== siteContent.admin.username || currentPassword !== siteContent.admin.password) {
        return res.status(401).json({ error: 'Current credentials are incorrect' });
    }

    // Update credentials
    siteContent.admin.username = newUsername;
    siteContent.admin.password = newPassword;

    console.log('Admin credentials updated');
    res.json({ success: true, message: 'Admin credentials updated successfully' });
});

// Admin login endpoint
app.post('/api/admin/login', express.json(), (req, res) => {
    const { username, password } = req.body;

    if (username === siteContent.admin.username && password === siteContent.admin.password) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Admin panel available at http://localhost:${port}/admin`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Stop the existing process or set PORT to a different port.`);
        process.exit(1);
    }
    throw err;
});