/**
 * Transportation Routes
 * This file contains the API routes for transportation bookings
 */

const express = require('express');
const router = express.Router();
const transportBooking = require('../models/transportBooking');
const { verifyToken } = require('../auth/auth');
const userModel = require('../auth/userModel');

/**
 * Middleware to authenticate requests
 * This middleware verifies the JWT token in the Authorization header
 * and attaches the user object to the request
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Authenticating request with token:', token ? `${token.substring(0, 10)}...` : 'none');

    if (!token) {
      // Allow guest access for booking
      req.user = {
        id: 'guest',
        email: 'guest@example.com',
        name: 'Guest User'
      };
      return next();
    }

    // Special handling for demo token
    if (token === 'demo-token') {
      console.log('Using demo token authentication');
      req.user = {
        id: 'demo-user-id',
        email: 'demo@example.com',
        name: 'Demo User'
      };
      return next();
    }

    // Normal token verification
    const decoded = await verifyToken(token);
    if (!decoded) {
      console.log('Token verification failed');
      // Allow guest access instead of returning error
      req.user = {
        id: 'guest',
        email: 'guest@example.com',
        name: 'Guest User'
      };
      return next();
    }

    console.log('Token verified successfully for user:', decoded.id);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    // Allow guest access on error
    req.user = {
      id: 'guest',
      email: 'guest@example.com',
      name: 'Guest User'
    };
    return next();
  }
};

/**
 * @route GET /api/transport/destinations
 * @desc Get list of destinations
 * @access Public
 */
router.get('/destinations', (req, res) => {
  try {
    res.status(200).json(transportBooking.DESTINATIONS);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route GET /api/transport/types
 * @desc Get list of transport types
 * @access Public
 */
router.get('/types', (req, res) => {
  try {
    res.status(200).json(transportBooking.TRANSPORT_TYPES);
  } catch (error) {
    console.error('Error fetching transport types:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route POST /api/transport/calculate-price
 * @desc Calculate price for a booking
 * @access Public
 */
router.post('/calculate-price', (req, res) => {
  try {
    const { transportType, destination, passengers, roundTrip } = req.body;

    if (!transportType || !destination || !passengers) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const priceDetails = transportBooking.calculatePrice(
      transportType,
      destination,
      parseInt(passengers),
      roundTrip === true || roundTrip === 'true'
    );

    res.status(200).json(priceDetails);
  } catch (error) {
    console.error('Error calculating price:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route POST /api/transport/book
 * @desc Create a new booking
 * @access Private (but allows guest)
 */
router.post('/book', authenticateToken, async (req, res) => {
  try {
    const {
      transportType,
      destination,
      bookingDate,
      passengers,
      contactNumber,
      email,
      roundTrip,
      specialRequests
    } = req.body;

    // Validate required fields
    if (!transportType || !destination || !bookingDate || !passengers || !contactNumber || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create booking data
    const bookingData = {
      userId: req.user.id,
      userName: req.user.name || req.user.email,
      transportType,
      destination,
      bookingDate,
      passengers,
      contactNumber,
      email,
      roundTrip,
      specialRequests
    };

    // Create booking
    const booking = await transportBooking.createBooking(bookingData);

    res.status(201).json({
      message: 'Booking created successfully',
      bookingId: booking.id,
      booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route GET /api/transport/bookings
 * @desc Get user's bookings
 * @access Private (but allows guest)
 */
router.get('/bookings', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching bookings for user:', req.user.id);

    // Get bookings from database
    const bookings = await transportBooking.getUserBookings(req.user.id);
    console.log(`Retrieved ${bookings.length} bookings for user ${req.user.id} from MongoDB`);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route GET /api/transport/booking/:id
 * @desc Get a booking by ID
 * @access Private (but allows guest)
 */
router.get('/booking/:id', authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await transportBooking.getBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the user or is a guest booking
    if (booking.userId !== req.user.id && booking.userId !== 'guest' && req.user.id !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route POST /api/transport/booking/:id/cancel
 * @desc Cancel a booking
 * @access Private (but allows guest)
 */
router.post('/booking/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const success = await transportBooking.cancelBooking(bookingId, req.user.id);

    if (!success) {
      return res.status(404).json({ message: 'Booking not found or unauthorized' });
    }

    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
