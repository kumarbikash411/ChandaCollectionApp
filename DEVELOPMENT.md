# Development Workflow Guide

## Working on ChandaCollection

This guide helps you contribute to ChandaCollection effectively.

## Daily Development Workflow

### 1. Start the Backend

```bash
cd backend
npm run dev
```

This starts the Express server with auto-reload (using nodemon).

Watch for:
```
Database initialized successfully!
✅ ChandaCollection Backend running on http://localhost:5000
```

### 2. Test Your Changes

```bash
# In a new terminal, test an endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123"}'
```

### 3. Work on Frontend (Optional)

```bash
cd frontend
npm start

# In another terminal
npm run ios
# or
npm run android
```

## Adding a New Feature

### Example: Creating Group Management Feature

#### Step 1: Database Schema (Already Done in `src/db/init.js`)

The groups and group_members tables are already defined. No changes needed here.

#### Step 2: Create the Model

**File**: `backend/src/models/Group.js`

```javascript
const pool = require('../db/pool');
const { v4: uuidv4 } = require('uuid');

class GroupModel {
  static async create(name, description, type, adminId) {
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO groups (id, name, description, type, admin_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, description, type, admin_id, created_at`,
      [id, name, description, type, adminId]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM groups WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByUser(userId) {
    const result = await pool.query(
      `SELECT g.* FROM groups g
       JOIN group_members gm ON g.id = gm.group_id
       WHERE gm.user_id = $1`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = GroupModel;
```

#### Step 3: Create the Controller

**File**: `backend/src/controllers/groupController.js`

```javascript
const { body, validationResult } = require('express-validator');
const GroupModel = require('../models/Group');

const createGroup = [
  body('name').trim().notEmpty().withMessage('Group name is required'),
  body('type').trim().notEmpty().withMessage('Group type is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, type } = req.body;
      const group = await GroupModel.create(name, description, type, req.userId);
      res.status(201).json({ message: 'Group created', group });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create group' });
    }
  },
];

const getGroups = async (req, res) => {
  try {
    const groups = await GroupModel.findByUser(req.userId);
    res.json({ groups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

module.exports = { createGroup, getGroups };
```

#### Step 4: Create the Routes

**File**: `backend/src/routes/groupRoutes.js`

```javascript
const express = require('express');
const { createGroup, getGroups } = require('../controllers/groupController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, createGroup);
router.get('/', authMiddleware, getGroups);

module.exports = router;
```

#### Step 5: Mount the Routes

**Edit**: `backend/src/index.js`

```javascript
// Add this after other route imports
const groupRoutes = require('./routes/groupRoutes');

// Add this after other app.use() calls
app.use('/api/groups', groupRoutes);
```

#### Step 6: Test the Endpoints

```bash
# Create a group
curl -X POST http://localhost:5000/api/groups \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "School Class 10A",
    "description": "Annual picnic collection",
    "type": "School"
  }'

# Get user's groups
curl -X GET http://localhost:5000/api/groups \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Git Workflow

### Creating a Feature Branch

```bash
git checkout -b feature/group-management
```

### Committing Changes

```bash
# View changes
git status

# Stage specific files
git add backend/src/models/Group.js
git add backend/src/controllers/groupController.js
git add backend/src/routes/groupRoutes.js

# Or stage all changes
git add -A

# Commit with a descriptive message
git commit -m "Add group management API

- Create groups with name, type, and admin
- Retrieve user's groups
- Group model and controller with validation

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Pushing Changes

```bash
git push origin feature/group-management
```

## Project Structure Best Practices

### Controllers
- Handle HTTP requests/responses
- Validate input
- Call models for business logic
- Return structured JSON

### Models
- Interact with database via pg pool
- Implement CRUD operations
- Handle SQL queries
- Return raw data (not formatted)

### Routes
- Define HTTP verbs and paths
- Mount middleware (auth, validation)
- Link to controllers
- Keep route files focused on one resource

### Middleware
- Verify authentication
- Validate permissions
- Error handling
- Logging

## Error Handling Pattern

```javascript
try {
  // Business logic
  const result = await someOperation();
  res.json({ data: result });
} catch (err) {
  console.error('Operation error:', err);
  
  // Return appropriate status code
  if (err.message === 'Not found') {
    res.status(404).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

## Logging Best Practices

```javascript
// Development - detailed logs
console.log('Creating group:', { name, type, adminId });

// Production - structured logging (use winston or pino)
// logger.info('User created', { userId, email });

// Errors - always log with context
console.error('Database error:', err);
```

## Security Checklist

Before committing:
- ✅ Sensitive data (passwords, tokens) is NOT logged
- ✅ User input is ALWAYS validated
- ✅ Database queries use parameterized queries (never string concatenation)
- ✅ Authentication middleware is applied to protected routes
- ✅ No hardcoded secrets in code (use .env)
- ✅ SQL injection impossible (using pg prepared statements)

## Code Style

### File Naming
- Controllers: `camelCase` + "Controller" suffix
  - `groupController.js`, `paymentController.js`
- Models: `PascalCase`
  - `Group.js`, `Payment.js`
- Routes: `camelCase` + "Routes" suffix
  - `groupRoutes.js`, `paymentRoutes.js`

### Variable Naming
```javascript
// Good
const groupId = uuidv4();
const groupName = 'Class 10A';

// Avoid
const g_id = uuidv4();
const gn = 'Class 10A';
```

### Comments
Only comment WHY, not WHAT:

```javascript
// Good - explains intent
// Convert amount to base currency for consistency across regions
const convertedAmount = amount * exchangeRate;

// Bad - reiterates code
// Multiply amount by exchange rate
const convertedAmount = amount * exchangeRate;
```

## Testing

### Manual Testing (For Now)

Use curl to test endpoints:

```bash
# Test a POST endpoint
curl -X POST http://localhost:5000/api/resource \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"field":"value"}'

# Test a GET endpoint
curl -X GET http://localhost:5000/api/resource/123 \
  -H "Authorization: Bearer TOKEN"
```

### Automated Testing (Phase 2)

```bash
npm test
```

Write tests for:
- Model methods
- Controller validation
- Edge cases (empty inputs, invalid tokens)

## Database Migrations (Future)

For now, the schema is auto-initialized. When you need to change schema:

1. Add changes to `src/db/init.js` ALTER TABLE commands
2. Restart the server (it won't recreate existing tables)
3. Or manually run SQL in psql for existing databases

## Debugging

### Backend Issues

1. Check server logs in the terminal running `npm run dev`
2. Add console.log statements in controllers
3. Use curl to test API directly
4. Check database: `psql -U chandauser -d chandacollection`

### Frontend Issues

1. Check React Native console in Metro bundler
2. Use `console.log()` in screens/services
3. Check network tab in debugger
4. Verify backend is running and accessible

### Database Connection Issues

```bash
# Test connection
psql -U chandauser -d chandacollection

# Check database exists
psql -U postgres -l

# View current connections
SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;
```

## Common Tasks

### Add a New API Endpoint

1. Create model method (if DB query needed)
2. Create controller function (request handler)
3. Create route definition
4. Mount route in `index.js`
5. Test with curl

### Add a New Screen (Frontend)

1. Create screen component in `frontend/src/screens/`
2. Add to navigation in `RootNavigator.jsx`
3. Use `useAuthStore` for state
4. Call API services
5. Test on simulator/emulator

### Update Database Schema

1. Edit `src/db/init.js` to add new tables/columns
2. Restart server (`npm run dev`)
3. Verify with `psql`

### Create Database Backup

```bash
pg_dump -U chandauser -d chandacollection > backup.sql
```

### Reset Database (WARNING: Deletes all data!)

```bash
dropdb -U chandauser chandacollection
createdb -U chandauser chandacollection
npm run dev  # Reinitialize schema
```

## Documentation

Keep these updated:
- **API.md** - New endpoints and their usage
- **ARCHITECTURE.md** - Major structure changes
- **README.md** - Setup and overview
- **Code comments** - Complex logic

## Deployment Checklist

Before deploying to production:
- ✅ All tests pass
- ✅ No console.log() in production code (use logger)
- ✅ No hardcoded secrets
- ✅ DATABASE_URL and JWT_SECRET set
- ✅ CORS configured for frontend domain
- ✅ Error messages don't expose sensitive info
- ✅ Rate limiting enabled (future)
- ✅ HTTPS enabled
- ✅ Database backups configured

## Useful Resources

- PostgreSQL: https://www.postgresql.org/docs/
- Express: https://expressjs.com/
- React Native: https://reactnative.dev/
- Zustand: https://github.com/pmndrs/zustand
- JWT: https://jwt.io/

Happy coding! 🎉
