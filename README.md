# Summit Time 🎥

**A modern video conferencing platform - Built by Pincode**

---

## About Summit Time

Summit Time is a secure, user-friendly video conferencing platform designed for seamless remote communication. Whether it's team meetings, client calls, or group discussions, Summit Time makes connecting simple and reliable.

**Developer:** Brighton Bernard  
**Company:** Pincode  
**Version:** 1.0.0

---

## Features ✨

### Core Features
- ✅ **Create Meetings** - Start a new meeting and get instant room link/Meeting ID
- ✅ **Join Meetings** - Enter via link or Meeting ID
- ✅ **Video Calls** - See all participants in video tiles
- ✅ **Audio Calls** - Crystal clear audio communication
- ✅ **Mute/Unmute** - Control your microphone anytime
- ✅ **Camera Control** - Turn camera on/off
- ✅ **Screen Sharing** - Share your screen for presentations & demos
- ✅ **Chat** - Text messaging during meetings
- ✅ **Waiting Room** - Host approval before entry
- ✅ **Leave Meeting** - Participants can leave, hosts can end for all

### Design System
- **Color Scheme:** Light Blue, White, Grey
- **Style:** Clean, Modern, Minimal
- **Responsive:** Desktop & Mobile optimized

---

## Tech Stack

### Frontend
- **Framework:** React/TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components
- **WebRTC:** For video/audio streaming
- **State Management:** Zustand

### Backend
- **Runtime:** Rust (Actix-web)
- **Real-time:** WebSocket
- **Database:** PostgreSQL
- **Authentication:** JWT

### Deployment
- Frontend: Vercel/Netlify
- Backend: Docker + Cloud Run

---

## Project Structure

```
summit-time-/
├── frontend/                 # React TypeScript frontend
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API & WebRTC services
│   │   ├── store/           # State management
│   │   ├── styles/          # Global CSS/Tailwind config
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                  # Rust backend
│   ├── src/
│   │   ├── main.rs          # Server entry point
│   │   ├── handlers/        # API handlers
│   │   ├── models/          # Data models
│   │   ├── services/        # Business logic
│   │   ├── ws/              # WebSocket handlers
│   │   └── db/              # Database queries
│   ├── Cargo.toml
│   └── Dockerfile
│
├── docker-compose.yml       # Local dev environment
├── .env.example             # Environment variables template
├── README.md                # This file
└── LICENSE                  # Apache License 2.0
```

---

## Getting Started

### Prerequisites
- Node.js 18+ & npm
- Rust 1.70+
- PostgreSQL 14+
- Docker & Docker Compose (optional)

### Quick Start with Docker

```bash
# Clone and setup
git clone https://github.com/bill-code-12/summit-time-.git
cd summit-time-
cp .env.example .env

# Start everything
docker-compose up -d

# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

### Manual Setup

#### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

#### Backend
```bash
cd backend
cargo build
cargo run
# Runs on http://localhost:8000
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Meetings
- `POST /api/meetings` - Create new meeting
- `GET /api/meetings` - List user meetings
- `GET /api/meetings/:id` - Get meeting details
- `POST /api/meetings/:id/join` - Join meeting
- `POST /api/meetings/:id/leave` - Leave meeting
- `POST /api/meetings/:id/end` - End meeting (host)
- `GET /api/meetings/:id/participants` - List participants

### Messages
- `GET /api/meetings/:id/messages` - Get chat history
- `POST /api/meetings/:id/messages` - Send message

### Participants
- `POST /api/participants/:id/mute` - Mute participant
- `POST /api/participants/:id/unmute` - Unmute participant
- `POST /api/participants/:id/camera` - Toggle camera
- `POST /api/participants/:id/screen-share` - Toggle screen share

---

## Environment Variables

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_APP_NAME=Summit Time
```

### Backend (.env)
```env
DATABASE_URL=postgresql://summituser:summitpass@localhost:5432/summit_time
JWT_SECRET=dev_secret_key_change_in_production
JWT_EXPIRY=7d
RUST_LOG=info
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## Development

### Frontend Development
```bash
cd frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run type-check # Check TypeScript
```

### Backend Development
```bash
cd backend
cargo watch -x run  # Auto-reload on changes
cargo test          # Run tests
cargo build --release  # Production build
```

---

## Features Implemented

- [x] Project structure & configuration
- [x] Frontend setup (React + Vite)
- [x] Backend setup (Rust + Actix-web)
- [x] Database schema & migrations
- [x] Authentication (JWT)
- [x] Meeting creation & management
- [x] WebRTC peer connections
- [x] WebSocket real-time communication
- [ ] UI components (In progress)
- [ ] Video/Audio streaming (Next)
- [ ] Screen sharing (Next)
- [ ] Chat system (Next)

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure your code follows our coding standards and includes tests.

---

## License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

---

## Support & Contact

- 📧 Email: support@summittime.app
- 🐛 Issues: [GitHub Issues](https://github.com/bill-code-12/summit-time-/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/bill-code-12/summit-time-/discussions)

---

## Credits

**Made with ❤️ by Pincode**

- **Developer:** Brighton Bernard
- **Brand:** Summit Time
- **Company:** Pincode
- **License:** Apache License 2.0

---

_Summit Time - Connect anywhere, anytime. 🌍_
