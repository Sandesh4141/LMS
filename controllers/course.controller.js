import {
  getAllCourses,
  getCourseById,
  getCoursesByDepartment,
  createCourse,
  updateCourse,
  deleteCourse,
  fetchAllSubjectsUnderCourse,
  getStudentsByCourse,
  getInstructorsByCourse,
  getCourseTimetable,
  updateSubjectsForCourse,
  updateCoursePartial,
} from "../models/course.model.js";

/* Fetch all courses */
const fetchAllCourses = async (req, res) => {
  try {
    const courses = await getAllCourses();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

/* Fetch course by ID */
const fetchCourseById = async (req, res) => {
  let { id } = req.params;
  id = parseInt(id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid Course ID" });
  }

  try {
    const course = await getCourseById(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

/* Fetch courses by department */
const fetchCoursesByDepartment = async (req, res) => {
  const { departmentId } = req.params;
  try {
    const courses = await getCoursesByDepartment(departmentId);
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses by department:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

/* Create a new course */
const createNewCourse = async (req, res) => {
  const {
    courseName,
    courseCode,
    description,
    credits,
    departmentId,
    totalSemesters,
    durationYears,
    modeOfStudy,
    eligibilityCriteria,
    intakeCapacity,
    affiliatedUniversity,
    isActive,
  } = req.body;

  if (
    !courseName ||
    !courseCode ||
    !description ||
    !credits ||
    !departmentId ||
    !totalSemesters ||
    !durationYears ||
    !modeOfStudy ||
    !eligibilityCriteria ||
    !intakeCapacity ||
    !affiliatedUniversity ||
    isActive === undefined
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newCourse = await createCourse(
      courseName,
      courseCode,
      description,
      credits,
      departmentId,
      totalSemesters,
      durationYears,
      modeOfStudy,
      eligibilityCriteria,
      intakeCapacity,
      affiliatedUniversity,
      isActive
    );
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course" });
  }
};

/* Update an existing course */
const updateExistingCourse = async (req, res) => {
  const { id } = req.params;
  const { course_name, description, department_id } = req.body;

  if (!course_name || !department_id) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  try {
    const updated = await updateCoursePartial(
      id,
      course_name,
      description,
      department_id
    );
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
};

/* Delete a course */
const deleteCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCourse = await deleteCourse(id);
    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ message: "Course deleted successfully", deletedCourse });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
};

/* Fetch subjects under a course */
const fetchSubjectsUnderCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const subjects = await fetchAllSubjectsUnderCourse(courseId);
    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};

/* Fetch students enrolled in a course */
const fetchStudentsByCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const students = await getStudentsByCourse(courseId);
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

/* Fetch instructors assigned to a course */
const fetchInstructorsByCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const instructors = await getInstructorsByCourse(courseId);
    res.json(instructors);
  } catch (error) {
    console.error("Error fetching instructors:", error);
    res.status(500).json({ error: "Failed to fetch instructors" });
  }
};

const updateCourseSubjects = async (req, res) => {
  const { courseId } = req.params;
  const { subjectIds } = req.body;

  try {
    await updateSubjectsForCourse(courseId, subjectIds);
    res.status(200).json({ message: "Subjects updated for course ✅" });
  } catch (error) {
    console.error("Error updating subjects for course:", error);
    res.status(500).json({ error: "Failed to update subjects" });
  }
};

export {
  fetchAllCourses,
  fetchCourseById,
  fetchCoursesByDepartment,
  createNewCourse,
  updateExistingCourse,
  deleteCourseById,
  fetchSubjectsUnderCourse,
  fetchStudentsByCourse,
  fetchInstructorsByCourse,
  updateCourseSubjects,
};
