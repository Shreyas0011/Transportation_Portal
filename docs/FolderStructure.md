```
Transportation Portal/
├── .gitignore
├── README.md
├── package.json
│
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   └── FolderStructure.md
│
├── backend/
│   ├── .env                   # ← gitignored (secrets here)
│   ├── .env.example           # ← committed (placeholders only)
│   ├── package.json
│   ├── server.js              # Entry point only
│   │
│   ├── data/                  # Sample placeholder data (no real PII)
│   │   ├── admins.sample.json
│   │   ├── buses.sample.json
│   │   └── drivers.sample.json
│   │
│   ├── scripts/               # One-time seed scripts
│   │   ├── seedAdmins.js
│   │   ├── seedBuses.js
│   │   ├── seedDatabase.js
│   │   └── seedDrivers.js
│   │
│   └── src/
│       ├── app.js             # Express app setup
│       │
│       ├── config/
│       │   ├── database.js    # connectDatabase() only
│       │   └── jwt.js         # generateToken / verifyToken
│       │
│       ├── constants/
│       │   ├── roles.js
│       │   ├── statuses.js
│       │   └── index.js
│       │
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── attendance.controller.js
│       │   ├── driver.controller.js
│       │   ├── fastag.controller.js
│       │   ├── notification.controller.js
│       │   ├── route.controller.js
│       │   ├── safety.controller.js
│       │   ├── student.controller.js
│       │   ├── user.controller.js
│       │   └── vehicle.controller.js
│       │
│       ├── middleware/
│       │   ├── auth.js
│       │   ├── authorize.js
│       │   ├── errorHandler.js
│       │   ├── rateLimiter.js
│       │   └── requestLogger.js
│       │
│       ├── models/
│       │   ├── Attendance.model.js
│       │   ├── Driver.model.js
│       │   ├── FastagLog.model.js
│       │   ├── Notification.model.js
│       │   ├── Route.model.js
│       │   ├── SafetyAlert.model.js
│       │   ├── Student.model.js
│       │   ├── User.model.js
│       │   └── Vehicle.model.js
│       │
│       ├── repositories/
│       │   ├── attendance.repository.js
│       │   ├── driver.repository.js
│       │   ├── fastag.repository.js
│       │   ├── notification.repository.js
│       │   ├── route.repository.js
│       │   ├── safety.repository.js
│       │   ├── student.repository.js
│       │   ├── user.repository.js
│       │   └── vehicle.repository.js
│       │
│       ├── routes/
│       │   ├── index.js
│       │   ├── auth.routes.js
│       │   ├── attendance.routes.js
│       │   ├── driver.routes.js
│       │   ├── fastag.routes.js
│       │   ├── notification.routes.js
│       │   ├── route.routes.js
│       │   ├── safety.routes.js
│       │   ├── student.routes.js
│       │   ├── user.routes.js
│       │   └── vehicle.routes.js
│       │
│       ├── services/
│       │   ├── attendance.service.js
│       │   ├── auth.service.js
│       │   ├── driver.service.js
│       │   ├── fastag.service.js
│       │   ├── notification.service.js
│       │   ├── route.service.js
│       │   ├── safety.service.js
│       │   ├── student.service.js
│       │   ├── user.service.js
│       │   └── vehicle.service.js
│       │
│       ├── utils/
│       │   ├── logger.js
│       │   └── response.js
│       │
│       └── validators/
│           ├── attendance.validator.js
│           ├── auth.validator.js
│           ├── driver.validator.js
│           ├── route.validator.js
│           ├── student.validator.js
│           ├── user.validator.js
│           └── vehicle.validator.js
│
└── frontend/
    ├── .env                   # ← gitignored
    ├── .env.example           # ← committed
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── App.tsx
        ├── api/
        │   ├── axios.ts       # Mock adapter (localStorage)
        │   └── transportApi.ts
        ├── components/
        ├── pages/
        │   ├── auth/
        │   ├── driver/
        │   ├── parent/
        │   ├── super-admin/
        │   ├── superadmin/
        │   └── transport-head/
        ├── store/
        └── utils/
            └── db.ts          # localStorage DB (anonymized seed data)
```
