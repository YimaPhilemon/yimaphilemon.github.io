# Portfolio Site Template

A dark, glassmorphic personal portfolio template — plain HTML, CSS, and vanilla JavaScript, no build step or framework. Deploys directly to GitHub Pages (or any static host).

This branch (`template`) has all personal content stripped out and replaced with clearly-labeled placeholders, so you can use it as a starting point for your own site. The original, fully-populated version lives on the `main` branch.

## Features

- Dark glassmorphic design system (`files/main_style.css`)
- Responsive nav, lightbox gallery, and screenshot slideshow (`files/portfolio.js`)
- Contact form wired to a Google Sheet via a Google Apps Script Web App (no backend to host) — see `files/google-apps-script.gs.txt`
- "Developer Snapshot" section that pulls live GitHub stats and pinned repos straight from GitHub's public REST API, with graceful fallbacks if the API is rate-limited
- Clean folder-based URLs (`/gallery/`, `/contact/`, `/resources/`) with redirect stubs for the old `.html` links
- SEO basics: sitemap (with image sitemap extension), robots.txt, Open Graph/Twitter meta tags, and JSON-LD structured data
- Optional "Recommended Tools" affiliate page (`resources/index.html`) — delete it if you don't need it

## Project structure

```
index.html              Home page
gallery/index.html      Gallery ( /gallery/ )
contact/index.html      Contact ( /contact/ )
resources/index.html    Recommended tools / affiliate links ( /resources/ ) - optional, delete if unused
files/
  main_style.css              Styles
  portfolio.js                All client-side JS
  favicon.svg                 Site icon - replace with your own
  placeholder-wide.svg         Generic wide image placeholder
  placeholder-square.svg       Generic square image placeholder
  google-apps-script.gs.txt    Backend for the contact form (paste into Google Apps Script)
sitemap.xml, robots.txt  Search engine files
```

`gallery.html`, `contact.html`, and `resources.html` at the root are redirect stubs for old bookmarks/links — the real pages live at the folder URLs above. Keep this pattern if you add more pages: put the page at `yourpage/index.html` and leave a redirect stub at `yourpage.html`.

## Setup checklist

Everything below is a placeholder. Go through each item before you publish:

- [ ] `files/theme/` is leftover, unused font/asset files from this site's original migration off Weebly — nothing in the HTML/CSS references them. Safe to delete, kept here rather than removed automatically.

- [ ] Replace `google07e185af0cbc9b53.html` at the repo root — that's the original owner's Google Search Console verification file and does nothing for you. Delete it and add your own if you use Search Console (Google gives you a new file with a unique name when you verify your own property).
- [ ] Name, bio, testimonials, and project descriptions throughout `index.html`, `gallery/index.html`, `contact/index.html`
- [ ] Every image — replace `files/placeholder-wide.svg` / `files/placeholder-square.svg` references with your own photos (there's no `uploads/` folder on this branch; add your own)
- [ ] Contact details and social links (email, phone, WhatsApp, LinkedIn, etc.) in `contact/index.html` and the hero section of `index.html`
- [ ] The resume/Upwork/YouTube links in the "Quick Links" card on `index.html`
- [ ] The video embeds (`<iframe src="about:blank">`) on `index.html` and `gallery/index.html` — point them at your own YouTube/Vimeo videos
- [ ] The GitHub username and repo list in the "Developer Snapshot" section (`data-gh-username` / `data-gh-repos` attributes in `index.html`)
- [ ] The Google Apps Script URL in `files/portfolio.js` (`CONTACT_FORM_ENDPOINT`) — deploy your own copy of `files/google-apps-script.gs.txt` and paste the resulting URL in; also set `NOTIFY_EMAIL` inside that script
- [ ] The timezone in `initLocalClock()` in `files/portfolio.js` (currently `UTC`)
- [ ] Add your own Google Analytics snippet (or remove the comment placeholder) and Search Console verification meta tag in each page's `<head>`
- [ ] Update every `canonical`, `og:url`, and `sitemap.xml` entry from `yourusername.github.io` to your actual domain
- [ ] The affiliate links and disclosure on `resources/index.html`, or delete that page (and its footer link on the other three pages) entirely

## License

Code: [MIT](LICENSE) — free to use, modify, and redistribute. See [LICENSE](LICENSE) for the full terms.
