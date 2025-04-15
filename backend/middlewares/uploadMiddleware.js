// middlewares/uploadMiddleware.js
const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // If the route contains 'profile', save to profiles directory
    // Otherwise, save to events directory
    const isProfile = req.originalUrl.includes("profile");
    const uploadPath = isProfile ? "uploads/profiles/" : "uploads/events/";
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename based on user ID or event ID
    const isProfile = req.originalUrl.includes("profile");
    const id = isProfile ? req.user._id : req.params.id;
    const prefix = isProfile ? "user" : "event";
    cb(null, `${prefix}-${id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Check file type
const fileFilter = (req, file, cb) => {
  // Allow only images
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: fileFilter,
});

module.exports = upload;
