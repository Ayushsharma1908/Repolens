// routes/auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const authService = require('../services/authService');

// ─────────────────────────────────────────────
// GOOGLE OAUTH
// ─────────────────────────────────────────────
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/signin?error=auth_failed`
  }),
  (req, res) => {
    // FIX: redirect with ?token= so AuthContext can read it
    const token = authService.generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/signin?token=${token}`);
  }
);

// ─────────────────────────────────────────────
// GITHUB OAUTH
// ─────────────────────────────────────────────
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/signin?error=auth_failed`
  }),
  (req, res) => {
    // FIX: redirect with ?token= so AuthContext can read it
    const token = authService.generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/signin?token=${token}`);
  }
);

// ─────────────────────────────────────────────
// EMAIL + PASSWORD — SIGN UP
// ─────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  console.log('Body received:', req.body); 
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const result = await authService.signup({ username, email, password });
    res.status(201).json(result);
  } catch (err) {
    if (err.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────────
// EMAIL + PASSWORD — SIGN IN
// ─────────────────────────────────────────────
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const result = await authService.signin({ email, password });
    res.json(result);
  } catch (err) {
    if (err.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    if (err.message === 'OAUTH_ACCOUNT') {
      return res.status(401).json({ success: false, message: 'This account uses Google or GitHub login.' });
    }
    console.error('Signin error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────────
// VERIFY TOKEN (called by AuthContext on page load)
// ─────────────────────────────────────────────
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const result = await authService.verifyAndGetUser(token);

    if (!result) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    res.json({ success: true, user: result });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
});

module.exports = router;