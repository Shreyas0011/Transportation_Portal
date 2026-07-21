# Transportation Portal — Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT BROWSER                    │
│   React + Vite (frontend/)                         │
│   - Mock localStorage adapter (axios.ts)           │
│   - All API calls intercepted via custom adapter   │
└──────────────┬──────────────────────────────────────┘
               │ HTTP (for real backend mode)
┌──────────────▼──────────────────────────────────────┐
│              BACKEND (backend/)                     │
│                                                     │
│  server.js  →  src/app.js  →  src/routes/          │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Routes   │→ │Controllers│→ │    Services      │  │
│  └──────────┘  └──────────┘  └────────┬─────────┘  │
│                                       │             │
│                               ┌───────▼──────────┐  │
│                               │  Repositories    │  │
│                               └───────┬──────────┘  │
└───────────────────────────────────────┼─────────────┘
                                        │
┌───────────────────────────────────────▼─────────────┐
│              MongoDB Atlas (Cloud)                   │
│   Collections: users, drivers, vehicles, routes,    │
│   students, attendance, notifications, fastag,      │
│   safetyalerts                                       │
└─────────────────────────────────────────────────────┘
```

## Backend Layers

| Layer | Responsibility |
|-------|---------------|
| **Routes** | URL mapping, middleware chaining |
| **Controllers** | Request parsing, response formatting |
| **Services** | Business logic, rules enforcement |
| **Repositories** | Raw MongoDB queries only |
| **Models** | Mongoose schemas |
| **Middleware** | Auth, rate-limiting, error handling, logging |
| **Validators** | Input validation for every request |
| **Config** | DB connection, JWT, env vars |
| **Utils** | Response helpers, safe logger |
| **Scripts** | DB seeding, migrations |

## Frontend Architecture

The frontend operates in **mock-first mode** using a custom axios adapter:
- All API calls are intercepted by `frontend/src/api/axios.ts`
- Data is persisted in browser `localStorage` via `frontend/src/utils/db.ts`
- No real network requests are made by default
- A `VITE_API_URL` env var is available to switch to the real backend
