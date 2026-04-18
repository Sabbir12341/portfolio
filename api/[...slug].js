const fs = require('fs');
const formidable = require('formidable');

const adminData = {
  visitors: 0,
  messages: []
};

const siteContent = {
  hero: {
    title: 'Sabbir Ahmed',
    subtitle: 'AI Automation Engineer | n8n | API Integration',
    tagline: 'I build intelligent automation systems using n8n, APIs, and AI to streamline business workflows.',
    profileImage: 'https://via.placeholder.com/128x128/3b82f6/ffffff?text=SA'
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

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: false,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
}

function getPublicContent() {
  const responseData = { ...siteContent };
  delete responseData.admin;
  return responseData;
}

module.exports = async (req, res) => {
  const baseUrl = `http://${req.headers.host || 'localhost'}`;
  const url = new URL(req.url, baseUrl);
  const pathname = url.pathname;

  if (pathname === '/api/health' && req.method === 'GET') {
    return sendJson(res, 200, { status: 'OK', message: 'Backend is running!' });
  }

  if (pathname === '/api/contact' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { name, email, message } = body;

      if (!name || !email || !message) {
        return sendJson(res, 400, { error: 'Name, email, and message are required.' });
      }

      const newMessage = { id: Date.now(), name, email, message, timestamp: new Date() };
      adminData.messages.push(newMessage);
      console.log('Contact form submission:', newMessage);
      return sendJson(res, 200, { success: true, message: 'Message received!' });
    } catch (error) {
      console.error('Contact processing error:', error);
      return sendJson(res, 400, { error: 'Invalid request body.' });
    }
  }

  if (pathname === '/api/admin/login' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { username, password } = body;

      if (username === siteContent.admin.username && password === siteContent.admin.password) {
        return sendJson(res, 200, { success: true, message: 'Login successful' });
      }

      return sendJson(res, 401, { error: 'Invalid credentials' });
    } catch (error) {
      console.error('Admin login error:', error);
      return sendJson(res, 400, { error: 'Invalid request body.' });
    }
  }

  if (pathname === '/api/admin/credentials' && req.method === 'PUT') {
    try {
      const body = await parseJsonBody(req);
      const { currentUsername, currentPassword, newUsername, newPassword } = body;

      if (currentUsername !== siteContent.admin.username || currentPassword !== siteContent.admin.password) {
        return sendJson(res, 401, { error: 'Current credentials are incorrect' });
      }

      if (!newUsername || !newPassword) {
        return sendJson(res, 400, { error: 'New username and password are required' });
      }

      siteContent.admin.username = newUsername;
      siteContent.admin.password = newPassword;
      console.log('Admin credentials updated');
      return sendJson(res, 200, { success: true, message: 'Admin credentials updated successfully' });
    } catch (error) {
      console.error('Admin credential update error:', error);
      return sendJson(res, 400, { error: 'Invalid request body.' });
    }
  }

  if (pathname === '/api/admin/stats' && req.method === 'GET') {
    return sendJson(res, 200, {
      visitors: adminData.visitors,
      messages: adminData.messages.length,
      recentMessages: adminData.messages.slice(-5)
    });
  }

  if (pathname === '/api/admin/messages' && req.method === 'GET') {
    return sendJson(res, 200, adminData.messages);
  }

  if (pathname.startsWith('/api/admin/messages/') && req.method === 'DELETE') {
    const id = parseInt(pathname.split('/').pop(), 10);
    adminData.messages = adminData.messages.filter(msg => msg.id !== id);
    return sendJson(res, 200, { success: true });
  }

  if (pathname === '/api/content' && req.method === 'GET') {
    if (url.searchParams.get('admin') !== 'true') {
      adminData.visitors++;
    }
    return sendJson(res, 200, getPublicContent());
  }

  if (pathname === '/api/content' && req.method === 'PUT') {
    try {
      const body = await parseJsonBody(req);
      const { section, data } = body;

      if (!section || !data) {
        return sendJson(res, 400, { error: 'Section and data are required' });
      }

      if (section === 'admin') {
        return sendJson(res, 403, { error: 'Admin section cannot be modified through this endpoint' });
      }

      if (siteContent[section]) {
        siteContent[section] = { ...siteContent[section], ...data };
        console.log(`Updated ${section}:`, siteContent[section]);
        return sendJson(res, 200, { success: true, message: `${section} updated successfully` });
      }

      return sendJson(res, 400, { error: 'Invalid section' });
    } catch (error) {
      console.error('Content update error:', error);
      return sendJson(res, 400, { error: 'Invalid request body.' });
    }
  }

  if (pathname === '/api/upload/profile-image' && req.method === 'POST') {
    try {
      const { files } = await parseMultipart(req);
      const file = files.profileImage;

      if (!file) {
        return sendJson(res, 400, { error: 'No file uploaded' });
      }

      const mimeType = file.mimetype || file.mimeType;
      if (!mimeType || !mimeType.startsWith('image/')) {
        return sendJson(res, 400, { error: 'Only image files are allowed!' });
      }

      const buffer = fs.readFileSync(file.filepath);
      const base64 = buffer.toString('base64');
      const imageUrl = `data:${mimeType};base64,${base64}`;
      siteContent.hero.profileImage = imageUrl;

      return sendJson(res, 200, {
        success: true,
        message: 'Profile image uploaded successfully',
        imageUrl
      });
    } catch (error) {
      console.error('Upload error:', error);
      return sendJson(res, 400, { error: error.message || 'Failed to upload image' });
    }
  }

  return sendJson(res, 404, { error: 'Not found' });
};
