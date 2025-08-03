const express = require('express');
const router = express.Router();
const OTP = require('../models/otp');
const User = require('../models/user');

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  const record = await OTP.findOne({ email, code: otp });
  if (!record || record.expiresAt < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  await User.updateOne({ email }, { isVerified: true });
  await OTP.deleteOne({ email });

  res.status(200).json({ message: 'Email verified successfully' });
});

module.exports = router;
  