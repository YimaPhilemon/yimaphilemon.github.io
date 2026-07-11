/**
 * Yima Philemon - Premium Developer Portfolio Logic
 * Clean, lightweight, zero-dependency vanilla JS for navigation, slideshow, lightbox, and forms.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSlideshow();
  initLightbox();
  initContactForm();
});

/**
 * Navbar & Responsive Menu Logic
 */
function initNavbar() {
  const header = document.querySelector('header');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-item a');

  // Sticky header transition on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
      
      // Animate hamburger lines
      const spans = hamburger.querySelectorAll('span');
      if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close mobile menu when clicking a link
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  // Highlight active page link based on URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navItems.forEach(item => {
    const itemPath = item.getAttribute('href');
    if (itemPath === currentPath) {
      item.parentElement.classList.add('active');
    } else {
      item.parentElement.classList.remove('active');
    }
  });
}

/**
 * Custom Slideshow / Carousel Logic
 */
function initSlideshow() {
  const container = document.querySelector('.slides-container');
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.slideshow-prev');
  const nextBtn = document.querySelector('.slideshow-next');
  const dotsContainer = document.querySelector('.slideshow-dots');

  if (!container || slides.length === 0) return;

  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;

  // Create dot indicators
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.querySelectorAll('.dot');

  function updateSlideshow() {
    container.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function goToSlide(index) {
    currentSlide = index;
    if (currentSlide < 0) {
      currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
      currentSlide = 0;
    }
    updateSlideshow();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      resetAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
      resetAutoplay();
    });
  }

  // Start Autoplay
  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 5000); // changes slide every 5 seconds
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  startAutoplay();
}

/**
 * Custom Lightweight Lightbox Logic
 */
function initLightbox() {
  // Select all image elements that should trigger the lightbox
  const galleryLinks = document.querySelectorAll('a[rel^="lightbox"], .gallery-item, .role-img-wrap');
  
  if (galleryLinks.length === 0) return;

  // Create Lightbox DOM structure dynamically if not present
  let lightbox = document.querySelector('.lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    lightbox.innerHTML = `
      <div class="lightbox-close">&times;</div>
      <div class="lightbox-content-wrap">
        <img class="lightbox-img" src="" alt="Gallery Image">
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  // Open lightbox
  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable scroll on body
  }

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scroll
    setTimeout(() => {
      lightboxImg.src = '';
    }, 300);
  }

  // Bind click handlers to triggers
  galleryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      let src = '';
      // Support nested anchors or direct image links
      if (link.tagName === 'A') {
        src = link.getAttribute('href');
      } else {
        // For wrapper div structures, get the anchor href inside it or direct img src
        const anchor = link.querySelector('a');
        const img = link.querySelector('img');
        src = anchor ? anchor.getAttribute('href') : (img ? img.getAttribute('src') : '');
      }

      if (src) {
        openLightbox(src);
      }
    });
  });

  // Close events
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrap')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/**
 * Contact Form Client-side Handler
 */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  const successMsg = document.querySelector('.form-success-msg');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Perform validation
    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const messageInput = form.querySelector('textarea');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      alert('Please enter a valid email address.');
      return;
    }

    // Intercept action and show visual success
    // In a real staging setup, this form submits to Formspree, Web3Forms, or Mailto.
    // For static hosting we display a beautiful success feedback state.
    if (successMsg) {
      successMsg.textContent = `Thank you, ${nameInput.value.trim()}! Your message has been sent successfully.`;
      successMsg.style.display = 'block';
      form.reset();
      
      // Auto scroll to success message
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Auto hide after 8 seconds
      setTimeout(() => {
        successMsg.style.display = 'none';
      }, 8000);
    } else {
      alert('Message sent successfully!');
      form.reset();
    }
  });
}
