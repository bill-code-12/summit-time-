#!/bin/bash

# Summit Time - Production Build Script

echo "🔨 Building Summit Time for production..."
echo ""

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Frontend built"
echo ""

# Build Docker images
echo "🐳 Building Docker images..."
docker-compose build

echo ""
echo "✅ Production build complete"
echo ""
echo "To deploy: docker-compose -f docker-compose.yml up -d"
