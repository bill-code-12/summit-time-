#!/bin/bash

# Summit Time - Development Start Script

echo "🚀 Starting Summit Time Development Environment..."
echo ""

# Check if .env files exist
if [ ! -f "frontend/.env.local" ]; then
    echo "❌ Error: frontend/.env.local not found"
    echo "Please create frontend/.env.local with Firebase credentials"
    exit 1
fi

if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env not found in root directory"
    echo "Copy .env.example to .env and fill in your values"
    exit 1
fi

echo "✅ Environment files found"
echo ""

# Start Docker Compose
echo "🐳 Starting Docker containers..."
docker-compose up -d

echo ""
echo "✅ Services starting..."
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend: http://localhost:8000"
echo "📍 Database: localhost:5432"
echo ""
echo "🔗 Test health: curl http://localhost:8000/health"
echo ""
echo "Type 'docker-compose logs -f' to see logs"
