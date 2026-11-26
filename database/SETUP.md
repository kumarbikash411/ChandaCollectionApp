# Database Setup Guide

## Prerequisites

You need PostgreSQL 12 or higher installed on your system.

### macOS (using Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

### Ubuntu/Debian
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### Windows
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

## Initial Setup

### 1. Create Database and User

Connect to PostgreSQL as the default user:

```bash
psql -U postgres
```

Then run:

```sql
-- Create the database
CREATE DATABASE chandacollection;

-- Create a user
CREATE USER chandauser WITH PASSWORD 'chandapass123';

-- Grant privileges
ALTER ROLE chandauser SET client_encoding TO 'utf8';
ALTER ROLE chandauser SET default_transaction_isolation TO 'read committed';
ALTER ROLE chandauser SET default_transaction_deferrable TO on;
ALTER ROLE chandauser SET default_transaction_level TO 'read committed';
GRANT ALL PRIVILEGES ON DATABASE chandacollection TO chandauser;

-- Exit psql
\q
```

### 2. Update Backend .env

Create `.env` in the `backend/` directory:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```
DATABASE_URL=postgresql://chandauser:chandapass123@localhost:5432/chandacollection
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### 3. Run Database Migrations

The backend will automatically initialize the database schema when you start the server:

```bash
cd backend
npm run dev
```

Watch for the log message:
```
Database initialized successfully!
✅ ChandaCollection Backend running on http://localhost:5000
```

## Verifying the Setup

Connect to your database to verify tables were created:

```bash
psql -U chandauser -d chandacollection
```

List tables:
```sql
\dt
```

You should see:
- users
- groups
- group_members
- campaigns
- payments
- expenses
- audit_logs

## Using PostgreSQL from Node.js

The backend uses the `pg` library to connect to PostgreSQL. Connection pooling is configured to handle concurrent requests efficiently.

## Backing Up Your Database

```bash
# Backup database
pg_dump -U chandauser -d chandacollection > backup.sql

# Restore from backup
psql -U chandauser -d chandacollection < backup.sql
```

## Development Tips

### Connect to the database in development
```bash
psql -U chandauser -d chandacollection
```

### View current database size
```sql
SELECT pg_size_pretty(pg_database_size('chandacollection'));
```

### Drop and recreate database (WARNING: Deletes all data)
```bash
dropdb -U chandauser chandacollection
createdb -U chandauser chandacollection
```

Then restart the backend server to reinitialize the schema.

## Production Deployment

For production on Railway or similar services:

1. Set `DATABASE_URL` environment variable with your cloud PostgreSQL credentials
2. Set `JWT_SECRET` to a strong, randomly generated string
3. Set `NODE_ENV=production`
4. Ensure SSL connections are enabled for PostgreSQL

Example Railway connection string:
```
postgresql://username:password@host:5432/database?sslmode=require
```
