/**
 * Images.js - Handles image optimization and lazy loading
 * Features:
 * - Lazy loading of images
 * - Image optimization
 * - Responsive image handling
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create a placeholder image for lazy loading
    const placeholderSvg = 'images/placeholder.svg';

    // Initialize image lazy loading
    initLazyLoading();

    // Initialize responsive images
    initResponsiveImages();

    // Initialize image error handling
    initImageErrorHandling();

    /**
     * Initialize lazy loading for images
     */
    function initLazyLoading() {
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img.lazy-load[data-src]');

            if (lazyImages.length === 0) {
                console.log('No lazy-load images found');
                return;
            }

            console.log('Found ' + lazyImages.length + ' lazy-load images');

            // Create an observer for lazy loading
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;

                        // Set a loading class to show loading animation
                        img.classList.add('loading');

                        // Load the image immediately
                        img.src = img.dataset.src;
                        img.classList.remove('loading');
                        img.classList.add('loaded');

                        // If there's a data-srcset, set it too
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                        }

                        // Remove data attributes to prevent reloading
                        img.removeAttribute('data-src');
                        img.removeAttribute('data-srcset');

                        // Stop observing the image
                        imageObserver.unobserve(img);

                        console.log('Loaded image: ' + img.src);
                    }
                });
            }, {
                rootMargin: '200px 0px', // Load images 200px before they enter the viewport
                threshold: 0.01 // Trigger when even a tiny part of the image is visible
            });

            // Start observing each lazy image
            lazyImages.forEach(img => {
                // Make sure the image has a placeholder if it doesn't already
                if (!img.src || img.src === window.location.href) {
                    img.src = placeholderSvg;
                }

                imageObserver.observe(img);
                console.log('Observing image: ' + img.dataset.src);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            loadImagesImmediately();
        }
    }

    /**
     * Fallback function to load images immediately if IntersectionObserver is not supported
     */
    function loadImagesImmediately() {
        const lazyImages = document.querySelectorAll('img.lazy-load[data-src]');

        console.log('Fallback: Loading ' + lazyImages.length + ' images immediately');

        lazyImages.forEach(img => {
            // Create a new image to preload
            const tempImg = new Image();
            tempImg.src = img.dataset.src;

            // When the image is loaded, update the src
            tempImg.onload = function() {
                img.src = img.dataset.src;
                img.classList.add('loaded');

                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }

                img.removeAttribute('data-src');
                img.removeAttribute('data-srcset');
            };

            // Handle loading errors
            tempImg.onerror = function() {
                console.error('Failed to load image: ' + tempImg.src);
                img.classList.add('error');
                img.src = placeholderSvg;
            };
        });
    }

    /**
     * Initialize responsive images
     */
    function initResponsiveImages() {
        // Convert regular images to responsive images
        const images = document.querySelectorAll('img:not([data-src]):not(.no-responsive)');

        images.forEach(img => {
            // Skip images that are already processed
            if (img.classList.contains('responsive-img')) return;

            // Add responsive class
            img.classList.add('responsive-img');

            // Store original src
            const originalSrc = img.src;

            // Create srcset if not already present
            if (!img.srcset) {
                // Get image filename and extension
                const srcParts = originalSrc.split('.');
                const ext = srcParts.pop();
                const filename = srcParts.join('.');

                // Only create srcset if we can determine the filename and extension
                if (filename && ext) {
                    // Check if image exists in different sizes
                    checkImageExists(`${filename}-sm.${ext}`, function(exists) {
                        if (exists) {
                            img.srcset = `${filename}-sm.${ext} 500w, ${originalSrc} 1000w`;
                            img.sizes = "(max-width: 600px) 100vw, 50vw";
                        }
                    });
                }
            }
        });
    }

    /**
     * Check if an image exists
     * @param {string} url - URL of the image to check
     * @param {function} callback - Callback function with exists parameter
     */
    function checkImageExists(url, callback) {
        const img = new Image();
        img.onload = function() { callback(true); };
        img.onerror = function() { callback(false); };
        img.src = url;
    }

    /**
     * Initialize image error handling
     */
    function initImageErrorHandling() {
        const images = document.querySelectorAll('img:not(.lazy-load)');

        console.log('Setting up error handling for ' + images.length + ' non-lazy images');

        images.forEach(img => {
            img.onerror = function() {
                // Don't replace if already using placeholder
                if (img.src.includes('placeholder') || img.src.includes('svg')) return;

                console.error('Image failed to load: ' + img.src);

                // Add error class
                img.classList.add('error');

                // Set fallback image
                img.src = placeholderSvg;
            };
        });
    }

    /**
     * Convert existing images to lazy loading
     */
    window.convertToLazyLoading = function() {
        const images = document.querySelectorAll('img:not([data-src]):not(.no-lazy)');

        images.forEach(img => {
            // Skip already processed images
            if (img.hasAttribute('data-src')) return;

            // Store original src in data-src
            const originalSrc = img.src;
            img.dataset.src = originalSrc;

            // Store srcset if present
            if (img.srcset) {
                img.dataset.srcset = img.srcset;
                img.removeAttribute('srcset');
            }

            // Set a low-res placeholder or blur-up image
            img.src = 'images/placeholder.jpg';

            // Add lazy-load class
            img.classList.add('lazy-load');
        });

        // Reinitialize lazy loading
        initLazyLoading();
    };
});
