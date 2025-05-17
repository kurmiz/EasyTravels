/**
 * MongoDB Configuration
 * This file contains the configuration for connecting to MongoDB
 */

// MongoDB connection string - using the default MongoDB connection
const MONGODB_URI = "mongodb://127.0.0.1:27017/bhairahawa_tourism";

// Database name
const DB_NAME = "bhairahawa_tourism";

// Collections
const COLLECTIONS = {
  USERS: "users",
  SESSIONS: "sessions"
};

// JWT Secret for token generation
const JWT_SECRET = "bhairahawa-tourism-secret-key";

// Token expiration time
const TOKEN_EXPIRY = "7d"; // 7 days

// Export configuration
module.exports = {
  MONGODB_URI,
  DB_NAME,
  COLLECTIONS,
  JWT_SECRET,
  TOKEN_EXPIRY
};
