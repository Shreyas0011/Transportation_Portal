# Deployment Guide

## Prerequisites
- Node.js >= 18
- MongoDB Atlas account
- Git

---

## Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your real MongoDB URI and JWT secret
npm install
npm run dev
```

## Frontend Setup

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL if connecting to real backend
npm install
npm run dev
```

## Environment Variables

### backend/.env
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/transportation_portal
JWT_SECRET=<your_secret>
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### frontend/.env
```
VITE_API_URL=http://localhost:5000
```

## Seeding the Database

The backend auto-seeds on first startup when the database is empty.

## Production Build

```bash
cd frontend
npm run build
```

## Demo Credentials (Development Only)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@transcend.org | super123 |
| Transport Head | head@transcend.org | head123 |
| Driver | driver001@transcend.org | driver123 |
| Parent | parent001@transcend.org | Parent@123 |

> ⚠️ Change all passwords before deploying to production.
