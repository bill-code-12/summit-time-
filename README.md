# Summit Time - Video Conferencing Platform

> A modern, secure video conferencing platform built with React, TypeScript, Rust, and Firebase.

**Built by:** Pincode | **Developer:** Brighton Bernard

---

## 🎯 Overview

Summit Time is a full-stack video conferencing application combining:
- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Rust + Actix-web + PostgreSQL
- **Authentication:** Firebase Auth
- **Real-time:** WebSocket + WebRTC
- **Deployment:** Docker + Cloud Run + Vercel

---

## ✨ Features

### Core Features
✅ Create & join meetings  
✅ HD video/audio calls  
✅ Screen sharing  
✅ Real-time chat  
✅ Waiting room (host approval)  
✅ Participant mute/camera control  
✅ Meeting recordings  
✅ Mobile responsive  

### Technical Features
✅ End-to-end encryption  
✅ Automatic quality adjustment  
✅ Real-time signaling  
✅ Database persistence  
✅ Scalable architecture  
✅ Production-ready  

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Rust 1.70+
- PostgreSQL 14+
- Docker & Docker Compose
- Firebase Project

### Setup

#### 1. Firebase Setup
```bash
# Go to https://console.firebase.google.com
# Create project: "summit-time"
# Enable Authentication > Email/Password
# Get credentials from Project Settings
```

#### 2. Environment Configuration
```bash
# Frontend
cp frontend/.env.example frontend/.env.local
# Fill in Firebase credentials

# Backend
cp .env.example .env
# Fill in Firebase service account credentials
```

#### 3. Start Development
```bash
chmod +x scripts/dev.sh
./scripts/dev.sh
```

Or manually:
```bash
# Start all services
docker-compose up -d

# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

---

## 📁 Project Structure

```
summit-time/
├── frontend/                    # React + TypeScript
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API & WebRTC services
│   │   ├── store/              # Zustand state management
│   │   ├── types/              # TypeScript interfaces
│   │   ├── lib/                # Firebase & utilities
│   │   ├── providers/          # Context providers
│   │   └── App.tsx             # Main app
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # Rust + Actix-web
│   ├── src/
│   │   ├── main.rs            # Server setup
│   │   ├── handlers.rs        # API endpoints
│   │   ├── models.rs          # Data models
│   │   ├── db.rs              # Database layer
│   │   ├── middleware.rs      # Firebase auth
│   │   ├── websocket.rs       # WebSocket handler
│   │   └── services.rs        # Business logic
│   ├── Cargo.toml
│   └── Dockerfile
│
├── scripts/                     # Helper scripts
│   ├── dev.sh                  # Start development
│   └── build.sh                # Production build
│
├── docker-compose.yml          # Local dev environment
├── .env.example                # Environment template
└── README.md                   # This file
```

---

## 🔌 API Endpoints

### Meetings
- `POST /api/meetings` - Create meeting
- `GET /api/meetings` - List user meetings
- `GET /api/meetings/{id}` - Get meeting details
- `POST /api/meetings/{id}/join` - Join meeting
- `POST /api/meetings/{id}/leave` - Leave meeting
- `POST /api/meetings/{id}/end` - End meeting (host only)
- `GET /api/meetings/{id}/participants` - List participants

### Messages
- `GET /api/meetings/{id}/messages` - Get chat history
- `POST /api/meetings/{id}/messages` - Send message

### Real-time
- `WS /ws/{meeting_id}` - WebSocket for video signaling

---

## 🔐 Authentication

Summit Time uses **Firebase Authentication** with **JWT tokens** for API requests:

```typescript
// Frontend: Firebase Auth
const user = await authService.login(email, password);

// Get ID token
const idToken = await authService.getIdToken(user);

// Backend: Verify token
const verified = await verifyFirebaseToken(idToken);
```

---

## 🎥 WebRTC Architecture

```
Participant A          Signaling Server        Participant B
    │                       (WebSocket)             │
    ├──────── SDP Offer ────────────────────────────>│
    │                                                │
    │<───── SDP Answer + ICE Candidates ────────────┤
    │                                                │
    ├────── Direct P2P Connection (Media) ────────────>│
    │          (Video/Audio/Screen)                │
    │                                                │
```

---

## 🚢 Deployment

### Docker
```bash
./scripts/build.sh
docker-compose -f docker-compose.yml up -d
```

### Cloud Run (Backend)
```bash
gcloud run deploy summit-time-api \
  --source backend/ \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Vercel (Frontend)
```bash
vercel --prod
```

---

## 📝 Database Schema

### meetings
```sql
CREATE TABLE meetings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  meeting_id TEXT UNIQUE,
  host_id TEXT NOT NULL,
  status TEXT,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### participants
```sql
CREATE TABLE participants (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  meeting_id TEXT,
  is_host BOOLEAN,
  is_muted BOOLEAN,
  camera_on BOOLEAN,
  screen_sharing BOOLEAN,
  joined_at TIMESTAMP,
  left_at TIMESTAMP,
  FOREIGN KEY (meeting_id) REFERENCES meetings(id)
);
```

### messages
```sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  meeting_id TEXT,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP,
  FOREIGN KEY (meeting_id) REFERENCES meetings(id)
);
```

---

## 🛠️ Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
cargo build
cargo run
```

### Run Tests
```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && cargo test
```

---

## 📊 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|----------|
| Frontend | React 18 | UI Framework |
| Styling | Tailwind CSS | Styling |
| State | Zustand | State Management |
| Routing | React Router | Navigation |
| Backend | Actix-web | Web Framework |
| Database | PostgreSQL | Data Store |
| Auth | Firebase | Authentication |
| Real-time | WebSocket | Signaling |
| Media | WebRTC | Video/Audio |
| Deployment | Docker | Containerization |

---

## 🔍 Troubleshooting

### Frontend won't connect to backend
```bash
# Check backend is running
curl http://localhost:8000/health

# Verify CORS is configured
# Check frontend .env has correct API_URL
```

### Video not working
```bash
# Check browser permissions for camera/mic
# Verify WebSocket connection: ws://localhost:8000/ws/{meeting_id}
# Check browser console for WebRTC errors
```

### Database connection error
```bash
# Ensure PostgreSQL is running
docker exec summit_time_db psql -U summituser -d summit_time

# Check DATABASE_URL in .env
```

---

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Rust Book](https://doc.rust-lang.org/book/)
- [WebRTC Specification](https://w3c.github.io/webrtc-pc/)
- [Actix-web Docs](https://actix.rs/)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the **Apache License 2.0** - see [LICENSE](LICENSE) file for details.

---

## 👥 Credits

**Made with ❤️ by Pincode**

- **Developer:** Brighton Bernard
- **Brand:** Summit Time
- **Version:** 1.0.0
- **Year:** 2024

---

## 📞 Support

- 📧 Email: support@summittime.app
- 🐛 Issues: [GitHub Issues](https://github.com/bill-code-12/summit-time-/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/bill-code-12/summit-time-/discussions)

---

**Summit Time - Connect anywhere, anytime. 🌍**
