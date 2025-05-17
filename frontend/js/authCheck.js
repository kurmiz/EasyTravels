/**
 * Authentication Check Script
 * This script checks if the user is authenticated and redirects to login if not
 */

(function() {
  // Check if AuthClient is available
  if (window.AuthClient) {
    // Check if user is authenticated
    if (!window.AuthClient.isAuthenticated()) {
      // Redirect to login page
      const currentPage = window.location.pathname.split('/').pop();
      window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
    }
  } else {
    // Fallback for when AuthClient is not available
    const authData = localStorage.getItem('auth');
    if (!authData) {
      // Redirect to login page
      const currentPage = window.location.pathname.split('/').pop();
      window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
    } else {
      try {
        const parsedAuthData = JSON.parse(authData);
        const expiresAt = new Date(parsedAuthData.expiresAt);
        
        // Check if token is expired
        if (new Date() > expiresAt) {
          localStorage.removeItem('auth');
          const currentPage = window.location.pathname.split('/').pop();
          window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
        }
      } catch (error) {
        localStorage.removeItem('auth');
        const currentPage = window.location.pathname.split('/').pop();
        window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
      }
    }
  }
})();
