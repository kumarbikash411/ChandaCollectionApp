# 🧪 Local Testing Guide - ChandaCollection MVP

This guide will help you run the entire ChandaCollection app locally and verify everything is working.

## ✅ Prerequisites Check

Before starting, make sure you have:

```bash
# Check Node.js
node --version    # Should be v18 or higher

# Check npm
npm --version     # Should be v9 or higher

# Check PostgreSQL (if installed locally)
psql --version    # Optional - only if setting up local DB
```

---

## 🗄️ Database Setup

### Option A: Use PostgreSQL Locally (Recommended for Full Testing)

#### macOS (using Homebrew):
```bash
# Install PostgreSQL
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Create database
createdb chandacollection

# Verify connection
psql -U postgres -d chandacollection -c "SELECT 1"
```

#### macOS (using Docker):
```bash
# If you have Docker installed, use this instead:
docker run --name chandacollection-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=chandacollection \
  -p 5432:5432 \
  -d postgres:13
```

#### Linux (Ubuntu/Debian):
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb chandacollection
```

#### Windows:
```bash
# Download PostgreSQL installer from https://www.postgresql.org/download/windows/
# Run installer with default settings
# PostgreSQL will start automatically
```

---

## 🚀 Backend Setup & Run

### Step 1: Navigate to Backend
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Verify .env File
```bash
# Check the .env file
cat .env

# It should contain:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/chandacollection
# JWT_SECRET=your_jwt_secret_key_change_in_production
# JWT_EXPIRE=7d
# PORT=5000
# NODE_ENV=development
```

### Step 4: Start the Backend Server
```bash
npm start
```

You should see:
```
Server running on port 5000
Database connected successfully
✓ Tables initialized
```

If you see errors about database connection, follow the **Troubleshooting** section below.

---

## 📱 Frontend Setup & Run (In a new terminal)

### Step 1: Navigate to Frontend
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Metro Server (for React Native)
```bash
npm start
```

You should see:
```
Starting Metro Bundler
Loaded dependency graph, 123 total modules
```

---

## 🧪 Testing the API

### In a new terminal, run these tests:

#### Test 1: Signup Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-string",
    "email": "testuser@example.com",
    "firstName": "Test",
    "lastName": "User"
  }
}
```

#### Test 2: Login Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Password123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-string",
    "email": "testuser@example.com",
    "firstName": "Test",
    "lastName": "User"
  }
}
```

#### Test 3: Profile Endpoint (Requires JWT Token)
```bash
# Replace YOUR_TOKEN with the token from signup/login response
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "id": "uuid-string",
  "email": "testuser@example.com",
  "firstName": "Test",
  "lastName": "User",
  "createdAt": "2026-11-26T22:08:53.386Z"
}
```

#### Test 4: Invalid Token Test (Should fail)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer invalid_token"
```

**Expected Response (401 Unauthorized):**
```json
{
  "error": "Invalid or expired token"
}
```

---

## 📊 Database Verification

### Check if tables were created:

```bash
# Connect to the database
psql -U postgres -d chandacollection

# List all tables
\dt

# Should show:
#          List of relations
# Schema |      Name       | Type  |  Owner
#--------+-----------------+-------+----------
# public | users           | table | postgres
# public | groups          | table | postgres
# public | campaigns       | table | postgres
# public | payments        | table | postgres
# public | expenses        | table | postgres
# public | audit_logs      | table | postgres
# public | notifications   | table | postgres
```

### Check users table:
```bash
SELECT * FROM users;

# Should show your test user:
#                   id                  |          email           | password_hash | firstname | lastname |          createdat
# ------------------------------------+--------------------------+---------------+-----------+----------+---------------------------
# xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | testuser@example.com     | $2a$10$...    | Test      | User     | 2026-11-26 22:08:53.386+05:30
```

### Exit PostgreSQL:
```bash
\q
```

---

## ✅ Verification Checklist

After running all tests, verify:

- [ ] Backend server starts without errors
- [ ] Database connects successfully
- [ ] Tables are created automatically
- [ ] Signup endpoint works (returns JWT token)
- [ ] Login endpoint works (returns JWT token)
- [ ] Profile endpoint works (with valid token)
- [ ] Profile endpoint fails properly (with invalid token)
- [ ] User data is stored in database
- [ ] Metro server starts for React Native

---

## 🐛 Troubleshooting

### Issue: "Database connection refused"

**Solution:**
```bash
# Check if PostgreSQL is running
# macOS (Homebrew):
brew services list

# Should show: postgresql started

# If not running, start it:
brew services start postgresql

# macOS (Docker):
docker ps

# If container not running:
docker start chandacollection-db

# Linux:
sudo systemctl status postgresql

# Windows:
# Check Services > PostgreSQL
```

### Issue: "Database chandacollection does not exist"

**Solution:**
```bash
# Create the database
createdb chandacollection

# Or with password:
createdb -U postgres -h localhost chandacollection
```

### Issue: "authentication failed for user postgres"

**Solution:**
```bash
# Update .env with correct credentials:
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/chandacollection

# Or reset PostgreSQL password:
psql -U postgres
\password postgres
# Enter new password twice
\q
```

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (get PID from above)
kill -9 <PID>

# Or use a different port in .env:
PORT=5001
```

### Issue: "npm: command not found"

**Solution:**
```bash
# Install Node.js and npm
# macOS:
brew install node

# Linux:
sudo apt-get install nodejs npm

# Windows:
# Download from https://nodejs.org/
```

### Issue: "Metro bundler error" in frontend

**Solution:**
```bash
# Clear Metro cache
npm start -- --reset-cache

# Or reset node_modules
rm -rf node_modules
npm install
npm start
```

---

## 📱 Testing with Postman/Insomnia

If you prefer a GUI instead of curl:

### Setup:
1. Download Postman or Insomnia
2. Create a new workspace
3. Add the following requests:

#### Request 1: Signup
- **Method:** POST
- **URL:** http://localhost:5000/api/auth/signup
- **Headers:** Content-Type: application/json
- **Body (raw JSON):**
  ```json
  {
    "email": "postman@example.com",
    "password": "Password123",
    "firstName": "Postman",
    "lastName": "User"
  }
  ```

#### Request 2: Login
- **Method:** POST
- **URL:** http://localhost:5000/api/auth/login
- **Headers:** Content-Type: application/json
- **Body (raw JSON):**
  ```json
  {
    "email": "postman@example.com",
    "password": "Password123"
  }
  ```

#### Request 3: Profile
- **Method:** GET
- **URL:** http://localhost:5000/api/auth/profile
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer {{token}}
  - (Replace {{token}} with actual token from login)

---

## 🔍 Checking Logs

### Backend Logs:
The backend terminal shows:
- Server startup messages
- Database connection status
- Request/response details
- Error messages with line numbers

### Database Logs:
```bash
# macOS (Homebrew):
tail -f /usr/local/var/log/postgres.log

# Linux:
sudo tail -f /var/log/postgresql/postgresql.log
```

---

## 📂 File Locations

**Backend:**
- Server: `backend/src/index.js`
- Routes: `backend/src/routes/authRoutes.js`
- Controllers: `backend/src/controllers/authController.js`
- Database: `backend/src/db/init.js` (schema)
- Database: `backend/src/db/pool.js` (connection)

**Frontend:**
- App: `frontend/App.jsx`
- Screens: `frontend/src/screens/`
- API Service: `frontend/src/services/api.js`
- State: `frontend/src/store/authStore.js`

---

## 🚀 Next Steps

After verifying everything works locally:

1. **Test on Railway:**
   - Follow RAILWAY_DEPLOYMENT.md
   - Deploy to Railway
   - Test production API

2. **Begin Phase 2:**
   - Create group endpoints
   - Add campaign functionality
   - Implement payment recording

3. **Team Collaboration:**
   - Add team members to GitHub
   - Set up code review process
   - Configure CI/CD notifications

---

## 💡 Tips

- **Keep terminals open:** Keep backend server running in one terminal while testing
- **Use different emails:** For each signup test, use a different email
- **Save tokens:** Copy JWT tokens for testing authenticated endpoints
- **Check logs:** When something fails, check the backend terminal logs first
- **Reset database:** To start fresh, delete the database and backend server will recreate it

---

## 📞 Support

If something doesn't work:

1. Check **Troubleshooting** section above
2. Review **Logs** in backend terminal
3. Run database verification commands
4. Check `.env` file for correct values
5. Create GitHub issue with error message and logs

---

**Status:** ✅ Ready for local testing
**Expected time:** 15-20 minutes for full setup
**Success indicator:** All 3 API endpoints respond with correct data

Good luck! 🚀
