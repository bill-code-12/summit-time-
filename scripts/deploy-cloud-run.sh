#!/bin/bash

# Summit Time - Cloud Run Deployment Script
# Deploy to Google Cloud Run without Vercel

set -e

echo "🚀 Summit Time - Cloud Run Deployment"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project info
read -p "Enter Google Cloud Project ID: " PROJECT_ID
read -p "Enter Cloud Run region (us-central1): " REGION
REGION=${REGION:-us-central1}

echo ""
echo "📝 Configuration Summary:"
echo "  Project ID: $PROJECT_ID"
echo "  Region: $REGION"
echo ""

# Set project
gcloud config set project $PROJECT_ID

echo "🔨 Building backend Docker image..."
# Build and push backend to Container Registry
gcloud builds submit backend/ --tag gcr.io/$PROJECT_ID/summit-time-backend

echo "📦 Building frontend Docker image..."
# Build and push frontend to Container Registry
gcloud builds submit frontend/ --tag gcr.io/$PROJECT_ID/summit-time-frontend --dockerfile frontend/Dockerfile

echo ""
echo "🚀 Deploying backend to Cloud Run..."
# Deploy backend
gcloud run deploy summit-time-backend \
  --image gcr.io/$PROJECT_ID/summit-time-backend \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:5432/$DB_NAME,FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID,FIREBASE_PRIVATE_KEY=$FIREBASE_PRIVATE_KEY,FIREBASE_CLIENT_EMAIL=$FIREBASE_CLIENT_EMAIL,ALLOWED_ORIGINS=https://$FRONTEND_DOMAIN" \
  --memory 512Mi \
  --cpu 1 \
  --timeout 3600

echo ""
echo "🌐 Deploying frontend to Cloud Run..."
# Deploy frontend
gcloud run deploy summit-time-frontend \
  --image gcr.io/$PROJECT_ID/summit-time-frontend \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="VITE_API_URL=https://summit-time-backend-REGION-PROJECT_ID.run.app/api" \
  --memory 256Mi \
  --cpu 1

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔗 Frontend URL: https://summit-time-frontend-REGION-PROJECT_ID.run.app"
echo "🔗 Backend URL: https://summit-time-backend-REGION-PROJECT_ID.run.app"
echo ""
echo "📚 Next steps:"
echo "  1. Update frontend VITE_API_URL with backend Cloud Run URL"
echo "  2. Set up Cloud SQL for database"
echo "  3. Configure Firebase credentials in Cloud Run environment variables"
echo "  4. Set up custom domain (optional)"
