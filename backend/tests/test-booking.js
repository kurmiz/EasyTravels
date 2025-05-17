/**
 * Test Booking Script
 * This script tests creating a booking directly in MongoDB
 */

const { connectToDatabase, getCollection } = require('./auth/db');
const { v4: uuidv4 } = require('uuid');

// Test booking data
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

// Create test booking
async function createTestBooking() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    console.log('Connected to MongoDB');
    
    // Get bookings collection
    const bookingsCollection = await getCollection('transport_bookings');
    
    // Insert test booking
    const result = await bookingsCollection.insertOne(testBooking);
    
    if (result.acknowledged) {
      console.log(`Successfully inserted test booking with ID: ${testBooking.id}`);
      
      // Verify booking was inserted
      const booking = await bookingsCollection.findOne({ id: testBooking.id });
      console.log('Retrieved booking from MongoDB:', booking ? 'Success' : 'Failed');
      
      if (booking) {
        console.log('Booking details:', JSON.stringify(booking, null, 2));
      }
    } else {
      console.error('Failed to insert test booking');
    }
  } catch (error) {
    console.error('Error creating test booking:', error);
  }
}

// Run the test
createTestBooking();
