# SkillX Deployment Guide

This guide provides step-by-step instructions for deploying the SkillX platform.

## Architecture
- **Frontend:** Next.js (Vercel)
- **Backend:** NestJS (Render)
- **Database:** PostgreSQL (Neon)
- **Auth:** Clerk

---

## 1. Database Setup (Neon)
1. Create a project at [neon.tech](https://neon.tech).
2. Set `DATABASE_URL` and `DIRECT_URL` (for migrations) in your Render environment.

---

## 2. Backend Deployment (Render)
1. Create a new **Web Service**.
2. **Build Command:** `npm install && npm run build:api`
3. **Start Command:** `npm run start --workspace=@skillx/api`
4. **Environment Variables:**
   - `DATABASE_URL`: (Neon pooled connection)
   - `DIRECT_URL`: (Neon direct connection)
   - `CLERK_SECRET_KEY`: (From Clerk dashboard)
   - `FRONTEND_URL`: `https://your-frontend.vercel.app`
   - `NODE_ENV`: `production`

---

## 3. Frontend Deployment (Vercel)
1. Import the repository into Vercel.
2. Vercel will detect the Turborepo.
3. **Root Directory:** `apps/web` (or root with Vercel's monorepo settings)
4. **Build Command:** `npx turbo build --filter=@skillx/web`
5. **Install Command:** `npm install`
6. **Environment Variables:**
   - `NEXT_PUBLIC_API_URL`: `https://skillx-mod4.onrender.com/api/v1`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: (From Clerk)
   - `CLERK_SECRET_KEY`: (From Clerk)
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: `/sign-in`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: `/sign-up`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`: `/profile`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`: `/profile`

---

## Production Checks
- **CORS:** Ensure `FRONTEND_URL` in Render matches your Vercel domain.
- **Prisma:** Run `npx prisma migrate deploy` locally against the Neon DB before deploying.
- **Clerk:** Ensure you have added your production domain to the Clerk dashboard Allowed Origins if applicable.
