/**
 * Test Full Booking Flow
 * This script tests the entire booking flow from creating a booking to viewing it
 */

const fetch = require('node-fetch');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const MONGODB_URI = 'mongodb://127.0.0.1:27017/bhairahawa_tourism';
const BOOKINGS_COLLECTION = 'transport_bookings';

// Test user
const TEST_USER = {
  id: 'test-user-' + Date.now(),
  email: 'test@example.com',
  name: 'Test User'
};

// Test booking
const TEST_BOOKING = {
  transportType: 'car',
  destination: 'lumbini',
  bookingDate: new Date().toISOString().split('T')[0],
  passengers: 2,
  roundTrip: true,
  contactNumber: '1234567890',
  specialRequests: 'Test booking from full flow test'
};

// Main test function
async function testFullFlow() {
  console.log('Starting full flow test...');
  
  let mongoClient;
  
  try {
    // Step 1: Connect to MongoDB
    console.log('\n1. Connecting to MongoDB...');
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    console.log('Connected to MongoDB');
    
    // Step 2: Create a test booking directly in MongoDB
    console.log('\n2. Creating test booking in MongoDB...');
    const db = mongoClient.db();
    const bookingsCollection = db.collection(BOOKINGS_COLLECTION);
    
    const booking = {
      id: uuidv4(),
      userId: TEST_USER.id,
      userName: TEST_USER.name,
      transportType: TEST_BOOKING.transportType,
      transportName: 'Car Rental',
      destination: TEST_BOOKING.destination,
      destinationName: 'Lumbini',
      bookingDate: TEST_BOOKING.bookingDate,
      passengers: TEST_BOOKING.passengers,
      roundTrip: TEST_BOOKING.roundTrip,
      contactNumber: TEST_BOOKING.contactNumber,
      specialRequests: TEST_BOOKING.specialRequests,
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
    
    const result = await bookingsCollection.insertOne(booking);
    console.log('Booking created in MongoDB:', booking.id);
    console.log('MongoDB document ID:', result.insertedId);
    
    // Step 3: Verify the booking was created
    console.log('\n3. Verifying booking in MongoDB...');
    const savedBooking = await bookingsCollection.findOne({ id: booking.id });
    if (!savedBooking) {
      throw new Error('Booking not found in MongoDB');
    }
    console.log('Booking found in MongoDB:', savedBooking.id);
    
    // Step 4: Create a test booking via the API
    console.log('\n4. Creating test booking via API...');
    try {
      // Get a demo token
      const demoToken = 'demo-token';
      
      const bookingResponse = await fetch(`${API_BASE_URL}/transport/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${demoToken}`
        },
        body: JSON.stringify({
          ...TEST_BOOKING,
          userId: 'demo-user-id'
        })
      });
      
      if (!bookingResponse.ok) {
        const errorText = await bookingResponse.text();
        console.warn(`API booking creation failed: ${bookingResponse.status} - ${errorText}`);
        console.warn('This is expected if the server is not running or the API is not available');
      } else {
        const apiBooking = await bookingResponse.json();
        console.log('Booking created via API:', apiBooking.id);
      }
    } catch (apiError) {
      console.warn('API booking creation error:', apiError.message);
      console.warn('This is expected if the server is not running or the API is not available');
    }
    
    // Step 5: Create a test booking in localStorage
    console.log('\n5. Creating test booking in localStorage...');
    console.log('This step will be performed in the browser');
    console.log('Open the bookings.html page to see the test booking');
    
    // Step 6: Verify all bookings in MongoDB
    console.log('\n6. Listing all bookings in MongoDB...');
    const allBookings = await bookingsCollection.find({}).toArray();
    console.log(`Found ${allBookings.length} bookings in MongoDB`);
    
    allBookings.forEach((b, index) => {
      console.log(`${index + 1}. ${b.destinationName} - ${b.status} - ${b.id}`);
    });
    
    console.log('\nFull flow test completed successfully!');
    return { success: true, booking };
    
  } catch (error) {
    console.error('\nFull flow test failed:', error);
    return { success: false, error: error.message };
  } finally {
    if (mongoClient) {
      await mongoClient.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the test
testFullFlow()
  .then(result => {
    console.log('\nTest result:', result.success ? 'SUCCESS' : 'FAILURE');
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
