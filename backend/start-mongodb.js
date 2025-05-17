/**
 * MongoDB Starter Script
 * This script checks if MongoDB is running and starts it if it's not
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// MongoDB paths for different operating systems
const mongoDBPaths = {
  win32: {
    // Common MongoDB installation paths on Windows
    paths: [
      'C:\\Program Files\\MongoDB\\Server\\6.0\\bin\\mongod.exe',
      'C:\\Program Files\\MongoDB\\Server\\5.0\\bin\\mongod.exe',
      'C:\\Program Files\\MongoDB\\Server\\4.4\\bin\\mongod.exe',
      'C:\\Program Files\\MongoDB\\Server\\4.2\\bin\\mongod.exe'
    ],
    dbPath: path.join(os.homedir(), 'mongodb-data')
  },
  linux: {
    paths: ['/usr/bin/mongod'],
    dbPath: '/var/lib/mongodb'
  },
  darwin: { // macOS
    paths: ['/usr/local/bin/mongod'],
    dbPath: '/data/db'
  }
};

// Get MongoDB path based on operating system
function getMongoDBPath() {
  const platform = os.platform();
  const paths = mongoDBPaths[platform]?.paths || [];
  
  for (const p of paths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  
  return null;
}

// Check if MongoDB is running
function isMongoDBRunning() {
  return new Promise((resolve) => {
    const command = os.platform() === 'win32' 
      ? 'tasklist | findstr mongod' 
      : 'ps aux | grep mongod | grep -v grep';
    
    exec(command, (error, stdout) => {
      if (error) {
        resolve(false);
        return;
      }
      
      resolve(stdout.trim().length > 0);
    });
  });
}

// Start MongoDB
function startMongoDB() {
  return new Promise((resolve, reject) => {
    const mongoPath = getMongoDBPath();
    
    if (!mongoPath) {
      reject(new Error('MongoDB executable not found. Please install MongoDB.'));
      return;
    }
    
    const platform = os.platform();
    const dbPath = mongoDBPaths[platform]?.dbPath || '';
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dbPath)) {
      try {
        fs.mkdirSync(dbPath, { recursive: true });
      } catch (error) {
        console.error(`Error creating MongoDB data directory: ${error.message}`);
      }
    }
    
    const command = `"${mongoPath}" --dbpath "${dbPath}"`;
    
    console.log(`Starting MongoDB with command: ${command}`);
    
    const mongoProcess = exec(command, (error) => {
      if (error) {
        reject(error);
        return;
      }
    });
    
    mongoProcess.stdout.on('data', (data) => {
      console.log(`MongoDB: ${data.trim()}`);
      if (data.includes('waiting for connections')) {
        resolve(true);
      }
    });
    
    mongoProcess.stderr.on('data', (data) => {
      console.error(`MongoDB Error: ${data.trim()}`);
    });
    
    // Resolve after a timeout if not resolved by stdout
    setTimeout(() => {
      resolve(true);
    }, 5000);
  });
}

// Main function
async function main() {
  try {
    console.log('Checking if MongoDB is running...');
    const isRunning = await isMongoDBRunning();
    
    if (isRunning) {
      console.log('MongoDB is already running.');
      return true;
    }
    
    console.log('MongoDB is not running. Attempting to start...');
    await startMongoDB();
    console.log('MongoDB started successfully.');
    return true;
  } catch (error) {
    console.error(`Error starting MongoDB: ${error.message}`);
    return false;
  }
}

// Export the main function
module.exports = main;

// If this script is run directly, execute the main function
if (require.main === module) {
  main().then((success) => {
    if (!success) {
      process.exit(1);
    }
  });
}
