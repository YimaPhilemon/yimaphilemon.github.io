/**
 * Yima Philemon - Premium Developer Portfolio Logic
 * Clean, lightweight, zero-dependency vanilla JS for navigation, slideshow, lightbox, and forms.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSlideshow();
  initLightbox();
  initContactForm();
  initWhatsAppContactButton();
  initLocalClock();
  initGithubStats();
  initGithubPinnedRepos();
});

/**
 * Live Local Time Clock (Developer Snapshot section)
 */
function initLocalClock() {
  const el = document.getElementById('local-time');
  if (!el) return;

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit',
  });

  const tick = () => {
    el.textContent = formatter.format(new Date());
  };

  tick();
  setInterval(tick, 30000);
}

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

  // Highlight active page link based on URL.
  // Pages now live under clean folder URLs (e.g. /gallery/), so compare the
  // first path segment rather than the old filename-based matching.
  const currentSection = window.location.pathname.split('/').filter(Boolean)[0] || '';
  navItems.forEach(item => {
    const itemPath = item.getAttribute('href');
    const itemSection = itemPath.split('/').filter(Boolean)[0] || '';
    if (itemSection === currentSection) {
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
 * Submissions are sent to a Google Apps Script Web App, which appends
 * each one as a row in a Google Sheet. See files/google-apps-script.gs.txt.
 */
const CONTACT_FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbybfAZEIivkOVI9IqKaKTG5x-lleciVR7gxjEBQD252IPeTtV5y0sIILgCA_EritafHlQ/exec';

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

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const showSuccess = () => {
      if (successMsg) {
        successMsg.textContent = `Thank you, ${nameInput.value.trim()}! Your message has been sent successfully.`;
        successMsg.style.display = 'block';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 8000);
      } else {
        alert('Message sent successfully!');
      }
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    };

    const showError = () => {
      alert('Sorry, something went wrong sending your message. Please try again or email me directly.');
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    };

    if (!CONTACT_FORM_ENDPOINT || CONTACT_FORM_ENDPOINT.startsWith('PASTE_')) {
      console.warn('Contact form endpoint is not configured yet. See files/google-apps-script.gs.txt.');
      showSuccess();
      return;
    }

    const payload = new FormData();
    payload.append('name', nameInput.value.trim());
    payload.append('email', emailInput.value.trim());
    payload.append('message', messageInput.value.trim());

    fetch(CONTACT_FORM_ENDPOINT, { method: 'POST', body: payload })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.result === 'success') {
          showSuccess();
        } else {
          throw new Error('Unexpected response from server');
        }
      })
      .catch((err) => {
        console.error('Contact form submission failed:', err);
        showError();
      });
  });
}

/**
 * WhatsApp Contact Shortcut
 * Lets a visitor send the same name/email/message straight to WhatsApp
 * instead of (or alongside) the Google Apps Script submission above.
 */
const CONTACT_WHATSAPP_NUMBER = '2349120925909';

function initWhatsAppContactButton() {
  const btn = document.getElementById('whatsapp-send-btn');
  const form = document.querySelector('.contact-form');
  if (!btn || !form) return;

  btn.addEventListener('click', () => {
    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const messageInput = form.querySelector('textarea');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      alert('Please enter a valid email address.');
      return;
    }

    const lines = [
      `Hi Yima, I'm ${nameInput.value.trim()} (${emailInput.value.trim()}).`,
      messageInput.value.trim(),
    ];
    const message = encodeURIComponent(lines.join('\n\n'));
    window.open(`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${message}`, '_blank');
  });
}

/**
 * GitHub Stats (Developer Snapshot section)
 * Pulls live data from GitHub's public REST API (no auth, no third-party
 * rendering service) so it never depends on someone else's uptime. Stats
 * are a nice-to-have flourish, not core content — if the API is unavailable,
 * the whole card just hides itself rather than showing an error to visitors.
 */
function loadGithubStats(grid) {
  const username = grid.dataset.ghUsername;
  const card = grid.closest('.glass-card');
  if (card) card.style.display = '';
  grid.innerHTML = '<p class="gh-loading">Loading live stats from GitHub…</p>';

  Promise.all([
    fetch(`https://api.github.com/users/${username}`).then((r) => {
      if (!r.ok) throw new Error(`users request failed (${r.status})`);
      return r.json();
    }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100`).then((r) => {
      if (!r.ok) throw new Error(`repos request failed (${r.status})`);
      return r.json();
    }),
  ])
    .then(([user, repos]) => {
      const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

      const languageCounts = {};
      repos.forEach((repo) => {
        if (!repo.language) return;
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      });
      const topLanguages = Object.entries(languageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([lang]) => lang);

      grid.innerHTML = `
        <div class="gh-mini-card">
          <span class="gh-mini-label">Public Repos</span>
          <span class="gh-mini-value">${user.public_repos}</span>
        </div>
        <div class="gh-mini-card">
          <span class="gh-mini-label">Total Stars Earned</span>
          <span class="gh-mini-value">${totalStars}</span>
        </div>
        <div class="gh-mini-card">
          <span class="gh-mini-label">Followers</span>
          <span class="gh-mini-value">${user.followers}</span>
        </div>
        <div class="gh-mini-card">
          <span class="gh-mini-label">Most Used Languages</span>
          <div class="gh-lang-list">
            ${topLanguages.map((lang) => `<span class="gh-lang-tag">${lang}</span>`).join('') || '<span class="gh-lang-tag">N/A</span>'}
          </div>
        </div>
      `;
    })
    .catch((err) => {
      console.error('GitHub stats fetch failed, hiding stats card:', err);
      if (card) card.style.display = 'none';
    });
}

function initGithubStats() {
  const grid = document.getElementById('gh-stats-grid');
  if (!grid) return;
  loadGithubStats(grid);
}

/**
 * Pinned Repositories (Developer Snapshot section)
 * Repos are real portfolio content, so they always render — each repo is
 * fetched independently (Promise.allSettled) and falls back to a plain
 * name + link card if its own live data can't be loaded, instead of
 * hiding the repo or showing an apology in its place.
 */
function renderRepoCard(owner, repo, tag, data) {
  const isUtility = tag === 'utility';
  const badge = isUtility ? '<span class="gh-repo-badge">🔧 Utility</span>' : '';

  if (data) {
    return `
      <a class="glass-card gh-repo-card${isUtility ? ' gh-repo-utility' : ''}" href="${data.html_url}" target="_blank">
        ${badge}
        <h4>${data.name}</h4>
        <p>${data.description || 'No description provided.'}</p>
        <div class="gh-repo-meta">
          <span>⭐ ${data.stargazers_count}</span>
          <span>🍴 ${data.forks_count}</span>
          <span>${data.language || '—'}</span>
        </div>
      </a>
    `;
  }

  return `
    <a class="glass-card gh-repo-card gh-repo-degraded${isUtility ? ' gh-repo-utility' : ''}" href="https://github.com/${owner}/${repo}" target="_blank">
      ${badge}
      <h4>${repo}</h4>
      <p class="gh-repo-degraded-note">Live details unavailable right now — view on GitHub →</p>
    </a>
  `;
}

function loadGithubPinnedRepos(grid) {
  // Each entry is "owner/repo" or "owner/repo:tag" (currently only tag "utility" is used).
  const entries = (grid.dataset.ghRepos || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [path, tag] = entry.split(':');
      const [owner, repo] = path.split('/');
      return { owner, repo, tag };
    });

  grid.innerHTML = '<p class="gh-loading">Loading repositories from GitHub…</p>';

  Promise.allSettled(
    entries.map((entry) =>
      fetch(`https://api.github.com/repos/${entry.owner}/${entry.repo}`).then((r) => {
        if (!r.ok) throw new Error(`repo request failed for ${entry.owner}/${entry.repo} (${r.status})`);
        return r.json();
      })
    )
  ).then((results) => {
    grid.innerHTML = entries
      .map((entry, i) => {
        const result = results[i];
        if (result.status === 'rejected') {
          console.error(`GitHub repo fetch failed for ${entry.owner}/${entry.repo}:`, result.reason);
        }
        const data = result.status === 'fulfilled' ? result.value : null;
        return renderRepoCard(entry.owner, entry.repo, entry.tag, data);
      })
      .join('');
  });
}

function initGithubPinnedRepos() {
  const grid = document.getElementById('gh-pinned-repos');
  if (!grid) return;
  loadGithubPinnedRepos(grid);
}
