# Requirements — To-Do List Life Dashboard

> Status: **Draft — awaiting approval before design.md is written**

---

## 1. Functional Requirements

### 1.1 Greeting Widget

| ID | Requirement |
|---|---|
| F-G1 | The dashboard shall display the current date in a human-readable format (e.g., "Friday, July 3, 2026"). |
| F-G2 | The dashboard shall display the current time, updated live every second (e.g., "14:05:32"). |
| F-G3 | The greeting text shall change based on the current hour: **Good Morning** (05:00–11:59), **Good Afternoon** (12:00–16:59), **Good Evening** (17:00–20:59), **Good Night** (21:00–04:59). |
| F-G4 | If a custom name has been saved (see F-N1), the greeting shall include it: e.g., "Good Morning, Gilang!". |
| F-G5 | If no name has been saved, the greeting shall display without a name: e.g., "Good Morning!". |

### 1.2 Custom Name (Challenge)

| ID | Requirement |
|---|---|
| F-N1 | The user shall be able to enter and save their name via a text input and a Save button. |
| F-N2 | The saved name shall be persisted in `localStorage` and restored on every page load. |
| F-N3 | The user shall be able to clear or change the saved name at any time. |

### 1.3 Focus Timer

| ID | Requirement |
|---|---|
| F-T1 | The timer shall count down from exactly 25 minutes (25:00) to 00:00. |
| F-T2 | The timer shall display time in MM:SS format at all times. |
| F-T3 | A **Start** button shall begin the countdown. Once running, the button shall change to **Stop** (pause). |
| F-T4 | A **Stop/Pause** button shall pause the countdown without resetting it. |
| F-T5 | A **Reset** button shall stop the countdown and return the display to 25:00. |
| F-T6 | When the countdown reaches 00:00 the timer shall stop automatically and give the user a visual or audio cue (e.g., the display flashes or an alert fires). |
| F-T7 | The timer state (running/paused/reset) shall **not** persist across page refreshes — it always resets to 25:00 on load. |

### 1.4 To-Do List

| ID | Requirement |
|---|---|
| F-D1 | The user shall be able to type a task in an input field and add it by pressing Enter or clicking an Add button. |
| F-D2 | Each task item shall display the task text, a checkbox to mark it complete, an Edit button, and a Delete button. |
| F-D3 | Checking a task's checkbox shall visually mark it as done (e.g., strikethrough text) and persist the done state. |
| F-D4 | Clicking Edit shall make the task text editable in-place (or via the same input field). Saving shall update the task in the list and in `localStorage`. |
| F-D5 | Clicking Delete shall remove the task from the list and from `localStorage`. |
| F-D6 | All tasks shall be persisted in `localStorage` and restored in the same order on every page load. |
| F-D7 | **(Challenge)** If the user tries to add a task whose text (trimmed, case-insensitive) exactly matches an existing task, the action shall be blocked and a warning message shall be shown to the user. |

### 1.5 Quick Links

| ID | Requirement |
|---|---|
| F-L1 | The user shall be able to enter a URL and an optional label, then save it as a Quick Link button. |
| F-L2 | Each Quick Link shall be displayed as a clickable button/card. Clicking it shall open the URL in a new browser tab. |
| F-L3 | Each Quick Link shall have a Delete button to remove it from the list and from `localStorage`. |
| F-L4 | All Quick Links shall be persisted in `localStorage` and restored on every page load. |
| F-L5 | If no label is provided, the button shall display the URL itself (truncated if necessary). |

### 1.6 Light / Dark Mode (Challenge)

| ID | Requirement |
|---|---|
| F-M1 | The dashboard shall include a toggle button (e.g., a sun/moon icon or "Light / Dark" text) to switch between light and dark colour themes. |
| F-M2 | The selected theme shall be persisted in `localStorage` and applied immediately on every page load (no flash of wrong theme). |
| F-M3 | The toggle button shall reflect the current active mode. |

---

## 2. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-1 | **Stack** — HTML5, CSS3, and Vanilla JavaScript (ES6+) only. No frameworks, no CDN scripts, no backend. |
| NFR-2 | **Storage** — All persistence via `localStorage` only. |
| NFR-3 | **File structure** — Exactly `index.html` (root), `css/style.css`, `js/script.js`. No additional CSS or JS files. |
| NFR-4 | **Compatibility** — Must work in the latest stable release of Chrome, Firefox, Edge, and Safari. |
| NFR-5 | **Performance** — Page shall load and become interactive with no perceptible delay on a standard laptop. |
| NFR-6 | **Responsive layout** — The UI shall be usable on both mobile (≥ 320 px) and desktop (≥ 1024 px) screen widths. |
| NFR-7 | **Readability** — Code shall use descriptive names and comments on non-obvious logic. |
| NFR-8 | **Accessibility** — Interactive elements (buttons, inputs) shall have visible focus states and meaningful labels. |

---

## 3. Constraints

- No `npm install`, no build step, no dev server — the project must run by opening `index.html` directly.
- No external fonts or icon libraries fetched from a CDN.
- The timer does **not** need to survive a page refresh (no persistence required for timer state).

---

## 4. Out of Scope (for this MVP)

- User accounts / cloud sync
- Multiple timer durations (Pomodoro short/long breaks)
- Task categories, tags, or priorities
- Drag-and-drop reordering
- Notifications via the browser Notifications API

---

## 5. Open Questions

| # | Question | Default assumption if not answered |
|---|---|---|
| Q1 | Should the focus timer play a sound when it reaches 00:00, or only a visual cue? | Visual cue only (no audio) — avoids autoplay restrictions. |
| Q2 | Should completed to-do items move to the bottom of the list, or stay in place? | Stay in place (order unchanged). |
| Q3 | Should Quick Links support editing after they are saved, or only add/delete? | Add and delete only for MVP simplicity. |
