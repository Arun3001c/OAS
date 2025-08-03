const express = require('express');
const router = express.Router();
const User = require('../models/user');
const OTP = require('../models/otp');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, isVerified: false });

    const otpCode = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60000); // 10 mins

    await OTP.create({ email, code: otpCode, expiresAt: expiry });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      text: `Your verification code is ${otpCode}`
    });

    console.log(`OTP for ${email}: ${otpCode}`);
    res.status(200).json({ message: 'Verification code sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

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

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.isVerified) {
    return res.status(401).json({ message: 'Email not verified or user not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1h' });

  res.status(200).json({ token });
});

module.exports = router;
