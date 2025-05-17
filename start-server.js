/**
 * EasyTravel Server Starter
 * This script starts the backend server from the root directory
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Path to the backend directory
const backendDir = path.join(__dirname, 'backend');
const serverPath = path.join(backendDir, 'server.js');

// Check if server.js exists
if (!fs.existsSync(serverPath)) {
  console.error(`Error: Server file not found at ${serverPath}`);
  process.exit(1);
}

console.log('Starting EasyTravel server...');
console.log(`Server path: ${serverPath}`);

// Spawn the server process
const serverProcess = spawn('node', [serverPath], {
  cwd: backendDir,
  stdio: 'inherit'
});

// Handle process events
serverProcess.on('error', (err) => {
  console.error('Failed to start server:', err);
});

serverProcess.on('close', (code) => {
  if (code !== 0) {
    console.log(`Server process exited with code ${code}`);
  }
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Stopping server...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Stopping server...');
  serverProcess.kill('SIGTERM');
});
