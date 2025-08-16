(function() {
  "use strict";

  // Global variables to track initialization
  let isInitialized = false;
  let eventListeners = [];

  // Safe event listener management
  function addManagedEventListener(element, event, handler) {
    if (element && element.addEventListener) {
      element.addEventListener(event, handler);
      eventListeners.push({ element, event, handler });
    }
  }

  function removeAllEventListeners() {
    eventListeners.forEach(({ element, event, handler }) => {
      if (element && element.removeEventListener) {
        try {
          element.removeEventListener(event, handler);
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    });
    eventListeners = [];
  }

  // Clean initialization function
  function initializeBasicFeatures() {
    if (isInitialized) {
      return;
    }

    // Only initialize basic features that work with Next.js
    initMobileNav();
    initScrollTop();
    initScrollHeader();
    initNavScrollspy();
    
    // Initialize external libraries after a delay
    setTimeout(() => {
      initSwiper();
      initGLightbox();
    }, 500);

    isInitialized = true;
  }

  function initMobileNav() {
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    
    if (!mobileNavToggleBtn) return;

    function toggleMobileNav() {
      const body = document.body;
      const isActive = body.classList.contains('mobile-nav-active');
      
      if (isActive) {
        body.classList.remove('mobile-nav-active');
        mobileNavToggleBtn.classList.remove('bi-x');
        mobileNavToggleBtn.classList.add('bi-list');
      } else {
        body.classList.add('mobile-nav-active');
        mobileNavToggleBtn.classList.remove('bi-list');
        mobileNavToggleBtn.classList.add('bi-x');
      }
    }
    
    addManagedEventListener(mobileNavToggleBtn, 'click', toggleMobileNav);

    // Close mobile nav when clicking on nav links
    document.querySelectorAll('#navmenu a').forEach(navLink => {
      addManagedEventListener(navLink, 'click', () => {
        if (document.body.classList.contains('mobile-nav-active')) {
          toggleMobileNav();
        }
      });
    });
  }

  function initScrollTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (!scrollTopBtn) return;

    function updateScrollTopBtn() {
      if (window.scrollY > 100) {
        scrollTopBtn.classList.add('active');
      } else {
        scrollTopBtn.classList.remove('active');
      }
    }

    function scrollToTop(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    addManagedEventListener(window, 'scroll', updateScrollTopBtn);
    addManagedEventListener(scrollTopBtn, 'click', scrollToTop);
    
    // Initial call
    updateScrollTopBtn();
  }

  function initScrollHeader() {
    const body = document.body;
    const header = document.querySelector('#header');
    
    if (!header) return;

    function updateScrolledClass() {
      if (window.scrollY > 100) {
        body.classList.add('scrolled');
      } else {
        body.classList.remove('scrolled');
      }
    }

    addManagedEventListener(window, 'scroll', updateScrolledClass);
    
    // Initial call
    updateScrolledClass();
  }

  function initNavScrollspy() {
    // Only run on home page
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      return;
    }

    const navLinks = document.querySelectorAll('.navmenu a[href^="#"]');
    if (navLinks.length === 0) return;

    function updateActiveNav() {
      const scrollPos = window.scrollY + 200;

      navLinks.forEach(link => {
        const hash = link.getAttribute('href');
        const section = document.querySelector(hash);
        
        if (!section) return;

        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
          // Remove active from all links
          navLinks.forEach(l => l.classList.remove('active'));
          // Add active to current link
          link.classList.add('active');
        }
      });
    }

    addManagedEventListener(window, 'scroll', updateActiveNav);
    
    // Initial call
    updateActiveNav();
  }

  function initSwiper() {
    if (typeof Swiper === 'undefined') return;

    document.querySelectorAll('.init-swiper').forEach(swiperElement => {
      try {
        const configElement = swiperElement.querySelector('.swiper-config');
        if (!configElement) return;

        const configText = configElement.innerHTML.trim();
        if (!configText) return;

        const config = JSON.parse(configText);
        new Swiper(swiperElement, config);
      } catch (error) {
        console.warn('Swiper initialization error:', error);
      }
    });
  }

  function initGLightbox() {
    if (typeof GLightbox === 'undefined') return;
    
    try {
      GLightbox({
        selector: '.glightbox'
      });
    } catch (error) {
      console.warn('GLightbox initialization error:', error);
    }
  }

  // Cleanup function
  function cleanup() {
    removeAllEventListeners();
    isInitialized = false;
  }

  // Global cleanup function for Next.js navigation
  window.initializePageScripts = function() {
    cleanup();
    setTimeout(initializeBasicFeatures, 100);
  };

  // Initialize when DOM is ready
  function domReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  // Initial setup
  domReady(() => {
    setTimeout(initializeBasicFeatures, 100);
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);

  // Handle hash navigation
  window.addEventListener('hashchange', () => {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  });

})();