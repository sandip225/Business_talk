# Database Connection Troubleshooting Guide

## ✅ Database Connection Status

**Good News!** Your MongoDB Atlas connection is working perfectly. The test confirmed:
- ✅ Connection to MongoDB Atlas successful
- ✅ Database: `business-talk` is accessible
- ✅ Collections exist: `aboutus`, `blogs`, `users`, `categories`, `podcasts`
- ✅ All CRUD operations (Create, Read, Update, Delete) working

## 🔍 Issues Identified

### Issue 1: No Blogs in Database
**Problem**: The database has 0 blogs stored.

**Solution**: You need to create blogs through the admin panel.

### Issue 2: Frontend Not Showing Data
**Problem**: Frontend might not be connecting to the backend API correctly.

**Solution**: Configure the frontend API URL properly.

---

## 🛠️ Solutions

### Step 1: Create Frontend Environment File

Create a file named `.env.local` in the `frontend` directory with:

```env
# Backend API URL for local development
VITE_API_URL=http://localhost:5000/api
```

**How to create it:**

```bash
# Windows (PowerShell)
cd frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Or manually create the file in frontend/.env.local
```

### Step 2: Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: ac-itbyxkq-shard-00-00.qxps2vv.mongodb.net
✅ Admin user exists: admin@businesstalk.com
🚀 Server running on http://localhost:5000
```

### Step 3: Start Frontend Server

```bash
cd frontend
npm run dev
```

### Step 4: Create Your First Blog

1. **Login to Admin Panel**
   - Go to: `http://localhost:5173/admin/login`
   - Email: `admin@businesstalk.com`
   - Password: `Admin@123`

2. **Create a Blog**
   - Go to Dashboard
   - Click "Create New Blog"
   - Fill in the form:
     - Title: "Welcome to Business Talk"
     - Excerpt: "Your premier podcast for business insights"
     - Content: Write your content
     - Category: "Business"
     - Set "Published" to true
   - Click "Save"

3. **Verify Blog is Saved**
   - Check the admin blogs list
   - Or run the test script:
     ```bash
     cd backend
     npx tsx src/test-db-connection.ts
     ```

---

## 🔧 Common Issues & Fixes

### Issue: "Failed to fetch blogs"

**Cause**: Frontend can't reach backend API

**Fix**:
1. Check backend is running on port 5000
2. Check frontend .env.local has correct API URL
3. Open browser console (F12) and check for CORS errors

### Issue: "Network Error" in Frontend

**Cause**: Backend not running or wrong URL

**Fix**:
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Should return: {"status":"ok","timestamp":"..."}
```

### Issue: Blogs Not Appearing on Public Pages

**Cause**: Blogs are not published

**Fix**:
1. Login to admin panel
2. Edit the blog
3. Set `isPublished` to `true`
4. Save

---

## 📊 Verify Everything is Working

### Test 1: Backend Health Check
```bash
curl http://localhost:5000/api/health
```
Expected: `{"status":"ok","timestamp":"2026-01-09T..."}`

### Test 2: Get All Blogs (Public)
```bash
curl http://localhost:5000/api/blogs
```
Expected: `{"blogs":[],"pagination":{...}}` (empty if no published blogs)

### Test 3: Get All Blogs (Admin)
```bash
# First, login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@businesstalk.com","password":"Admin@123"}'

# Copy the accessToken from response, then:
curl http://localhost:5000/api/blogs/admin/all \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test 4: Create a Blog via API
```bash
# Get token first (see Test 3)

curl -X POST http://localhost:5000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Blog via API",
    "excerpt": "This is a test",
    "content": "Full content here",
    "category": "Test",
    "isPublished": true
  }'
```

---

## 🎯 Quick Fix Script

Run this to test and fix common issues:

```bash
# 1. Test database connection
cd backend
npx tsx src/test-db-connection.ts

# 2. Start backend (in new terminal)
npm run dev

# 3. Start frontend (in another new terminal)
cd ../frontend
npm run dev

# 4. Open browser
# Visit: http://localhost:5173
# Admin: http://localhost:5173/admin/login
```

---

## 📝 Checklist

- [ ] Backend .env file exists with correct MONGODB_URI
- [ ] Frontend .env.local file exists with VITE_API_URL
- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 5173
- [ ] Can access http://localhost:5000/api/health
- [ ] Can login to admin panel
- [ ] Created at least one blog
- [ ] Blog is set to "Published"
- [ ] Blog appears on public pages

---

## 🆘 Still Having Issues?

### Check Backend Logs
Look for these messages when backend starts:
```
✅ MongoDB Connected: ...
✅ Admin user exists: ...
🚀 Server running on http://localhost:5000
```

### Check Frontend Console
Open browser DevTools (F12) → Console tab
Look for:
- ❌ Network errors
- ❌ CORS errors
- ❌ 404 errors

### Check MongoDB Atlas
1. Go to MongoDB Atlas dashboard
2. Check if cluster is running
3. Verify IP whitelist (add 0.0.0.0/0 for testing)
4. Check database user permissions

---

## 📚 Additional Resources

- **Backend API Docs**: See `backend/README.md`
- **Frontend Setup**: See `frontend/SETUP.md`
- **Docker Deployment**: See `EC2_DEPLOYMENT_GUIDE.md`

---

## ✨ Summary

Your database connection is **working perfectly**! The issue is simply that:
1. No blogs have been created yet (database is empty)
2. Frontend needs proper API URL configuration

Follow the steps above to create blogs and configure the frontend, and everything will work! 🎉

