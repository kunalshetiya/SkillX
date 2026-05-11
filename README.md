# SkillX 🚀

> A Full-Stack AI-Ready Skill Barter & Mentorship Platform built with modern scalable architecture.

![SkillX Banner](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js)
![NestJS](https://img.shields.io/badge/Backend-NestJS-red?style=for-the-badge&logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma)
![Clerk](https://img.shields.io/badge/Auth-Clerk-purple?style=for-the-badge)
![Render](https://img.shields.io/badge/Backend-Render-green?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)

---

# 🌍 Live Demo

## 🔗 Production Links

- **Frontend:** https://skill-x-web.vercel.app/
- **Backend API:** https://skillx-mod4.onrender.com/api/v1
- **Swagger API Docs:** https://skillx-mod4.onrender.com/api/docs

---

# 📌 Problem Statement

Traditional learning platforms are expensive, one-directional, and inaccessible to many learners.

SkillX solves this by creating a **Skill Barter Ecosystem** where users can:

- Teach skills they already know
- Learn skills from others
- Exchange mentorship through a credit-based barter system
- Build reputation through verified sessions and reviews

The platform promotes:

- Peer-to-peer learning
- Accessible mentorship
- Skill-based networking
- Community-driven education

---

# ✨ Key Features

## 🔐 Authentication & Security

- Clerk Authentication Integration
- Protected Routes
- JWT-based API Security
- Session-aware Authentication
- Production-ready Auth Flow

---

## 👤 User System

- Dynamic User Profiles
- Skill Portfolio Management
- Live Reputation Metrics
- Credits & Skill Economy
- Verified Mentorship Sessions

---

## 🛒 Skill Marketplace

- Browse Skills & Mentors
- Skill Search & Filtering
- Expertise Level Tags
- Teaching/Learning Categories
- Reputation-Based Discovery

---

## 🤝 Skill Barter System

- Send Barter Requests
- Accept / Reject Requests
- Session Lifecycle Management
- Credit-Based Exchange Logic
- Mentor-Learner Matching

---

## ⭐ Review & Reputation System

- Verified Session Reviews
- Dynamic Rating System
- Mentor Credibility Metrics
- Completed Session Tracking
- Community Trust Layer

---

## 📊 Dashboard System

- Personalized Dashboard
- Session Tracking
- Requests Overview
- Credits Overview
- Real-Time User State

---

# 🏗️ System Architecture

```txt
Frontend (Next.js + Tailwind + Clerk)
            ↓
Backend API (NestJS)
            ↓
Prisma ORM
            ↓
PostgreSQL (Neon DB)
```

---

# 🧠 Tech Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Clerk Authentication
- Axios
- React Hooks

## Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- REST API
- Swagger Documentation

## Database

- Neon PostgreSQL

## Deployment

- Frontend → Vercel
- Backend → Render
- Database → Neon

---

# 📂 Monorepo Structure

```bash
SkillX/
│
├── apps/
│   ├── web/          # Next.js Frontend
│   └── api/          # NestJS Backend
│
├── packages/
│   └── database/     # Prisma & Shared DB Package
│
├── turbo.json
├── package.json
└── README.md
```

---

# 🧩 Core Modules

| Module | Description |
|---|---|
| Authentication | Clerk-based secure auth |
| Users | Profile & skill management |
| Marketplace | Skill discovery engine |
| Barter Requests | Mentorship request workflow |
| Sessions | Session lifecycle handling |
| Reviews | Reputation & trust system |
| Credits | Internal barter economy |

---

# 🚀 API Documentation

Interactive Swagger Documentation:

```bash
https://skillx-mod4.onrender.com/api/docs
```

Includes:

- Authentication flows
- Users APIs
- Marketplace APIs
- Barter Request APIs
- Session APIs
- Review APIs

---

# ⚡ Local Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/kunalshetiya/SkillX.git
cd SkillX
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Environment Variables

Create `.env` file:

```env
DATABASE_URL=
DIRECT_URL=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_API_URL=
FRONTEND_URL=
NODE_ENV=development
```

---

## 4️⃣ Generate Prisma Client

```bash
npm run db:generate --workspace=@skillx/database
```

---

## 5️⃣ Push Database Schema

```bash
npm run db:push --workspace=@skillx/database
```

---

## 6️⃣ Run Frontend

```bash
npm run dev --workspace=@skillx/web
```

---

## 7️⃣ Run Backend

```bash
npm run start:dev --workspace=@skillx/api
```

---

# 🌐 Deployment

## Frontend Deployment

- Platform: Vercel
- Auto-deploy via GitHub

## Backend Deployment

- Platform: Render
- Production NestJS API

## Database

- Neon PostgreSQL
- Prisma ORM Integration

---

# 🔥 Highlights

✅ Full-Stack Production Deployment

✅ Monorepo Architecture using Turborepo

✅ Production-grade Authentication

✅ REST API with Swagger Documentation

✅ Prisma + PostgreSQL Integration

✅ Real-time Reputation System

✅ Credit-Based Barter Economy

✅ Responsive Modern UI

✅ Modular Scalable Backend Architecture

---

# 📸 Screenshots

> Add screenshots of:

- Dashboard
- Marketplace
- Profile System
- Sessions Page
- Reviews System
- Swagger Docs

---

# 🛠️ Future Enhancements

- AI Skill Recommendations
- Real-time Chat & WebSockets
- Video Mentorship Sessions
- Calendar Integration
- Gamification & Achievements
- Organization & Corporate Modules
- Mobile App
- AI Mentor Matching
- Blockchain Credential Verification

---

# 👨‍💻 Author

## Kunal Shetiya

- B.Tech Computer Science Student @ MIT-WPU
- Full Stack Developer
- AI & System Design Enthusiast

### Connect

- GitHub: https://github.com/kunalshetiya
- LinkedIn: Add your LinkedIn URL

---

# 📜 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you found this project useful:

- Star the repository ⭐
- Fork the project 🍴
- Share feedback 🚀

---

# 💡 SkillX Vision

> "Empowering people to exchange knowledge without barriers."

SkillX aims to redefine mentorship and collaborative learning by making skills a tradable asset in a community-driven ecosystem.

