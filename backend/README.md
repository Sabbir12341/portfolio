# Personal Website - Backend Configuration

## Environment Variables

Create a `.env` file in the backend folder with:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/personal-website?retryWrites=true&w=majority
PORT=3001
NODE_ENV=development
```

## Setup Instructions

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (if using separate build)
cd ../frontend
npm install
```

### 2. MongoDB Setup

Get your MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas):
- Create a cluster
- Get your connection string
- Add `<username>` and `<password>` to your `.env` file

### 3. Run Locally

```bash
# Development (from backend folder)
npm run dev

# Production (from backend folder)
npm start
```

Server will run on `http://localhost:3001`

## Deployment to Render

### 1. Create Render Account
Go to [render.com](https://render.com) and sign up

### 2. Connect GitHub
Link your GitHub repository to Render

### 3. Create Web Service
- **Name**: personal-website
- **Environment**: Node
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Region**: Choose closest to you
- **Branch**: main

### 4. Environment Variables
Add to Render dashboard:
```
MONGO_URI=<your_mongodb_atlas_connection_string>
NODE_ENV=production
```

### 5. Deploy
Push changes to GitHub, Render will auto-deploy

## API Endpoints

### Content
- `GET /api/content` - Get all site content
- `PUT /api/content` - Update content section
- `POST /api/contact` - Submit contact form

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Get stats
- `DELETE /api/admin/messages/:id` - Delete message
- `PUT /api/admin/credentials` - Update admin credentials

### Upload
- `POST /api/upload/profile-image` - Upload profile image

## Project Structure

```
personal-website/
├── frontend/
│   └── public/
│       ├── index.html (main site)
│       └── admin/
│           └── index.html (admin panel)
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── Message.js
│   │   └── SiteContent.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── content.js
│   │   └── upload.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

## Default Admin Credentials

- **Username**: admin
- **Password**: admin123

⚠️ **Change these immediately after first login!**

## Features

✅ Responsive design with Tailwind CSS
✅ MongoDB integration
✅ Admin panel to manage content
✅ File upload for profile image
✅ Contact form with message storage
✅ Deployment ready for Render
✅ CORS enabled for API access

## Support

For issues or questions, check the backend logs with:
```bash
npm run dev
```
