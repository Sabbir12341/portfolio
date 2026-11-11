# Personal Website - Backend Configuration

## Environment Variables

Create a `.env` file in the backend folder with:

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
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

### 2. Supabase Setup

- Create a project at [supabase.com](https://supabase.com)
- Run `supabase/schema.sql` in the **SQL Editor**
- Copy the Project URL and **service_role** key (Project Settings → API) into `.env`
- Moving from MongoDB? Add `MONGO_URI` to `.env` and run `node scripts/migrate-mongo-to-supabase.js` once

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
SUPABASE_URL=<your_supabase_project_url>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
NODE_ENV=production
```

### 5. Deploy
Push changes to GitHub, Render will auto-deploy

## API Endpoints

🔒 = needs `Authorization: Bearer <token>`. Get the token from `POST /api/admin/login`;
it lasts 12 hours and stops working as soon as the admin password changes.

### Content
- `GET /api/content` - Get all site content
- `PUT /api/content` - Update content section 🔒
- `POST /api/content/contact` - Submit contact form

### Admin
- `POST /api/admin/login` - Admin login, returns `{ token, expiresAt }` (10 failed tries per IP → 15 min block)
- `GET /api/admin/stats` - Get stats 🔒
- `DELETE /api/admin/messages/:id` - Delete message 🔒
- `PUT /api/admin/credentials` - Update admin credentials 🔒 (new password: min. 8 characters, stored as a scrypt hash)

### Upload
- `POST /api/upload/profile-image` - Upload profile image 🔒

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
│   │   └── supabase.js
│   ├── supabase/
│   │   └── schema.sql
│   ├── scripts/
│   │   ├── sync-content.js
│   │   └── migrate-mongo-to-supabase.js
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
✅ Supabase (Postgres) integration
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
