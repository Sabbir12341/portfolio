# 🚀 Quick Start - Get Your MongoDB Connection String

## Step 1: Create Free MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free account)
3. Create a new **Free Cluster**
4. Wait for cluster to deploy (~3 minutes)

## Step 2: Get Connection String

1. Click **"Connect"** button
2. Choose **"Connect your application"**
3. Select **Node.js** driver
4. Copy the connection string

## Step 3: Add Username & Password

Your connection string looks like:
```
mongodb+srv://<username>:<password>@cluster0.mongodb.net/personal-website?retryWrites=true&w=majority
```

Replace:
- `<username>` with your database username
- `<password>` with your database password

## Step 4: Update .env File

Edit `backend/.env`:

```bash
MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.mongodb.net/personal-website?retryWrites=true&w=majority
PORT=3001
NODE_ENV=development
```

## Step 5: Whitelist Your IP

In MongoDB Atlas:
1. Go to **Network Access**
2. Click **"Add IP Address"**
3. Choose **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

## Step 6: Start Server

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running → http://localhost:3001
✅ MongoDB Connected
```

## 🎯 That's It!

- **Website**: http://localhost:3001
- **Admin Panel**: http://localhost:3001/admin
- **Default Login**: admin / admin123

---

### ⚠️ Important: Change Password First!

1. Go to http://localhost:3001/admin
2. Login with admin/admin123
3. Scroll to "Admin Settings"
4. Change username and password
5. Click "Update Credentials"

---

Ready? Get your MongoDB string and update `backend/.env`! 🎉
