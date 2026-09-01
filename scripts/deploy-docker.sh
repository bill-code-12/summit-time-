#!/bin/bash

# Summit Time - Docker Production Deployment
# Deploy locally or on any VPS using Docker Compose

set -e

echo "🐳 Summit Time - Docker Production Deployment"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    echo "Install from: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    echo "Install from: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose found"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found"
    echo "Please create .env with the following:"
    echo ""
    echo "DATABASE_URL=postgresql://user:password@postgres:5432/summit_time"
    echo "FIREBASE_PROJECT_ID=your_project_id"
    echo "FIREBASE_PRIVATE_KEY=your_private_key"
    echo "FIREBASE_CLIENT_EMAIL=your_email@iam.gserviceaccount.com"
    echo "ALLOWED_ORIGINS=https://yourdomain.com"
    exit 1
fi

echo "📝 Building production images..."
echo ""

# Build images
docker-compose -f docker-compose.prod.yml build

echo ""
echo "🚀 Starting services..."
echo ""

# Start services
docker-compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for services to be healthy..."
sleep 10

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🔗 Access your application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend: http://localhost:8000"
echo "  Database: localhost:5432"
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  Stop services: docker-compose -f docker-compose.prod.yml down"
echo "  Database shell: docker-compose -f docker-compose.prod.yml exec postgres psql -U summituser -d summit_time"
