// backend/services/authService.js
console.log("AUTH SERVICE FILE LOADED");
const jwt = require('jsonwebtoken');

class AuthService {
  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Mock user database (replace with real database)
  async findOrCreateUser(profile, provider) {
    // In production, you would check your database here
    const user = {
      id: profile.id,
      email: profile.emails?.[0]?.value || `${profile.id}@${provider}.com`,
      name: profile.displayName || profile.username,
      avatar: profile.photos?.[0]?.value,
      provider: provider,
      createdAt: new Date()
    };
    
    // Here you would save to database
    console.log('User authenticated:', user);
    
    return user;
  }
}

module.exports = new AuthService();