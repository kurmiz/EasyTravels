/**
 * Test API Script
 * This script tests the booking API endpoints
 */

const fetch = require('node-fetch');
const auth = require('./auth/auth');
const userModel = require('./auth/userModel');

// API base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Test user data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  fullname: 'Test User'
};

// Test booking data
const testBooking = {
  transportType: 'car',
  destination: 'lumbini',
  bookingDate: new Date().toISOString().split('T')[0],
  passengers: 2,
  roundTrip: true,
  contactNumber: '1234567890',
  specialRequests: 'API test booking'
};

// Create test user and get token
async function createTestUserAndGetToken() {
  try {
    // Check if user exists
    let user = await userModel.findUserByEmail(testUser.email);
    
    if (!user) {
      // Register user
      console.log('Creating test user...');
      const result = await auth.register(testUser);
      user = result.user;
    }
    
    // Login and get token
    console.log('Logging in test user...');
    const loginResult = await auth.login(testUser.email, testUser.password);
    
    return loginResult.token;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
}

// Test creating a booking
async function testCreateBooking(token) {
  try {
    console.log('Testing create booking API...');
    
    const response = await fetch(`${API_BASE_URL}/transport/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testBooking)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create booking');
    }
    
    const booking = await response.json();
    console.log('Booking created successfully:', booking.id);
    
    return booking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

// Test getting user bookings
async function testGetBookings(token) {
  try {
    console.log('Testing get bookings API...');
    
    const response = await fetch(`${API_BASE_URL}/transport/bookings`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get bookings');
    }
    
    const bookings = await response.json();
    console.log(`Retrieved ${bookings.length} bookings`);
    
    if (bookings.length > 0) {
      console.log('First booking:', bookings[0].id);
    }
    
    return bookings;
  } catch (error) {
    console.error('Error getting bookings:', error);
    throw error;
  }
}

// Run the tests
async function runTests() {
  try {
    // Get token
    const token = await createTestUserAndGetToken();
    console.log('Got authentication token');
    
    // Create booking
    const booking = await testCreateBooking(token);
    
    // Get bookings
    const bookings = await testGetBookings(token);
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the tests
runTests();
