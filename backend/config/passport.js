// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const authService = require('../services/authService');

// ─────────────────────────────────────────────
// GOOGLE
// ─────────────────────────────────────────────
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await authService.findOrCreateUser(profile, 'google');
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// ─────────────────────────────────────────────
// GITHUB
// ─────────────────────────────────────────────
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/auth/github/callback`,
    scope: ['user:email'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await authService.findOrCreateUser(profile, 'github');
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

module.exports = passport;