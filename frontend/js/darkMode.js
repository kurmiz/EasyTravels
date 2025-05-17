/**
 * Dark Mode Toggle Functionality
 * This script handles the dark mode toggle and persists user preference
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get the dark mode toggle button
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    // Check if user has a preference stored
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    
    // Set initial state based on user preference
    if (isDarkMode) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
    
    // Toggle dark mode when button is clicked
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            // Check if dark mode is currently enabled
            const isDarkMode = document.body.classList.contains('dark-mode');
            
            // Toggle dark mode
            if (isDarkMode) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }
    
    // Function to enable dark mode
    function enableDarkMode() {
        // Add dark mode class to root and body
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
        
        // Update toggle button icon
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="bx bx-sun"></i>';
            darkModeToggle.setAttribute('title', 'Switch to Light Mode');
        }
        
        // Store user preference
        localStorage.setItem('darkMode', 'enabled');
        
        // Dispatch event for other scripts
        document.dispatchEvent(new CustomEvent('darkModeChange', { detail: { isDarkMode: true } }));
    }
    
    // Function to disable dark mode
    function disableDarkMode() {
        // Remove dark mode class from root and body
        document.documentElement.classList.remove('dark-mode');
        document.body.classList.remove('dark-mode');
        
        // Update toggle button icon
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="bx bx-moon"></i>';
            darkModeToggle.setAttribute('title', 'Switch to Dark Mode');
        }
        
        // Store user preference
        localStorage.setItem('darkMode', 'disabled');
        
        // Dispatch event for other scripts
        document.dispatchEvent(new CustomEvent('darkModeChange', { detail: { isDarkMode: false } }));
    }
    
    // Listen for system preference changes
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Function to handle system preference change
    function handleSystemPreferenceChange(e) {
        // Only apply system preference if user hasn't manually set a preference
        if (!localStorage.getItem('darkMode')) {
            if (e.matches) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        }
    }
    
    // Add listener for system preference changes
    prefersDarkScheme.addEventListener('change', handleSystemPreferenceChange);
    
    // Apply system preference on initial load if no user preference
    if (!localStorage.getItem('darkMode')) {
        if (prefersDarkScheme.matches) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    }
});
