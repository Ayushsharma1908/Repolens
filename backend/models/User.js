// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      sparse: true,   // allows null for GitHub users without public email
      lowercase: true,
      trim: true,
    },
    // select: false means password is NEVER returned in queries
    // unless you explicitly do .select('+password')
    password: {
      type: String,
      select: false,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    githubId: {
      type: String,
      sparse: true,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);