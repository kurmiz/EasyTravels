/**
 * Main JavaScript file for Bhairahawa Tourism Website
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const header = document.querySelector('header');
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');
    const preloader = document.getElementById('preloader');
    
    // Remove preloader when page is loaded
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.display = 'none';
        });
    }
    
    // Sticky header on scroll
    window.addEventListener('scroll', function() {
        header.classList.toggle('sticky', window.scrollY > 0);
    });
    
    // Mobile menu toggle
    if (menuIcon) {
        menuIcon.addEventListener('click', function() {
            navbar.classList.toggle('open');
            menuIcon.classList.toggle('bx-x');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && !menuIcon.contains(e.target) && navbar.classList.contains('open')) {
            navbar.classList.remove('open');
            menuIcon.classList.remove('bx-x');
        }
    });
    
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('open');
            menuIcon.classList.remove('bx-x');
        });
    });
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function scrollActive() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.navbar a[href*=' + sectionId + ']').classList.add('active');
            } else {
                document.querySelector('.navbar a[href*=' + sectionId + ']').classList.remove('active');
            }
        });
    }
    
    if (sections.length > 0) {
        window.addEventListener('scroll', scrollActive);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
