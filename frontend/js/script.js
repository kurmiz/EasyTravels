/**
 * Main JavaScript file for Bhairahawa Tourism Website
 * Features:
 * - Header scroll effect
 * - Mobile menu toggle
 * - Smooth scrolling
 * - Animations
 * - Form handling
 * - Image lazy loading
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect with throttling for performance
    const header = document.querySelector("header");
    let scrollTimeout;

    function handleScroll() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        // Add sticky class when scrolling down
        header.classList.toggle("sticky", scrollTop > 80);

        // Clear timeout if it exists
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        // Set new timeout
        scrollTimeout = setTimeout(() => {
            // This code runs after scrolling has stopped
        }, 200);
    }

    // Throttle scroll event for better performance
    window.addEventListener("scroll", function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                handleScroll();
                scrollTimeout = null;
            }, 10);
        }
    });

    // Mobile menu toggle
    const menu = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');

    if (menu && navbar) {
        menu.addEventListener('click', () => {
            menu.classList.toggle('bx-x');
            navbar.classList.toggle('open');

            // Prevent body scrolling when menu is open
            if (navbar.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !navbar.contains(e.target) && navbar.classList.contains('open')) {
                menu.classList.remove('bx-x');
                navbar.classList.remove('open');
                document.body.style.overflow = '';
            }
        });

        // Close menu when scrolling
        window.addEventListener('scroll', () => {
            if (navbar.classList.contains('open')) {
                menu.classList.remove('bx-x');
                navbar.classList.remove('open');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on a nav link
        const navLinks = navbar.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('open');
                menu.classList.remove('bx-x');
                document.body.style.overflow = '';
            });
        });
    }

    // Initialize ScrollReveal animations if the library is loaded
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            distance: '60px',
            duration: 2500,
            delay: 400,
            reset: false  // Changed to false to prevent animations from resetting when scrolling
        });

        // Home section animations
        sr.reveal('.home-text', {delay: 200, origin: 'left'});
        sr.reveal('.home-img', {delay: 200, origin: 'right'});

        // Other section animations
        sr.reveal('.main-text', {delay: 100, origin: 'top'});
        sr.reveal('.container-box, .about-img, .about-text, .place-card', {delay: 300, origin: 'bottom', interval: 200});
        sr.reveal('.contact-content', {delay: 200, origin: 'left', interval: 200});

        // New sections animations
        sr.reveal('.chatbot-button', {delay: 500, origin: 'bottom'});
        sr.reveal('.social-links a', {delay: 300, origin: 'top', interval: 100});
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip empty links

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Close mobile menu after clicking a link
                if (menu && navbar) {
                    menu.classList.remove('bx-x');
                    navbar.classList.remove('open');
                }
            }
        });
    });

    // Testimonial Slider
    const testimonialContainers = document.querySelectorAll('.testimonial-container');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dots = document.querySelectorAll('.dot');

    if (testimonialContainers.length > 0 && testimonialCards.length > 0 && prevBtn && nextBtn) {
        let currentIndex = 0;
        let currentContainerIndex = 0;
        const totalContainers = testimonialContainers.length;
        const cardsPerContainer = testimonialCards.length / totalContainers;

        // Show the first container, hide others
        testimonialContainers.forEach((container, index) => {
            if (index === 0) {
                container.style.display = 'flex';
            } else {
                container.style.display = 'none';
            }
        });

        function updateSlider() {
            // Calculate which container and which slide within container
            currentContainerIndex = Math.floor(currentIndex / cardsPerContainer);
            const slideIndexInContainer = currentIndex % cardsPerContainer;

            // Hide all containers, show current one
            testimonialContainers.forEach((container, index) => {
                if (index === currentContainerIndex) {
                    container.style.display = 'flex';
                    container.style.transform = `translateX(-${slideIndexInContainer * 100}%)`;
                } else {
                    container.style.display = 'none';
                }
            });

            // Update dots
            if (dots) {
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }
        }

        // Initialize slider
        updateSlider();

        // Auto slide functionality
        let autoSlideInterval;

        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % testimonialCards.length;
                updateSlider();
            }, 5000); // Change slide every 5 seconds
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        // Start auto slide on page load
        startAutoSlide();

        // Pause auto slide when hovering over testimonial containers
        testimonialContainers.forEach(container => {
            container.addEventListener('mouseenter', stopAutoSlide);
            container.addEventListener('mouseleave', startAutoSlide);
        });

        // Next button click
        nextBtn.addEventListener('click', () => {
            stopAutoSlide(); // Stop auto slide when user interacts
            currentIndex = (currentIndex + 1) % testimonialCards.length;
            updateSlider();
            startAutoSlide(); // Restart auto slide
        });

        // Previous button click
        prevBtn.addEventListener('click', () => {
            stopAutoSlide(); // Stop auto slide when user interacts
            currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
            updateSlider();
            startAutoSlide(); // Restart auto slide
        });

        // Dot clicks
        if (dots) {
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    stopAutoSlide(); // Stop auto slide when user interacts
                    currentIndex = index;
                    updateSlider();
                    startAutoSlide(); // Restart auto slide
                });
            });
        }

        // Touch swipe functionality for mobile
        testimonialContainers.forEach(container => {
            let touchStartX = 0;
            let touchEndX = 0;

            container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoSlide();
            }, { passive: true });

            container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startAutoSlide();
            }, { passive: true });
        });

        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance to be considered a swipe

            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left, go to next slide
                currentIndex = (currentIndex + 1) % testimonialCards.length;
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right, go to previous slide
                currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
            }

            updateSlider();
        }
    }

    // Search functionality
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            searchInput.classList.toggle('active');
            if (searchInput.classList.contains('active')) {
                searchInput.focus();
            }
        });

        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchButton.contains(e.target) && !searchInput.contains(e.target) && searchInput.classList.contains('active')) {
                searchInput.classList.remove('active');
            }
        });

        // Handle search submission
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = searchInput.value.trim().toLowerCase();
                if (searchTerm) {
                    // Simple search implementation - scroll to section that matches search term
                    const sections = ['home', 'about', 'places', 'transport', 'testimonials', 'contact'];
                    let found = false;

                    for (const section of sections) {
                        if (section.includes(searchTerm)) {
                            const element = document.getElementById(section);
                            if (element) {
                                window.scrollTo({
                                    top: element.offsetTop - 80,
                                    behavior: 'smooth'
                                });
                                found = true;
                                break;
                            }
                        }
                    }

                    if (!found) {
                        alert('No results found for "' + searchInput.value + '". Try searching for: home, about, places, transport, testimonials, or contact.');
                    }

                    searchInput.value = '';
                    searchInput.classList.remove('active');
                }
            }
        });
    }

    // Scroll to top button
    const scrollTopBtn = document.querySelector('.scroll-top');

    if (scrollTopBtn) {
        // Show/hide scroll to top button
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
            }
        });

        // Scroll to top when button is clicked
        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Form submissions
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Simple form validation
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            if (isValid) {
                alert('Thank you for your booking request! We will contact you shortly to confirm your reservation.');
                this.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Simple form validation
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            if (isValid) {
                alert('Thank you for your message! We will get back to you as soon as possible.');
                this.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }

    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value.trim()) {
                alert('Thank you for subscribing to our newsletter!');
                this.reset();
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    // Image lazy loading is now handled by images.js
    // This is kept for backward compatibility with older browsers
    if ('IntersectionObserver' in window && !window.lazyLoadInitialized) {
        // Set a flag to prevent double initialization
        window.lazyLoadInitialized = true;

        console.log('Initializing lazy loading from script.js');
    }

// Close the DOMContentLoaded event listener
});