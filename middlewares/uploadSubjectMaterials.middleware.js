import multer from "multer";
import path from "path";
import fs from "fs";

// 📌 Multer Storage Engine (Saves File in Subject-Specific Folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { subjectId } = req.params; // Get subject ID from request params

    if (!subjectId) {
      return cb(new Error("Subject ID is required"), null);
    }

    const uploadDir = `uploads/course_materials/${subjectId}/`; // Set subject folder

    // 📌 Ensure the subject-specific directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir); // Save file inside subject's folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + file.originalname; // Add timestamp to avoid name conflicts
    cb(null, uniqueSuffix);
  },
});

// 📌 Multer Configuration
export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 * 40 },
});
