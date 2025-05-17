/**
 * Test Browser Flow
 * This script tests the entire booking flow in the browser
 * 
 * To use this script:
 * 1. Open the browser console on the homepage
 * 2. Copy and paste this entire script into the console
 * 3. Press Enter to run the test
 */

(async function() {
  console.log('Starting browser flow test...');
  
  // Helper function to wait for a specified time
  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Helper function to scroll to an element
  function scrollToElement(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return wait(1000);
  }
  
  // Helper function to highlight an element
  function highlightElement(element, color = '#4CAF50') {
    const originalOutline = element.style.outline;
    const originalBoxShadow = element.style.boxShadow;
    
    element.style.outline = `3px solid ${color}`;
    element.style.boxShadow = `0 0 10px ${color}`;
    
    return {
      reset: () => {
        element.style.outline = originalOutline;
        element.style.boxShadow = originalBoxShadow;
      }
    };
  }
  
  // Helper function to show a message
  function showMessage(message, isSuccess = true) {
    const messageElement = document.createElement('div');
    messageElement.style.position = 'fixed';
    messageElement.style.top = '10px';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translateX(-50%)';
    messageElement.style.padding = '15px 20px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.backgroundColor = isSuccess ? '#4CAF50' : '#F44336';
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
  
  try {
    // Step 1: Check if we're on the homepage
    if (!window.location.pathname.endsWith('/') && !window.location.pathname.endsWith('/index.html')) {
      console.log('Not on homepage, redirecting...');
      window.location.href = '/';
      return;
    }
    
    // Step 2: Check if user is authenticated
    if (!window.AuthClient || !window.AuthClient.isAuthenticated()) {
      console.log('User not authenticated, logging in as demo user...');
      
      // Try to find login link
      const loginLink = Array.from(document.querySelectorAll('a')).find(a => 
        a.textContent.toLowerCase().includes('login') || 
        a.href.toLowerCase().includes('login.html')
      );
      
      if (loginLink) {
        loginLink.click();
        return;
      } else {
        // If no login link, try to use the AuthClient directly
        try {
          await window.AuthClient.login('demo@example.com', 'password123');
          console.log('Logged in as demo user');
          showMessage('Logged in as demo user');
          await wait(1000);
        } catch (error) {
          console.error('Failed to login:', error);
          showMessage('Failed to login', false);
          return;
        }
      }
    }
    
    console.log('User is authenticated:', window.AuthClient.getCurrentUser());
    
    // Step 3: Find the transport section
    const transportSection = document.getElementById('transport');
    if (!transportSection) {
      console.error('Transport section not found');
      showMessage('Transport section not found', false);
      return;
    }
    
    await scrollToElement(transportSection);
    const highlight = highlightElement(transportSection);
    console.log('Found transport section');
    
    // Step 4: Find the booking form
    const bookingForm = document.getElementById('booking-form');
    if (!bookingForm) {
      console.error('Booking form not found');
      highlight.reset();
      showMessage('Booking form not found', false);
      return;
    }
    
    await scrollToElement(bookingForm);
    highlight.reset();
    const formHighlight = highlightElement(bookingForm);
    console.log('Found booking form');
    
    // Step 5: Fill out the form
    const transportTypeSelect = document.getElementById('transport-type');
    const destinationSelect = document.getElementById('destination');
    const bookingDateInput = document.getElementById('booking-date');
    const passengersInput = document.getElementById('passengers');
    const roundTripCheckbox = document.getElementById('round-trip');
    const contactNumberInput = document.getElementById('contact-number');
    const specialRequestsInput = document.getElementById('special-requests');
    
    if (!transportTypeSelect || !destinationSelect || !bookingDateInput || 
        !passengersInput || !roundTripCheckbox || !contactNumberInput) {
      console.error('Form fields not found');
      formHighlight.reset();
      showMessage('Form fields not found', false);
      return;
    }
    
    // Fill transport type
    transportTypeSelect.value = 'car';
    transportTypeSelect.dispatchEvent(new Event('change'));
    highlightElement(transportTypeSelect, '#2196F3');
    await wait(500);
    
    // Fill destination
    destinationSelect.value = 'lumbini';
    destinationSelect.dispatchEvent(new Event('change'));
    highlightElement(destinationSelect, '#2196F3');
    await wait(500);
    
    // Fill booking date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    bookingDateInput.value = tomorrowString;
    bookingDateInput.dispatchEvent(new Event('change'));
    highlightElement(bookingDateInput, '#2196F3');
    await wait(500);
    
    // Fill passengers
    passengersInput.value = '2';
    passengersInput.dispatchEvent(new Event('input'));
    highlightElement(passengersInput, '#2196F3');
    await wait(500);
    
    // Check round trip
    roundTripCheckbox.checked = true;
    roundTripCheckbox.dispatchEvent(new Event('change'));
    highlightElement(roundTripCheckbox, '#2196F3');
    await wait(500);
    
    // Fill contact number
    contactNumberInput.value = '1234567890';
    contactNumberInput.dispatchEvent(new Event('input'));
    highlightElement(contactNumberInput, '#2196F3');
    await wait(500);
    
    // Fill special requests
    if (specialRequestsInput) {
      specialRequestsInput.value = 'Test booking from browser flow';
      specialRequestsInput.dispatchEvent(new Event('input'));
      highlightElement(specialRequestsInput, '#2196F3');
      await wait(500);
    }
    
    console.log('Form filled out');
    
    // Step 6: Submit the form
    const submitButton = bookingForm.querySelector('button[type="submit"]');
    if (!submitButton) {
      console.error('Submit button not found');
      formHighlight.reset();
      showMessage('Submit button not found', false);
      return;
    }
    
    await scrollToElement(submitButton);
    highlightElement(submitButton, '#FF5722');
    console.log('Submitting form...');
    
    // Create a submit event
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    bookingForm.dispatchEvent(submitEvent);
    
    // Wait for submission to complete
    await wait(3000);
    formHighlight.reset();
    
    // Step 7: Check if submission was successful
    const notification = document.querySelector('.notification');
    if (notification && notification.classList.contains('success')) {
      console.log('Booking submitted successfully');
      showMessage('Booking submitted successfully');
    } else {
      console.warn('Booking submission result unclear, checking bookings page...');
    }
    
    // Step 8: Navigate to bookings page
    console.log('Navigating to bookings page...');
    window.location.href = 'bookings.html';
    
  } catch (error) {
    console.error('Test failed:', error);
    showMessage('Test failed: ' + error.message, false);
  }
})();
