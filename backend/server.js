/**
 * Bhairahawa Tourism Website Server
 * This file contains the server code for the website
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { connectToDatabase } = require('./auth/db');
const auth = require('./auth/auth');
const userModel = require('./auth/userModel');
const startMongoDB = require('./start-mongodb');

// Import routes
const transportRoutes = require('./routes/transportRoutes');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB and start server
async function startServer() {
  try {
    // Start MongoDB if it's not running
    console.log('Ensuring MongoDB is running...');
    const mongoStarted = await startMongoDB();

    if (!mongoStarted) {
      console.error('Failed to start MongoDB. Please start it manually.');
      process.exit(1);
    }

    // Connect to MongoDB
    await connectToDatabase();
    console.log('Connected to MongoDB successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    console.log('MongoDB connection error. Please make sure MongoDB is running.');
    process.exit(1);
  }
}

// API Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const userData = req.body;
    const result = await auth.register(userData);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await auth.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    const { sessionId } = req.body;
    await auth.logout(sessionId);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const decoded = await auth.verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  req.user = decoded;
  next();
};

// Protected routes
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await userModel.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Authentication check endpoint
app.get('/api/auth/check', authenticateToken, (req, res) => {
  try {
    console.log('Auth check for user:', req.user);

    // Special handling for demo token
    if (req.user.id === 'demo-user-id') {
      return res.status(200).json({
        authenticated: true,
        user: {
          id: 'demo-user-id',
          email: 'demo@example.com',
          name: 'Demo User'
        },
        message: 'Demo authentication is working'
      });
    }

    // Regular authentication
    res.status(200).json({
      authenticated: true,
      user: req.user,
      message: 'Authentication is working'
    });
  } catch (error) {
    console.error('Error in auth check:', error);
    res.status(500).json({
      authenticated: false,
      message: error.message
    });
  }
});

// API Status Endpoints
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/db-status', async (req, res) => {
  try {
    // Check if we can get a collection from the database
    const collection = await require('./auth/db').getCollection('users');
    const count = await collection.countDocuments();

    res.status(200).json({
      connected: true,
      message: 'Database is connected',
      collections: {
        users: {
          count: count
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking database status:', error);
    res.status(500).json({
      connected: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});



// Use transport routes
app.use('/api/transport', transportRoutes);

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/landing.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/signup.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/signup.html'));
});

app.get('/bookings.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/bookings.html'));
});

app.get('/chatbot.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/chatbot.html'));
});

app.get('/nightlife.html', (req, res) => {
  console.log('Accessing nightlife.html');
  const filePath = path.join(__dirname, '../frontend/nightlife.html');
  console.log('File path:', filePath);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending nightlife.html:', err);
      res.status(err.status).end();
    } else {
      console.log('Successfully sent nightlife.html');
    }
  });
});

app.get('/test.html', (req, res) => {
  console.log('Accessing test.html');
  const filePath = path.join(__dirname, '../frontend/test.html');
  console.log('File path:', filePath);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending test.html:', err);
      res.status(err.status).end();
    } else {
      console.log('Successfully sent test.html');
    }
  });
});

// Catch-all route for any other requests to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start the server
startServer();
