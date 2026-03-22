// services/authService.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

class AuthService {

  // ─────────────────────────────────────────────
  // TOKEN HELPERS
  // ─────────────────────────────────────────────
  generateToken(user) {
    return jwt.sign(
      {
        id: user._id || user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return null;
    }
  }

  // Called by /auth/verify route — decodes token then fetches fresh user from DB
  async verifyAndGetUser(token) {
    const decoded = this.verifyToken(token);
    if (!decoded) return null;

    const user = await User.findById(decoded.id);
    if (!user) return null;

    return this.formatUser(user);
  }

  // ─────────────────────────────────────────────
  // EMAIL + PASSWORD
  // ─────────────────────────────────────────────
  async signup({ username, email, password }) {
    // Check duplicate email
    const existing = await User.findOne({ email });
    if (existing) throw new Error('EMAIL_EXISTS');

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = this.generateToken(user);

    // FIX: return token at top level, not inside user
    return {
      success: true,
      token,
      user: this.formatUser(user),
    };
  }

  async signin({ email, password }) {
    // select('+password') because password is hidden by default in schema
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new Error('INVALID_CREDENTIALS');

    // User registered via OAuth — no password set
    if (!user.password) throw new Error('OAUTH_ACCOUNT');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('INVALID_CREDENTIALS');

    const token = this.generateToken(user);

    // FIX: return token at top level, not inside user
    return {
      success: true,
      token,
      user: this.formatUser(user),
    };
  }

  // ─────────────────────────────────────────────
  // OAUTH (Google + GitHub)
  // Called from Passport strategies in config/passport.js
  // ─────────────────────────────────────────────
  async findOrCreateUser(profile, provider) {
    const email = profile.emails?.[0]?.value || null;
    const avatar = profile.photos?.[0]?.value || null;
    const providerIdField = provider === 'google' ? 'googleId' : 'githubId';

    // 1. Check if user already exists with this OAuth ID
    let user = await User.findOne({ [providerIdField]: profile.id });
    if (user) return user;

    // 2. If same email exists, link OAuth to that account
    if (email) {
      user = await User.findOne({ email });
      if (user) {
        user[providerIdField] = profile.id;
        user.avatar = user.avatar || avatar;
        await user.save();
        return user;
      }
    }

    // 3. Create new user
    const username = (profile.displayName || profile.username || `user_${profile.id}`)
      .replace(/\s+/g, '')
      .toLowerCase();

    user = await User.create({
      [providerIdField]: profile.id,
      username,
      email,
      avatar,
    });

    return user;
  }

  // ─────────────────────────────────────────────
  // HELPER — strip sensitive fields before sending to client
  // ─────────────────────────────────────────────
  formatUser(user) {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar || null,
      provider: user.googleId ? 'google' : user.githubId ? 'github' : 'email',
    };
  }
}

module.exports = new AuthService();