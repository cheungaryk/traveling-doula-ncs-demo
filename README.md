# Traveling Doula NCS — Redesign Demo

Static HTML/CSS/JS demo redesign of [travelingdoulancs.com](https://travelingdoulancs.com/) for Gary Cheung’s review. Not for live deployment.

## Pages

| Page | File |
|------|------|
| Home | `index.html` |
| Services | `services.html` |
| Investment | `investment.html` |
| About | `about.html` |
| Testimonials | `testimonials.html` |
| Contact | `contact.html` |

Shared assets: `styles.css`, `main.js`, `assets/logo.png`

## Preview locally

From this folder:

```bash
python3 -m http.server 8765
```

Then open **http://127.0.0.1:8765/**

Or open any `.html` file directly in a browser (relative links still work).

## Design notes

- **Fonts:** Barlow Condensed (headings) + Rasa (body) — matching the live site. Body copy is `1.25rem` (20px at the default browser size), up from `1.0625rem` (17px), with headings, nav, cards, forms, and footer scaled to match.
- **Palette:** dark purple canvas (`#3D2270`) with live brand pink (`#FF8EDD`) and teal (`#4DBCC5`); cream body text; pink CTAs use dark purple label text (`#2A1A4A`) for WCAG AA (live site’s light-on-lavender combos are avoided)
- Mobile-first nav with accessible hamburger (aria-expanded, Escape, focus trap)
- Skip link, landmarks, visible teal focus rings, reduced-motion support

## Content

Rates, credentials, and testimonials are drawn from the live site and rewritten for scanability. The “site in gestation” messaging is removed. Contact form is front-end only (demo notice).
