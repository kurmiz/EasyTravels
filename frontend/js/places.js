/**
 * Places.js - Handles functionality for the places/attractions section
 * Features:
 * - Filtering places by category
 * - Lazy loading of place images
 * - Details modal for each place
 * - Place search functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const filterBtns = document.querySelectorAll('.filter-btn');
    const placeCards = document.querySelectorAll('.place-card');
    const viewMoreBtn = document.querySelector('.view-more');
    const detailsBtns = document.querySelectorAll('.btn-small');

    // Place details data
    const placeDetails = {
        'Lumbini': {
            fullDescription: `Lumbini is the birthplace of Lord Buddha and a UNESCO World Heritage Site. The sacred garden contains the Maya Devi Temple, marking the exact spot where Queen Maya Devi gave birth to Siddhartha Gautama, who later became Buddha.

            The Ashoka Pillar, erected by Emperor Ashoka in 249 BCE, confirms this as Buddha's birthplace. The site also features a sacred pond where Maya Devi bathed before giving birth, and numerous international monasteries representing different Buddhist traditions from around the world.

            Visitors should plan to spend at least a full day exploring the main attractions, including the Maya Devi Temple, Ashoka Pillar, Peace Flame, and various monasteries. The site is open daily from 6:00 am to 6:00 pm.`,
            images: ['images/lumbini.jpg', 'images/lumbinis.jpg'],
            openingHours: '6:00 am - 6:00 pm daily',
            entryFee: 'NPR 200 for foreigners, NPR 50 for SAARC nationals, Free for Nepali citizens',
            bestTimeToVisit: 'October to March',
            tips: 'Wear modest clothing as this is a religious site. Remove shoes before entering temples.'
        },
        'Gautam Buddha International Airport': {
            fullDescription: `Opened in 2022, this is Nepal's second international airport, named after Gautam Buddha. The modern facility connects Lumbini to international destinations and serves as an important transportation hub for the region.

            The airport features state-of-the-art facilities including duty-free shops, restaurants, and lounges. It has significantly improved accessibility to Lumbini for international visitors.`,
            images: ['images/airport.jpg', 'images/airports.jpg'],
            openingHours: '24 hours',
            entryFee: 'No entry fee (except for passengers)',
            bestTimeToVisit: 'Anytime',
            tips: 'Check flight schedules in advance as international flights may be limited.'
        },
        'Gaighat': {
            fullDescription: `Located near Rani-gaun, Gaighat is a popular photoshoot destination for locals and visitors alike. This scenic area offers beautiful natural backdrops for photography enthusiasts.

            The peaceful environment with lush greenery and natural settings makes it perfect for creative shoots and enjoying nature.`,
            images: ['images/gg.jpg'],
            openingHours: 'Open all day',
            entryFee: 'Free',
            bestTimeToVisit: 'Early morning or late afternoon for the best lighting',
            tips: 'Best accessed by bike or car. Bring your own refreshments as there are limited facilities.'
        },
        'Green Park': {
            fullDescription: `Located near Dhakdhai, Green Park is a popular recreational area offering relaxing green spaces, walking paths, and recreational facilities. It's especially popular among young people and families looking for a peaceful day out.

            The park features well-maintained gardens, seating areas, and play areas for children.`,
            images: ['images/green park.jpg'],
            openingHours: '6:00 am - 7:00 pm',
            entryFee: 'NPR 50 per person',
            bestTimeToVisit: 'Weekday mornings to avoid crowds',
            tips: 'Bring a picnic to enjoy in the designated areas.'
        },
        'Mahadev Shiv Mandir': {
            fullDescription: `This peaceful Hindu temple is dedicated to Lord Shiva. Located near APF camp close to Meudhihawa, this temple offers a serene environment for worship.

            Devotees visit every Monday to pay respects to Lord Shiva in this clean and well-maintained temple. The temple architecture reflects traditional Hindu design elements.`,
            images: ['images/shiva.jpg'],
            openingHours: '5:00 am - 8:00 pm daily',
            entryFee: 'Free (donations appreciated)',
            bestTimeToVisit: 'Early mornings or during Shivaratri festival',
            tips: 'Remove shoes before entering. Mondays are especially busy with devotees.'
        },
        'Bhat-Bhateni Supermarket': {
            fullDescription: `Bhat-Bhateni is Nepal's leading supermarket chain, and its Bhairahawa branch offers a wide variety of groceries, clothing, electronics, and household goods in a modern shopping environment.

            The supermarket provides a convenient one-stop shopping experience with international and local products. It's air-conditioned and well-organized, making shopping comfortable even during hot days. The store features multiple departments including groceries, household items, clothing, electronics, and more.`,
            images: ['images/bhatbhateni.png'],
            openingHours: '8:00 am - 8:00 pm daily',
            entryFee: 'Free',
            bestTimeToVisit: 'Weekday mornings to avoid crowds',
            tips: 'Bring your own shopping bags to reduce plastic waste. Check for special promotions and discounts that are regularly offered.'
        },
        'Tiger Resort': {
            fullDescription: `Tiger Resort is a tranquil getaway located near the Daunne hills in Nawalparasi. Surrounded by lush forests, it offers comfortable accommodations and a close-to-nature experience, ideal for travelers exploring the region or passing along the East-West Highway.

            The resort provides a peaceful retreat with comfortable rooms, dining options, and outdoor activities. It's a perfect place to relax and connect with nature while enjoying the scenic beauty of the Daunne hills.`,
            images: ['images/tigerresort.jpg'],
            openingHours: 'Open 24 hours (Reception: 7:00 am - 10:00 pm)',
            entryFee: 'Accommodation rates vary by season',
            bestTimeToVisit: 'October to March for pleasant weather',
            tips: 'Book in advance during peak tourist seasons. Consider renting a vehicle for easier access.'
        },
        'Lumbini Cable Car': {
            fullDescription: `The Lumbini Cable Car connects Butwal to Basantapur Danda, offering scenic views of the surrounding hills and valleys. It provides easy access to religious and tourist destinations and is a popular attraction for visitors seeking a panoramic ride.

            The cable car system offers a unique perspective of the beautiful landscape below, making it a must-visit attraction for photography enthusiasts and nature lovers. The ride provides breathtaking views of the hills, forests, and settlements below.`,
            images: ['images/cable.jpg'],
            openingHours: '8:00 am - 5:00 pm',
            entryFee: 'NPR 350 for adults, NPR 200 for children',
            bestTimeToVisit: 'Clear mornings for the best views',
            tips: 'Check weather conditions before visiting as the service may be suspended during bad weather. Bring a camera to capture the panoramic views.'
        },
        'Siddha Baba Mandir': {
            fullDescription: `Siddha Baba Mandir is a sacred temple dedicated to Siddha Baba, a revered spiritual figure. Located in the hills near Bhairahawa, this temple attracts devotees seeking blessings and spiritual solace.

            The temple complex offers a peaceful environment for meditation and prayer. Visitors often combine a trip to this temple with other nearby attractions.`,
            images: ['images/siddhababa.jpg'],
            openingHours: '6:00 am - 7:00 pm',
            entryFee: 'Free (donations appreciated)',
            bestTimeToVisit: 'Early mornings for a peaceful experience',
            tips: 'Dress modestly and remove shoes before entering the temple premises.'
        },
        'Baglung Suspension Bridge': {
            fullDescription: `The Baglung Suspension Bridge, also known as the Gandaki Golden Bridge, is one of the longest pedestrian suspension bridges in the world, stretching 567 meters across the Kali Gandaki River and connecting Baglung and Kusma.

            The bridge offers panoramic views of hills, rivers, and mountains like Dhaulagiri. It's also located near the famous Baglung Kalika Temple, making it a popular destination for both adventure seekers and pilgrims. Walking across the bridge provides a thrilling experience with spectacular views of the deep gorge below and the surrounding landscape.`,
            images: ['images/bridge.jpg'],
            openingHours: 'Open all day',
            entryFee: 'Free',
            bestTimeToVisit: 'Early morning or late afternoon for the best lighting and views',
            tips: 'The bridge can sway slightly which is normal. Those with a fear of heights should be prepared. Bring a camera to capture the stunning views.'
        },
        'Nuwakot': {
            fullDescription: `Nuwakot is a historic district with rich cultural heritage and beautiful landscapes. Located near Bhairahawa, it offers visitors a glimpse into Nepal's traditional architecture and rural lifestyle.

            The area features historic buildings, temples, and panoramic views of the surrounding countryside. It's a perfect destination for those interested in Nepali history and culture.`,
            images: ['images/nuwakot.jpg'],
            openingHours: 'Open all day',
            entryFee: 'Free (some historic sites may charge entrance fees)',
            bestTimeToVisit: 'October to March for pleasant weather',
            tips: 'Wear comfortable walking shoes as many sites require walking on uneven terrain. Bring a camera to capture the historic architecture.'
        },
        'Rani Mahal': {
            fullDescription: `Ranimahal, also known as the "Queen's Palace," is a historic palace built in the early 20th century. This architectural marvel combines Nepali and European design elements, creating a unique cultural landmark.

            The palace offers stunning views of the surrounding landscape and provides insights into Nepal's royal history. Visitors can explore the palace grounds and learn about its historical significance.`,
            images: ['images/ranimahal.jpeg'],
            openingHours: '9:00 am - 5:00 pm daily',
            entryFee: 'NPR 100 for adults, NPR 50 for students',
            bestTimeToVisit: 'Morning hours for the best lighting for photography',
            tips: 'Guided tours are available and recommended to fully understand the palace\'s history. Photography is allowed in most areas.'
        },
        'Jharna': {
            fullDescription: `Jharna is a beautiful waterfall area that offers a refreshing escape from the city. The cascading water creates a peaceful atmosphere, making it a popular spot for nature lovers and photographers.

            Surrounded by lush greenery, the waterfall area provides a cool microclimate even during hot days. Visitors can enjoy the natural beauty, take photographs, and relax in the serene environment.`,
            images: ['images/jharna.jpg'],
            openingHours: 'Open all day (best visited during daylight hours)',
            entryFee: 'Free',
            bestTimeToVisit: 'During and after the monsoon season when the water flow is strongest',
            tips: 'Wear appropriate footwear as the paths can be slippery. Bring water and snacks as there are limited facilities in the area.'
        }
    };

    // Filter places by category
    if (filterBtns && filterBtns.length > 0 && placeCards && placeCards.length > 0) {
        // Initialize Isotope if available
        let iso = null;
        if (typeof Isotope !== 'undefined') {
            const placesGrid = document.querySelector('.places-content');
            if (placesGrid) {
                iso = new Isotope(placesGrid, {
                    itemSelector: '.place-card',
                    layoutMode: 'fitRows',
                    transitionDuration: '0.4s'
                });
            }
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));

                // Add active class to clicked button
                btn.classList.add('active');

                // Get filter value
                const filterValue = btn.getAttribute('data-filter');

                // Use Isotope if available
                if (iso) {
                    if (filterValue === 'all') {
                        iso.arrange({ filter: '*' });
                    } else {
                        iso.arrange({ filter: `[data-category*="${filterValue}"]` });
                    }
                } else {
                    // Fallback to basic filtering
                    placeCards.forEach(card => {
                        if (filterValue === 'all') {
                            card.style.display = '';
                            card.classList.add('filter-show');
                            card.classList.remove('filter-hide');

                            // Add animation
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1)';
                            }, 10);
                        } else {
                            if (card.getAttribute('data-category').includes(filterValue)) {
                                card.style.display = '';
                                card.classList.add('filter-show');
                                card.classList.remove('filter-hide');

                                // Add animation
                                setTimeout(() => {
                                    card.style.opacity = '1';
                                    card.style.transform = 'scale(1)';
                                }, 10);
                            } else {
                                card.classList.add('filter-hide');
                                card.classList.remove('filter-show');

                                // Add animation
                                card.style.opacity = '0';
                                card.style.transform = 'scale(0.8)';

                                // Hide after animation completes
                                setTimeout(() => {
                                    card.style.display = 'none';
                                }, 400);
                            }
                        }
                    });
                }
            });
        });

        // Trigger click on "All" button to initialize
        const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (allBtn) {
            allBtn.click();
        }
    }

    // Create and show place details modal
    function showPlaceDetails(placeName) {
        // Check if place exists in our data
        if (!placeDetails[placeName]) {
            console.error('Place details not found for:', placeName);
            return;
        }

        const place = placeDetails[placeName];

        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'place-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'modal-title');

        // Create image gallery HTML if multiple images
        let imageGalleryHTML = '';
        if (place.images.length > 1) {
            imageGalleryHTML = `
                <div class="modal-gallery">
                    <div class="gallery-main">
                        <img src="${place.images[0]}" alt="${placeName}" id="gallery-main-img">
                    </div>
                    <div class="gallery-thumbs">
                        ${place.images.map((img, index) => `
                            <div class="gallery-thumb ${index === 0 ? 'active' : ''}" data-src="${img}">
                                <img src="${img}" alt="${placeName} image ${index + 1}">
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            imageGalleryHTML = `
                <div class="modal-image-container">
                    <img src="${place.images[0]}" alt="${placeName}" class="responsive-img">
                </div>
            `;
        }

        // Create modal content
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modal-title">${placeName}</h2>
                    <button class="close-modal" aria-label="Close modal">&times;</button>
                </div>
                <div class="modal-body">
                    ${imageGalleryHTML}
                    <div class="modal-details">
                        <div class="detail-item">
                            <h4>Description</h4>
                            <p>${place.fullDescription}</p>
                        </div>
                        <div class="detail-info">
                            <div class="detail-item">
                                <h4>Opening Hours</h4>
                                <p>${place.openingHours}</p>
                            </div>
                            <div class="detail-item">
                                <h4>Entry Fee</h4>
                                <p>${place.entryFee}</p>
                            </div>
                        </div>
                        <div class="detail-info">
                            <div class="detail-item">
                                <h4>Best Time to Visit</h4>
                                <p>${place.bestTimeToVisit}</p>
                            </div>
                            <div class="detail-item">
                                <h4>Tips for Visitors</h4>
                                <p>${place.tips}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a href="https://www.google.com/maps/search/${encodeURIComponent(placeName + ' Bhairahawa Nepal')}" target="_blank" class="btn btn-small">
                        <i class='bx bx-map'></i> View on Map
                    </a>
                    <button class="btn btn-outline btn-small close-btn">Close</button>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.appendChild(modal);

        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';

        // Show modal with animation
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });

        // Set up gallery functionality if multiple images
        if (place.images.length > 1) {
            const galleryMainImg = modal.querySelector('#gallery-main-img');
            const galleryThumbs = modal.querySelectorAll('.gallery-thumb');

            galleryThumbs.forEach(thumb => {
                thumb.addEventListener('click', () => {
                    // Update main image
                    galleryMainImg.src = thumb.dataset.src;

                    // Update active thumb
                    galleryThumbs.forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                });
            });
        }

        // Close modal function
        function closeModal() {
            modal.classList.remove('show');

            // Re-enable body scrolling
            document.body.style.overflow = '';

            // Remove modal after animation completes
            setTimeout(() => {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            }, 300);
        }

        // Close modal when clicking on close button
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // Close modal when clicking on close button in footer
        const footerCloseBtn = modal.querySelector('.close-btn');
        if (footerCloseBtn) {
            footerCloseBtn.addEventListener('click', closeModal);
        }

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close modal when pressing Escape key
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                // Remove this event listener when modal is closed
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    // Add event listeners to details buttons
    detailsBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const placeName = btn.closest('.place-card').querySelector('.place-header h4').textContent;
            showPlaceDetails(placeName);
        });
    });

    // View more button functionality
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // This would typically load more places or redirect to a full listing page
            alert('This would show more attractions. Currently showing all available attractions.');
        });
    }
});
