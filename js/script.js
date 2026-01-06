// ===============================
// EcoPulse Main JavaScript
// ===============================

// Global EcoPulse namespace
window.EcoPulse = window.EcoPulse || {};

// Accessibility utilities
EcoPulse.AccessibilityManager = {
  init: function() {
    this.setupSkipLinks();
    this.setupFocusManagement();
    this.setupReducedMotion();
    this.setupHighContrast();
  },
  
  // Setup skip navigation links
  setupSkipLinks: function() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  },
  
  // Setup focus management for keyboard navigation
  setupFocusManagement: function() {
    // Add focus indicators to interactive elements
    const interactiveElements = [
      'a', 'button', 'input', 'select', 'textarea', 
      '[tabindex]', '[role="button"]', '[role="link"]'
    ];
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', function() {
      document.body.classList.remove('keyboard-navigation');
    });
    
    // Add focus classes to elements
    document.addEventListener('focusin', function(e) {
      const target = e.target;
      if (target.classList.contains('btn') || target.tagName === 'BUTTON' || 
          target.tagName === 'A' || target.tagName === 'INPUT') {
        target.classList.add('focus-outline');
      }
    });
    
    document.addEventListener('focusout', function(e) {
      e.target.classList.remove('focus-outline');
    });
  },
  
  // Handle reduced motion preferences
  setupReducedMotion: function() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotion = (e) => {
      if (e.matches) {
        document.body.classList.add('reduce-motion');
      } else {
        document.body.classList.remove('reduce-motion');
      }
    };
    
    mediaQuery.addListener(handleReducedMotion);
    handleReducedMotion(mediaQuery);
  },
  
  // Handle high contrast preferences
  setupHighContrast: function() {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    const handleHighContrast = (e) => {
      if (e.matches) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
    };
    
    mediaQuery.addListener(handleHighContrast);
    handleHighContrast(mediaQuery);
  }
};

// Keyboard navigation manager
EcoPulse.KeyboardNavigation = {
  init: function() {
    this.setupSliderNavigation();
    this.setupModalNavigation();
    this.setupMenuNavigation();
  },
  
  // Enhanced keyboard navigation for sliders
  setupSliderNavigation: function() {
    const sliders = document.querySelectorAll('input[type="range"]');
    
    sliders.forEach(slider => {
      slider.addEventListener('keydown', function(e) {
        // Allow arrow keys to adjust slider
        if ([37, 38, 39, 40].includes(e.keyCode)) { // Arrow keys
          e.preventDefault();
          
          const step = parseFloat(this.step) || 1;
          let value = parseFloat(this.value);
          
          switch(e.keyCode) {
            case 37: // Left arrow
            case 40: // Down arrow
              value = Math.max(this.min, value - step);
              break;
            case 38: // Up arrow
            case 39: // Right arrow
              value = Math.min(this.max, value + step);
              break;
          }
          
          this.value = value;
          
          // Trigger input event for visual updates
          this.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    });
  },
  
  // Enhanced keyboard navigation for modal-like elements
  setupModalNavigation: function() {
    // Handle tab trapping for modals if they exist
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        // Close any open modals/menus
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
          const menuBtn = document.getElementById('mobile-menu-btn');
          if (menuBtn) menuBtn.focus();
        }
      }
    });
  },
  
  // Enhanced keyboard navigation for menus
  setupMenuNavigation: function() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          mobileMenu.classList.toggle('hidden');
          
          if (!mobileMenu.classList.contains('hidden')) {
            // Focus first menu item when menu opens
            const firstItem = mobileMenu.querySelector('a');
            if (firstItem) firstItem.focus();
          }
        }
      });
      
      // Add keyboard navigation to menu items
      const menuItems = mobileMenu.querySelectorAll('a');
      menuItems.forEach((item, index) => {
        item.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') {
            mobileMenu.classList.add('hidden');
            menuBtn.focus();
          } else if (e.key === 'Tab') {
            if (!e.shiftKey && index === menuItems.length - 1) {
              // If on last item and tabbing forward, go to first
              e.preventDefault();
              menuItems[0].focus();
            } else if (e.shiftKey && index === 0) {
              // If on first item and shift+tabbing, go to last
              e.preventDefault();
              menuItems[menuItems.length - 1].focus();
            }
          }
        });
      });
    }
  }
};

// Mobile menu functionality - centralized to prevent duplicate event listeners
EcoPulse.initMobileMenu = () => {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuBtn && mobileMenu) {
    // Remove existing event listeners to prevent duplication
    const newBtn = menuBtn.cloneNode(true);
    menuBtn.parentNode.replaceChild(newBtn, menuBtn);
    
    const updatedMenuBtn = document.getElementById("mobile-menu-btn");
    
    updatedMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle("hidden");
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!updatedMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
      }
    });
  }
};

// Scroll to top functionality
EcoPulse.initScrollToTop = () => {
  const scrollToTopBtn = document.getElementById("scroll-to-top");

  if (scrollToTopBtn) {
    const toggleScrollButton = () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.remove("opacity-0", "invisible", "translate-y-4");
      } else {
        scrollToTopBtn.classList.add("opacity-0", "invisible", "translate-y-4");
      }
    };

    window.addEventListener("scroll", toggleScrollButton, { passive: true });

    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    toggleScrollButton();
  }
};

// Scroll indicator functionality
EcoPulse.initScrollIndicator = () => {
  const scrollIndicator = document.getElementById("scroll-indicator");

  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", () => {
      const nextSection = document.querySelector(
        "section.hero-section + section"
      );

      if (nextSection) {
        nextSection.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  }
};

// Scroll reveal animation system
EcoPulse.initScrollReveal = () => {
  const reveals = document.querySelectorAll(".scroll-reveal");

  if (reveals.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    reveals.forEach(el => revealObserver.observe(el));
  }
};

// Initialize all functionalities
document.addEventListener("DOMContentLoaded", () => {
  EcoPulse.initMobileMenu();
  EcoPulse.initScrollToTop();
  EcoPulse.initScrollIndicator();
  EcoPulse.initScrollReveal();
  
  // Initialize accessibility features
  EcoPulse.AccessibilityManager.init();
  EcoPulse.KeyboardNavigation.init();
  
  // Set current year in footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
