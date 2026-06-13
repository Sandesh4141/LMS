-- Optional sample data for local development
-- Run after schema.sql:
--   psql -U your_user -d your_database -f db/seed.sql

BEGIN;

-- Department
INSERT INTO department (program_name, program_code, description)
SELECT 'Computer Science', 'CS', 'Department of Computer Science'
WHERE NOT EXISTS (SELECT 1 FROM department WHERE program_code = 'CS');

INSERT INTO department (program_name, program_code, description)
SELECT 'Information Technology', 'IT', 'Department of Information Technology'
WHERE NOT EXISTS (SELECT 1 FROM department WHERE program_code = 'IT');

-- Admin — POST /login  { "username": "admin", "password": "admin123", "role": "admin" }
INSERT INTO admins (username, password, name, phone_number)
SELECT 'admin', 'admin123', 'System Administrator', '9800000000'
WHERE NOT EXISTS (SELECT 1 FROM admins WHERE username = 'admin');

-- Teachers — role: teacher
INSERT INTO teachers (username, password, name, department, email, phone_number, join_date)
SELECT 'jdoe', 'teacher123', 'Jane Doe', 'Computer Science', 'jane.doe@lms.edu', '9811111111', '2022-01-15'::DATE
WHERE NOT EXISTS (SELECT 1 FROM teachers WHERE username = 'jdoe');

INSERT INTO teachers (username, password, name, department, email, phone_number, join_date)
SELECT 'rsmith', 'teacher123', 'Robert Smith', 'Information Technology', 'robert.smith@lms.edu', '9822222222', '2021-08-01'::DATE
WHERE NOT EXISTS (SELECT 1 FROM teachers WHERE username = 'rsmith');

-- Courses
INSERT INTO courses (
    course_name, course_code, description, credits, department_id,
    total_semesters, duration_years, mode_of_study,
    eligibility_criteria, intake_capacity, affiliated_university, is_active
)
SELECT
    'Bachelor of Computer Science', 'BCS', 'Undergraduate CS program', 120, d.id,
    8, 4.0, 'Full-time', 'High school graduate', 60, 'State University', TRUE
FROM department d
WHERE d.program_code = 'CS'
  AND NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'BCS');

INSERT INTO courses (
    course_name, course_code, description, credits, department_id,
    total_semesters, duration_years, mode_of_study,
    eligibility_criteria, intake_capacity, affiliated_university, is_active
)
SELECT
    'Diploma in IT', 'DIT', 'IT diploma program', 90, d.id,
    6, 3.0, 'Full-time', 'High school graduate', 40, 'State University', TRUE
FROM department d
WHERE d.program_code = 'IT'
  AND NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'DIT');

-- Subjects
INSERT INTO subjects (subject_name, course_id, semester_number, description, credits, teacher_id)
SELECT 'Data Structures', c.id, 1, 'Intro to data structures', 4, t.id
FROM courses c
CROSS JOIN teachers t
WHERE c.course_code = 'BCS' AND t.username = 'jdoe'
  AND NOT EXISTS (
    SELECT 1 FROM subjects s
    WHERE s.subject_name = 'Data Structures' AND s.course_id = c.id
  );

INSERT INTO subjects (subject_name, course_id, semester_number, description, credits, teacher_id)
SELECT 'Database Systems', c.id, 2, 'Relational databases and SQL', 4, t.id
FROM courses c
CROSS JOIN teachers t
WHERE c.course_code = 'BCS' AND t.username = 'jdoe'
  AND NOT EXISTS (
    SELECT 1 FROM subjects s
    WHERE s.subject_name = 'Database Systems' AND s.course_id = c.id
  );

-- Teacher–subject links (teacher API)
INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT t.id, s.id
FROM teachers t
JOIN subjects s ON s.teacher_id = t.id
WHERE t.username = 'jdoe'
ON CONFLICT (teacher_id, subject_id) DO NOTHING;

-- Student — POST /login  { "username": "alice", "password": "Alice@123", "role": "student" }
INSERT INTO students (
    username, password, name, email, phone, dob, gender,
    department, course_id, enrollment_year, year_of_study, address
)
SELECT
    'alice', 'Alice@123', 'Alice Johnson', 'alice.johnson@student.lms.edu',
    '9833333333', '2004-05-10'::DATE, 'female',
    d.id::TEXT, c.id, 2024, 1, '123 Campus Road'
FROM department d
JOIN courses c ON c.course_code = 'BCS' AND c.department_id = d.id
WHERE d.program_code = 'CS'
  AND NOT EXISTS (SELECT 1 FROM students WHERE username = 'alice');

-- Timetable
INSERT INTO timetables (course_id, teacher_id, subject_id, day_of_week, start_time, end_time, room_number)
SELECT c.id, t.id, s.id, 'Monday', '09:00'::TIME, '10:30'::TIME, 'A-101'
FROM courses c
JOIN subjects s ON s.course_id = c.id AND s.subject_name = 'Data Structures'
JOIN teachers t ON t.username = 'jdoe'
WHERE c.course_code = 'BCS'
  AND NOT EXISTS (
    SELECT 1 FROM timetables tt
    WHERE tt.course_id = c.id AND tt.subject_id = s.id AND tt.day_of_week = 'Monday'
  );

-- Announcement
INSERT INTO announcements (title, message, audience_type, course_id)
SELECT 'Welcome', 'Welcome to the new semester!', 'all', c.id
FROM courses c
WHERE c.course_code = 'BCS'
  AND NOT EXISTS (SELECT 1 FROM announcements WHERE title = 'Welcome' AND course_id = c.id);

-- Activity log (admin overview)
INSERT INTO activity_log (activity_description)
SELECT 'System schema initialized'
WHERE NOT EXISTS (SELECT 1 FROM activity_log WHERE activity_description = 'System schema initialized');

INSERT INTO activity_log (activity_description)
SELECT 'Sample data loaded'
WHERE NOT EXISTS (SELECT 1 FROM activity_log WHERE activity_description = 'Sample data loaded');

-- Notification (student dashboard)
INSERT INTO notifications (user_id, message, type)
SELECT s.id, 'Welcome to the LMS portal', 'info'
FROM students s
WHERE s.username = 'alice'
  AND NOT EXISTS (
    SELECT 1 FROM notifications n
    WHERE n.user_id = s.id AND n.message = 'Welcome to the LMS portal'
  );

COMMIT;
