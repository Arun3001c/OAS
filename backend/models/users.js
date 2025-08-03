const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  validate: {
    validator: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    },
    message: props => `${props.value} is not a valid email!`
  }
}
,
  password: {
    type: String,
    required: true
  },
  resetPasswordOTP: String,
  resetPasswordExpires: Date
});

module.exports = mongoose.model('User', UserSchema);
