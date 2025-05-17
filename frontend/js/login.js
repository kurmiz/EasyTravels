/**
 * JavaScript for Login Page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already authenticated
    if (window.AuthClient && window.AuthClient.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');

    // Get redirect URL from query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect') || 'index.html';

    // Toggle password visibility
    passwordToggle.addEventListener('click', function() {
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            this.classList.remove('bx-hide');
            this.classList.add('bx-show');
        } else {
            passwordField.type = 'password';
            this.classList.remove('bx-show');
            this.classList.add('bx-hide');
        }
    });

    // Form validation
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Reset previous error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(message => message.remove());

        let isValid = true;

        // Validate email
        const email = emailField.value.trim();
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
            showError('password', 'Please enter your password');
            isValid = false;
        }

        // If form is valid, submit it
        if (isValid) {
            // Show loading state
            const loginBtn = document.querySelector('.login-btn');
            const originalBtnText = loginBtn.textContent;
            loginBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Logging in...';
            loginBtn.disabled = true;

            // For demo purposes, we'll use a simulated login
            // In a real application, you would use the AuthClient.login method
            if (window.AuthClient) {
                // Use the actual authentication service
                window.AuthClient.login(email, password)
                    .then(() => {
                        showSuccessMessage();
                        setTimeout(() => {
                            window.location.href = redirectUrl;
                        }, 1500);
                    })
                    .catch(error => {
                        showLoginError(error.message);
                        loginBtn.innerHTML = originalBtnText;
                        loginBtn.disabled = false;
                    });
            } else {
                // Fallback to demo login for testing
                setTimeout(() => {
                    if (email === 'demo@example.com' && password === 'password123') {
                        // Simulate saving auth data
                        localStorage.setItem('auth', JSON.stringify({
                            token: 'demo-token',
                            user: { email, name: 'Demo User' },
                            sessionId: 'demo-session',
                            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                        }));

                        showSuccessMessage();
                        setTimeout(() => {
                            window.location.href = redirectUrl;
                        }, 1500);
                    } else {
                        showLoginError();
                        loginBtn.innerHTML = originalBtnText;
                        loginBtn.disabled = false;
                    }
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

        field.parentElement.parentElement.appendChild(errorDiv);

        // Add error class to input
        field.classList.add('error');
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
            <p>Login successful! Redirecting to home page...</p>
        `;

        // Insert before the form
        loginForm.parentElement.insertBefore(successMessage, loginForm);

        // Hide the form
        loginForm.style.display = 'none';
    }

    // Helper function to show login error
    function showLoginError() {
        // Create error message at the top of the form
        const loginError = document.createElement('div');
        loginError.className = 'login-error';
        loginError.innerHTML = `
            <i class='bx bx-error-circle'></i>
            <p>Invalid email or password. Please try again.</p>
            <p class="hint">Hint: Use demo@example.com / password123</p>
        `;

        // Insert at the top of the form
        loginForm.insertBefore(loginError, loginForm.firstChild);

        // Shake the form to indicate error
        loginForm.classList.add('shake');
        setTimeout(() => {
            loginForm.classList.remove('shake');
        }, 500);
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

        input.error {
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

        .login-error {
            background-color: rgba(231, 76, 60, 0.1);
            border-left: 4px solid var(--error-color);
            color: var(--error-color);
            padding: 15px;
            border-radius: var(--border-radius-sm);
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .login-error i {
            font-size: 2rem;
            margin-bottom: 10px;
        }

        .login-error .hint {
            font-size: 0.8rem;
            margin-top: 5px;
            color: var(--text-muted);
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .shake {
            animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        .bx-spin {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
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

    // Focus on email field when page loads
    emailField.focus();
});
