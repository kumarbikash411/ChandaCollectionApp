#!/bin/bash
# Startup verification script for ChandaCollection

echo "🚀 Starting ChandaCollection Backend..."
echo ""

# Check if PostgreSQL is running
echo "📋 Checking PostgreSQL..."
if ! psql -U postgres -c "SELECT 1" > /dev/null 2>&1; then
  echo "❌ PostgreSQL is not running!"
  echo "   Start PostgreSQL with: brew services start postgresql"
  exit 1
fi
echo "✅ PostgreSQL is running"

# Check if database exists
echo ""
echo "📋 Checking database..."
if ! psql -U postgres -c "SELECT 1" -d chandacollection > /dev/null 2>&1; then
  echo "⚠️  Database 'chandacollection' not found. Creating..."
  psql -U postgres << 'SQL'
CREATE DATABASE chandacollection;
CREATE USER chandauser WITH PASSWORD 'chandapass123';
GRANT ALL PRIVILEGES ON DATABASE chandacollection TO chandauser;
SQL
  echo "✅ Database created"
else
  echo "✅ Database exists"
fi

# Check Node.js
echo ""
echo "📋 Checking Node.js..."
NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION"

# Check dependencies
echo ""
echo "📋 Checking dependencies..."
if [ -d "backend/node_modules" ]; then
  echo "✅ Dependencies installed"
else
  echo "📦 Installing dependencies..."
  cd backend
  npm install
  cd ..
  echo "✅ Dependencies installed"
fi

# Start backend
echo ""
echo "🔧 Starting backend server..."
echo "   Server will run on http://localhost:5000"
echo "   API base: http://localhost:5000/api"
echo ""
echo "Press Ctrl+C to stop"
echo "================================"
echo ""

cd backend
npm run dev
