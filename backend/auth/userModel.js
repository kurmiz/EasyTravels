/**
 * User Model
 * This file contains the user model and related functions
 */

const { getCollection } = require('./db');
const config = require('./config');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/**
 * Create a new user
 * @param {object} userData - User data (name, email, password, country)
 * @returns {Promise<object>} Created user object
 */
async function createUser(userData) {
  const { fullname, email, password, country } = userData;
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // Create user object
  const user = {
    id: uuidv4(),
    fullname,
    email: email.toLowerCase(),
    password: hashedPassword,
    country,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Get users collection
  const usersCollection = await getCollection(config.COLLECTIONS.USERS);
  
  // Check if user already exists
  const existingUser = await usersCollection.findOne({ email: user.email });
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  // Insert user into database
  await usersCollection.insertOne(user);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Find a user by email
 * @param {string} email - User email
 * @returns {Promise<object|null>} User object or null if not found
 */
async function findUserByEmail(email) {
  const usersCollection = await getCollection(config.COLLECTIONS.USERS);
  return usersCollection.findOne({ email: email.toLowerCase() });
}

/**
 * Find a user by ID
 * @param {string} id - User ID
 * @returns {Promise<object|null>} User object or null if not found
 */
async function findUserById(id) {
  const usersCollection = await getCollection(config.COLLECTIONS.USERS);
  return usersCollection.findOne({ id });
}

/**
 * Verify user password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Create a session for a user
 * @param {string} userId - User ID
 * @returns {Promise<object>} Session object
 */
async function createSession(userId) {
  const sessionsCollection = await getCollection(config.COLLECTIONS.SESSIONS);
  
  // Create session object
  const session = {
    id: uuidv4(),
    userId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  };
  
  // Insert session into database
  await sessionsCollection.insertOne(session);
  
  return session;
}

/**
 * Find a session by ID
 * @param {string} sessionId - Session ID
 * @returns {Promise<object|null>} Session object or null if not found
 */
async function findSessionById(sessionId) {
  const sessionsCollection = await getCollection(config.COLLECTIONS.SESSIONS);
  return sessionsCollection.findOne({ id: sessionId });
}

/**
 * Delete a session
 * @param {string} sessionId - Session ID
 * @returns {Promise<boolean>} True if session was deleted, false otherwise
 */
async function deleteSession(sessionId) {
  const sessionsCollection = await getCollection(config.COLLECTIONS.SESSIONS);
  const result = await sessionsCollection.deleteOne({ id: sessionId });
  return result.deletedCount > 0;
}

// Export user model functions
module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  verifyPassword,
  createSession,
  findSessionById,
  deleteSession
};
