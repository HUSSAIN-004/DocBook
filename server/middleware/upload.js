const multer = require("multer");
const path = require("path");

// Configure multer for memory storage (for base64 conversion)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for base64 storage
  },
  fileFilter: fileFilter,
});

// Helper function to convert buffer to base64 data URL
const bufferToBase64 = (buffer, mimetype) => {
  const base64 = buffer.toString("base64");
  return `data:${mimetype};base64,${base64}`;
};

module.exports = { upload, bufferToBase64 };
