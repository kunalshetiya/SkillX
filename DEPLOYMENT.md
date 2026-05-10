# SkillX Deployment Guide

This guide provides step-by-step instructions for deploying the SkillX platform using free-tier services.

## Architecture
- **Frontend:** Next.js (Vercel)
- **Backend:** NestJS (Render)
- **Database:** PostgreSQL (Neon)
- **Auth:** Clerk

---

## 1. Database Setup (Neon)
1. Create a free account at [neon.tech](https://neon.tech).
2. Create a new project named `skillx`.
3. Copy the **Connection String**.
   - It should look like: `postgresql://user:password@ep-shard-name.aws.neon.tech/neondb?sslmode=require`
4. Set this as `DATABASE_URL` in your environment.
5. For Prisma migrations, Neon provides a **Direct Connection** string (usually port 5432). Set this as `DIRECT_URL`.

---

## 2. Authentication Setup (Clerk)
1. Create a free account at [clerk.com](https://clerk.com).
2. Create a new application named `SkillX`.
3. In **API Keys**, copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. In **Paths**, ensure:
   - Sign-in: `/sign-in`
   - Sign-up: `/sign-up`
   - After sign-in: `/profile`
   - After sign-up: `/profile`

---

## 3. Backend Deployment (Render)
1. Create a free account at [render.com](https://render.com).
2. Create a new **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build -- --filter=@skillx/api`
   - **Start Command:** `npm run start:prod --workspace=@skillx/api`
5. Add **Environment Variables**:
   - `PORT`: `4000` (or leave default)
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: (from Neon)
   - `DIRECT_URL`: (from Neon)
   - `CLERK_SECRET_KEY`: (from Clerk)
   - `FRONTEND_URL`: (your Vercel URL, e.g., `https://skillx.vercel.app`)

---

## 4. Frontend Deployment (Vercel)
1. Create a free account at [vercel.com](https://vercel.com).
2. Create a new project and import your repository.
3. Vercel will automatically detect the Turborepo.
4. Configure the **Build Settings**:
   - **Root Directory:** `apps/web` (or root if using Vercel's monorepo support)
   - **Framework Preset:** `Next.js`
5. Add **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://your-render-url.onrender.com/api/v1`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: (from Clerk)
   - `CLERK_SECRET_KEY`: (from Clerk)
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: `/sign-in`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: `/sign-up`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`: `/profile`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`: `/profile`

---

## 5. Prisma Production Steps
Before your first deployment, run:
```bash
npx prisma migrate deploy
```
This ensures the schema is synced to Neon.

## Troubleshooting
- **CORS Errors:** Ensure `FRONTEND_URL` on Render matches your Vercel URL exactly (including `https://`).
- **Auth Redirects:** Ensure Clerk paths match the App Router structure.
- **Database Timeouts:** Neon's free tier scales to zero. The first request after inactivity might take 5-10 seconds.
