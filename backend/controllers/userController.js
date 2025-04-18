// controllers/userController.js
const path = require("path");
const fs = require("fs");
const Event = require("../models/eventModel");
const Ticket = require("../models/ticketModel");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    // Email validation
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Case-insensitive check for existing email
    const emailExists = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });

    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Case-insensitive check for existing username
    const usernameExists = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") },
    });

    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
      });
    }

    // Create new user - allow any valid role including admin
    if (role && !["user", "organizer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const user = await User.create({
      name,
      username,
      email,
      password,
      role: role || "user", // Allow admin role if specified
    });

    if (user) {
      res.status(201).json({
        message: "User created successfully",
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Registration error:", error.message);

    // Check if it's a validation error
    if (error.name === "ValidationError") {
      // Extract the specific validation error message
      const errorMessage = Object.values(error.errors)
        .map((val) => val.message)
        .join(", ");

      return res.status(400).json({ message: errorMessage });
    }

    res.status(500).json({ message: "Server error during registration" });
  }
};

// @desc    Login user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { login, password } = req.body;

    // Find user by either email or username (case-insensitive)
    const user = await User.findOne({
      $or: [
        { email: { $regex: new RegExp(`^${login}$`, "i") } },
        { username: { $regex: new RegExp(`^${login}$`, "i") } },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if account is active
    if (!user.active) {
      return res.status(401).json({
        message: "Account has been deactivated. Please contact support.",
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Return success message with token
    res.json({
      message: "Login successful",
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        active: user.active,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Profile retrieval error:", error.message);
    res.status(500).json({ message: "Server error retrieving profile" });
  }
};

// @desc    Update user name
// @route   PUT /api/users/profile/name
// @access  Private
const updateUserName = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Use findByIdAndUpdate to avoid triggering validation on other fields
    // The { new: true } option returns the updated document
    // The { runValidators: false } option prevents running validators
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, runValidators: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Name updated successfully" });
  } catch (error) {
    console.error("Name update error:", error.message);
    res.status(500).json({ message: "Server error updating name" });
  }
};

// @desc    Update user email
// @route   PUT /api/users/profile/email
// @access  Private
const updateUserEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Email validation
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Case-insensitive check for duplicate email
    const emailExists = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
      _id: { $ne: req.user._id },
    });

    if (emailExists) {
      return res
        .status(400)
        .json({ message: "Email already in use by another account" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { email },
      { new: true, runValidators: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Email updated successfully" });
  } catch (error) {
    console.error("Email update error:", error.message);

    // Check if it's a validation error
    if (error.name === "ValidationError") {
      // Extract the specific validation error message
      const errorMessage = Object.values(error.errors)
        .map((val) => val.message)
        .join(", ");

      return res.status(400).json({ message: errorMessage });
    }

    res.status(500).json({ message: "Server error updating email" });
  }
};

// @desc    Update username
// @route   PUT /api/users/profile/username
// @access  Private
const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Case-insensitive check for duplicate username
    const usernameExists = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") },
      _id: { $ne: req.user._id },
    });

    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username },
      { new: true, runValidators: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Username updated successfully" });
  } catch (error) {
    console.error("Username update error:", error.message);
    res.status(500).json({ message: "Server error updating username" });
  }
};

// @desc    Update password
// @route   PUT /api/users/profile/password
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, password } = req.body;

    // Check if both passwords are provided
    if (!currentPassword || !password) {
      return res.status(400).json({
        message: "Both current password and new password are required",
      });
    }

    // Get the current user with password
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Validate new password format
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Use findByIdAndUpdate instead of save() to bypass schema validation
    await User.findByIdAndUpdate(
      req.user._id,
      { password: hashedPassword },
      { runValidators: false }
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error.message);
    res
      .status(400)
      .json({ message: "Error updating password: " + error.message });
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/profile/upload
// @access  Private
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old profile picture if it exists and is not the default
    if (user.profilePicture && user.profilePicture !== "default-profile.png") {
      const oldProfilePath = path.join(__dirname, "..", user.profilePicture);
      if (fs.existsSync(oldProfilePath)) {
        fs.unlinkSync(oldProfilePath);
      }
    }

    // Update the user's profile picture field
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: req.file.path },
      { new: true, runValidators: false }
    );

    res.json({ message: "Profile image uploaded successfully" });
  } catch (error) {
    console.error("Profile image upload error:", error.message);
    res.status(500).json({ message: "Server error uploading profile image" });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error.message);
    res.status(500).json({ message: "Server error retrieving users" });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Get user by ID error:", error.message);
    res.status(500).json({ message: "Server error retrieving user" });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for duplicate email if being updated (with case-insensitive check)
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({
        email: { $regex: new RegExp(`^${req.body.email}$`, "i") },
        _id: { $ne: req.params.id },
      });
      if (emailExists) {
        return res
          .status(400)
          .json({ message: "Email already in use by another account" });
      }
    }

    // Check for duplicate username if being updated (with case-insensitive check)
    if (req.body.username && req.body.username !== user.username) {
      const usernameExists = await User.findOne({
        username: { $regex: new RegExp(`^${req.body.username}$`, "i") },
        _id: { $ne: req.params.id },
      });
      if (usernameExists) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    // Create an update object with only the fields we want to update
    const updateFields = {};

    // Only include fields that are provided in the request
    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.email) updateFields.email = req.body.email;
    if (req.body.username) updateFields.username = req.body.username;
    if (req.body.role) {
      if (!["user", "organizer", "admin"].includes(req.body.role)) {
        return res.status(400).json({ message: "Invalid role specified" });
      }
      updateFields.role = req.body.role;
    }

    // Only include active status if it's explicitly provided
    if (req.body.active !== undefined) {
      updateFields.active = req.body.active;
    }

    // Use findByIdAndUpdate to avoid triggering password validation
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Admin update user error:", error.message);
    res.status(500).json({ message: "Server error updating user" });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user's profile picture if exists
    if (user.profilePicture && user.profilePicture !== "default-profile.png") {
      const profilePath = path.join(__dirname, "..", user.profilePicture);
      if (fs.existsSync(profilePath)) {
        fs.unlinkSync(profilePath);
      }
    }

    // Delete all user's tickets
    await Ticket.deleteMany({ user: user._id });

    // Delete all user's transactions
    await Transaction.deleteMany({ user: user._id });

    // If user is organizer, handle their events
    if (user.role === "organizer") {
      const events = await Event.find({ organizer: user._id });

      // For each event
      for (const event of events) {
        // Delete event image if exists
        if (event.imageUrl && event.imageUrl !== "placeholder.jpg") {
          const imagePath = path.join(__dirname, "..", event.imageUrl);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }

        // Delete all tickets for this event
        await Ticket.deleteMany({ event: event._id });

        // Delete all transactions for this event
        await Transaction.deleteMany({ event: event._id });

        // Delete the event
        await Event.findByIdAndDelete(event._id);
      }
    }

    // Finally, delete the user
    await User.findByIdAndDelete(user._id);

    res.json({ message: "User and all related data permanently deleted" });
  } catch (error) {
    console.error("Delete user error:", error.message);
    res.status(500).json({ message: "Server error deleting user" });
  }
};

module.exports = {
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
};