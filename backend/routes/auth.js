// backend/routes/auth.js
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const authService = require('../services/authService');
console.log("AuthService:", authService);
console.log("findOrCreateUser:", authService.findOrCreateUser);
const router = express.Router();

// Passport serialization
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await authService.findOrCreateUser(profile, 'google');
      const token = authService.generateToken(user);
      return done(null, { ...user, token });
    } catch (error) {
      return done(error, null);
    }
  }
));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback',
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await authService.findOrCreateUser(profile, 'github');
      const token = authService.generateToken(user);
      return done(null, { ...user, token });
    } catch (error) {
      return done(error, null);
    }
  }
));

// Google Auth Routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/signin?error=auth_failed` }),
  (req, res) => {
    // Successful authentication
    const userData = encodeURIComponent(JSON.stringify(req.user));
    res.redirect(`${process.env.CLIENT_URL}/auth-callback?user=${userData}`);
  }
);

// GitHub Auth Routes
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${process.env.CLIENT_URL}/signin?error=auth_failed` }),
  (req, res) => {
    // Successful authentication
    const userData = encodeURIComponent(JSON.stringify(req.user));
    res.redirect(`${process.env.CLIENT_URL}/auth-callback?user=${userData}`);
  }
);

// Regular email/password sign in (you'll need to implement this with a database)
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Here you would validate against your database
    // This is just a mock example
    const user = {
      id: '123',
      email: email,
      name: 'Test User',
      avatar: null,
      provider: 'local'
    };
    
    const token = authService.generateToken(user);
    res.json({ success: true, user: { ...user, token } });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
});

// Sign up route
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Here you would save to your database
    const user = {
      id: Date.now().toString(),
      email: email,
      name: name,
      avatar: null,
      provider: 'local'
    };
    
    const token = authService.generateToken(user);
    res.json({ success: true, user: { ...user, token } });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Sign up failed' });
  }
});

// Verify token route
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ valid: false });
  }
  
  const decoded = authService.verifyToken(token);
  
  if (decoded) {
    res.json({ valid: true, user: decoded });
  } else {
    res.status(401).json({ valid: false });
  }
});



module.exports = router;