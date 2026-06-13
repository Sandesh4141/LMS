# LMS Backend

A **Learning Management System (LMS)** REST API inspired by Moodle-style workflows. The server manages academic structure (departments, courses, subjects), users (admins, teachers, students), timetables, announcements, assignments, and reporting—built with **Node.js**, **Express**, and **PostgreSQL** using an **MVC** layout.

## Features

| Area | Capabilities |
|------|----------------|
| **Authentication** | Role-based login (`admin`, `teacher`, `student`) with JWT |
| **Admin** | Departments, courses, subjects, students, teachers, timetables, announcements (with file attachments), dashboard overview, reports, profile & password settings |
| **Teacher** | Dashboard, profile & avatar, assigned course/subjects, subject material uploads, assignments, enrolled students |
| **Student** | Authenticated dashboard endpoint (student-facing API is minimal today) |

## Tech stack

- **Runtime:** Node.js (ES modules)
- **Framework:** Express 4
- **Database:** PostgreSQL (`pg`)
- **Auth:** JSON Web Tokens (`jsonwebtoken`)
- **Uploads:** Multer (profile pictures, announcements, assignment materials, subject content)
- **Docs (optional):** `swagger-jsdoc` is configured in `swagger.js` but not wired in `index.js` by default

## Project structure

```
LMS/
├── index.js                 # Application entry point
├── db/db.js                 # PostgreSQL connection pool
├── routes/
│   ├── login.routes.js      # Public login
│   ├── admin/               # Admin-only routes (JWT + role)
│   ├── teacher/             # Teacher-only routes
│   └── student/             # Student-only routes
├── controllers/             # Request handlers
├── models/                  # Database queries
├── middlewares/             # JWT auth, file upload configs
└── uploads/                 # Uploaded files (gitignored)
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/) with a database and tables for your LMS schema

## Database setup

SQL files live in `db/`:

| File | Purpose |
|------|---------|
| `db/schema.sql` | Creates all tables, indexes, and foreign keys |
| `db/seed.sql` | Optional sample admin, teacher, student, courses, and timetable data |

```bash
# Create database first, then:
psql -U your_user -d your_database -f db/schema.sql
psql -U your_user -d your_database -f db/seed.sql   # optional
```

**Sample logins** (after running `seed.sql`):

| Role | Username | Password |
|------|----------|----------|
| admin | `admin` | `admin123` |
| teacher | `jdoe` | `teacher123` |
| student | `alice` | `Alice@123` |

> `schema.sql` drops existing LMS tables before recreating them. Do not run it against a production database with data you need to keep.

## Getting started

### 1. Clone and install

```bash
git clone <repository-url>
cd LMS
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASS=your_db_password
DB_PORT=5432

JWT_SECRET=your_secure_jwt_secret
```

| Variable | Description |
|----------|-------------|
| `DB_USER` | PostgreSQL username |
| `DB_HOST` | Database host |
| `DB_NAME` | Database name |
| `DB_PASS` | Database password |
| `DB_PORT` | Database port (default `5432`) |
| `JWT_SECRET` | Secret used to sign and verify JWTs |

### 3. Run the server

```bash
npm start
```

The API listens on **port 5000** (hardcoded in `index.js`):

```
http://localhost:5000
```

Development uses **nodemon** for automatic restarts on file changes.

## Authentication

### Login

**`POST /login`**

Request body:

```json
{
  "username": "your_username",
  "password": "your_password",
  "role": "admin"
}
```

`role` must be one of: `admin`, `teacher`, `student`.

Response (success):

```json
{
  "token": "<jwt>"
}
```

Tokens expire after **1 hour**. Include the token on protected routes:

```
Authorization: Bearer <token>
```

Admin, teacher, and student route groups apply JWT verification and role checks via `authenticateJWT` and `authorizeRoles`.

## API overview

Base URL: `http://localhost:5000`

### Public

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/login` | Authenticate and receive JWT |

### Admin (`/admin/*`)

Requires `Authorization: Bearer <token>` and role `admin`.

| Prefix | Description |
|--------|-------------|
| `/admin/overview` | Dashboard stats and recent activity |
| `/admin/departments` | CRUD departments; list courses/subjects per department |
| `/admin/courses` | CRUD courses; list subjects, students, instructors |
| `/admin/subjects` | CRUD subjects; filter by course and semester |
| `/admin/students` | CRUD students; fetch generated credentials |
| `/admin/teachers` | CRUD teachers |
| `/admin/timetable` | Create/read/update/delete timetable entries |
| `/admin/announcements` | CRUD announcements (optional `attachment` upload) |
| `/admin/reports` | Reports for students, teachers, subjects, courses, announcements |
| `/admin/admin-settings` | Admin profile, profile image, change password |

### Teacher (`/teacher/*`)

Requires role `teacher`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/teacher/dashboard` | Teacher dashboard data |
| `GET` | `/teacher/profile` | Profile details |
| `PUT` | `/teacher/profile/update` | Update profile |
| `POST` | `/teacher/profile/upload` | Upload profile picture |
| `PUT` | `/teacher/profile/change-password` | Change password |
| `GET` | `/teacher/course` | Assigned course |
| `GET` | `/teacher/subjects` | Assigned subjects |
| `POST` | `/teacher/subjects/:subjectId/upload` | Upload subject material |
| `GET` | `/teacher/course/:courseId/enrolled-students` | Students in course |
| `GET` | `/teacher/course/:id/subjects` | Subjects for a course |
| `GET` | `/teacher/subjects/:id` | Subject details |
| `POST` | `/teacher/subjects/:subjectId/assignments` | Create assignment (file upload) |
| `GET` | `/teacher/subjects/:subjectId/assignments` | List assignments |

### Student (`/student/*`)

Requires role `student`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/student/dashboard` | Student dashboard data |

For exact request/response shapes, refer to the corresponding files under `routes/` and `controllers/`.

## File uploads

Uploaded files are stored under `uploads/` (ignored by git):

| Path | Usage |
|------|--------|
| `uploads/profile_pictures/` | Admin and teacher profile images |
| `uploads/adminAnnouncements/` | Announcement attachments |
| Assignment/subject uploads | Configured in dedicated multer middlewares |

Profile images are limited to JPEG/PNG/JPG (see `middlewares/uploadProfilePic.middleware.js`).

## Student account defaults

When an admin creates a student via the API, the backend can auto-generate credentials (see `models/student.model.js`):

- **Username:** local part of the student email (before `@`)
- **Default password:** `{FirstName}@123` (first token of `name`)

Admins can retrieve credentials via `GET /admin/students/:id/credentials`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start server with nodemon |
| `npm test` | Placeholder (no tests configured) |

## Security notes

- Passwords are stored and compared in plain text in the current login flow—**not suitable for production** without hashing (e.g. bcrypt).
- Set a strong `JWT_SECRET` in production; avoid relying on the middleware fallback default.
- Restrict CORS and use HTTPS in production deployments.

## Planned improvements

The `improvements` file in the repo tracks Moodle-inspired enhancements (notifications, richer student/teacher features, activity modules, etc.). Treat it as a product backlog, not API documentation.

## License

This project is released under the [Unlicense](LICENSE) (public domain).

## Author

sandesh
