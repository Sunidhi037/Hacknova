// EcoPulse Core Utilities
// Contains centralized functionality for all pages

// Function to initialize page-specific features
window.EcoPulse = window.EcoPulse || {};

// Initialize year in footer
EcoPulse.initYearFooter = () => {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
};

// Initialize all core utilities
document.addEventListener("DOMContentLoaded", () => {
    // Initialize year in footer
    EcoPulse.initYearFooter();
    
    // Initialize mobile menu if it exists
    if (typeof EcoPulse.initMobileMenu === 'function') {
        EcoPulse.initMobileMenu();
    }
    
    // Initialize scroll to top if it exists
    if (typeof EcoPulse.initScrollToTop === 'function') {
        EcoPulse.initScrollToTop();
    }
    
    // Initialize scroll reveal if it exists
    if (typeof EcoPulse.initScrollReveal === 'function') {
        EcoPulse.initScrollReveal();
    }
});