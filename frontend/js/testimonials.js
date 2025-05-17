/**
 * Testimonials JavaScript file for Bhairahawa Tourism Website
 * This file handles the random profile images for testimonials
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize random testimonial profile images
    randomizeTestimonialImages();
});

/**
 * Randomize testimonial profile images
 * This function randomly assigns profile images to testimonials
 */
function randomizeTestimonialImages() {
    // Get all testimonial image elements
    const testimonialImages = document.querySelectorAll('.testimonial-img img');
    
    if (testimonialImages.length === 0) {
        console.log('No testimonial images found');
        return;
    }
    
    // Available profile images
    const profileImages = [
        'images/profile1.jpg',
        'images/profile2.jpg',
        'images/profile3.jpg',
        'images/profile4.jpg',
        'images/profile5.jpg',
        'images/profile6.jpg'
    ];
    
    // Shuffle the profile images array
    const shuffledImages = shuffleArray([...profileImages]);
    
    // Assign random images to testimonials
    testimonialImages.forEach((imgElement, index) => {
        // Use modulo to cycle through available images if there are more testimonials than images
        const imageIndex = index % shuffledImages.length;
        
        // Store original src as data attribute for potential reset
        if (!imgElement.dataset.originalSrc) {
            imgElement.dataset.originalSrc = imgElement.src;
        }
        
        // Set the new random image
        imgElement.src = shuffledImages[imageIndex];
        
        // Add fade-in animation
        imgElement.style.opacity = '0';
        setTimeout(() => {
            imgElement.style.transition = 'opacity 0.5s ease';
            imgElement.style.opacity = '1';
        }, 50);
    });
    
    console.log('Testimonial profile images randomized');
}

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} - The shuffled array
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
