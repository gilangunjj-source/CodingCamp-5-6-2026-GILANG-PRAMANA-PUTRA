# Product — To-Do List Life Dashboard

## What It Is

A single-page personal dashboard that helps a user organize their day at a glance.
Everything lives on one screen: the current time and date, a focus timer, a to-do list,
and a set of quick-launch links to favorite websites.

There is no login, no server, and no installation. Open `index.html` in a browser and
it works immediately.

## Who It's For

A beginner learning software engineering fundamentals — someone who wants a practical,
low-stakes project to practice HTML, CSS, and JavaScript while building something
genuinely useful for daily use.

## Core Features (MVP)

| Feature | Description |
|---|---|
| Greeting | Shows live current date/time and a greeting that changes by time of day (morning / afternoon / evening / night). Supports a custom saved name. |
| Focus Timer | 25-minute countdown with Start / Stop / Reset controls, displayed as MM:SS. |
| To-Do List | Add, edit, mark complete, and delete tasks. Duplicate task text is blocked with a warning. Persists across page refreshes. |
| Quick Links | Add buttons that open a saved URL in a new tab. Persists across page refreshes. |

## Challenges (also required)

- **Light / Dark mode toggle** — user preference saved and restored on reload.
- **Custom name in greeting** — user sets their name once; greeting becomes "Good Morning, [Name]".
- **Duplicate task prevention** — identical task text is blocked or warned before saving.

## Non-Functional Goals

- **Simplicity** — clean, minimal UI, no complex setup, no test framework required.
- **Performance** — fast load, responsive interactions, no lag on updates.
- **Visual Design** — friendly aesthetic, clear visual hierarchy, readable typography,
  responsive on both mobile and desktop.
- **Compatibility** — must work in modern Chrome, Firefox, Edge, and Safari.
