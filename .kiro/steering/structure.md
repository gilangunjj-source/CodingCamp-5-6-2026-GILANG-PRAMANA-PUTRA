# Structure — File & Folder Rules

## Required Layout

```
project-root/
├── index.html          ← single HTML entry point
├── css/
│   └── style.css       ← ALL styles go here, one file only
└── js/
    └── script.js       ← ALL JavaScript goes here, one file only
```

## Rules (non-negotiable)

1. **`index.html` lives at the project root.** Never nest it inside a subdirectory.
2. **Exactly one CSS file: `css/style.css`.** No other `.css` files anywhere in the project.
3. **Exactly one JS file: `js/script.js`.** No other `.js` files anywhere in the project.
4. **No inline `<style>` blocks in HTML** beyond a trivial one-liner if unavoidable.
   All styles belong in `css/style.css`.
5. **No inline `<script>` blocks in HTML.** All JavaScript belongs in `js/script.js`.
6. **HTML links the files with relative paths:**

```html
<link rel="stylesheet" href="css/style.css" />
<script src="js/script.js" defer></script>
```

## What These Rules Prevent

- Splitting code into multiple component files (not needed for this scope).
- Creating helper JS modules or partial CSS files.
- Adding a framework that would require extra files (build output, vendor bundles, etc.).

## Rationale

Keeping everything in two files forces a beginner to reason about code organization
within a single file — a foundational skill before introducing modules or bundlers.
It also makes the project trivially portable: zip the folder, send it, unzip, open
`index.html`. Done.
