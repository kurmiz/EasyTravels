/**
 * Test Booking Flow
 * This script tests the entire booking flow from creation to retrieval
 */

const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const TEST_USER = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
};

// Test booking data
const TEST_BOOKING = {
  transportType: 'car',
  destination: 'lumbini',
  bookingDate: new Date().toISOString().split('T')[0],
  passengers: 2,
  roundTrip: true,
  contactNumber: '1234567890',
  specialRequests: 'Test booking from flow test'
};

// Main test function
async function testBookingFlow() {
  console.log('Starting booking flow test...');
  
  try {
    // Step 1: Check API status
    console.log('\n1. Checking API status...');
    const statusResponse = await fetch(`${API_BASE_URL}/status`);
    if (!statusResponse.ok) {
      throw new Error(`API status check failed: ${statusResponse.status}`);
    }
    const statusData = await statusResponse.json();
    console.log('API status:', statusData.status);
    
    // Step 2: Check database connection
    console.log('\n2. Checking database connection...');
    const dbStatusResponse = await fetch(`${API_BASE_URL}/db-status`);
    if (!dbStatusResponse.ok) {
      throw new Error(`Database status check failed: ${dbStatusResponse.status}`);
    }
    const dbStatusData = await dbStatusResponse.json();
    console.log('Database connected:', dbStatusData.connected);
    
    // Step 3: Register or login test user
    console.log('\n3. Authenticating test user...');
    let authToken;
    let userId;
    
    try {
      // Try to register first
      const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_USER)
      });
      
      if (registerResponse.ok) {
        const registerData = await registerResponse.json();
        authToken = registerData.token;
        userId = registerData.user.id;
        console.log('Registered new test user');
      } else {
        // If registration fails (likely because user exists), try login
        const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: TEST_USER.email,
            password: TEST_USER.password
          })
        });
        
        if (!loginResponse.ok) {
          // If both fail, use demo mode
          console.log('Using demo mode authentication');
          authToken = 'demo-token';
          userId = 'demo-user-id';
        } else {
          const loginData = await loginResponse.json();
          authToken = loginData.token;
          userId = loginData.user.id;
          console.log('Logged in existing test user');
        }
      }
    } catch (error) {
      // Fallback to demo mode if auth fails
      console.log('Auth error, using demo mode:', error.message);
      authToken = 'demo-token';
      userId = 'demo-user-id';
    }
    
    console.log('Auth token:', authToken);
    console.log('User ID:', userId);
    
    // Step 4: Check transport routes
    console.log('\n4. Testing transport routes...');
    const transportTestResponse = await fetch(`${API_BASE_URL}/transport/test`);
    if (!transportTestResponse.ok) {
      throw new Error(`Transport routes test failed: ${transportTestResponse.status}`);
    }
    const transportTestData = await transportTestResponse.json();
    console.log('Transport routes:', transportTestData.message);
    
    // Step 5: Get destinations
    console.log('\n5. Getting destinations...');
    const destinationsResponse = await fetch(`${API_BASE_URL}/transport/destinations`);
    if (!destinationsResponse.ok) {
      throw new Error(`Failed to get destinations: ${destinationsResponse.status}`);
    }
    const destinations = await destinationsResponse.json();
    console.log('Destinations available:', Object.keys(destinations).length);
    
    // Step 6: Get transport types
    console.log('\n6. Getting transport types...');
    const transportTypesResponse = await fetch(`${API_BASE_URL}/transport/types`);
    if (!transportTypesResponse.ok) {
      throw new Error(`Failed to get transport types: ${transportTypesResponse.status}`);
    }
    const transportTypes = await transportTypesResponse.json();
    console.log('Transport types available:', Object.keys(transportTypes).length);
    
    // Step 7: Calculate price
    console.log('\n7. Calculating price...');
    const priceResponse = await fetch(`${API_BASE_URL}/transport/calculate-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transportType: TEST_BOOKING.transportType,
        destination: TEST_BOOKING.destination,
        passengers: TEST_BOOKING.passengers,
        roundTrip: TEST_BOOKING.roundTrip
      })
    });
    
    if (!priceResponse.ok) {
      throw new Error(`Failed to calculate price: ${priceResponse.status}`);
    }
    
    const priceDetails = await priceResponse.json();
    console.log('Price calculation:', priceDetails);
    
    // Step 8: Create booking
    console.log('\n8. Creating booking...');
    const bookingResponse = await fetch(`${API_BASE_URL}/transport/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(TEST_BOOKING)
    });
    
    if (!bookingResponse.ok) {
      const errorText = await bookingResponse.text();
      throw new Error(`Failed to create booking: ${bookingResponse.status} - ${errorText}`);
    }
    
    const booking = await bookingResponse.json();
    console.log('Booking created with ID:', booking.id);
    
    // Step 9: Get user's bookings
    console.log('\n9. Getting user bookings...');
    const bookingsResponse = await fetch(`${API_BASE_URL}/transport/bookings`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (!bookingsResponse.ok) {
      throw new Error(`Failed to get bookings: ${bookingsResponse.status}`);
    }
    
    const bookings = await bookingsResponse.json();
    console.log('User has', bookings.length, 'bookings');
    
    // Step 10: Get specific booking
    console.log('\n10. Getting specific booking...');
    const bookingDetailsResponse = await fetch(`${API_BASE_URL}/transport/booking/${booking.id}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (!bookingDetailsResponse.ok) {
      throw new Error(`Failed to get booking details: ${bookingDetailsResponse.status}`);
    }
    
    const bookingDetails = await bookingDetailsResponse.json();
    console.log('Retrieved booking details:', {
      id: bookingDetails.id,
      destination: bookingDetails.destinationName,
      date: bookingDetails.bookingDate,
      status: bookingDetails.status
    });
    
    console.log('\nBooking flow test completed successfully!');
    return { success: true, booking };
    
  } catch (error) {
    console.error('\nBooking flow test failed:', error);
    return { success: false, error: error.message };
  }
}

// Run the test
testBookingFlow()
  .then(result => {
    console.log('\nTest result:', result.success ? 'SUCCESS' : 'FAILURE');
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
