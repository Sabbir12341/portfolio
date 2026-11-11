# Personal Website Restructure - Complete Guide

## 🎉 Project Structure Updated

Your project is now organized with **separated frontend and backend**, ready for deployment on Render!

### New Folder Structure:

```
personal-website/
├── frontend/
│   ├── public/
│   │   ├── index.html          (Main website)
│   │   └── admin/
│   │       └── index.html      (Admin panel)
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── supabase.js         (Supabase client + content helpers)
│   ├── supabase/
│   │   └── schema.sql          (Tables: site_content, messages)
│   ├── scripts/
│   │   ├── sync-content.js     (Push site-content.js to the database)
│   │   └── migrate-mongo-to-supabase.js (One-time MongoDB → Supabase copy)
│   ├── routes/
│   │   ├── admin.js            (Admin endpoints)
│   │   ├── content.js          (Content endpoints)
│   │   └── upload.js           (File upload endpoint)
│   ├── uploads/                (Profile images)
│   ├── server.js               (Main server file)
│   ├── package.json
│   ├── .env.example            (Environment template)
│   └── README.md
│
├── .env                        (Local environment variables)
├── .env.example                (Environment template)
└── .gitignore

```

## 🚀 Running Locally

### 1. Setup Environment Variables

Create a `.env` file in the `backend` folder:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=3001
NODE_ENV=development
```

Set up [Supabase](https://supabase.com):
1. Create a project
2. Run `backend/supabase/schema.sql` in **SQL Editor**
3. Copy the Project URL and **service_role** key from **Project Settings → API**

See [README.md](README.md) for the full steps, including moving old MongoDB data.

### 2. Run the Server

```bash
cd backend
npm install  # Already done!
npm run dev  # Development with auto-reload
```

Server runs on: **http://localhost:3001**

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ Change these immediately on first login!

---

## 🌍 Deploy to Render

### Step 1: Create GitHub Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Restructured with frontend/backend separation"

# Create repo on GitHub and push
git remote add origin https://github.com/yourusername/personal-website.git
git branch -M main
git push -u origin main
```

### Step 2: Sign Up on Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your GitHub account

### Step 3: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Select your repository
3. Fill in the details:

| Field | Value |
|-------|-------|
| **Name** | personal-website |
| **Environment** | Node |
| **Region** | Choose closest to you |
| **Branch** | main |
| **Build Command** | `cd backend && npm install` |
| **Start Command** | `cd backend && npm start` |

### Step 4: Add Environment Variables

1. In Render dashboard, go to **Environment**
2. Add these variables:

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NODE_ENV=production
```

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. Your site is live! 🎉

Render will give you a URL like: `https://personal-website-xxxxx.onrender.com`

---

## 📱 API Endpoints

### Public Content
```
GET  /api/content           - Get all site content
POST /api/contact           - Submit contact message
```

### Admin Panel
```
POST   /api/admin/login     - Login
GET    /api/admin/stats     - Get stats & messages
DELETE /api/admin/messages/:id - Delete message
PUT    /api/admin/credentials  - Update admin login
```

### File Upload
```
POST /api/upload/profile-image  - Upload profile image
```

---

## 🔒 Security Notes

1. **Change Default Password**: Log in immediately and change admin credentials
2. **Use Environment Variables**: Never hardcode secrets
3. **Supabase Security**:
   - The service_role key bypasses RLS: keep it only on the server (`backend/.env`, Render)
   - Tables have RLS enabled with no policies, so the public anon key cannot read or write them

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
npx kill-port 3001
npm run dev
```

### Supabase Connection Error
- Check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env`
- Make sure `backend/supabase/schema.sql` has been run
- Free projects pause after a week of inactivity: restore it in the Supabase dashboard

### Frontend Not Loading
- Make sure frontend files are in `frontend/public/`
- Backend serves frontend at: `http://localhost:3001`

### Render Deployment Issues
- Check build logs in Render dashboard
- Verify environment variables are set
- Ensure backend `server.js` is in `backend` folder

---

## 📦 What's Included

✅ **Express.js API** - RESTful backend with routes
✅ **Supabase (Postgres)** - Cloud database integration
✅ **CORS** - Cross-origin request handling
✅ **File Upload** - Profile image uploads
✅ **Static File Serving** - Frontend from backend
✅ **Environment Configuration** - .env support
✅ **Admin Panel** - Manage website content
✅ **Contact Form** - Message submission & storage

---

## 🔄 Development Workflow

1. **Make Changes Locally**
```bash
cd backend
npm run dev
```

2. **Test the API**
```bash
curl http://localhost:3001/api/health
```

3. **Push to GitHub**
```bash
git add .
git commit -m "Update message"
git push origin main
```

4. **Auto-Deploy**
- Render automatically deploys on push
- Check deployment status in Render dashboard

---

## 📚 Useful Commands

```bash
# Backend
cd backend
npm run dev      # Development mode
npm start        # Production mode
npm install      # Install dependencies

# View logs
npm run dev      # See console output

# Supabase
# View data in the Table Editor of the Supabase dashboard
# https://supabase.com/dashboard
```

---

## 🎯 Next Steps

1. ✅ Create a Supabase project and run `schema.sql`
2. ✅ Create `.env` file with the Supabase URL and service_role key
3. ✅ Test locally: `npm run dev` from `backend/` folder
4. ✅ Push to GitHub
5. ✅ Deploy to Render
6. ✅ Update admin password
7. ✅ Update contact email

---

## 📞 Support

**Issue: Can't connect to Supabase?**
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env`
- Check that the project is not paused

**Issue: Frontend not showing?**
- Ensure `frontend/public/index.html` exists
- Check server logs for errors

**Issue: Admin panel not working?**
- Check browser console for errors
- Verify backend API is running

---

## 🎓 Learn More

- [Express.js Docs](https://expressjs.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Render Deployment](https://render.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Happy Building! 🚀**
