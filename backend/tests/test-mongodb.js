/**
 * MongoDB Test Script
 * This script tests the MongoDB connection and inserts a test booking
 */

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

// MongoDB connection string
const uri = 'mongodb://127.0.0.1:27017/bhairahawa_tourism';

async function testMongoDB() {
  console.log('Testing MongoDB connection...');
  
  let client;
  try {
    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    // Get database and collection
    const db = client.db('bhairahawa_tourism');
    const collection = db.collection('transport_bookings');
    
    // Count existing bookings
    const count = await collection.countDocuments();
    console.log(`Found ${count} existing bookings in the database`);
    
    // Create a test booking
    const testBooking = {
      id: uuidv4(),
      userId: 'test-user-id',
      userName: 'Test User',
      transportType: 'car',
      transportName: 'Car Rental',
      destination: 'lumbini',
      destinationName: 'Lumbini',
      bookingDate: new Date().toISOString().split('T')[0],
      passengers: 2,
      roundTrip: true,
      contactNumber: '1234567890',
      specialRequests: 'Test booking',
      priceDetails: {
        basePrice: 3000,
        distancePrice: 540,
        passengerMultiplier: 1.5,
        roundTrip: true,
        totalPrice: 10620
      },
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert test booking
    const result = await collection.insertOne(testBooking);
    console.log(`Inserted test booking with ID: ${testBooking.id}`);
    console.log(`MongoDB document ID: ${result.insertedId}`);
    
    // Retrieve the booking to verify
    const savedBooking = await collection.findOne({ id: testBooking.id });
    console.log('Retrieved booking from database:', savedBooking ? 'Success' : 'Failed');
    
    if (savedBooking) {
      console.log('Test booking details:', {
        id: savedBooking.id,
        destination: savedBooking.destinationName,
        date: savedBooking.bookingDate
      });
    }
    
    return { success: true, booking: savedBooking };
  } catch (error) {
    console.error('Error testing MongoDB:', error);
    return { success: false, error: error.message };
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the test
testMongoDB()
  .then(result => {
    console.log('Test completed with result:', result.success ? 'Success' : 'Failed');
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unhandled error in test:', error);
    process.exit(1);
  });
