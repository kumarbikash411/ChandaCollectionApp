# 📚 ChandaCollection - Documentation Index

Welcome! Here's your complete map to the ChandaCollection codebase.

## 🎯 Start Here (Choose Your Path)

### 👤 I'm New to This Project
**→ Read these in order:**
1. [GETTING_STARTED.md](./GETTING_STARTED.md) - Visual project overview (10 min)
2. [QUICKSTART.md](./QUICKSTART.md) - Setup PostgreSQL and run backend (10 min)
3. [README.md](./README.md) - Project vision and features (5 min)

### 👨‍💻 I'm a Developer Ready to Code
**→ Read these:**
1. [DEVELOPMENT.md](./DEVELOPMENT.md) - Workflow and how to add features
2. [docs/API.md](./docs/API.md) - API endpoints reference
3. [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - System design

### 🏗️ I Want to Understand the Architecture
**→ Read these:**
1. [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Complete system design
2. [database/SETUP.md](./database/SETUP.md) - Database schema explained
3. [docs/API.md](./docs/API.md) - API patterns and endpoints

### 🚀 I Want to Deploy to Production
**→ Read these:**
1. [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md#deployment-architecture) - Deployment setup
2. [QUICKSTART.md](./QUICKSTART.md#production-deployment) - Production environment
3. Backend: Configure environment variables in `.env`

### 🐛 Something Isn't Working
**→ Check these:**
1. [QUICKSTART.md#troubleshooting](./QUICKSTART.md#troubleshooting) - Common issues
2. [DEVELOPMENT.md#debugging](./DEVELOPMENT.md#debugging) - Debug techniques
3. Check server logs: `npm run dev` output

---

## 📄 Complete Documentation Map

### 🏠 Main Documentation
| Document | Purpose | Audience |
|----------|---------|----------|
| [README.md](./README.md) | Project overview, tech stack, MVP features | Everyone |
| [QUICKSTART.md](./QUICKSTART.md) | 10-minute setup guide with copy-paste commands | Developers |
| [GETTING_STARTED.md](./GETTING_STARTED.md) | Visual project structure and next steps | Developers |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | What was built, deliverables, future roadmap | Project Managers |

### 🛠️ Technical Documentation
| Document | Purpose | For |
|----------|---------|-----|
| [docs/API.md](./docs/API.md) | Complete API reference with curl examples | Developers |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design, ERDs, component architecture | Architects/Senior Devs |
| [database/SETUP.md](./database/SETUP.md) | PostgreSQL setup for all platforms | DevOps/Developers |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Workflow, feature implementation, best practices | Developers |

### 🚀 Operational
| Document | Purpose | For |
|----------|---------|-----|
| [start.sh](./start.sh) | Automated setup and backend startup | Everyone |
| [.gitignore](./.gitignore) | Git ignore patterns | Git users |
| [.env.example](./backend/.env.example) | Environment variable template | Developers |

---

## 🗂️ What's Inside Each Folder

### `/backend` - Express.js REST API
```
├── package.json         → Dependencies and scripts
├── .env                 → Configuration (database, JWT secret, port)
└── src/
    ├── index.js         → Main server file
    ├── controllers/     → Request handlers (signup, login, etc.)
    ├── models/          → Database interactions (User.js)
    ├── routes/          → API endpoint definitions
    ├── middleware/      → Auth and validation
    └── db/              → Database connection and schema
```

**Start here**: `backend/src/index.js` - Main Express server

### `/frontend` - React Native Mobile App
```
├── package.json         → Dependencies
├── App.jsx              → App entry point
└── src/
    ├── screens/         → UI screens (Login, Signup, Home)
    ├── navigation/      → Screen routing and navigation
    ├── services/        → API client (connects to backend)
    ├── store/           → State management (Zustand)
    └── components/      → Reusable UI components
```

**Start here**: `frontend/App.jsx` - App entry point

### `/database` - Database Documentation
- `SETUP.md` - Detailed PostgreSQL setup for all platforms

**Start here**: PostgreSQL setup in QUICKSTART.md

### `/docs` - Technical Documentation
- `API.md` - API reference with request/response examples
- `ARCHITECTURE.md` - System design and deployment

---

## 🎯 Key Concepts to Understand

### Authentication Flow
1. User signs up with email, password, name
2. Backend hashes password with bcryptjs
3. Backend generates JWT token (expires in 7 days)
4. Frontend stores token in Zustand state
5. Future requests include token in Authorization header
6. Backend verifies token before processing request

**See**: [docs/ARCHITECTURE.md#authentication-flow](./docs/ARCHITECTURE.md#authentication-flow)

### API Request/Response Pattern
```javascript
// Request
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "securePass123",
  "firstName": "John",
  "lastName": "Doe"
}

// Response
{
  "message": "User created successfully",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**See**: [docs/API.md](./docs/API.md) for all endpoints

### Database Schema
7 tables auto-created on server start:
- `users` - User accounts
- `groups` - Collection groups
- `group_members` - User roles
- `campaigns` - Collection campaigns
- `payments` - Payment records
- `expenses` - Expense tracking
- `audit_logs` - Change history

**See**: [database/SETUP.md](./database/SETUP.md)

### File Organization Pattern
```
controllers/     → Handle HTTP requests
models/          → Interact with database
routes/          → Define API endpoints
middleware/      → Auth, validation
```

**See**: [DEVELOPMENT.md#project-structure](./DEVELOPMENT.md#project-structure-best-practices)

---

## 🚀 Quick Start (Copy These Commands)

### Setup Backend
```bash
# 1. Set up PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# 2. Create database
psql -U postgres << 'EOF'
CREATE DATABASE chandacollection;
CREATE USER chandauser WITH PASSWORD 'chandapass123';
GRANT ALL PRIVILEGES ON DATABASE chandacollection TO chandauser;
EOF

# 3. Start backend
cd backend
npm install
npm run dev
```

### Test API
```bash
# In another terminal
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Full guide**: [QUICKSTART.md](./QUICKSTART.md)

---

## 📖 Reading by Topic

### 🔐 Security
- [docs/ARCHITECTURE.md#security-considerations](./docs/ARCHITECTURE.md#security-considerations)
- [DEVELOPMENT.md#security-checklist](./DEVELOPMENT.md#security-checklist)

### 🗄️ Database
- [database/SETUP.md](./database/SETUP.md) - PostgreSQL setup
- [docs/ARCHITECTURE.md#entity-relationship-diagram-erd](./docs/ARCHITECTURE.md#entity-relationship-diagram-erd)
- Database initialization code: [backend/src/db/init.js](./backend/src/db/init.js)

### 🌐 API
- [docs/API.md](./docs/API.md) - All endpoints with examples
- API client code: [frontend/src/services/api.js](./frontend/src/services/api.js)

### 📱 Frontend
- [frontend/src/navigation/RootNavigator.jsx](./frontend/src/navigation/RootNavigator.jsx) - Navigation setup
- [frontend/src/screens/](./frontend/src/screens/) - UI components
- [frontend/src/store/authStore.js](./frontend/src/store/authStore.js) - State management

### 🛠️ Development Workflow
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Workflow and best practices
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Next steps

### 🚀 Deployment
- [docs/ARCHITECTURE.md#deployment-architecture](./docs/ARCHITECTURE.md#deployment-architecture)
- [QUICKSTART.md#production-deployment](./QUICKSTART.md#production-deployment)

---

## 🎓 Learning Path

### Week 1: Setup & Understanding
1. **Day 1**: QUICKSTART.md → Set up backend
2. **Day 2**: GETTING_STARTED.md → Understand project structure
3. **Day 3**: docs/API.md → Learn API patterns
4. **Day 4**: docs/ARCHITECTURE.md → Understand system design
5. **Day 5**: DEVELOPMENT.md → Ready to code

### Week 2+: Building Features
1. Choose a feature from [GETTING_STARTED.md#phase-2](./GETTING_STARTED.md#-next-steps-phase-2)
2. Create model, controller, routes
3. Test with curl
4. Add frontend screen
5. See: [DEVELOPMENT.md#adding-a-new-feature](./DEVELOPMENT.md#adding-a-new-feature)

---

## 🔧 Common Tasks

### Add a New API Endpoint
1. See: [DEVELOPMENT.md#adding-a-new-api-endpoint](./DEVELOPMENT.md#adding-a-new-api-endpoint)
2. Example: Group management walkthrough included

### Add a New Screen
1. Create component in `frontend/src/screens/`
2. Add to navigator in `frontend/src/navigation/RootNavigator.jsx`
3. Use `useAuthStore` for state
4. Call API services

### Test an Endpoint
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Debug Issues
1. Check server logs (from `npm run dev`)
2. See: [DEVELOPMENT.md#debugging](./DEVELOPMENT.md#debugging)
3. Use curl to test API directly
4. Check database: `psql -U chandauser -d chandacollection`

---

## 📋 Checklist for Getting Started

- [ ] Read QUICKSTART.md
- [ ] Install PostgreSQL
- [ ] Create database and user
- [ ] Run `npm install` in backend
- [ ] Start backend with `npm run dev`
- [ ] Test signup endpoint with curl
- [ ] Understand project structure (GETTING_STARTED.md)
- [ ] Read DEVELOPMENT.md
- [ ] Pick a feature to build
- [ ] Code! 🚀

---

## 🆘 Need Help?

| Issue | Solution |
|-------|----------|
| "Cannot connect to database" | [QUICKSTART.md#troubleshooting](./QUICKSTART.md#troubleshooting) |
| "How do I add a feature?" | [DEVELOPMENT.md#adding-a-new-feature](./DEVELOPMENT.md#adding-a-new-feature) |
| "What APIs exist?" | [docs/API.md](./docs/API.md) |
| "How is this designed?" | [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) |
| "How do I debug?" | [DEVELOPMENT.md#debugging](./DEVELOPMENT.md#debugging) |
| "What's the roadmap?" | [PROJECT_SUMMARY.md#next-steps](./PROJECT_SUMMARY.md#-next-steps-priority-order) |

---

## 📚 External Resources

- **Express.js**: https://expressjs.com/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **React Native**: https://reactnative.dev/
- **Zustand**: https://github.com/pmndrs/zustand
- **JWT**: https://jwt.io/

---

## 🎉 Final Notes

✅ You have a **production-ready backend**
✅ You have a **React Native app structure**
✅ You have **40+ pages of documentation**
✅ You have a **clear roadmap for 6 weeks**

**Everything is documented. Everything is ready. Time to build!**

**Next:** Pick [QUICKSTART.md](./QUICKSTART.md) and get the backend running in 10 minutes!

---

**Last Updated**: November 26, 2026
**Version**: MVP 1.0
**Status**: ✅ Ready for Development
