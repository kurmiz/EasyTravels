/**
 * MongoDB Database Connection
 * This file handles the connection to MongoDB
 */

const { MongoClient } = require('mongodb');
const config = require('./config');

// Create a MongoDB client
const client = new MongoClient(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Database connection
let db;

/**
 * Connect to MongoDB
 * @returns {Promise<object>} MongoDB database instance
 */
async function connectToDatabase() {
  if (db) return db;

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    db = client.db(config.DB_NAME);

    // Create collections if they don't exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (!collectionNames.includes('transport_bookings')) {
      await db.createCollection('transport_bookings');
      console.log('Created transport_bookings collection');
    }

    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

/**
 * Get a collection from the database
 * @param {string} collectionName - Name of the collection
 * @returns {Promise<Collection>} MongoDB collection
 */
async function getCollection(collectionName) {
  const db = await connectToDatabase();
  return db.collection(collectionName);
}

/**
 * Close the database connection
 */
async function closeConnection() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Export database functions
module.exports = {
  connectToDatabase,
  getCollection,
  closeConnection
};
