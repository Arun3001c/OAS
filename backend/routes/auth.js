// ✅ Updated backend/routes/auth.js with /resend-otp
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
    pass: process.env.EMAIL_PASS,
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// REGISTER + SEND OTP
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, isVerified: false });

    const otpCode = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60000); // 10 min

    await OTP.create({ email, code: otpCode, expiresAt: expiry });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      text: `Your verification code is ${otpCode}`,
    });

    res.status(200).json({ message: 'Verification code sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// ✅ RESEND OTP
router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

    const otpCode = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60000);

    await OTP.updateOne(
      { email },
      { $set: { code: otpCode, expiresAt: expiry } },
      { upsert: true }
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Resend Verification Code',
      text: `Your new verification code is ${otpCode}`,
    });

    console.log(`Resent OTP for ${email}: ${otpCode}`);
    res.status(200).json({ message: 'New OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to resend OTP', error: err.message });
  }
});

// VERIFY OTP
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

// LOGIN
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

// FORGOT PASSWORD - SEND OTP
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otpCode = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60000);

  user.resetPasswordOTP = otpCode;
  user.resetPasswordExpires = expiry;
  await user.save();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP to reset password is ${otpCode}`,
  });

  res.status(200).json({ message: 'OTP sent to your email' });
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.resetPasswordOTP !== otp || user.resetPasswordExpires < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.resetPasswordOTP = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successfully' });
});

// CHECK VERIFICATION STATUS (called by frontend AuthContext)

router.get('/check-verification', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'yourSecretKey');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ isVerified: user.isVerified, user: { name: user.name, email: user.email } });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});


module.exports = router;
