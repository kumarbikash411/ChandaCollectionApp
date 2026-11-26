# ChandaCollection - Money Collection & Expense Tracking for Groups

One app to collect money, track spending, and show everyone where it went.

## Project Structure

```
ChandaCollectionApp/
├── backend/           # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & validation
│   │   ├── db/             # Database setup
│   │   └── index.js        # Main server
│   └── package.json
├── frontend/          # React Native mobile app
│   ├── src/
│   │   ├── screens/        # UI screens
│   │   ├── navigation/     # Navigation stack
│   │   ├── services/       # API client
│   │   ├── store/          # State management (Zustand)
│   │   └── components/     # Reusable components
│   ├── App.jsx
│   └── package.json
├── database/          # SQL schemas & migrations
└── docs/              # Documentation
```

## Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update DATABASE_URL in .env to your PostgreSQL connection
# Example: postgresql://postgres:password@localhost:5432/chandacollection

# Start server
npm run dev
```

The backend will:
- Initialize the PostgreSQL database with all required tables
- Start on `http://localhost:5000`
- Provide API endpoints at `/api/*`

### 2. Frontend Setup (React Native)

```bash
cd frontend
npm install

# Start Metro bundler
npm start

# In another terminal, run on iOS or Android
npm run ios
# or
npm run android
```

## API Endpoints

### Authentication
- **POST** `/api/auth/signup` - Create a new user account
- **POST** `/api/auth/login` - Login and get JWT token
- **GET** `/api/auth/profile` - Get current user profile (requires auth)

### Request/Response Format

**Signup Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Signup Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "created_at": "2026-11-26T20:00:00Z"
  },
  "token": "jwt_token_here"
}
```

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Login Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt_token_here"
}
```

## Database Schema

### Users Table
- `id` (UUID, PK)
- `email` (VARCHAR, unique)
- `password_hash` (VARCHAR)
- `first_name`, `last_name` (VARCHAR)
- `phone` (VARCHAR)
- `language` (VARCHAR, default 'en')
- `created_at`, `updated_at` (TIMESTAMP)

### Groups Table
- `id` (UUID, PK)
- `name` (VARCHAR)
- `description` (TEXT)
- `type` (VARCHAR) - e.g., 'School', 'Office', 'Apartment', 'Puja'
- `admin_id` (UUID, FK → users)
- `created_at`, `updated_at` (TIMESTAMP)

### Group Members Table
- `id` (UUID, PK)
- `group_id` (UUID, FK)
- `user_id` (UUID, FK)
- `role` (VARCHAR) - 'admin', 'treasurer', 'auditor', 'member'
- `joined_at` (TIMESTAMP)

### Campaigns Table
- `id` (UUID, PK)
- `group_id` (UUID, FK)
- `name` (VARCHAR)
- `description` (TEXT)
- `amount_per_person` (DECIMAL)
- `target_amount` (DECIMAL)
- `total_collected` (DECIMAL)
- `due_date` (DATE)
- `status` (VARCHAR) - 'active', 'closed'
- `created_at`, `updated_at` (TIMESTAMP)

### Payments Table
- `id` (UUID, PK)
- `campaign_id` (UUID, FK)
- `user_id` (UUID, FK)
- `amount` (DECIMAL)
- `payment_method` (VARCHAR) - 'upi', 'cash', 'bank_transfer'
- `status` (VARCHAR) - 'pending', 'completed', 'failed'
- `payment_date` (TIMESTAMP)
- `receipt_url` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

### Expenses Table
- `id` (UUID, PK)
- `campaign_id` (UUID, FK)
- `created_by` (UUID, FK → users)
- `description` (TEXT)
- `amount` (DECIMAL)
- `category` (VARCHAR)
- `vendor` (VARCHAR)
- `bill_photo_url` (TEXT)
- `status` (VARCHAR) - 'pending', 'approved'
- `created_at`, `updated_at` (TIMESTAMP)

### Audit Logs Table
- `id` (UUID, PK)
- `entity_type` (VARCHAR) - e.g., 'payment', 'expense'
- `entity_id` (UUID)
- `action` (VARCHAR) - 'create', 'update', 'delete'
- `changed_by` (UUID, FK)
- `old_value`, `new_value` (JSONB)
- `timestamp` (TIMESTAMP)

## MVP Features (Phase 1 - In Progress)

- ✅ User authentication (signup, login)
- ✅ Basic UI structure
- ⏳ Group creation and management
- ⏳ Campaign creation
- ⏳ Payment recording (cash + UPI placeholder)
- ⏳ Per-person ledger
- ⏳ Expense tracking with bill photos
- ⏳ Dashboard with balance and transparency
- ⏳ PDF receipt generation
- ⏳ Basic report export

## Future Enhancements

- Multi-language support (Hindi, regional languages)
- WhatsApp integration for payments & receipts
- SMS/Push notifications for payment reminders
- Online payment gateway integration
- Bill recognition using OCR/AI
- Approval workflow for expenses
- Monthly recurring collections
- Multiple treasurers support
- Government audit mode
- Advanced analytics and spending insights

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Auth**: JWT (jsonwebtoken)
- **Password**: bcryptjs
- **Validation**: express-validator

### Frontend
- **Framework**: React Native
- **Navigation**: React Navigation
- **State Management**: Zustand
- **HTTP Client**: Axios
- **UI Components**: React Native built-ins

## Development Guide

### Adding a New API Endpoint

1. Create a controller in `backend/src/controllers/`
2. Add validation and business logic
3. Create a route in `backend/src/routes/`
4. Mount the route in `backend/src/index.js`

### Adding a New Screen

1. Create a component in `frontend/src/screens/`
2. Add the screen to the navigation stack in `RootNavigator.jsx`
3. Use `useAuthStore` for state management
4. Call API services from `frontend/src/services/`

## Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Deployment

### Backend (Node.js on Railway/Heroku)
```bash
# Set environment variables
# DATABASE_URL, JWT_SECRET, etc.

npm run start
```

### Frontend (React Native)
- Build APK for Android: `npm run android -- --release`
- Build IPA for iOS: `npm run ios -- --release`
- Or upload to app stores using Expo/EAS Build

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

## Contributing

1. Create a feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -m "Description"`
3. Push: `git push origin feature/name`
4. Create a pull request

## License

MIT
