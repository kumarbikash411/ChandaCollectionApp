# ChandaCollection - Quick Start Guide

Get the ChandaCollection app running in 10 minutes! 🚀

## Prerequisites

Before you start, make sure you have:

- **Node.js 16+** - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL 12+** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

## Step 1: Set Up PostgreSQL (5 minutes)

### macOS
```bash
# Install PostgreSQL
brew install postgresql

# Start the service
brew services start postgresql

# Create database and user
psql -U postgres << 'EOF'
CREATE DATABASE chandacollection;
CREATE USER chandauser WITH PASSWORD 'chandapass123';
GRANT ALL PRIVILEGES ON DATABASE chandacollection TO chandauser;
\q
EOF
```

### Ubuntu/Debian
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start

# Create database and user
sudo -u postgres psql << 'EOF'
CREATE DATABASE chandacollection;
CREATE USER chandauser WITH PASSWORD 'chandapass123';
GRANT ALL PRIVILEGES ON DATABASE chandacollection TO chandauser;
\q
EOF
```

### Windows
1. Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. During installation, remember your password for the postgres user
3. Open pgAdmin or PowerShell and run:
```sql
-- Create database
CREATE DATABASE chandacollection;
CREATE USER chandauser WITH PASSWORD 'chandapass123';
GRANT ALL PRIVILEGES ON DATABASE chandacollection TO chandauser;
```

## Step 2: Clone & Set Up Backend (3 minutes)

```bash
# Navigate to your project directory
cd /Users/bikashkumar/ChandaCollectionApp

# Install backend dependencies
cd backend
npm install

# Backend is now ready!
```

## Step 3: Start the Backend Server (1 minute)

```bash
# From the backend directory
npm run dev
```

You should see:
```
✅ ChandaCollection Backend running on http://localhost:5000
📡 API base: http://localhost:5000/api
Database initialized successfully!
```

**Keep this terminal open!** The server needs to stay running.

## Step 4: Test the API (1 minute)

Open a new terminal and test the signup endpoint:

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

You should get a response with a token:
```json
{
  "message": "User created successfully",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

✅ **Backend is working!**

## Step 5: Set Up Frontend (Optional - For Mobile Development)

### Option A: React Native CLI (iOS/Android)

```bash
# From the frontend directory
cd ../frontend
npm install

# Start the Metro bundler
npm start

# In another terminal, run on iOS
npm run ios

# Or run on Android (requires Android Studio/emulator)
npm run android
```

### Option B: Web Testing (For Now)

Since React Native requires Xcode (macOS) or Android Studio (Windows/Linux), we'll test the backend API directly for now.

## Understanding the Project Structure

```
ChandaCollectionApp/
├── backend/           ← Node.js + Express server (runs on port 5000)
│   ├── src/
│   │   ├── controllers/    # Handles requests (signup, login, etc.)
│   │   ├── models/         # Database interactions
│   │   ├── routes/         # API endpoint definitions
│   │   ├── middleware/     # Authentication & validation
│   │   └── db/             # Database connection
│   └── package.json
│
├── frontend/          ← React Native mobile app
│   ├── src/
│   │   ├── screens/        # UI screens (Login, Signup, Home)
│   │   ├── services/       # API client (connects to backend)
│   │   ├── store/          # State management
│   │   └── navigation/     # Screen navigation
│   └── package.json
│
├── database/          # Database documentation
│   └── SETUP.md        # Detailed PostgreSQL setup
│
├── docs/              # Technical documentation
│   ├── API.md          # Complete API reference
│   └── ARCHITECTURE.md  # System design overview
│
└── README.md          # Main project documentation
```

## Available API Endpoints (Phase 1)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/signup` | Create a new account |
| POST | `/api/auth/login` | Login and get token |
| GET | `/api/auth/profile` | Get current user info |

### Sign Up Example
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "securePass123",
    "firstName": "Alice",
    "lastName": "Smith"
  }'
```

### Login Example
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "securePass123"
  }'
```

### Get Profile Example (use the token from login/signup)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Database Verification

To verify your database is set up correctly:

```bash
# Connect to the database
psql -U chandauser -d chandacollection

# List all tables
\dt

# Should show:
# - audit_logs
# - campaigns
# - expenses
# - group_members
# - groups
# - payments
# - users

# Exit
\q
```

## What's Next?

The MVP (Phase 1) is initialized with:
- ✅ User authentication (signup/login)
- ✅ Database schema for all features
- ✅ API framework ready for new endpoints
- ✅ Mobile app navigation structure

### Next Steps to Build:
1. **Group Management** - Create groups, add members, assign roles
2. **Campaign Creation** - Set up collection campaigns with targets
3. **Payment Recording** - Log cash and UPI payments
4. **Per-Person Ledger** - Show who paid what
5. **Expense Tracking** - Add expenses with bill photos
6. **Dashboard** - Transparency view with totals
7. **Receipts & Reports** - PDF generation and exports

## Troubleshooting

### "Port 5000 already in use"
```bash
# Find and kill the process
lsof -i :5000
kill -9 <PID>
```

### "Cannot connect to database"
1. Check PostgreSQL is running: `brew services list` (macOS)
2. Verify credentials in `backend/.env`
3. Check database exists: `psql -U chandauser -d chandacollection`

### "Module not found"
```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Port 3000 already in use" (frontend)
Metro will auto-increment the port, or you can kill the process:
```bash
lsof -i :3000
kill -9 <PID>
```

## Useful Commands

```bash
# Backend development
cd backend
npm run dev          # Start with auto-reload
npm test             # Run tests (when added)

# Frontend development
cd frontend
npm start            # Start Metro bundler
npm run ios          # Run on iOS simulator
npm run android      # Run on Android emulator

# Database
psql -U chandauser -d chandacollection  # Connect to database
psql -U chandauser -d chandacollection < backup.sql  # Restore backup

# Git
git status           # See changes
git add .            # Stage all
git commit -m "msg"  # Commit
git log              # View history
```

## For Production Deployment

See the following for deploying to the cloud:

- **Backend**: Deploy on Railway, Heroku, or AWS
  - Set DATABASE_URL to your cloud PostgreSQL
  - Set JWT_SECRET to a strong random string
  - Set NODE_ENV=production

- **Frontend**: Build and upload to App Store / Play Store
  - Use Expo EAS Build for managed deployment
  - Or use native build tools (Xcode for iOS, Android Studio for Android)

## Support & Documentation

- 📖 [Full API Documentation](./docs/API.md)
- 🏗️ [System Architecture](./docs/ARCHITECTURE.md)
- 🗄️ [Database Setup](./database/SETUP.md)
- 📋 [Main README](./README.md)

## Happy Coding! 🎉

You now have a fully functional backend running. Start by exploring the API endpoints, then build out the group management features next.

Questions? Check the docs or the code comments for more details!
