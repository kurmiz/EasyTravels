/**
 * User Menu JavaScript
 * This file handles the user menu functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const userNameElement = document.getElementById('user-name');
  const logoutButton = document.getElementById('logout-btn');
  
  // Get current user
  let currentUser = null;
  
  if (window.AuthClient) {
    currentUser = window.AuthClient.getCurrentUser();
  } else {
    // Fallback for when AuthClient is not available
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsedAuthData = JSON.parse(authData);
        currentUser = parsedAuthData.user;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  }
  
  // Update user name in the header
  if (currentUser) {
    userNameElement.textContent = currentUser.name || currentUser.fullname || currentUser.email;
  }
  
  // Handle logout
  if (logoutButton) {
    logoutButton.addEventListener('click', function() {
      if (window.AuthClient) {
        window.AuthClient.logout()
          .then(() => {
            window.location.href = 'login.html';
          })
          .catch(error => {
            console.error('Error logging out:', error);
            // Fallback to clearing local storage
            localStorage.removeItem('auth');
            window.location.href = 'login.html';
          });
      } else {
        // Fallback for when AuthClient is not available
        localStorage.removeItem('auth');
        window.location.href = 'login.html';
      }
    });
  }
});
