import multer from "multer";
import path from "path";
import fs from "fs";

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subjectId = req.params.subjectId; // Get subject ID
    const dir = `uploads/assignments/subject_${subjectId}`;

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// File filter: Only allow PDFs, DOCX, PPTX
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.ms-powerpoint",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only PDFs, DOCX, and PPTX allowed."),
      false
    );
  }
};

// Configure Multer Middleware
const uploadAssignmentMaterial = multer({
  storage,
  fileFilter,
}).single("assignmentFile"); // Ensure field name matches in Postman

export { uploadAssignmentMaterial };
