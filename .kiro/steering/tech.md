# Tech — Constraints & Conventions

## Allowed Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (plain, no preprocessors) |
| Behaviour | Vanilla JavaScript (ES6+) |
| Persistence | Browser `localStorage` API |

**No frameworks, no libraries, no build tools.**
This means no React, Vue, Angular, Svelte, jQuery, Bootstrap, Tailwind, Vite, Webpack, etc.
The project must run by opening `index.html` directly in a browser — no `npm install`, no dev server.

## Storage Rules

- All persistent data (tasks, quick links, theme preference, user name) is stored exclusively
  in `localStorage`.
- Keys should be namespaced to avoid collisions, e.g. `dashboard_tasks`, `dashboard_links`,
  `dashboard_theme`, `dashboard_username`.
- Data is serialized with `JSON.stringify` / `JSON.parse`.
- The app must work correctly after a hard refresh (Ctrl+F5).

## JavaScript Conventions

- Use `const` / `let`; never `var`.
- Prefer descriptive function and variable names over single-letter abbreviations.
- Comment every non-obvious block of logic so a beginner can follow along.
- DOM queries should be cached in variables at the top of each logical section, not repeated inline.
- No inline event handlers in HTML (`onclick="…"`). Attach all listeners in `script.js`.

## CSS Conventions

- Use CSS custom properties (variables) for colours and spacing so light/dark mode is a
  one-class swap on `<body>`.
- Mobile-first: base styles target small screens; `@media` queries layer in desktop styles.
- No `!important` unless absolutely unavoidable.

## Browser Compatibility

Must work in the latest stable release of Chrome, Firefox, Edge, and Safari.
No polyfills are required — ES6+ features available in all four browsers are fine.

## What Is Explicitly Forbidden

- Any `<script src="...">` pointing to a CDN or external resource.
- Any `<link rel="stylesheet">` pointing to an external URL.
- Backend code of any kind (Node, PHP, Python, etc.).
- A `package.json`, `node_modules`, or any build artifact.
- Additional CSS or JS files beyond the two files defined in `structure.md`.
