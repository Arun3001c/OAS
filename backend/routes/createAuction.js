const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');

// Signup Route
router.post('/CreateAuction', async (req, res) => {
  try {
   console.log('Received request to create auction:', Auction);
    
  }
  
  catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
