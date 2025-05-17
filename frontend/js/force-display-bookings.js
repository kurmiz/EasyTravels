/**
 * Force Display Bookings
 * This script forces the display of bookings by creating a test booking and displaying it
 * 
 * To use this script:
 * 1. Include it in bookings.html before the closing </body> tag
 * 2. Open bookings.html in the browser
 * 3. The script will automatically create and display a test booking
 */

(function() {
  console.log('Force display bookings script loaded');
  
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded, waiting for scripts to initialize...');
    setTimeout(forceDisplayBookings, 1000);
  });
  
  // Main function to force display bookings
  function forceDisplayBookings() {
    console.log('Forcing display of bookings...');
    
    // Create a test booking
    const testBooking = createTestBooking();
    
    // Save to localStorage
    saveBookingToLocalStorage(testBooking);
    
    // Display the booking
    displayBooking(testBooking);
  }
  
  // Create a test booking
  function createTestBooking() {
    console.log('Creating test booking...');
    
    // Get current user or use a default
    let userId = 'test-user';
    let userName = 'Test User';
    
    if (window.AuthClient && window.AuthClient.isAuthenticated()) {
      const currentUser = window.AuthClient.getCurrentUser();
      userId = currentUser.id || userId;
      userName = currentUser.name || userName;
    }
    
    // Create a test booking
    return {
      id: 'test-booking-' + Date.now(),
      userId: userId,
      userName: userName,
      transportType: 'car',
      transportName: 'Car Rental',
      destination: 'lumbini',
      destinationName: 'Lumbini',
      bookingDate: new Date().toISOString().split('T')[0],
      passengers: 2,
      roundTrip: true,
      contactNumber: '1234567890',
      specialRequests: 'Test booking',
      priceDetails: {
        basePrice: 3000,
        distancePrice: 540,
        passengerMultiplier: 1.5,
        roundTrip: true,
        totalPrice: 10620
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      savedLocally: true
    };
  }
  
  // Save booking to localStorage
  function saveBookingToLocalStorage(booking) {
    try {
      const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      localBookings.push(booking);
      localStorage.setItem('bookings', JSON.stringify(localBookings));
      console.log('Test booking saved to localStorage');
    } catch (error) {
      console.error('Error saving test booking to localStorage:', error);
    }
  }
  
  // Display the booking
  function displayBooking(booking) {
    console.log('Displaying test booking...');
    
    // Get the bookings list element
    const bookingsList = document.getElementById('bookings-list');
    if (!bookingsList) {
      console.error('Bookings list element not found');
      return;
    }
    
    // Hide the "no bookings" message
    const noBookingsElement = document.querySelector('.no-bookings');
    if (noBookingsElement) {
      noBookingsElement.style.display = 'none';
    }
    
    // Create the booking card
    const bookingCard = document.createElement('div');
    bookingCard.className = `booking-card ${booking.status || 'pending'}`;
    bookingCard.innerHTML = `
      <div class="booking-header">
        <h3>${booking.destinationName}</h3>
        <span class="booking-status ${booking.status || 'pending'}">${booking.status || 'pending'}</span>
      </div>
      <div class="booking-info">
        <p><i class='bx bx-calendar'></i> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
        <p><i class='bx bx-car'></i> ${booking.transportName}</p>
        <p><i class='bx bx-group'></i> ${booking.passengers} passenger(s)</p>
        <p><i class='bx bx-money'></i> NPR ${booking.priceDetails.totalPrice}</p>
      </div>
      <div class="booking-actions">
        <button class="btn-small view-details" data-id="${booking.id}">View Details</button>
        ${booking.status === 'pending' ? `<button class="btn-small btn-outline cancel-booking" data-id="${booking.id}">Cancel</button>` : ''}
      </div>
    `;
    
    // Add the booking card to the list
    bookingsList.appendChild(bookingCard);
    
    // Update booking stats
    updateBookingStats();
    
    console.log('Test booking displayed');
    
    // Show success message
    showMessage('Test booking displayed successfully');
  }
  
  // Update booking stats
  function updateBookingStats() {
    const bookingCards = document.querySelectorAll('.booking-card');
    
    // Update total bookings
    const totalBookingsElement = document.getElementById('total-bookings');
    if (totalBookingsElement) {
      totalBookingsElement.textContent = bookingCards.length;
    }
    
    // Update pending bookings
    const pendingBookingsElement = document.getElementById('pending-bookings');
    if (pendingBookingsElement) {
      const pendingBookings = document.querySelectorAll('.booking-card.pending').length;
      pendingBookingsElement.textContent = pendingBookings;
    }
    
    // Update confirmed bookings
    const confirmedBookingsElement = document.getElementById('confirmed-bookings');
    if (confirmedBookingsElement) {
      const confirmedBookings = document.querySelectorAll('.booking-card.confirmed').length;
      confirmedBookingsElement.textContent = confirmedBookings;
    }
    
    // Update cancelled bookings
    const cancelledBookingsElement = document.getElementById('cancelled-bookings');
    if (cancelledBookingsElement) {
      const cancelledBookings = document.querySelectorAll('.booking-card.cancelled').length;
      cancelledBookingsElement.textContent = cancelledBookings;
    }
  }
  
  // Show message
  function showMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.style.position = 'fixed';
    messageElement.style.top = '10px';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translateX(-50%)';
    messageElement.style.padding = '15px 20px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.backgroundColor = '#4CAF50';
    messageElement.style.color = 'white';
    messageElement.style.fontWeight = 'bold';
    messageElement.style.zIndex = '9999';
    messageElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    messageElement.textContent = message;
    
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
      messageElement.style.opacity = '0';
      messageElement.style.transition = 'opacity 0.5s';
      setTimeout(() => {
        document.body.removeChild(messageElement);
      }, 500);
    }, 3000);
  }
})();
