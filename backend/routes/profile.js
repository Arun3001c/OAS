const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/user');
const verifyToken = require('../middleware/auth');
const fs = require('fs');

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});
const upload = multer({ storage });

/**
 * @route   GET /api/profile
 * @desc    Get logged-in user profile
 * @access  Private
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Adjust profile image path for frontend access
    if (user.profileImage) {
      user.profileImage = `/${user.profileImage.replace(/\\/g, '/')}`;
    }

    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/', verifyToken, upload.single('profileImage'), async (req, res) => {  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, phone, address, userId } = req.body;

    // Update userId if provided and not already taken
    if (userId && userId !== user.userId) {
      const exists = await User.findOne({ userId });
      if (exists) return res.status(400).json({ message: 'User ID already taken' });
      user.userId = userId;
    }

    // Update other fields
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    // Handle profile image
    if (req.file) {
      user.profileImage = `uploads/${req.file.filename}`;
    }

    await user.save();

    const updatedUser = user.toObject();
    updatedUser.profileImage = user.profileImage ? `/${user.profileImage.replace(/\\/g, '/')}` : null;

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
