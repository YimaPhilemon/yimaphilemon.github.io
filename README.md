# yimaphilemon.github.io

Personal portfolio site for Yima Philemon — Unity developer, level designer, and Flutter developer. Live at [yimaphilemon.github.io](https://yimaphilemon.github.io/).

A static site, no build step or framework — plain HTML, CSS, and vanilla JavaScript, deployed via GitHub Pages.

## Features

- Dark glassmorphic design system (`files/main_style.css`)
- Responsive nav, lightbox gallery, and screenshot slideshow (`files/portfolio.js`)
- Contact form wired to a Google Sheet via a Google Apps Script Web App (no backend to host) — see `files/google-apps-script.gs.txt`
- "Developer Snapshot" section that pulls live GitHub stats and pinned repos straight from GitHub's public REST API, with graceful fallbacks if the API is rate-limited
- Clean folder-based URLs (`/gallery/`, `/contact/`, `/resources/`) with redirect stubs for the old `.html` links
- SEO basics: sitemap (with image sitemap extension), robots.txt, Open Graph/Twitter meta tags, and JSON-LD structured data

## Project structure

```
index.html            Home page
gallery/index.html     Gallery ( /gallery/ )
contact/index.html     Contact ( /contact/ )
resources/index.html   Recommended tools / affiliate links ( /resources/ )
files/
  main_style.css        Styles
  portfolio.js          All client-side JS
  favicon.svg           Site icon
  google-apps-script.gs.txt   Backend for the contact form (paste into Google Apps Script)
uploads/                Images and screenshots
sitemap.xml, robots.txt Search engine files
```

`gallery.html`, `contact.html`, and `resources.html` at the root are redirect stubs kept for old bookmarks/links — the real pages live at the folder URLs above.

## Using this as a template

The code is MIT-licensed and free to reuse — but **the personal content is not** (see [LICENSE](LICENSE) for the exact scope). If you fork this as a starting point, replace:

- [ ] Name, bio, and testimonials throughout `index.html`, `gallery/index.html`, `contact/index.html`
- [ ] Everything in `uploads/` (photos, screenshots)
- [ ] Contact details and social links (email, phone, WhatsApp, LinkedIn, etc.)
- [ ] The resume link
- [ ] The GitHub username in the "Developer Snapshot" section (`data-gh-username` / `data-gh-repos` attributes in `index.html`)
- [ ] The Google Apps Script URL in `files/portfolio.js` (`CONTACT_FORM_ENDPOINT`) — point it at your own deployment
- [ ] The Google Analytics ID (`G-QBP4PEKW8Z`) and Google Search Console verification file
- [ ] The affiliate links and disclosure on `resources/index.html`, or remove that page entirely

## License

Code: [MIT](LICENSE). Personal content (name, photos, bio, contact info, resume, affiliate links): all rights reserved, not covered by the license. See [LICENSE](LICENSE) for the full split.
