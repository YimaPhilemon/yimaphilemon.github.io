/**
 * Yima Philemon - Premium Developer Portfolio Logic
 * Clean, lightweight, zero-dependency vanilla JS for navigation, slideshow, lightbox, and forms.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSlideshow();
  initLightbox();
  initContactForm();
  initSendSplit();
  initSendRoutes();
  initContactFab();
  initTheme();
  initThankYou();
  titleLinkedInBadgeFrame();
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
      hamburger.setAttribute('aria-expanded', String(hamburger.classList.contains('active')));
      
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
        hamburger.setAttribute('aria-expanded', 'false');
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

  // Slide images are lazy so they don't block first paint, but a lazy image
  // sitting outside the clipped track never enters the viewport on its own and
  // would pop in blank mid-transition. Flipping it to eager starts the fetch,
  // so we warm the current slide plus its immediate neighbours ahead of time.
  function preloadAround(index) {
    for (let offset = -1; offset <= 1; offset++) {
      const slide = slides[(index + offset + totalSlides) % totalSlides];
      const img = slide && slide.querySelector('img[loading="lazy"]');
      if (img) img.loading = 'eager';
    }
  }

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
    preloadAround(currentSlide);
    updateSlideshow();
  }

  preloadAround(0);

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
 * Contact form and WhatsApp handoff, both delivered through Web3Forms.
 *
 * Web3Forms replaces the old Google Apps Script endpoint: the Apps Script was a
 * personal deployment that had to be re-published whenever the script changed,
 * and it answered from a script.google.com origin that some corporate networks
 * block outright. This posts to a normal API instead.
 *
 * The WhatsApp button records the enquiry here TOO, rather than only opening a
 * chat. Opening a composer is not a delivery: if the visitor never presses send
 * in WhatsApp, the enquiry would otherwise vanish with no trace it happened.
 *
 * That difference is why the two routes treat the returned promise differently:
 *
 *  - The form submit AWAITS it, because it is the whole delivery, so success
 *    and failure both have to be reported honestly.
 *  - The WhatsApp route must NOT await it. window.open() has to run
 *    synchronously inside the click handler or the popup blocker eats the tab,
 *    so the record is fired off and the handoff proceeds regardless.
 *
 * keepalive lets the request outlive the page either way, since a mobile
 * WhatsApp deep link navigates away from the tab that started it.
 *
 * The access key is a publishable, submit-only identifier. It is meant to live
 * in client-side code and can only post to this site's own inbox.
 */
const WEB3FORMS_KEY = 'b823c637-9bcf-4410-91bd-0c86fbf029da';
const CONTACT_WHATSAPP_NUMBER = '2349120925909';
const CONTACT_EMAIL = 'yimaphilemon56@gmail.com';

/** Resolves to { ok } — never rejects, so no caller needs a catch. */
function recordLead(fields) {
  try {
    return fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      keepalive: true,
      body: JSON.stringify(Object.assign({ access_key: WEB3FORMS_KEY }, fields)),
    })
      .then((res) => res.json().catch(() => ({})))
      .then((data) => ({ ok: !!data && data.success === true }))
      // Offline, blocked, or rate-limited. The WhatsApp handoff still runs;
      // the direct route surfaces this to the visitor.
      .catch(() => ({ ok: false }));
  } catch (e) {
    return Promise.resolve({ ok: false });
  }
}

/** Reads the shared bits of the contact form, or null if it isn't on the page. */
function contactFormParts() {
  const form = document.querySelector('.contact-form');
  if (!form) return null;

  const card = form.closest('.glass-card') || form.parentElement;
  const value = (name) => {
    const field = form.querySelector('[name="' + name + '"]');
    return field ? field.value.trim() : '';
  };

  return {
    form: form,
    value: value,
    successEl: card && card.querySelector('.form-success-msg'),
    errorEl: card && card.querySelector('.form-error-msg'),
  };
}

function showFormError(parts, message) {
  if (!parts.errorEl) { alert(message); return; }
  if (parts.successEl) parts.successEl.style.display = 'none';
  parts.errorEl.textContent = message;
  parts.errorEl.style.display = 'block';
  parts.errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Validates and builds the payload once, so the form and the WhatsApp button
 * can never disagree about what counts as a complete enquiry.
 * Returns null (having shown the reason) if anything is missing.
 */
function composeEnquiry(parts) {
  const name = parts.value('name');
  const email = parts.value('email');
  const message = parts.value('message');

  if (!name || !email || !message) {
    showFormError(parts, 'Please fill in your name, email, and a short message.');
    return null;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFormError(parts, 'That email address doesn’t look right. Please check it and try again.');
    return null;
  }

  return {
    name: name,
    body: [
      'Hi Yima, I’m ' + name + ' (' + email + ').',
      '',
      message,
    ].join('\n'),
    fields: {
      subject: 'Portfolio enquiry from ' + name,
      from_name: 'Yima Philemon portfolio',
      name: name,
      email: email,
      message: message,
    },
  };
}

function initContactForm() {
  const parts = contactFormParts();
  if (!parts) return;

  const submitBtn = parts.form.querySelector('button[type="submit"]');
  const label = submitBtn ? submitBtn.textContent : '';

  parts.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const enquiry = composeEnquiry(parts);
    if (!enquiry) return;

    if (parts.errorEl) parts.errorEl.style.display = 'none';
    // A handoff message from an earlier attempt would otherwise sit above a
    // form the visitor is now re-sending.
    if (parts.successEl) parts.successEl.style.display = 'none';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
      submitBtn.textContent = 'Sending…';
    }

    recordLead(Object.assign({ chosen_channel: 'direct' }, enquiry.fields)).then((res) => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-busy');
        submitBtn.textContent = label;
      }

      if (!res.ok) {
        showFormError(
          parts,
          'Sorry — that didn’t go through. Please check your connection and try again, '
            + 'or use the arrow beside the button to send on WhatsApp or by email instead.'
        );
        return;
      }

      parts.form.reset();
      goToThankYou(enquiry.name);
    });
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
        <h4>${data.name}${badge}</h4>
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
      <h4>${repo}${badge}</h4>
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

/**
 * Split send button: the caret half opens the handoff routes.
 * The routes themselves are wired in initSendRoutes; this only owns open/close
 * and the keyboard behaviour a menu button implies.
 */
function initSendSplit() {
  document.querySelectorAll('[data-send-split]').forEach((split) => {
    const toggle = split.querySelector('.send-split-toggle');
    const menu = split.querySelector('.send-split-menu');
    const options = Array.from(split.querySelectorAll('.send-split-option'));
    if (!toggle || !menu || !options.length) return;

    function setOpen(open) {
      split.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      options.forEach((o) => { o.tabIndex = open ? 0 : -1; });
    }

    toggle.addEventListener('click', () => {
      const opening = !split.classList.contains('open');
      setOpen(opening);
      // Deferred a frame: the menu is visibility:hidden until the open class
      // lands, and a hidden element silently refuses focus.
      if (opening) requestAnimationFrame(() => options[0].focus());
    });

    options.forEach((o) => o.addEventListener('click', () => setOpen(false)));

    menu.addEventListener('keydown', (e) => {
      const i = options.indexOf(document.activeElement);
      if (i === -1) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); options[(i + 1) % options.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); options[(i - 1 + options.length) % options.length].focus(); }
    });

    document.addEventListener('click', (e) => {
      if (split.classList.contains('open') && !split.contains(e.target)) setOpen(false);
    });
    split.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && split.classList.contains('open')) { setOpen(false); toggle.focus(); }
    });

    setOpen(false);
  });
}

/**
 * The two handoff routes behind the caret. Both record the enquiry here first
 * — see recordLead for why this one is deliberately not awaited.
 */
function initSendRoutes() {
  const parts = contactFormParts();
  if (!parts) return;

  parts.form.querySelectorAll('[data-send]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const channel = btn.getAttribute('data-send');
      const enquiry = composeEnquiry(parts);
      if (!enquiry) return;

      const saved = recordLead(Object.assign({ chosen_channel: channel }, enquiry.fields));

      if (channel === 'whatsapp') {
        window.open(
          'https://wa.me/' + CONTACT_WHATSAPP_NUMBER + '?text=' + encodeURIComponent(enquiry.body),
          '_blank'
        );
      } else {
        // A synthesised anchor click rather than assigning location.href: iOS
        // Safari sometimes blocks programmatic mailto: navigation, and a popup
        // would leave a blank tab behind on desktop.
        const a = document.createElement('a');
        a.href = 'mailto:' + CONTACT_EMAIL
          + '?subject=' + encodeURIComponent(enquiry.fields.subject)
          + '&body=' + encodeURIComponent(enquiry.body);
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }

      if (parts.errorEl) parts.errorEl.style.display = 'none';
      if (!parts.successEl) return;

      const opened = {
        whatsapp: 'WhatsApp should have opened with your message ready — press send there to reach me.',
        email: 'Your email app should have opened with the message ready — press send there to reach me.',
      };
      parts.successEl.textContent = 'Thanks, ' + enquiry.name + '! '
        + (opened[channel] || opened.email);
      parts.successEl.style.display = 'block';
      parts.successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Only claim the details were captured once they actually were.
      saved.then((res) => {
        if (!res.ok || !parts.successEl.isConnected) return;
        const note = document.createElement('span');
        note.className = 'form-success-note';
        note.textContent = 'I’ve also received your details here, so I can reach you either way.';
        parts.successEl.appendChild(note);
      });
    });
  });
}

/**
 * Hands off to the thank-you page after a confirmed send.
 *
 * The visitor's name travels in sessionStorage rather than a query string on
 * purpose: a ?name= would show up in analytics page reports, in browser history
 * and in any referrer header, which is no place for someone's name. This keeps
 * it in the tab, where it is read once and immediately discarded.
 *
 * location.replace rather than assign, so Back doesn't return to a form that
 * has already been submitted.
 */
const THANKS_KEY = 'yp_thanks';

function goToThankYou(name) {
  try {
    sessionStorage.setItem(THANKS_KEY, JSON.stringify({ name: name }));
  } catch (e) { /* private mode — the page falls back to its generic copy */ }
  window.location.replace('/thank-you/');
}

function initThankYou() {
  const heading = document.querySelector('[data-thanks-heading]');
  if (!heading) return;

  let data = null;
  try {
    const raw = sessionStorage.getItem(THANKS_KEY);
    if (raw) data = JSON.parse(raw);
    // Read once: a refresh, or a later visit, gets the generic page rather than
    // greeting someone by a name from a submission they've forgotten.
    sessionStorage.removeItem(THANKS_KEY);
  } catch (e) { /* fall through to the generic copy */ }

  if (!data || !data.name) return;
  const nameEl = heading.querySelector('[data-thanks-name]');
  // textContent, not innerHTML — this is visitor input echoed back to the page.
  if (nameEl) nameEl.textContent = ', ' + data.name;
}

/**
 * Floating contact speed-dial, bottom-right, on every page. Injected here
 * rather than pasted into each HTML file, so one change reaches the whole site.
 * A "+" toggle expands into three routes rather than linking straight to
 * WhatsApp, since a visitor might prefer any of them.
 *
 * Messenger uses m.me/<username>, which opens a thread with the profile
 * directly, instead of facebook.com/<username>, which only opens the page.
 */
const FACEBOOK_USERNAME = 'philemon.unity.1';

function initContactFab() {
  if (document.querySelector('.fab')) return;

  const whatsappIcon = '<svg viewBox="0 0 24 24" aria-hidden="true">'
    + '<path fill="currentColor" d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.335 4.963L2 22l5.233-1.372a9.948 9.948 0 0 0 4.778 1.22h.005c5.505 0 9.988-4.478 9.99-9.985A9.97 9.97 0 0 0 12.012 2zm4.846 13.197c-.267.751-1.353 1.378-1.854 1.488c-.452.1-1.042.181-2.923-.6a10.974 10.974 0 0 1-4.707-4.148c-.689-.916-1.12-1.956-1.12-3.037c0-1.196.623-1.787.848-2.022c.189-.197.49-.297.79-.297c.1 0 .195.005.282.009c.28.013.42.03.602.413c.224.473.766 1.867.831 2.001c.066.134.11.291.02.467c-.087.177-.132.29-.265.447c-.132.156-.277.348-.396.467c-.131.131-.269.274-.117.535c.151.258.675 1.112 1.445 1.8c.995.888 1.826 1.162 2.087 1.293c.26.13.413.109.567-.068c.153-.177.656-.763.831-1.024c.174-.26.35-.219.588-.13c.24.089 1.517.716 1.78.85c.262.133.437.2.503.312c.066.113.066.657-.201 1.408z"/>'
    + '</svg>';
  const messengerIcon = '<svg viewBox="0 0 24 24" aria-hidden="true">'
    + '<path fill="currentColor" d="M12 2C6.3 2 2 6.16 2 11.7c0 2.9 1.18 5.42 3.1 7.16c.16.15.26.35.27.57l.05 1.75c.02.56.6.92 1.11.7l1.95-.86c.17-.08.36-.09.54-.04c.94.26 1.94.4 2.98.4c5.7 0 10-4.16 10-9.7C22 6.16 17.7 2 12 2zm6 7.46l-2.94 4.66c-.47.74-1.47.92-2.16.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.68-.63l2.94-4.66c.47-.74 1.47-.92 2.16-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.16-2.4c.42-.32.97.18.68.63z"/>'
    + '</svg>';
  const mailIcon = '<svg viewBox="0 0 24 24" aria-hidden="true">'
    + '<path d="M3 6.5h18v11H3z M3 7l9 6 9-6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>'
    + '</svg>';
  const plusIcon = '<svg viewBox="0 0 24 24" aria-hidden="true">'
    + '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'
    + '</svg>';

  const message = 'Hi Yima, I found your portfolio and would like to talk about a project.';

  const fab = document.createElement('div');
  fab.className = 'fab';
  fab.innerHTML = ''
    + '<div class="fab-menu">'
    + '  <a class="fab-action fab-action-whatsapp" href="https://wa.me/' + CONTACT_WHATSAPP_NUMBER
    + '?text=' + encodeURIComponent(message) + '" target="_blank" rel="noopener" tabindex="-1">'
    + whatsappIcon + '<span>WhatsApp</span></a>'
    + '  <a class="fab-action fab-action-messenger" href="https://m.me/' + FACEBOOK_USERNAME + '"'
    + ' target="_blank" rel="noopener" tabindex="-1">' + messengerIcon + '<span>Messenger</span></a>'
    + '  <a class="fab-action fab-action-contact" href="/contact/" tabindex="-1">'
    + mailIcon + '<span>Contact Me</span></a>'
    + '</div>'
    + '<button type="button" class="fab-toggle" aria-label="Open contact options" aria-expanded="false">'
    + plusIcon + '</button>';
  document.body.appendChild(fab);

  const toggle = fab.querySelector('.fab-toggle');
  const actions = Array.from(fab.querySelectorAll('.fab-action'));

  function setOpen(open) {
    fab.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close contact options' : 'Open contact options');
    actions.forEach((a) => { a.tabIndex = open ? 0 : -1; });
  }

  toggle.addEventListener('click', () => setOpen(!fab.classList.contains('open')));
  actions.forEach((a) => a.addEventListener('click', () => setOpen(false)));

  document.addEventListener('click', (e) => {
    if (fab.classList.contains('open') && !fab.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fab.classList.contains('open')) { setOpen(false); toggle.focus(); }
  });

  setOpen(false);
}

/**
 * Light / dark theme.
 *
 * The stored choice is applied by a tiny inline script in each <head>, before
 * first paint, so the page can never flash the wrong theme. This only owns the
 * toggle button and persisting the change. No stored choice means "follow the
 * system", which is what the media query in the stylesheet handles.
 */
const THEME_KEY = 'yp_theme';

function initTheme() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  const current = () => {
    const set = document.documentElement.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const apply = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* private mode */ }
  };

  apply(current());
  btn.addEventListener('click', () => apply(current() === 'light' ? 'dark' : 'light'));
}

/**
 * Titles the LinkedIn badge iframe.
 *
 * The badge script injects its own iframe, and an iframe with no title is
 * announced as just "frame". We cannot add the attribute in the markup because
 * the element does not exist until LinkedIn’s script runs, so this watches for
 * it and labels it on arrival. The observer disconnects once it has done its job,
 * or after 15s if the script never loads (blocked, offline).
 */
function titleLinkedInBadgeFrame() {
  const host = document.querySelector('.LI-profile-badge');
  if (!host) return;

  const label = (frame) => {
    if (frame.getAttribute('title')) return false;
    frame.setAttribute('title', 'Yima Philemon on LinkedIn');
    return true;
  };

  const existing = host.querySelector('iframe');
  if (existing && label(existing)) return;

  const observer = new MutationObserver(() => {
    const frame = host.querySelector('iframe');
    if (frame && label(frame)) observer.disconnect();
  });
  observer.observe(host, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 15000);
}
