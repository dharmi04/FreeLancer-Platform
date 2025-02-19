// middleware/uploadMiddleware.js
const multer = require("multer");
const path = require("path");

// Configure storage destination & file naming
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // "uploads/resumes" folder must exist, or you can create it
    cb(null, "uploads/resumes/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // e.g., resume-123456789.pdf
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter files (optional, e.g., only PDFs)
const fileFilter = (req, file, cb) => {
  // accept only pdf/doc/docx, etc. if you want
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed."), false);
  }
};

// Create the Multer instance
const upload = multer({
  storage: storage,
  // fileFilter, // uncomment if you want to restrict file types
});

module.exports = upload;
