import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directory exists
const uploadDir = "uploads/profile_pictures/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in "uploads/profile_pictures/"
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${req.user.id}_${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueSuffix);
  },
});

// File Filter: Only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and JPG files are allowed"), false);
  }
};

// Multer Upload Config
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Max file size: 2MB
});
