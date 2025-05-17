/**
 * Authentication Service
 * This file contains authentication-related functions
 */

const userModel = require('./userModel');
const config = require('./config');
const jwt = require('jsonwebtoken');

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @returns {Promise<object>} User object and token
 */
async function register(userData) {
  try {
    // Create user in database
    const user = await userModel.createUser(userData);
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Create session
    const session = await userModel.createSession(user.id);
    
    return {
      user,
      token,
      sessionId: session.id
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Login a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} User object and token
 */
async function login(email, password) {
  try {
    // Find user by email
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Verify password
    const isPasswordValid = await userModel.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    
    // Generate JWT token
    const { password: _, ...userWithoutPassword } = user;
    const token = generateToken(userWithoutPassword);
    
    // Create session
    const session = await userModel.createSession(user.id);
    
    return {
      user: userWithoutPassword,
      token,
      sessionId: session.id
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Logout a user
 * @param {string} sessionId - Session ID
 * @returns {Promise<boolean>} True if logout was successful
 */
async function logout(sessionId) {
  try {
    return await userModel.deleteSession(sessionId);
  } catch (error) {
    throw error;
  }
}

/**
 * Verify a user's authentication token
 * @param {string} token - JWT token
 * @returns {Promise<object|null>} Decoded token payload or null if invalid
 */
async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Generate a JWT token for a user
 * @param {object} user - User object
 * @returns {string} JWT token
 */
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    config.JWT_SECRET,
    { expiresIn: config.TOKEN_EXPIRY }
  );
}

/**
 * Check if a user is authenticated
 * @param {string} token - JWT token
 * @param {string} sessionId - Session ID
 * @returns {Promise<boolean>} True if user is authenticated
 */
async function isAuthenticated(token, sessionId) {
  try {
    // Verify token
    const decoded = await verifyToken(token);
    if (!decoded) return false;
    
    // Verify session
    if (sessionId) {
      const session = await userModel.findSessionById(sessionId);
      if (!session) return false;
      
      // Check if session is expired
      if (new Date() > new Date(session.expiresAt)) {
        await userModel.deleteSession(sessionId);
        return false;
      }
      
      // Check if session belongs to user
      if (session.userId !== decoded.id) return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

// Export authentication functions
module.exports = {
  register,
  login,
  logout,
  verifyToken,
  isAuthenticated
};
