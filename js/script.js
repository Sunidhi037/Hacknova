// ===============================
// EcoPulse Main JavaScript
// ===============================

// Global EcoPulse namespace
window.EcoPulse = window.EcoPulse || {};

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
  
  // Set current year in footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
