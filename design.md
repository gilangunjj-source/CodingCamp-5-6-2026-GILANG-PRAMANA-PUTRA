# Design — To-Do List Life Dashboard

> Status: **Draft — awaiting approval before tasks.md is written**

---

## 1. Page Layout (Visual Structure)

The entire app is one HTML page (`index.html`). The layout is a single centered
column on mobile, and a two-column grid on desktop (≥ 768 px).

```
┌─────────────────────────────────────────────────────┐
│  [☀/🌙 toggle]                          [Name input] │  ← Top bar
├─────────────────────────────────────────────────────┤
│           Good Morning, Gilang!                      │  ← Greeting
│           Friday, July 3, 2026  •  08:42:15          │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│   ⏱ Focus Timer      │   ✅ To-Do List              │
│   25:00              │   [ Add a task...  ] [Add]   │
│   [Start] [Reset]    │   ☐ Buy groceries  ✏ 🗑      │
│                      │   ☑ Read chapter 3 ✏ 🗑      │
├──────────────────────┴──────────────────────────────┤
│   🔗 Quick Links                                     │
│   [URL input] [Label input] [Save]                   │
│   [GitHub ×]  [YouTube ×]  [Gmail ×]                 │
└─────────────────────────────────────────────────────┘
```

On mobile all sections stack vertically in this order:
1. Top bar (theme toggle + name)
2. Greeting
3. Focus Timer
4. To-Do List
5. Quick Links

---

## 2. HTML Structure (`index.html`)

```
<body class="light-mode">          ← theme class toggled here
  <header>
    <button id="theme-toggle">     ← Light/Dark toggle
    <div id="name-form">           ← Name input + Save + Clear
  </header>

  <section id="greeting">
    <h1 id="greeting-text">        ← "Good Morning, Gilang!"
    <p id="datetime-text">         ← "Friday, July 3, 2026 • 08:42:15"
  </section>

  <main class="dashboard-grid">

    <section id="timer">
      <h2>Focus Timer</h2>
      <div id="timer-display">25:00</div>
      <div id="timer-controls">
        <button id="timer-start">Start</button>
        <button id="timer-reset">Reset</button>
      </div>
    </section>

    <section id="todo">
      <h2>To-Do List</h2>
      <div id="todo-form">
        <input id="todo-input" type="text" placeholder="Add a task…">
        <button id="todo-add">Add</button>
      </div>
      <p id="todo-warning" hidden>⚠ That task already exists!</p>
      <ul id="todo-list"></ul>      ← populated by JS
    </section>

  </main>

  <section id="links">
    <h2>Quick Links</h2>
    <div id="link-form">
      <input id="link-url"   type="url"  placeholder="https://…">
      <input id="link-label" type="text" placeholder="Label (optional)">
      <button id="link-add">Save</button>
    </div>
    <div id="link-list"></div>     ← populated by JS
  </section>

</body>
```

---

## 3. CSS Architecture (`css/style.css`)

### 3.1 Custom Properties (variables)

All colours are defined as CSS variables on `:root` so the dark theme only
needs to override the same set of variables on `body.dark-mode`.

```css
:root {
  --bg-color:        #f5f5f5;
  --surface-color:   #ffffff;
  --text-primary:    #1a1a1a;
  --text-secondary:  #555555;
  --accent-color:    #4f46e5;   /* indigo */
  --danger-color:    #ef4444;
  --border-color:    #e0e0e0;
  --shadow:          0 2px 8px rgba(0,0,0,0.08);
  --radius:          10px;
  --font:            'Segoe UI', system-ui, sans-serif;
}

body.dark-mode {
  --bg-color:        #1a1a2e;
  --surface-color:   #16213e;
  --text-primary:    #e0e0e0;
  --text-secondary:  #a0a0a0;
  --accent-color:    #818cf8;
  --border-color:    #2a2a4a;
  --shadow:          0 2px 8px rgba(0,0,0,0.4);
}
```

### 3.2 Layout

- Mobile-first base: single column, full width sections.
- `@media (min-width: 768px)`: `.dashboard-grid` becomes a 2-column CSS Grid
  with Timer on the left and To-Do on the right.
- `#links` spans full width below the grid in both layouts.

### 3.3 Component Styles (summary)

| Component | Key styles |
|---|---|
| `header` | Flex row, space-between, sticky top |
| `#greeting` | Centered text, large `h1`, subdued `p` |
| `#timer-display` | Monospace font, large size (3–4 rem), bold |
| `#timer-display.finished` | Red color + CSS animation (pulse/flash) |
| `.todo-item` | Flex row, checkbox left, text center, buttons right |
| `.todo-item.done span` | `text-decoration: line-through`, muted color |
| `.link-btn` | Pill-shaped button, accent background, small × delete |
| `#todo-warning` | Amber/orange text, shown/hidden via `hidden` attribute |

---

## 4. JavaScript Architecture (`js/script.js`)

The file is organized into clearly separated sections with a comment banner
for each one. There are no classes — just plain functions and a few module-level
variables for state.

### 4.1 File Sections (in order)

```
// ─── 1. CONSTANTS & STATE ─────────────────────────────
// ─── 2. LOCAL STORAGE HELPERS ─────────────────────────
// ─── 3. GREETING & CLOCK ──────────────────────────────
// ─── 4. THEME TOGGLE ──────────────────────────────────
// ─── 5. CUSTOM NAME ───────────────────────────────────
// ─── 6. FOCUS TIMER ───────────────────────────────────
// ─── 7. TO-DO LIST ────────────────────────────────────
// ─── 8. QUICK LINKS ───────────────────────────────────
// ─── 9. INIT (runs on page load) ──────────────────────
```

### 4.2 Constants & State

```js
const LS_KEYS = {
  tasks:    'dashboard_tasks',
  links:    'dashboard_links',
  theme:    'dashboard_theme',
  username: 'dashboard_username',
};

// Timer state
let timerInterval = null;   // holds setInterval reference
let timeLeft      = 25 * 60; // seconds remaining
let timerRunning  = false;
```

### 4.3 localStorage Helpers

Two tiny utility functions used everywhere else:

```js
function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function loadData(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}
```

### 4.4 Greeting & Clock

- `updateClock()` — called every second via `setInterval`.
  - Reads `new Date()`.
  - Formats the date string and time string.
  - Determines greeting word from the current hour.
  - Reads saved username from localStorage; appends it if present.
  - Updates `#greeting-text` and `#datetime-text` innerHTML.

### 4.5 Theme Toggle

- On load: read `LS_KEYS.theme`; apply `dark-mode` class to `<body>` if saved.
- `toggleTheme()` — flips `dark-mode` class on `<body>`, saves new value,
  updates the toggle button label/icon.

### 4.6 Custom Name

- On load: read `LS_KEYS.username`; pre-fill the name input if present.
- `saveName()` — reads input value, trims it, saves to localStorage,
  calls `updateClock()` to refresh the greeting immediately.
- `clearName()` — removes the key from localStorage, clears the input,
  refreshes the greeting.

### 4.7 Focus Timer

```
timerRunning = false
timeLeft     = 1500 (25 × 60 seconds)

startTimer()
  → if already running, do nothing
  → set timerRunning = true, change button label to "Stop"
  → setInterval every 1000 ms → tick()

tick()
  → timeLeft--
  → update #timer-display with formatTime(timeLeft)
  → if timeLeft === 0 → timerFinished()

stopTimer()
  → clearInterval, timerRunning = false, button label → "Start"

resetTimer()
  → stopTimer(), timeLeft = 1500, update display, remove .finished class

timerFinished()
  → stopTimer(), add .finished class to #timer-display (triggers CSS flash)

formatTime(seconds)
  → returns "MM:SS" string (zero-padded)
```

The Start button calls `startTimer()` when not running, `stopTimer()` when running
(one button, two labels — matches F-T3/F-T4).

### 4.8 To-Do List

**Data shape** stored in localStorage:
```js
[
  { id: 1234567890, text: "Buy groceries", done: false },
  { id: 1234567891, text: "Read chapter 3", done: true  }
]
```

Key functions:

| Function | What it does |
|---|---|
| `loadTasks()` | Reads array from localStorage; calls `renderTasks()` |
| `saveTasks()` | Writes current `tasks` array to localStorage |
| `renderTasks()` | Clears `#todo-list`; builds a `<li>` for each task |
| `addTask()` | Reads input, checks for duplicate (F-D7), pushes new object, saves, renders |
| `toggleDone(id)` | Flips `done` on the matching task, saves, renders |
| `deleteTask(id)` | Filters out the matching task, saves, renders |
| `startEdit(id)` | Replaces task text with an inline `<input>` + Save button |
| `saveEdit(id)` | Reads edited value, checks for duplicate, updates task, saves, renders |
| `isDuplicate(text, excludeId)` | Returns true if any other task has the same trimmed, lowercase text |

### 4.9 Quick Links

**Data shape** stored in localStorage:
```js
[
  { id: 1234567890, url: "https://github.com", label: "GitHub" },
  { id: 1234567891, url: "https://youtube.com", label: "" }
]
```

Key functions:

| Function | What it does |
|---|---|
| `loadLinks()` | Reads array from localStorage; calls `renderLinks()` |
| `saveLinks()` | Writes current `links` array to localStorage |
| `renderLinks()` | Clears `#link-list`; builds a `<button>` + delete `×` for each link |
| `addLink()` | Reads URL + label inputs, pushes new object, saves, renders |
| `deleteLink(id)` | Filters out the matching link, saves, renders |
| `openLink(url)` | Calls `window.open(url, '_blank')` |

If label is empty, the button displays the URL (truncated with CSS `text-overflow: ellipsis`).

### 4.10 Init

A single `init()` function called at the bottom of the file (after all functions
are defined) that wires everything up:

```js
function init() {
  applyTheme();           // 1. apply saved theme before anything renders
  loadTasks();            // 2. render saved tasks
  loadLinks();            // 3. render saved links
  loadName();             // 4. pre-fill name input
  updateClock();          // 5. show greeting/time immediately
  setInterval(updateClock, 1000);  // 6. tick every second

  // 7. attach all event listeners
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('name-save').addEventListener('click', saveName);
  document.getElementById('name-clear').addEventListener('click', clearName);
  document.getElementById('timer-start').addEventListener('click', handleTimerBtn);
  document.getElementById('timer-reset').addEventListener('click', resetTimer);
  document.getElementById('todo-add').addEventListener('click', addTask);
  document.getElementById('todo-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });
  document.getElementById('link-add').addEventListener('click', addLink);
}

init();
```

---

## 5. localStorage Key Reference

| Key | Type | Contents |
|---|---|---|
| `dashboard_tasks` | JSON array | Array of `{ id, text, done }` objects |
| `dashboard_links` | JSON array | Array of `{ id, url, label }` objects |
| `dashboard_theme` | string | `"dark"` or `"light"` |
| `dashboard_username` | string | User's display name, e.g. `"Gilang"` |

---

## 6. Decisions & Rationale

| Decision | Reason |
|---|---|
| One button for Start/Stop (label changes) | Simpler DOM, matches F-T3/F-T4 intent |
| Task/link IDs via `Date.now()` | Zero-dependency unique ID for a beginner project |
| `isDuplicate()` is case-insensitive + trimmed | Prevents near-duplicates that would confuse users |
| Theme class on `<body>`, not `:root` | Easier for beginners to understand; avoids FOUC with early script |
| `hidden` attribute for warning message | Semantic HTML; toggled with `.removeAttribute('hidden')` |
| No `class` / OOP | Scope: plain functions are easier for a beginner to read and debug |
