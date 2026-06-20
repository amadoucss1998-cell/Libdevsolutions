# LibDev Solutions — Business Website

A professional, animated single-page marketing website for **LibDev Solutions**
(web & mobile app development — Monrovia, Liberia).

> **We Code. You Grow.**

## ✨ Features

- Modern dark UI with electric-blue brand gradient (matches the LibDev flyer)
- Animated constellation/particle background (HTML canvas)
- Scroll-reveal animations, animated stat counters, scroll progress bar
- Interactive service cards (cursor spotlight) and a 3D-tilt hero code card
- Floating chips, marquee strip, sticky glass navbar with mobile menu
- Sections: Hero · Services · Why Me · Process · CTA · Contact
- Working contact form (opens the visitor's mail app — no backend needed)
- Floating WhatsApp button + click-to-call / click-to-email
- Fully responsive and accessible (respects `prefers-reduced-motion`)
- **Zero build step / no dependencies** — pure HTML, CSS, JavaScript

## 📁 Structure

```
index.html    # markup & content
styles.css    # all styling + animations
script.js     # interactions, reveal, counters, particle background
```

## 🚀 Run locally

Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## 🌐 Deploy

Any static host works:

- **GitHub Pages** — Settings → Pages → deploy from branch (root).
- **Netlify / Vercel** — drag-and-drop the folder, or connect this repo.

## ✏️ Customize

- **Contact details** — phone, email and WhatsApp number live in `index.html`
  (search for `0886933223`, `hello@libdevsolutions.com`, `wa.me`).
- **Colors** — edit the CSS variables at the top of `styles.css` (`:root`).
- **Social links** — update the `#` hrefs in the `.socials` block.

> ⚠️ The WhatsApp links use `2310886933223` (Liberia country code 231 +
> your number). Double-check this is correct before sharing widely.
