# Summit Time - Deployment Guide

## 🚀 Deployment Options

There are multiple ways to deploy Summit Time. Choose the one that works best for you.

### Option 1: Docker Locally (Easiest)

```bash
chmod +x scripts/deploy-docker.sh
./scripts/deploy-docker.sh
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

**Best for:** Development, testing, small VPS

---

### Option 2: Google Cloud Run (Recommended for Production)

#### Setup:

1. **Install Google Cloud SDK**
   ```bash
   https://cloud.google.com/sdk/docs/install
   ```

2. **Create a GCP Project**
   ```bash
   gcloud projects create summit-time-prod
   gcloud config set project summit-time-prod
   ```

3. **Enable Required APIs**
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   gcloud services enable sql.googleapis.com
   ```

4. **Setup Cloud SQL (PostgreSQL)**
   ```bash
   # Create instance
   gcloud sql instances create summit-time-db \
     --database-version POSTGRES_15 \
     --tier db-f1-micro \
     --region us-central1

   # Create database
   gcloud sql databases create summit_time \
     --instance summit-time-db

   # Create user
   gcloud sql users create summituser \
     --instance summit-time-db \
     --password=YOUR_SECURE_PASSWORD
   ```

5. **Deploy Backend**
   ```bash
   gcloud run deploy summit-time-backend \
     --source backend/ \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars DATABASE_URL=postgresql://summituser:PASSWORD@CLOUD_SQL_IP:5432/summit_time,FIREBASE_PROJECT_ID=summit-time-com,FIREBASE_PRIVATE_KEY=YOUR_KEY,FIREBASE_CLIENT_EMAIL=YOUR_EMAIL
   ```

6. **Deploy Frontend**
   ```bash
   gcloud run deploy summit-time-frontend \
     --source frontend/ \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars VITE_API_URL=https://BACKEND_URL/api
   ```

**Access:**
- Frontend: https://summit-time-frontend-XXX.run.app
- Backend: https://summit-time-backend-XXX.run.app

**Cost:** ~$0-5/month for low usage

**Best for:** Production, auto-scaling, global CDN

---

### Option 3: Traditional VPS (AWS EC2, DigitalOcean, Linode)

#### Steps:

1. **SSH into your VPS**
   ```bash
   ssh root@YOUR_SERVER_IP
   ```

2. **Install Docker & Docker Compose**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

3. **Clone repository**
   ```bash
   git clone https://github.com/bill-code-12/summit-time-.git
   cd summit-time-
   ```

4. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

5. **Deploy**
   ```bash
   chmod +x scripts/deploy-docker.sh
   ./scripts/deploy-docker.sh
   ```

6. **Setup Nginx Reverse Proxy**
   ```bash
   chmod +x scripts/setup-nginx.sh
   ./scripts/setup-nginx.sh
   ```

7. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot certonly --standalone -d your-domain.com
   ```

**Access:**
- Frontend: https://your-domain.com
- Backend: https://your-domain.com/api

**Cost:** $5-20/month (depending on VPS)

**Best for:** Full control, custom setup

---

### Option 4: Docker Swarm (Multi-server)

```bash
# Initialize Swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml summit-time
```

**Best for:** Multiple servers, high availability

---

## 📋 Environment Variables

**Backend (.env)**
```env
DATABASE_URL=postgresql://user:pass@host:5432/summit_time
FIREBASE_PROJECT_ID=summit-time-com
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_email@iam.gserviceaccount.com
ALLOWED_ORIGINS=https://your-domain.com
RUST_LOG=info
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
```

**Frontend (.env.production)**
```env
VITE_API_URL=https://your-domain.com/api
VITE_WS_URL=wss://your-domain.com
VITE_FIREBASE_API_KEY=AIzaSyCU7taFwuScsDZQm4Q02P5PH0eymOVqrFM
VITE_FIREBASE_AUTH_DOMAIN=summit-time-com.firebaseapp.com
# ... other Firebase config
```

---

## 🔐 Security Checklist

- [ ] Update database password
- [ ] Set strong JWT secret
- [ ] Enable SSL/TLS
- [ ] Configure CORS properly
- [ ] Setup firewall rules
- [ ] Enable rate limiting
- [ ] Setup monitoring/logging
- [ ] Regular backups
- [ ] Update dependencies regularly

---

## 📊 Monitoring

### Docker Compose
```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check health
docker-compose -f docker-compose.prod.yml ps
```

### Cloud Run
```bash
# View logs
gcloud run logs read summit-time-backend --region us-central1

# Monitor
gcloud monitoring dashboards list
```

---

## 🆘 Troubleshooting

### Database connection error
```bash
# Check database is running
docker exec summit_time_db_prod psql -U summituser -d summit_time -c "SELECT 1;"
```

### Frontend can't reach backend
```bash
# Check CORS headers
curl -H "Origin: https://your-domain.com" http://localhost:8000/health
```

### SSL certificate issues
```bash
# Renew certificate
sudo certbot renew --dry-run
```

---

## 📈 Scaling

### Horizontal Scaling (Multiple Instances)

**Cloud Run:**
- Automatically scales based on demand
- Configure max instances in Cloud Run settings

**Docker Compose:**
```bash
# Scale backend
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

### Database Scaling

- Use Cloud SQL High Availability (HA)
- Setup read replicas
- Implement connection pooling

---

## 💰 Cost Estimation

### Cloud Run (Recommended)
- Backend: $0.20/1M requests
- Frontend: $0.50/1M requests
- SQL: $38/month (shared tier)
- **Total:** ~$50-100/month for moderate usage

### VPS (DigitalOcean)
- 1GB RAM: $5/month
- 2GB RAM: $12/month
- Database backup: $1/month
- **Total:** $6-13/month

### High Traffic
- CDN: $0.085/GB
- Load balancer: $0.025/hour
- Auto-scaling instances: Variable

---

## 🎯 Recommended Setup

For **production use**, we recommend:

1. **Cloud Run for Backend** - Auto-scaling, no management
2. **Cloud SQL for Database** - Managed, automatic backups
3. **Cloud Storage** - For file uploads
4. **Cloud CDN** - For static assets
5. **Cloud Monitoring** - For logs and alerts

**Total Cost:** ~$50-150/month for 1000+ daily active users

---

## 📚 Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/)
- [Let's Encrypt](https://letsencrypt.org/)

---

**Questions?** Check GitHub Issues or create a discussion.

**Happy deploying! 🚀**
