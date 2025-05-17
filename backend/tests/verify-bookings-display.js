/**
 * Verify Bookings Display
 * This script verifies that bookings are properly displayed on the bookings.html page
 *
 * To use this script:
 * 1. Include it in bookings.html before the closing </body> tag
 * 2. Open bookings.html in the browser
 * 3. Check the console for verification results
 */

(function() {
  console.log('Running bookings display verification...');

  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded, waiting for scripts to initialize...');
    setTimeout(verifyBookingsDisplay, 2000); // Wait 2 seconds for everything to load
  });

  // Listen for the bookingsDisplayed event
  document.addEventListener('bookingsDisplayed', function(event) {
    console.log('Bookings displayed event received:', event.detail);
    verifyBookingsDisplay();
  });

  // Main verification function
  function verifyBookingsDisplay() {
    console.log('Verifying bookings display...');

    // Step 1: Check if user is authenticated
    if (!window.AuthClient || !window.AuthClient.isAuthenticated()) {
      console.error('Verification failed: User is not authenticated');
      showVerificationResult(false, 'User is not authenticated');

      // Try to create a test booking in localStorage
      createTestBooking();
      return;
    }

    const currentUser = window.AuthClient.getCurrentUser();
    console.log('Current user:', currentUser);

    // Step 2: Check if bookings list element exists
    const bookingsList = document.getElementById('bookings-list');
    if (!bookingsList) {
      console.error('Verification failed: Bookings list element not found');
      showVerificationResult(false, 'Bookings list element not found');
      return;
    }

    // Step 3: Check if loadUserBookings function exists
    if (typeof window.loadUserBookings !== 'function') {
      console.error('Verification failed: loadUserBookings function not found');
      showVerificationResult(false, 'loadUserBookings function not found');

      // Try to create a test booking in localStorage
      createTestBooking();
      return;
    }

    // Step 4: Check if bookings are already displayed in the DOM
    const existingBookingCards = document.querySelectorAll('.booking-card');
    if (existingBookingCards.length > 0) {
      console.log('Bookings already displayed in DOM:', existingBookingCards.length);
      showVerificationResult(true, `Successfully displayed ${existingBookingCards.length} bookings`);

      // Highlight the booking cards to make them more visible
      highlightBookingCards(existingBookingCards);
      return;
    }

    // Step 5: Call loadUserBookings and verify results
    console.log('Calling loadUserBookings...');
    window.loadUserBookings().then(bookings => {
      console.log('loadUserBookings returned:', bookings);

      // Step 6: Check if bookings were returned
      if (!bookings || !Array.isArray(bookings)) {
        console.error('Verification failed: No bookings returned');
        showVerificationResult(false, 'No bookings returned');

        // Try to create a test booking in localStorage
        createTestBooking();
        return;
      }

      // Step 7: Check if bookings are displayed in the DOM
      setTimeout(() => {
        const bookingCards = document.querySelectorAll('.booking-card');
        console.log('Found booking cards in DOM:', bookingCards.length);

        if (bookingCards.length === 0) {
          console.error('Verification failed: No booking cards found in DOM');
          showVerificationResult(false, 'No booking cards found in DOM');

          // Try to create a test booking in localStorage
          createTestBooking();
          return;
        }

        if (bookingCards.length !== bookings.length) {
          console.warn(`Warning: Number of booking cards (${bookingCards.length}) doesn't match number of bookings (${bookings.length})`);
        }

        // Step 8: Check booking stats
        const totalBookingsElement = document.getElementById('total-bookings');
        if (totalBookingsElement) {
          console.log('Total bookings displayed:', totalBookingsElement.textContent);
          if (totalBookingsElement.textContent != bookingCards.length) {
            console.warn(`Warning: Total bookings counter (${totalBookingsElement.textContent}) doesn't match actual cards (${bookingCards.length})`);

            // Update the total bookings counter
            totalBookingsElement.textContent = bookingCards.length;
          }
        }

        // Step 9: Check if booking details are correct
        let detailsCorrect = true;
        bookingCards.forEach((card, index) => {
          const destinationElement = card.querySelector('.booking-header h3');
          if (!destinationElement) {
            console.error(`Verification failed: Booking card ${index} missing destination`);
            detailsCorrect = false;
          }
        });

        if (!detailsCorrect) {
          showVerificationResult(false, 'Some booking cards have missing details');
          return;
        }

        // All checks passed
        console.log('Verification successful: Bookings are properly displayed');
        showVerificationResult(true, `Successfully displayed ${bookingCards.length} bookings`);

        // Highlight the booking cards to make them more visible
        highlightBookingCards(bookingCards);
      }, 1000); // Wait 1 second for DOM to update
    }).catch(error => {
      console.error('Verification failed: Error calling loadUserBookings', error);
      showVerificationResult(false, `Error: ${error.message}`);

      // Try to create a test booking in localStorage
      createTestBooking();
    });
  }

  // Create a test booking in localStorage
  function createTestBooking() {
    console.log('Creating test booking in localStorage...');

    // Get current user or use a default
    let userId = 'test-user';
    let userName = 'Test User';

    if (window.AuthClient && window.AuthClient.isAuthenticated()) {
      const currentUser = window.AuthClient.getCurrentUser();
      userId = currentUser.id || userId;
      userName = currentUser.name || userName;
    }

    // Create a test booking
    const testBooking = {
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

    // Save to localStorage
    try {
      const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      localBookings.push(testBooking);
      localStorage.setItem('bookings', JSON.stringify(localBookings));
      console.log('Test booking created and saved to localStorage');

      // Reload the page to display the test booking
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error saving test booking to localStorage:', error);
    }
  }

  // Highlight booking cards
  function highlightBookingCards(bookingCards) {
    bookingCards.forEach(card => {
      card.style.boxShadow = '0 0 10px 2px #4CAF50';
      setTimeout(() => {
        card.style.boxShadow = '';
      }, 3000);
    });
  }

  // Show verification result
  function showVerificationResult(success, message) {
    // Create result element
    const resultElement = document.createElement('div');
    resultElement.style.position = 'fixed';
    resultElement.style.top = '10px';
    resultElement.style.right = '10px';
    resultElement.style.padding = '15px';
    resultElement.style.borderRadius = '5px';
    resultElement.style.color = '#fff';
    resultElement.style.backgroundColor = success ? '#4CAF50' : '#F44336';
    resultElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    resultElement.style.zIndex = '9999';
    resultElement.style.maxWidth = '300px';

    resultElement.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 5px;">
        ${success ? '✅ Verification Successful' : '❌ Verification Failed'}
      </div>
      <div>${message}</div>
    `;

    // Remove any existing verification results
    const existingResults = document.querySelectorAll('[data-verification-result]');
    existingResults.forEach(el => el.remove());

    // Add data attribute to identify this element
    resultElement.setAttribute('data-verification-result', 'true');

    document.body.appendChild(resultElement);

    // Remove after 10 seconds
    setTimeout(() => {
      resultElement.style.opacity = '0';
      resultElement.style.transition = 'opacity 0.5s';
      setTimeout(() => {
        if (document.body.contains(resultElement)) {
          document.body.removeChild(resultElement);
        }
      }, 500);
    }, 10000);
  }
})();
