# API Reference

Base URL: `http://localhost:5000/api`

All responses follow the standard format:

**Success:** `{ "success": true, "message": "...", "data": {} }`  
**Error:** `{ "success": false, "message": "...", "error": "..." }`

---

## Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login with email and password |
| POST | `/auth/logout` | Logout current session |

**POST /auth/login**
```json
{ "email": "user@example.com", "password": "password" }
```

---

## Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users (passwords excluded) |
| POST | `/users` | Create new user |
| PUT | `/users/:email/status` | Toggle user active/inactive |
| PUT | `/users/:email/password` | Update user password |
| DELETE | `/users/:email` | Delete user |

---

## Drivers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/drivers` | Get all drivers |
| POST | `/drivers` | Add new driver |
| PUT | `/drivers` | Update driver |
| DELETE | `/drivers/:employeeId` | Delete driver |

---

## Vehicles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vehicles` | Get all vehicles |
| POST | `/vehicles` | Add new vehicle |
| PUT | `/vehicles` | Update vehicle |
| DELETE | `/vehicles/:vehicleNumber` | Delete vehicle |

---

## Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/routes` | Get all routes |
| POST | `/routes` | Create new route |
| PUT | `/routes` | Update route |
| DELETE | `/routes/:routeName` | Delete route |

---

## Students

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students` | Get all students |
| POST | `/students` | Add new student |
| PUT | `/students` | Update student |
| POST | `/students/allocate` | Allocate bus/route to student |
| POST | `/students/deallocate` | Remove bus/route from student |

---

## Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/attendance` | Get all attendance records |
| POST | `/attendance` | Save/upsert attendance record(s) |

---

## Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | Get all notifications |
| POST | `/notifications` | Create notification |

---

## FASTag Logs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/fastag/logs` | Get all FASTag logs |
| POST | `/fastag/logs` | Log gate entry/exit |

---

## Safety Alerts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/safety/alerts` | Get all safety alerts |
| POST | `/safety/alerts` | Create safety alert |

---

## Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |
