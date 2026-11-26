# Railway Deployment Guide

This guide walks you through deploying ChandaCollection backend and PostgreSQL database to Railway.

## What is Railway?

Railway is a modern deployment platform that makes it easy to deploy:
- Backend applications (Node.js, Python, Go, etc.)
- Databases (PostgreSQL, MySQL, MongoDB, etc.)
- All with automatic scaling and monitoring

**Website**: https://railway.app

---

## Prerequisites

1. GitHub account with code pushed (✅ Already done!)
2. Railway account (free tier available)
3. 10 minutes of your time

---

## Step 1: Create Railway Account

1. Go to https://railway.app
2. Click **"Start for Free"**
3. Sign up with GitHub (recommended)
4. Authorize Railway to access your GitHub

---

## Step 2: Create a New Project

1. After logging in, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select **`ChandaCollectionApp`** from your repositories
4. Click **"Deploy"**

Railway will start provisioning your project.

---

## Step 3: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically add PostgreSQL to your project

**Wait for it to fully initialize** (usually 1-2 minutes)

---

## Step 4: Configure Backend Environment Variables

1. Click on the **Express.js** service in your Railway project
2. Go to the **"Variables"** tab
3. Add these environment variables:

```
JWT_SECRET=your_super_secret_key_min_32_chars_long_change_this
JWT_EXPIRE=7d
NODE_ENV=production
PORT=3000
```

For the **DATABASE_URL**, Railway will automatically provide it. Click on the PostgreSQL database and copy the connection string from the variables tab.

4. Add to Express.js variables:
```
DATABASE_URL=postgresql://user:password@host:port/database
```

Railway will show you the exact connection string.

---

## Step 5: Verify Deployment

1. Click on your Express.js service
2. Go to the **"Deployments"** tab
3. Wait for the **"Status"** to show **"Success"** (green checkmark)
4. Click on the **"Service URL"** to get your API URL

Your API is now live! 🚀

Example URL: `https://chandacollection-prod-xxxxx.railway.app`

---

## Step 6: Test Deployed API

```bash
# Replace with your Railway API URL
API_URL="https://your-railway-url.railway.app"

# Test signup
curl -X POST $API_URL/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Expected: JWT token in response
```

---

## Step 7: Update Frontend API URL (Optional)

If you want the mobile app to use the deployed backend:

**File**: `frontend/src/services/api.js`

Change:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

To:
```javascript
const API_BASE_URL = 'https://your-railway-url.railway.app/api';
```

Rebuild the app and redeploy.

---

## Troubleshooting

### "Build Failed"
1. Check the **"Build Logs"** tab
2. Ensure `backend/package.json` exists
3. Ensure `backend/src/index.js` exists
4. Push fixes to GitHub and redeploy

### "Service won't start"
1. Check **"Deploy Logs"** tab
2. Verify DATABASE_URL is correct
3. Verify JWT_SECRET is set
4. Check PORT is set to 3000

### "Cannot connect to database"
1. Verify PostgreSQL service is running
2. Check DATABASE_URL is correct (from Railway PostgreSQL variables)
3. Ensure firewall rules allow connection
4. Railway automatically handles firewall

### "502 Bad Gateway"
Wait 2-3 minutes for the service to fully start. Railway needs time to initialize.

---

## Managing Your Railway Services

### View Logs
1. Click on a service
2. Click **"Logs"** tab
3. Watch real-time logs

### Monitor Performance
1. Click on a service
2. Click **"Monitoring"** tab
3. View CPU, Memory, Network usage

### Scale Services (Paid)
1. Click on a service
2. Click **"Settings"** tab
3. Adjust resources if needed

### View Database
1. Click on PostgreSQL service
2. Click **"Data"** tab
3. Browse tables and data

---

## Database Management

### Connect to PostgreSQL from Local Machine

```bash
# Get connection string from Railway
# (Found in PostgreSQL service → Variables → DATABASE_URL)

# Example format:
# postgresql://user:password@host:port/database

psql postgresql://user:password@host:port/database
```

### Backup Database

1. Go to PostgreSQL service
2. Click **"Database"** tab
3. Click **"Backup"** button
4. Download backup

### Restore Database

1. Click **"Restore"** in Database tab
2. Select backup file
3. Confirm restoration

---

## Environment Variables Reference

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | Auto-provided | From PostgreSQL service |
| `JWT_SECRET` | Random string | Min 32 chars, change it! |
| `JWT_EXPIRE` | `7d` | 7 days expiration |
| `NODE_ENV` | `production` | Production environment |
| `PORT` | `3000` | Railway default |

---

## Monitoring & Alerts

### Enable Email Notifications
1. Go to **Account Settings**
2. Set up email notifications
3. Get alerts for deployment failures

### View Metrics
1. Click on service
2. Click **"Monitoring"**
3. See CPU, Memory, Network, Errors

---

## Custom Domain (Optional)

To use your own domain instead of railway.app:

1. Go to Express.js service
2. Click **"Settings"**
3. Click **"Custom Domain"**
4. Enter your domain (e.g., `api.chandacollection.com`)
5. Update DNS records as instructed

---

## CI/CD Pipeline

Railway automatically:
1. ✅ Detects code changes on GitHub
2. ✅ Builds Docker image
3. ✅ Runs tests (if configured)
4. ✅ Deploys to production
5. ✅ Zero-downtime deployment

**No manual deployment needed!** Just push to GitHub and Railway handles the rest.

---

## Production Checklist

Before going live with users:

- [ ] Set strong JWT_SECRET (min 32 chars, random)
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS (Railway does this by default)
- [ ] Set up database backups
- [ ] Enable monitoring/alerts
- [ ] Test all API endpoints
- [ ] Load test the API
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Enable rate limiting
- [ ] Review security settings

---

## Pricing

Railway offers:
- **Free Tier**: $5/month credit (usually free for hobby projects)
- **Pay-as-you-go**: $0.000417/GB/hour (charged by usage)
- **Most indie projects**: Under $20/month

**No credit card required for free tier!**

---

## Useful Railway Commands (CLI)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link project
railway link

# Deploy
railway up

# View logs
railway logs

# View variables
railway variables
```

---

## Support & Documentation

- **Railway Docs**: https://docs.railway.app
- **Status Page**: https://status.railway.app
- **Community**: https://railway.app/support
- **Pricing**: https://railway.app/pricing

---

## Next Steps

1. ✅ Create Railway account
2. ✅ Deploy backend
3. ✅ Deploy PostgreSQL
4. ✅ Test API
5. 🔄 Update frontend API URL (optional)
6. 🔄 Set up custom domain (optional)
7. 🔄 Enable monitoring & backups

Your backend is now **production-ready** and running on Railway! 🚀

---

## Quick Reference

**GitHub Repository**:
```
https://github.com/kumarbikash411/ChandaCollectionApp
```

**Railway URL** (after deployment):
```
https://your-project.railway.app/api
```

**Database Connection** (from Railway):
```
postgresql://user:password@host:port/database
```

**Local Testing** (before Railway):
```bash
cd backend
npm run dev
# http://localhost:5000/api
```

---

**Deployment Complete!** 🎉

Your ChandaCollection backend is now deployed to Railway with PostgreSQL database!

Ready for Phase 2 development? See DEVELOPMENT.md for adding new features.
