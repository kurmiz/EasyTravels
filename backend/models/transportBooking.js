/**
 * Transportation Booking Model
 * This file contains the schema and functions for transportation bookings
 */

const { getCollection } = require('../auth/db');
const config = require('../auth/config');
const { v4: uuidv4 } = require('uuid');

// Collection name for bookings
const BOOKINGS_COLLECTION = 'transport_bookings';

// Predefined destinations based on the project
const DESTINATIONS = {
  'lumbini': {
    name: 'Lumbini',
    distance: 27,
    description: 'Birthplace of Lord Buddha, UNESCO World Heritage Site'
  },
  'tiger_resort': {
    name: 'Tiger Resort, Daunne',
    distance: 35,
    description: 'Tranquil getaway located near the Daunne hills in Nawalparasi'
  },
  'lumbini_cable_car': {
    name: 'Lumbini Cable Car',
    distance: 20,
    description: 'Scenic cable car connecting Butwal to Basantapur Danda'
  },
  'siddha_baba': {
    name: 'Siddha Baba Mandir',
    distance: 25,
    description: 'Sacred temple dedicated to Siddha Baba'
  },
  'baglung_bridge': {
    name: 'Baglung Suspension Bridge',
    distance: 120,
    description: 'One of the longest pedestrian suspension bridges in the world'
  },
  'bhat_bhateni': {
    name: 'Bhat-Bhateni Supermarket',
    distance: 1,
    description: 'Nepal\'s leading supermarket chain in Bhairahawa'
  },
  'daunne': {
    name: 'Daunne',
    distance: 30,
    description: 'Beautiful hill station with panoramic views'
  },
  'nuwakot': {
    name: 'Nuwakot',
    distance: 8,
    description: 'Historical site with cultural importance'
  }
};

// Transportation types with base prices
const TRANSPORT_TYPES = {
  'bike': {
    name: 'Bike Rental',
    basePrice: 500,
    pricePerKm: 5,
    description: 'Explore at your own pace'
  },
  'bus': {
    name: 'Bus Service',
    basePrice: 100,
    pricePerKm: 2,
    description: 'Economical group travel'
  },
  'car': {
    name: 'Car Rental',
    basePrice: 3000,
    pricePerKm: 20,
    description: 'Comfortable private tours'
  },
  'rickshaw': {
    name: 'E-Rickshaw',
    basePrice: 150,
    pricePerKm: 10,
    description: 'Eco-friendly city travel'
  }
};

/**
 * Calculate price for a transportation booking
 * @param {string} transportType - Type of transportation
 * @param {string} destination - Destination ID
 * @param {number} passengers - Number of passengers
 * @param {boolean} roundTrip - Whether it's a round trip
 * @returns {object} Price details
 */
function calculatePrice(transportType, destination, passengers, roundTrip) {
  if (!TRANSPORT_TYPES[transportType] || !DESTINATIONS[destination]) {
    throw new Error('Invalid transport type or destination');
  }

  const transport = TRANSPORT_TYPES[transportType];
  const dest = DESTINATIONS[destination];

  // Base calculation
  let basePrice = transport.basePrice;
  let distancePrice = dest.distance * transport.pricePerKm;

  // Adjust for passengers (except for bike which is per vehicle)
  let passengerMultiplier = 1;
  if (transportType !== 'bike' && passengers > 1) {
    passengerMultiplier = transportType === 'bus' ? 1 : 1 + (passengers - 1) * 0.5;
  }

  // Calculate total
  let totalPrice = (basePrice + distancePrice) * passengerMultiplier;

  // Round trip doubles the price
  if (roundTrip) {
    totalPrice *= 2;
  }

  return {
    basePrice,
    distancePrice,
    passengerMultiplier,
    roundTrip,
    totalPrice: Math.round(totalPrice)
  };
}

/**
 * Create a new transportation booking
 * @param {object} bookingData - Booking data
 * @returns {Promise<object>} Created booking
 */
async function createBooking(bookingData) {
  try {
    const {
      userId,
      userName,
      transportType,
      destination,
      bookingDate,
      passengers,
      contactNumber,
      email,
      roundTrip,
      specialRequests
    } = bookingData;

    // Validate required fields
    if (!transportType || !destination || !bookingDate || !passengers || !contactNumber || !email) {
      throw new Error('Missing required booking fields');
    }

    // Calculate price
    const priceDetails = calculatePrice(
      transportType,
      destination,
      parseInt(passengers),
      roundTrip === true || roundTrip === 'true'
    );

    // Create booking object
    const booking = {
      id: uuidv4(),
      userId: userId || 'guest',
      userName: userName || 'Guest User',
      transportType,
      transportName: TRANSPORT_TYPES[transportType].name,
      destination,
      destinationName: DESTINATIONS[destination].name,
      bookingDate,
      passengers: parseInt(passengers),
      contactNumber,
      email,
      roundTrip: roundTrip === true || roundTrip === 'true',
      specialRequests,
      priceDetails,
      status: 'confirmed',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Get bookings collection
    const bookingsCollection = await getCollection(BOOKINGS_COLLECTION);

    // Insert booking into database
    const result = await bookingsCollection.insertOne(booking);

    if (!result.acknowledged) {
      throw new Error('Failed to insert booking into database');
    }

    console.log(`Successfully created booking with ID: ${booking.id}`);
    return booking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

/**
 * Get bookings for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} User's bookings
 */
async function getUserBookings(userId) {
  try {
    const bookingsCollection = await getCollection(BOOKINGS_COLLECTION);
    const bookings = await bookingsCollection.find({ userId }).toArray();
    console.log(`Retrieved ${bookings.length} bookings for user ${userId}`);
    return bookings;
  } catch (error) {
    console.error('Error getting user bookings:', error);
    throw error;
  }
}

/**
 * Get all bookings (for admin purposes)
 * @returns {Promise<Array>} All bookings
 */
async function getAllBookings() {
  try {
    const bookingsCollection = await getCollection(BOOKINGS_COLLECTION);
    const bookings = await bookingsCollection.find({}).toArray();
    return bookings;
  } catch (error) {
    console.error('Error getting all bookings:', error);
    throw error;
  }
}

/**
 * Get a booking by ID
 * @param {string} bookingId - Booking ID
 * @returns {Promise<object|null>} Booking object or null if not found
 */
async function getBookingById(bookingId) {
  try {
    const bookingsCollection = await getCollection(BOOKINGS_COLLECTION);
    const booking = await bookingsCollection.findOne({ id: bookingId });
    return booking;
  } catch (error) {
    console.error('Error getting booking by ID:', error);
    throw error;
  }
}

/**
 * Update a booking's status
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status
 * @returns {Promise<boolean>} True if updated successfully
 */
async function updateBookingStatus(bookingId, status) {
  try {
    const bookingsCollection = await getCollection(BOOKINGS_COLLECTION);
    const result = await bookingsCollection.updateOne(
      { id: bookingId },
      { $set: { status, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}

/**
 * Cancel a booking
 * @param {string} bookingId - Booking ID
 * @param {string} userId - User ID (for verification)
 * @returns {Promise<boolean>} True if cancelled successfully
 */
async function cancelBooking(bookingId, userId) {
  try {
    const bookingsCollection = await getCollection(BOOKINGS_COLLECTION);
    const booking = await bookingsCollection.findOne({ id: bookingId });

    if (!booking || (booking.userId !== userId && booking.userId !== 'guest')) {
      return false;
    }

    const result = await bookingsCollection.updateOne(
      { id: bookingId },
      { $set: { status: 'cancelled', updatedAt: new Date() } }
    );

    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
}

// Export model functions and constants
module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  calculatePrice,
  DESTINATIONS,
  TRANSPORT_TYPES
};
