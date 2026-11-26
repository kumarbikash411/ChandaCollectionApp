# ChandaCollection - Architecture Overview

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      React Native App                        │
│          (iOS & Android via React Native CLI)               │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Navigation Layer (React Navigation)                   │ │
│  │  - Stack Navigator (Auth flow)                         │ │
│  │  - Bottom Tab Navigator (Main app)                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Screens                                               │ │
│  │  - LoginScreen                                         │ │
│  │  - SignupScreen                                        │ │
│  │  - HomeScreen                                          │ │
│  │  - GroupScreen (upcoming)                              │ │
│  │  - CampaignScreen (upcoming)                           │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  State Management (Zustand)                            │ │
│  │  - authStore (user, token, auth state)                │ │
│  │  - groupStore (upcoming)                               │ │
│  │  - campaignStore (upcoming)                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  API Client (Axios)                                    │ │
│  │  - authService                                         │ │
│  │  - groupService (upcoming)                             │ │
│  │  - campaignService (upcoming)                          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    HTTP/REST (JSON)
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Express.js Backend                         │
│              (Node.js on Railway/Heroku)                    │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  API Routes                                            │ │
│  │  - POST /api/auth/signup                              │ │
│  │  - POST /api/auth/login                               │ │
│  │  - GET  /api/auth/profile                             │ │
│  │  - POST /api/groups (upcoming)                         │ │
│  │  - GET  /api/groups (upcoming)                         │ │
│  │  - POST /api/campaigns (upcoming)                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Middleware                                            │ │
│  │  - authMiddleware (JWT verification)                  │ │
│  │  - errorHandler                                        │ │
│  │  - cors                                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Controllers                                           │ │
│  │  - authController                                      │ │
│  │  - groupController (upcoming)                          │ │
│  │  - campaignController (upcoming)                       │ │
│  │  - paymentController (upcoming)                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Business Logic Models                                 │ │
│  │  - User                                                │ │
│  │  - Group (upcoming)                                    │ │
│  │  - Campaign (upcoming)                                 │ │
│  │  - Payment (upcoming)                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Database Connection Pool (pg)                         │ │
│  │  - Connection pooling & reuse                          │ │
│  │  - Error handling                                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    PostgreSQL Protocol
                              ↓
        ┌──────────────────────────────────────┐
        │      PostgreSQL Database             │
        │      (Railway / Local Dev)           │
        │                                      │
        │  Tables:                             │
        │  - users                             │
        │  - groups                            │
        │  - group_members                     │
        │  - campaigns                         │
        │  - payments                          │
        │  - expenses                          │
        │  - audit_logs                        │
        └──────────────────────────────────────┘
```

## Component Details

### Frontend (React Native)

#### Screens
- **LoginScreen**: Email + password login
- **SignupScreen**: User registration with name, email, password
- **HomeScreen**: Main dashboard showing quick actions
- **GroupScreen** (upcoming): Create and manage groups
- **CampaignScreen** (upcoming): View and manage collection campaigns
- **LedgerScreen** (upcoming): Per-person payment tracking
- **ExpenseScreen** (upcoming): Add and view expenses
- **DashboardScreen** (upcoming): Transparency view with totals and balance

#### State Management (Zustand)
```
authStore
├── user (current user data)
├── token (JWT)
├── isLoading
├── error
└── actions: setUser, setToken, logout, etc.

groupStore (upcoming)
├── groups (list of user's groups)
├── currentGroup (selected group)
└── actions: createGroup, addMember, etc.

campaignStore (upcoming)
├── campaigns (filtered by group)
├── currentCampaign
└── actions: createCampaign, recordPayment, etc.
```

#### Navigation Flow
```
Login/Signup (Stack) → Home (Tab)
├── My Groups (Stack)
├── Collections (Stack)
├── Expenses (Stack)
└── Profile (Stack)
```

### Backend (Node.js + Express)

#### Request/Response Cycle
1. **Request** comes to Express server
2. **Routing** directs to appropriate controller
3. **Authentication** middleware verifies JWT
4. **Validation** ensures data integrity
5. **Business Logic** in controller processes request
6. **Database Query** via model (pg pool)
7. **Response** sent back to client

#### File Organization
```
backend/src/
├── controllers/      # Request handlers
│   ├── authController.js
│   ├── groupController.js (upcoming)
│   └── campaignController.js (upcoming)
├── models/           # Database interactions
│   ├── User.js
│   ├── Group.js (upcoming)
│   └── Campaign.js (upcoming)
├── routes/           # API route definitions
│   ├── authRoutes.js
│   ├── groupRoutes.js (upcoming)
│   └── campaignRoutes.js (upcoming)
├── middleware/       # Auth, validation, error handling
│   └── auth.js
├── db/               # Database connection & initialization
│   ├── pool.js
│   └── init.js
└── index.js          # Main server file
```

### Database (PostgreSQL)

#### Entity Relationship Diagram (ERD)

```
                        users
                   ┌────────────┐
                   │            │
                   │ id (PK)    │
                   │ email      │
                   │ password   │
                   │ name       │
                   └────────────┘
                   ↑      ↑
                   │      │
        ┌──────────┘      └──────────┐
        │                             │
   (admin_id)                   (user_id)
        │                             │
        ↓                             ↓
    ┌────────────┐           ┌──────────────────┐
    │  groups    │           │  group_members   │
    │            │           │                  │
    │ id (PK)    │◄──────────│ group_id (FK)    │
    │ name       │  (1:M)    │ user_id (FK)     │
    │ type       │           │ role             │
    │ admin_id   │           └──────────────────┘
    └────────────┘
         │
         │ (1:M)
         │
         ↓
    ┌────────────────┐
    │  campaigns     │
    │                │
    │ id (PK)        │
    │ group_id (FK)  │
    │ name           │
    │ amount         │
    │ due_date       │
    └────────────────┘
      ↑          ↑
      │          │
  (1:M)      (1:M)
      │          │
      └──────┬───┘
             │
      ┌──────┴──────┐
      ↓             ↓
  ┌────────┐   ┌──────────┐
  │payments│   │expenses  │
  │        │   │          │
  │id (PK) │   │id (PK)   │
  │user_id │   │created_by│
  │amount  │   │amount    │
  │status  │   │category  │
  └────────┘   └──────────┘
```

#### Key Design Decisions

1. **UUID for Primary Keys**: Better for distributed systems and privacy
2. **Audit Logs**: Track all changes for transparency and compliance
3. **Soft Deletes** (future): Archive data instead of deleting
4. **Indexing**: On foreign keys and frequently queried columns for performance
5. **JSONB for Audit Values**: Flexible storage of changes over time

## Authentication Flow

### Sign Up
1. User enters email, password, name
2. Frontend validates (client-side)
3. Frontend sends to `POST /auth/signup`
4. Backend validates (server-side)
5. Backend hashes password with bcrypt
6. Backend inserts user into database
7. Backend generates JWT token (expires in 7 days)
8. Frontend stores token in Zustand store (can optionally use AsyncStorage for persistence)
9. User redirected to home screen

### Login
1. User enters email, password
2. Frontend validates
3. Frontend sends to `POST /auth/login`
4. Backend finds user by email
5. Backend compares password with bcrypt
6. Backend generates JWT token
7. Frontend stores token and redirects

### Authenticated Requests
1. Frontend includes token in `Authorization: Bearer <token>` header
2. Backend middleware verifies JWT signature and expiration
3. If valid, request proceeds; if invalid, returns 401

## Security Considerations

### Implemented
- ✅ Password hashing (bcryptjs)
- ✅ JWT tokens with expiration
- ✅ Input validation (express-validator)
- ✅ CORS protection
- ✅ Database connection pooling

### To Implement
- 🔲 Rate limiting
- 🔲 HTTPS/TLS in production
- 🔲 Database encryption at rest
- 🔲 Audit logging for all data changes
- 🔲 Two-factor authentication
- 🔲 Field-level permissions (role-based access)
- 🔲 SQL injection prevention (parameterized queries already used)

## Scalability Considerations

### Current (MVP)
- Single Express server
- Local or cloud PostgreSQL
- No caching layer
- No background jobs

### Future Improvements
- Redis for session/token caching
- Message queue for notifications (RabbitMQ/Kafka)
- Microservices for payments, expense processing
- Read replicas for PostgreSQL
- CDN for static assets
- API Gateway for rate limiting and routing

## Deployment Architecture

### Development
```
Localhost:5000 (Backend) ← → Localhost:5432 (PostgreSQL)
```

### Production (Railway Example)
```
Frontend (App Store/Play Store)
         ↓
    API Gateway
         ↓
Railway App (Express.js)
         ↓
Railway PostgreSQL
         ↓
S3 (Bill photos, receipts)
         ↓
SendGrid/Twilio (Email/SMS)
```

## Performance Optimization

1. **Database Indexing**: Added on foreign keys and status columns
2. **Connection Pooling**: pg uses pool of 10 connections by default
3. **Response Caching**: Will add for frequently accessed data (groups, campaigns)
4. **API Pagination**: Implement for large data lists (groups, payments)
5. **Image Optimization**: Compress bill photos before uploading to S3

## Testing Strategy

### Unit Tests
- Model validations
- Authentication logic
- Calculations (totals, balances)

### Integration Tests
- Full user sign-up flow
- Payment recording end-to-end
- Group creation and member addition

### End-to-End Tests
- Mobile app navigation
- Complete campaign workflow

## Future Architecture Changes

1. **Monorepo**: Consider using pnpm workspaces or Turborepo
2. **TypeScript**: Migrate backend to TypeScript for type safety
3. **GraphQL**: Consider as alternative to REST for complex queries
4. **Mobile State Sync**: Implement offline-first with WatermelonDB or Realm
5. **Internationalization**: Setup i18n for multi-language support
