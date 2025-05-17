/**
 * JavaScript for Signup Page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already authenticated
    if (window.AuthClient && window.AuthClient.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    // DOM Elements
    const signupForm = document.getElementById('signup-form');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirm-password');
    const passwordToggles = document.querySelectorAll('.password-toggle');

    // Toggle password visibility
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;

            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('bx-hide');
                this.classList.add('bx-show');
            } else {
                input.type = 'password';
                this.classList.remove('bx-show');
                this.classList.add('bx-hide');
            }
        });
    });

    // Form validation
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Reset previous error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(message => message.remove());

        let isValid = true;

        // Validate full name
        const fullname = document.getElementById('fullname').value.trim();
        if (fullname === '') {
            showError('fullname', 'Please enter your full name');
            isValid = false;
        }

        // Validate email
        const email = document.getElementById('email').value.trim();
        if (email === '') {
            showError('email', 'Please enter your email address');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate password
        const password = passwordField.value;
        if (password === '') {
            showError('password', 'Please create a password');
            isValid = false;
        } else if (password.length < 8) {
            showError('password', 'Password must be at least 8 characters long');
            isValid = false;
        }

        // Validate confirm password
        const confirmPassword = confirmPasswordField.value;
        if (confirmPassword === '') {
            showError('confirm-password', 'Please confirm your password');
            isValid = false;
        } else if (confirmPassword !== password) {
            showError('confirm-password', 'Passwords do not match');
            isValid = false;
        }

        // Validate country selection
        const country = document.getElementById('country').value;
        if (country === '') {
            showError('country', 'Please select your country');
            isValid = false;
        }

        // Validate terms checkbox
        const termsChecked = document.getElementById('terms').checked;
        if (!termsChecked) {
            showError('terms', 'You must agree to the Terms of Service and Privacy Policy');
            isValid = false;
        }

        // If form is valid, submit it
        if (isValid) {
            // Prepare user data
            const userData = {
                fullname,
                email,
                password,
                country
            };

            // Show loading state
            const signupBtn = document.querySelector('.signup-btn');
            const originalBtnText = signupBtn.textContent;
            signupBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Creating Account...';
            signupBtn.disabled = true;

            // For demo purposes, we'll use a simulated registration
            // In a real application, you would use the AuthClient.register method
            if (window.AuthClient) {
                // Use the actual authentication service
                window.AuthClient.register(userData)
                    .then(() => {
                        showSuccessMessage();
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1500);
                    })
                    .catch(error => {
                        showError('email', error.message || 'Registration failed');
                        signupBtn.innerHTML = originalBtnText;
                        signupBtn.disabled = false;
                    });
            } else {
                // Fallback to demo registration for testing
                setTimeout(() => {
                    // Simulate saving auth data
                    localStorage.setItem('auth', JSON.stringify({
                        token: 'demo-token',
                        user: { email, name: fullname, country },
                        sessionId: 'demo-session',
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                    }));

                    showSuccessMessage();
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                }, 1500);
            }
        }
    });

    // Helper function to show error message
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        if (fieldId === 'terms') {
            field.parentElement.appendChild(errorDiv);
        } else {
            field.parentElement.parentElement.appendChild(errorDiv);
        }

        // Add error class to input
        if (fieldId !== 'terms') {
            field.classList.add('error');
        }
    }

    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Helper function to show success message
    function showSuccessMessage() {
        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class='bx bx-check-circle'></i>
            <p>Account created successfully! Redirecting to login page...</p>
        `;

        // Insert before the form
        signupForm.parentElement.insertBefore(successMessage, signupForm);

        // Hide the form
        signupForm.style.display = 'none';
    }

    // Add CSS for error and success messages
    const style = document.createElement('style');
    style.textContent = `
        .error-message {
            color: var(--error-color);
            font-size: 0.8rem;
            margin-top: 5px;
            display: flex;
            align-items: center;
        }

        .error-message::before {
            content: '⚠️';
            margin-right: 5px;
        }

        input.error, select.error {
            border-color: var(--error-color) !important;
        }

        .success-message {
            background-color: var(--success-color);
            color: white;
            padding: 20px;
            border-radius: var(--border-radius-md);
            text-align: center;
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            animation: fadeIn 0.5s ease-out;
        }

        .success-message i {
            font-size: 3rem;
            margin-bottom: 10px;
        }
    `;
    document.head.appendChild(style);

    // Remove preloader when page is loaded
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.display = 'none';
        });
    }
});
