// controllers/userController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    // Case-insensitive check for existing email
    const emailExists = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });
    
    if (emailExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Case-insensitive check for existing username
    const usernameExists = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') }
    });
    
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
      });
    }

    // Create new user - allow any valid role including admin
    if (role && !['user', 'organizer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const user = await User.create({
      name,
      username,
      email,
      password,
      role: role || 'user', // Allow admin role if specified
    });

    if (user) {
      res.status(201).json({
        message: 'User created successfully',
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
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
        { email: { $regex: new RegExp(`^${login}$`, 'i') } },
        { username: { $regex: new RegExp(`^${login}$`, 'i') } }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is active
    if (!user.active) {
      return res.status(401).json({ message: 'Account has been deactivated. Please contact support.' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Return success message with token
    res.json({
      message: 'Login successful',
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        active: user.active
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile retrieval error:', error.message);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
};

// @desc    Update user name
// @route   PUT /api/users/profile/name
// @access  Private
const updateUserName = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
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
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Name updated successfully' });
  } catch (error) {
    console.error('Name update error:', error.message);
    res.status(500).json({ message: 'Server error updating name' });
  }
};

// @desc    Update user email
// @route   PUT /api/users/profile/email
// @access  Private
const updateUserEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Case-insensitive check for duplicate email
    const emailExists = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      _id: { $ne: req.user._id }
    });
    
    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use by another account' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { email },
      { new: true, runValidators: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Email updated successfully' });
  } catch (error) {
    console.error('Email update error:', error.message);
    res.status(500).json({ message: 'Server error updating email' });
  }
};

// @desc    Update username
// @route   PUT /api/users/profile/username
// @access  Private
const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Case-insensitive check for duplicate username
    const usernameExists = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') },
      _id: { $ne: req.user._id }
    });
    
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username },
      { new: true, runValidators: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Username updated successfully' });
  } catch (error) {
    console.error('Username update error:', error.message);
    res.status(500).json({ message: 'Server error updating username' });
  }
};

// @desc    Update password
// @route   PUT /api/users/profile/password
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Validate password format manually
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
      });
    }

    // For password, we need to hash it before updating
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { password: hashedPassword },
      { new: true, runValidators: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error.message);
    res.status(500).json({ message: 'Server error updating password' });
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/profile/upload
// @access  Private
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile picture field
    user.profilePicture = req.file.path;
    await user.save();

    res.json({ message: 'Profile image uploaded successfully' });
  } catch (error) {
    console.error('Profile image upload error:', error.message);
    res.status(500).json({ message: 'Server error uploading profile image' });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({ message: 'Server error retrieving users' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get user by ID error:', error.message);
    res.status(500).json({ message: 'Server error retrieving user' });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for duplicate email if being updated
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use by another account' });
      }
    }
    
    // Check for duplicate username if being updated
    if (req.body.username && req.body.username !== user.username) {
      const usernameExists = await User.findOne({ username: req.body.username });
      if (usernameExists) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    // Update fields if provided
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.username = req.body.username || user.username;
    
    // Admin can update role if provided
    if (req.body.role) {
      if (!['user', 'organizer', 'admin'].includes(req.body.role)) {
        return res.status(400).json({ message: 'Invalid role specified' });
      }
      user.role = req.body.role;
    }
    
    // Admin can update active status
    user.active = req.body.active !== undefined ? req.body.active : user.active;
    
    // Admin can reset password if needed
    if (req.body.password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(req.body.password)) {
        return res.status(400).json({
          message: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
        });
      }
      user.password = req.body.password;
    }

    await user.save();

    res.json({
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Admin update user error:', error.message);
    res.status(500).json({ message: 'Server error updating user' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Instead of actual deletion, set active status to false
      user.active = false;
      await user.save();
      
      res.json({ message: 'User deactivated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ message: 'Server error deleting user' });
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
  deleteUser
};