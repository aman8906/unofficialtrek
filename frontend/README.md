# Unofficial Trek - Frontend (React + Vite + Tailwind CSS v4)

    npm install
    npm run dev        # http://localhost:5173
    npm run build

Public site: /      Admin panel: /admin  (demo login: admin@unofficialtrek.com / admin123)

## Match the reference site exactly (colour, font, size)
All design values live in ONE place: the `@theme { ... }` block at the top of `src/index.css` (Tailwind v4 has no tailwind.config.js).
Font links are in `index.html`; type scale (h1/h2/h3) and the heading underline are also in `src/index.css`.
Tailwind v4 needs Chrome 111+, Safari 16.4+, Firefox 128+.
Measure the reference site with Chrome DevTools (see analysis document, Section 4) and paste the real values there.
The current values are a clean placeholder palette, NOT measured from the reference site.

## Data
Runs on sample data (`src/data/mock.js`) with VITE_USE_MOCK=true. The admin panel saves into localStorage, and the public site reads it,
so changes made in admin show on the website. For the backend step set `VITE_USE_MOCK=false` and `VITE_API_URL`;
every call lives in `src/services/api.js`.

## Structure
src/components  Header (menu toggle, search button, season dropdown), Footer, SearchOverlay, TrekCard, sections (home blocks), Forms, ui
src/pages       Home, Treks (filters), SeasonPage, TrekDetail, Rafting/Bungee, Villages, Weather, About, Contact
src/admin       Login, Layout, Dashboard, config-driven ResourcePage (CRUD), Settings
