-- LMS PostgreSQL schema
-- Reconstructed from application models/controllers.
--
-- Usage:
--   psql -U your_user -d your_database -f db/schema.sql
--   psql -U your_user -d your_database -f db/seed.sql   -- optional sample data

BEGIN;

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Drop existing objects (dev rebuild only — comment out in production)
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS student_submissions CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS subject_materials CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS student_courses CASCADE;
DROP TABLE IF EXISTS department_courses CASCADE;
DROP TABLE IF EXISTS teacher_subjects CASCADE;
DROP TABLE IF EXISTS timetables CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS department CASCADE;

-- ---------------------------------------------------------------------------
-- Departments (table name matches code: "department")
-- ---------------------------------------------------------------------------
CREATE TABLE department (
    id              SERIAL PRIMARY KEY,
    program_name    VARCHAR(255) NOT NULL,
    program_code    VARCHAR(50)  NOT NULL UNIQUE,
    description     TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ
);

-- ---------------------------------------------------------------------------
-- Users
-- ---------------------------------------------------------------------------
CREATE TABLE admins (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(100) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    phone_number    VARCHAR(30),
    profile_image   VARCHAR(500),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ
);

CREATE TABLE teachers (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(100) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    department      VARCHAR(255),          -- program_name (see reports.model.js)
    email           VARCHAR(255),
    phone_number    VARCHAR(30),
    join_date       DATE,
    office_hours    VARCHAR(255),
    profile_picture VARCHAR(500),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ
);

CREATE TABLE courses (
    id                      SERIAL PRIMARY KEY,
    course_name             VARCHAR(255) NOT NULL,
    course_code             VARCHAR(50)  NOT NULL UNIQUE,
    description             TEXT,
    credits                 INTEGER,
    department_id           INTEGER REFERENCES department(id) ON DELETE SET NULL,
    total_semesters         INTEGER,
    duration_years          NUMERIC(4, 1),
    mode_of_study           VARCHAR(100),
    eligibility_criteria    TEXT,
    intake_capacity         INTEGER,
    affiliated_university   VARCHAR(255),
    is_active               BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ
);

CREATE TABLE subjects (
    id               SERIAL PRIMARY KEY,
    subject_name     VARCHAR(255) NOT NULL,
    course_id        INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    semester_number  INTEGER,
    description      TEXT,
    credits          INTEGER,
    teacher_id       INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ
);

CREATE TABLE students (
    id               SERIAL PRIMARY KEY,
    username         VARCHAR(100) NOT NULL UNIQUE,
    password         VARCHAR(255) NOT NULL,
    name             VARCHAR(255) NOT NULL,
    email            VARCHAR(255) NOT NULL,
    phone            VARCHAR(30),
    dob              DATE,
    gender           VARCHAR(20),
    department       VARCHAR(255),     -- stored as id string or name (app uses both patterns)
    course_id        INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    enrollment_year  INTEGER,
    year_of_study    INTEGER,
    address          TEXT,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ
);

-- ---------------------------------------------------------------------------
-- Junction & scheduling
-- ---------------------------------------------------------------------------
CREATE TABLE teacher_subjects (
    teacher_id  INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id  INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (teacher_id, subject_id)
);

-- Unquoted "Timetables" in code resolves to this table in PostgreSQL
CREATE TABLE timetables (
    id           SERIAL PRIMARY KEY,
    course_id    INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id   INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id   INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    day_of_week  VARCHAR(20) NOT NULL,
    start_time   TIME NOT NULL,
    end_time     TIME NOT NULL,
    room_number  VARCHAR(50),
    semester     INTEGER,                -- used by getAvailableTimeSlots (optional)
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ
);

CREATE TABLE department_courses (
    id          SERIAL PRIMARY KEY,
    program_id  INTEGER NOT NULL REFERENCES department(id) ON DELETE CASCADE,
    course_id   INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE (program_id, course_id)
);

CREATE TABLE student_courses (
    id          SERIAL PRIMARY KEY,
    student_id  INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id   INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    year        INTEGER,
    semester    INTEGER,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, course_id, year, semester)
);

-- ---------------------------------------------------------------------------
-- Content & communication
-- ---------------------------------------------------------------------------
CREATE TABLE announcements (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    message         TEXT NOT NULL,
    audience_type   VARCHAR(50) NOT NULL DEFAULT 'all',
    department_id   INTEGER REFERENCES department(id) ON DELETE SET NULL,
    course_id       INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    subject_id      INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
    file_path       VARCHAR(500),
    file_type       VARCHAR(100),
    file_name       VARCHAR(255),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ
);

CREATE TABLE subject_materials (
    id          SERIAL PRIMARY KEY,
    subject_id  INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id  INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    file_path   VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE assignments (
    id          SERIAL PRIMARY KEY,
    subject_id  INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id  INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    due_date    TIMESTAMPTZ NOT NULL,
    file_path   VARCHAR(500),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ
);

CREATE TABLE student_submissions (
    id                 SERIAL PRIMARY KEY,
    assignment_id      INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id         INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    submission_status  VARCHAR(50) NOT NULL DEFAULT 'pending',
    submitted_at       TIMESTAMPTZ,
    file_path          VARCHAR(500),
    UNIQUE (assignment_id, student_id)
);

CREATE TABLE notifications (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL,          -- student/teacher/admin id (no polymorphic FK in app)
    message     TEXT NOT NULL,
    type        VARCHAR(50),
    is_read     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE activity_log (
    id                   SERIAL PRIMARY KEY,
    activity_description TEXT NOT NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX idx_courses_department_id ON courses(department_id);
CREATE INDEX idx_subjects_course_id ON subjects(course_id);
CREATE INDEX idx_subjects_teacher_id ON subjects(teacher_id);
CREATE INDEX idx_students_course_id ON students(course_id);
CREATE INDEX idx_timetables_course_id ON timetables(course_id);
CREATE INDEX idx_timetables_teacher_id ON timetables(teacher_id);
CREATE INDEX idx_timetables_day ON timetables(day_of_week);
CREATE INDEX idx_assignments_subject_id ON assignments(subject_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_announcements_course_id ON announcements(course_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

COMMIT;
