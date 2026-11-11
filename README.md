# 🚀 Quick Start - Supabase Database Setup

The backend (Express, hosted on Render) stores everything in **Supabase (Postgres)**:
the site content in the `site_content` table and contact form messages in `messages`.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project**, pick a name, database password and region
3. Wait for the project to finish setting up (~2 minutes)

## Step 2: Create the Tables

1. In the Supabase dashboard open **SQL Editor** → **New query**
2. Paste the contents of [`backend/supabase/schema.sql`](backend/supabase/schema.sql)
3. Click **Run**

## Step 3: Get Your API Keys

**Project Settings** → **API**:
- **Project URL** → `SUPABASE_URL`
- **service_role** key (secret) → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ The service_role key bypasses all security rules. Keep it only in `backend/.env`
and the Render environment, never in frontend code or git.

## Step 4: Update .env File

Copy `backend/.env.example` to `backend/.env` and fill in:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=3001
NODE_ENV=development
```

## Step 5: Move Old MongoDB Data (one time)

Add your old `MONGO_URI` to `backend/.env`, then:

```bash
cd backend
node scripts/migrate-mongo-to-supabase.js
```

This copies the site content (incl. profile image and admin login) and all contact messages.
After that, `MONGO_URI` can be removed.

## Step 6: Start Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ Supabase connected
🚀 Server running → http://localhost:3001
```

## Step 7: Update Render

In the Render dashboard → your backend service → **Environment**:
- Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Remove `MONGO_URI`

Then redeploy.

## Updating Content from the CV

Content defaults live in [`frontend/public/site-content.js`](frontend/public/site-content.js).
To push them to the database:

```bash
node backend/scripts/sync-content.js   # writes straight to Supabase (uses backend/.env)
```

## 🎯 Links

- **Website**: sabbirportfolio.vercel.app/
- **Admin Panel**: sabbirportfolio.vercel.app/admin
- **Default Login** (new database only): admin / admin123

### ⚠️ Important: Change Password First!

1. Go to sabbirportfolio.vercel.app/admin
2. Log in
3. Scroll to "Admin Settings"
4. Change username and password
5. Click "Update Credentials"
