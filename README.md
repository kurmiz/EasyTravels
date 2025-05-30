# Bhairahawa Tourism Website

A tourism website for Bhairahawa, the gateway to Lumbini - birthplace of Lord Buddha. This website includes authentication features that restrict access to the main content until users sign up or log in.

## Features

- User authentication (signup, login, logout)
- Protected routes that require authentication
- MongoDB integration for user data storage
- Responsive design for all device sizes
- Tourism information about Bhairahawa and surrounding areas

## Project Structure

```
bhairahawa-tourism/
├── auth/                  # Authentication-related files
│   ├── auth.js            # Authentication service
│   ├── config.js          # Configuration settings
│   ├── db.js              # MongoDB connection
│   └── userModel.js       # User model and functions
├── js/                    # Client-side JavaScript
│   ├── authCheck.js       # Authentication check script
│   ├── authClient.js      # Client-side authentication utilities
│   └── userMenu.js        # User menu functionality
├── images/                # Image files
├── index.html             # Main content page (protected)
├── landing.html           # Landing page (public)
├── login.html             # Login page
├── signup.html            # Signup page
├── main.css               # Main CSS file
├── landing.css            # Landing page CSS
├── login.css              # Login page CSS
├── signup.css             # Signup page CSS
├── main.js                # Main JavaScript file
├── login.js               # Login page JavaScript
├── signup.js              # Signup page JavaScript
├── server.js              # Express server
├── package.json           # Project dependencies
└── README.md              # Project documentation
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/bhairahawa-tourism.git
   cd bhairahawa-tourism
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure MongoDB:
   - Make sure MongoDB is running on your system
   - Update the MongoDB connection string in `auth/config.js` if needed

4. Start the server:
   ```
   npm start
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Development

For development with automatic server restart:
```
npm run dev
```

## Authentication Flow

1. Users visit the landing page
2. They can either sign up or log in
3. After successful authentication, they are redirected to the main content
4. If they try to access protected pages directly, they are redirected to the login page
5. Users can log out, which will clear their session

## Demo Account

For testing purposes, you can use the following demo account:
- Email: demo@example.com
- Password: password123

## Technologies Used

- HTML, CSS, JavaScript (Vanilla)
- MongoDB for database
- Express.js for server
- JWT for authentication tokens
- bcrypt.js for password hashing

## License

This project is licensed under the MIT License - see the LICENSE file for details.
#   E a s y T r a v e l  
 