// routes/userRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserName,
  updateUserEmail,
  updateUsername,
  updatePassword,
  uploadProfileImage,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, admin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (require authentication)
router.get("/profile", protect, getUserProfile);

// Individual update routes
router.put("/profile/name", protect, updateUserName);
router.put("/profile/email", protect, updateUserEmail);
router.put("/profile/username", protect, updateUsername);
router.put("/profile/password", protect, updatePassword);

// Profile image upload route
router.post(
  "/profile/upload",
  protect,
  upload.single("image"),
  uploadProfileImage
);

// Admin routes
router.route("/").get(protect, admin, getUsers);

router
  .route("/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;