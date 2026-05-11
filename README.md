SkillX 🚀
A Full-Stack AI-Ready Skill Barter & Mentorship Platform built with modern scalable architecture.
SkillX Banner Next.js NestJS PostgreSQL Prisma Clerk Render Vercel
________________________________________
🌍 Live Demo
🔗 Production Links
•	Frontend: https://skill-x-web.vercel.app/
•	Backend API: https://skillx-mod4.onrender.com/api/v1
•	Swagger API Docs: https://skillx-mod4.onrender.com/api/docs
________________________________________
📌 Problem Statement
Traditional learning platforms are expensive, one-directional, and inaccessible to many learners.
SkillX solves this by creating a Skill Barter Ecosystem where users can:
•	Teach skills they already know
•	Learn skills from others
•	Exchange mentorship through a credit-based barter system
•	Build reputation through verified sessions and reviews
The platform promotes:
•	Peer-to-peer learning
•	Accessible mentorship
•	Skill-based networking
•	Community-driven education
________________________________________
✨ Key Features
🔐 Authentication & Security
•	Clerk Authentication Integration
•	Protected Routes
•	JWT-based API Security
•	Session-aware Authentication
•	Production-ready Auth Flow
________________________________________
👤 User System
•	Dynamic User Profiles
•	Skill Portfolio Management
•	Live Reputation Metrics
•	Credits & Skill Economy
•	Verified Mentorship Sessions
________________________________________
🛒 Skill Marketplace
•	Browse Skills & Mentors
•	Skill Search & Filtering
•	Expertise Level Tags
•	Teaching/Learning Categories
•	Reputation-Based Discovery
________________________________________
🤝 Skill Barter System
•	Send Barter Requests
•	Accept / Reject Requests
•	Session Lifecycle Management
•	Credit-Based Exchange Logic
•	Mentor-Learner Matching
________________________________________
⭐ Review & Reputation System
•	Verified Session Reviews
•	Dynamic Rating System
•	Mentor Credibility Metrics
•	Completed Session Tracking
•	Community Trust Layer
________________________________________
📊 Dashboard System
•	Personalized Dashboard
•	Session Tracking
•	Requests Overview
•	Credits Overview
•	Real-Time User State
________________________________________
🏗️ System Architecture
Frontend (Next.js + Tailwind + Clerk)
            ↓
Backend API (NestJS)
            ↓
Prisma ORM
            ↓
PostgreSQL (Neon DB)
________________________________________
🧠 Tech Stack
Frontend
•	Next.js
•	TypeScript
•	Tailwind CSS
•	Clerk Authentication
•	Axios
•	React Hooks
Backend
•	NestJS
•	TypeScript
•	Prisma ORM
•	PostgreSQL
•	REST API
•	Swagger Documentation
Database
•	Neon PostgreSQL
Deployment
•	Frontend → Vercel
•	Backend → Render
•	Database → Neon
________________________________________
📂 Monorepo Structure
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
________________________________________
🧩 Core Modules
Module	Description
Authentication	Clerk-based secure auth
Users	Profile & skill management
Marketplace	Skill discovery engine
Barter Requests	Mentorship request workflow
Sessions	Session lifecycle handling
Reviews	Reputation & trust system
Credits	Internal barter economy
________________________________________
🚀 API Documentation
Interactive Swagger Documentation:
https://skillx-mod4.onrender.com/api/docs
Includes:
•	Authentication flows
•	Users APIs
•	Marketplace APIs
•	Barter Request APIs
•	Session APIs
•	Review APIs
________________________________________
⚡ Local Setup
1️⃣ Clone Repository
git clone https://github.com/kunalshetiya/SkillX.git
cd SkillX
________________________________________
2️⃣ Install Dependencies
npm install
________________________________________
3️⃣ Configure Environment Variables
Create .env file:
DATABASE_URL=
DIRECT_URL=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_API_URL=
FRONTEND_URL=
NODE_ENV=development
________________________________________
4️⃣ Generate Prisma Client
npm run db:generate --workspace=@skillx/database
________________________________________
5️⃣ Push Database Schema
npm run db:push --workspace=@skillx/database
________________________________________
6️⃣ Run Frontend
npm run dev --workspace=@skillx/web
________________________________________
7️⃣ Run Backend
npm run start:dev --workspace=@skillx/api
________________________________________
🌐 Deployment
Frontend Deployment
•	Platform: Vercel
•	Auto-deploy via GitHub
Backend Deployment
•	Platform: Render
•	Production NestJS API
Database
•	Neon PostgreSQL
•	Prisma ORM Integration
________________________________________
🔥 Highlights
✅ Full-Stack Production Deployment
✅ Monorepo Architecture using Turborepo
✅ Production-grade Authentication
✅ REST API with Swagger Documentation
✅ Prisma + PostgreSQL Integration
✅ Real-time Reputation System
✅ Credit-Based Barter Economy
✅ Responsive Modern UI
✅ Modular Scalable Backend Architecture
________________________________________
📸 Screenshots
Add screenshots of:
•	Dashboard
•	Marketplace
•	Profile System
•	Sessions Page
•	Reviews System
•	Swagger Docs
________________________________________
🛠️ Future Enhancements
•	AI Skill Recommendations
•	Real-time Chat & WebSockets
•	Video Mentorship Sessions
•	Calendar Integration
•	Gamification & Achievements
•	Organization & Corporate Modules
•	Mobile App
•	AI Mentor Matching
•	Blockchain Credential Verification
________________________________________
👨‍💻 Author
Kunal Shetiya
•	B.Tech Computer Science Student @ MIT-WPU
•	Full Stack Developer
•	AI & System Design Enthusiast
Connect
•	GitHub: https://github.com/kunalshetiya
•	LinkedIn: Add your LinkedIn URL
________________________________________
📜 License
This project is licensed under the MIT License.
________________________________________
⭐ Support
If you found this project useful:
•	Star the repository ⭐
•	Fork the project 🍴
•	Share feedback 🚀
________________________________________
💡 SkillX Vision
“Empowering people to exchange knowledge without barriers.”
SkillX aims to redefine mentorship and collaborative learning by making skills a tradable asset in a community-driven ecosystem.
