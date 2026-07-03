# Tasks — To-Do List Life Dashboard

> Work through these **in order**. Each task is small enough to implement and
> manually test before moving to the next one.
>
> Legend: ⬜ = not started · 🔄 = in progress · ✅ = done

---

## Phase 1 — Project Scaffold

### Task 1 — Create the folder structure
✅

**What to do:**
- Create the following files (empty for now):
  - `index.html` at the project root
  - `css/style.css`
  - `js/script.js`

**How to test:**
- Open `index.html` in a browser — it loads without errors (blank page is fine).
- Open DevTools → Console — no errors.

---

### Task 2 — Write the HTML skeleton
✅

**What to do:**
Add the full HTML skeleton to `index.html` with:
- Correct `<!DOCTYPE html>`, `<html lang="en">`, `<head>` (charset, viewport, title).
- `<link>` to `css/style.css`.
- `<script src="js/script.js" defer>` at the end of `<head>` (or before `</body>`).
- A `<body>` with placeholder `<section>` tags for: header, greeting, timer, todo, links.
- Every element must have the `id` values defined in design.md (e.g. `id="greeting-text"`, `id="timer-display"`, etc.).

**How to test:**
- Open `index.html` — raw text/placeholder content is visible.
- DevTools → Console — no errors.
- DevTools → Elements — confirm all required `id` attributes are present.

---

## Phase 2 — Styling Foundation

### Task 3 — Add CSS variables and base styles
✅

**What to do:**
In `css/style.css`:
- Define `:root` with all CSS custom properties (colors, radius, shadow, font) from design.md §3.1.
- Set `box-sizing: border-box` on `*`.
- Set `background-color`, `color`, and `font-family` on `body` using the variables.

**How to test:**
- Reload `index.html` — background and text color should match the light theme palette.
- Temporarily add `class="dark-mode"` to `<body>` in the HTML → background should turn dark → remove it after.

---

### Task 4 — Layout: mobile single-column + desktop grid
✅

**What to do:**
In `css/style.css`:
- Style `<header>` as a flex row (space-between, sticky top).
- Style `#greeting` as centered text.
- Style `.dashboard-grid` as a single column by default.
- Add `@media (min-width: 768px)` that turns `.dashboard-grid` into a 2-column CSS Grid.
- Ensure `#links` spans full width below the grid.
- Add basic card styles (background, border-radius, padding, shadow) to each `<section>`.

**How to test:**
- Resize the browser window — at < 768 px sections stack vertically; at ≥ 768 px Timer and To-Do appear side by side.

---

## Phase 3 — Greeting & Clock

### Task 5 — Live clock and date display
✅

**What to do:**
In `js/script.js`:
- Define the `LS_KEYS` constants object.
- Write `updateClock()`:
  - Gets `new Date()`.
  - Formats the time as `HH:MM:SS` (zero-padded).
  - Formats the date as e.g. `"Friday, July 3, 2026"` using `toLocaleDateString`.
  - Updates `#datetime-text` with both strings.
- Call `updateClock()` once immediately, then `setInterval(updateClock, 1000)`.

**How to test:**
- Open the page — the current date and time appear in `#datetime-text`.
- Wait 3 seconds — the seconds counter increments in real time.

---

### Task 6 — Time-of-day greeting text
✅

**What to do:**
Inside `updateClock()` (extend Task 5):
- Read the current hour (0–23).
- Pick the correct greeting word:
  - 5–11 → "Good Morning"
  - 12–16 → "Good Afternoon"
  - 17–20 → "Good Evening"
  - 21–4  → "Good Night"
- Update `#greeting-text` with the greeting (no name yet — just e.g. "Good Morning!").

**How to test:**
- Temporarily set the hour check to a fixed value (e.g. `const hour = 8`) and verify each
  greeting word appears for the correct range → revert after.
- At the real current time the correct greeting should show.

---

## Phase 4 — Theme Toggle (Challenge)

### Task 7 — Light / Dark mode toggle
✅

**What to do:**
In `js/script.js`:
- Write `applyTheme()`:
  - Reads `LS_KEYS.theme` from localStorage.
  - If `"dark"`, adds `dark-mode` class to `<body>` and sets button label to "🌙".
  - Otherwise removes the class and sets button label to "☀️".
- Write `toggleTheme()`:
  - Flips `dark-mode` class on `<body>`.
  - Saves new theme value (`"dark"` or `"light"`) to localStorage.
  - Updates the button label.
- Attach `click` listener to `#theme-toggle` → `toggleTheme`.
- Call `applyTheme()` at the very start of `init()`.

In `css/style.css`:
- Add `body.dark-mode { ... }` block overriding the colour variables (from design.md §3.1).

**How to test:**
- Click the toggle — background/text colors flip between light and dark.
- Refresh the page — the last chosen theme is still applied (no flash).
- The button label/icon matches the current mode.

---

## Phase 5 — Custom Name (Challenge)

### Task 8 — Save and display custom name in greeting
✅

**What to do:**
In `js/script.js`:
- Write `loadName()`:
  - Reads `LS_KEYS.username` from localStorage.
  - If found, pre-fills `#name-input` with the saved name.
- Write `saveName()`:
  - Reads and trims the value of `#name-input`.
  - If not empty, saves to localStorage, then calls `updateClock()` to refresh greeting.
- Write `clearName()`:
  - Removes `LS_KEYS.username` from localStorage.
  - Clears `#name-input`.
  - Calls `updateClock()` to refresh greeting.
- In `updateClock()`: after picking the greeting word, read the saved name and build
  the final string — `"Good Morning, Gilang!"` if name exists, `"Good Morning!"` if not.
- Attach listeners: `#name-save` → `saveName`, `#name-clear` → `clearName`.
- Call `loadName()` inside `init()`.

**How to test:**
- Type your name → click Save → greeting updates to include your name immediately.
- Refresh the page → name is still there in the greeting and input.
- Click Clear → name disappears from greeting and input.

---

## Phase 6 — Focus Timer

### Task 9 — Timer display and formatting
✅

**What to do:**
In `js/script.js`:
- Declare `let timeLeft = 25 * 60` and `let timerInterval = null` and `let timerRunning = false`.
- Write `formatTime(seconds)`:
  - Returns a zero-padded `"MM:SS"` string (e.g. `"25:00"`, `"04:07"`).
- Set `#timer-display` to `formatTime(timeLeft)` on page load.

**How to test:**
- Open the page — display shows `25:00`.
- In the browser console run `formatTime(65)` — should return `"01:05"`.
- Run `formatTime(0)` — should return `"00:00"`.

---

### Task 10 — Start / Stop timer
✅

**What to do:**
In `js/script.js`:
- Write `startTimer()`:
  - Sets `timerRunning = true`.
  - Changes `#timer-start` label to `"Stop"`.
  - Starts `setInterval` (1 s), stored in `timerInterval`.
  - Each tick: `timeLeft--`, updates display, calls `timerFinished()` if `timeLeft === 0`.
- Write `stopTimer()`:
  - `clearInterval(timerInterval)`, sets `timerRunning = false`.
  - Changes `#timer-start` label back to `"Start"`.
- Write `handleTimerBtn()`:
  - If `timerRunning` → `stopTimer()`, else → `startTimer()`.
- Attach `#timer-start` → `handleTimerBtn`.

**How to test:**
- Click Start → countdown begins, button shows "Stop".
- Click Stop → countdown pauses, button shows "Start".
- Click Start again → countdown resumes from where it paused.

---

### Task 11 — Reset timer
✅

**What to do:**
In `js/script.js`:
- Write `resetTimer()`:
  - Calls `stopTimer()`.
  - Sets `timeLeft = 25 * 60`.
  - Updates `#timer-display` to `"25:00"`.
  - Removes the `.finished` CSS class from `#timer-display`.
- Attach `#timer-reset` → `resetTimer`.

**How to test:**
- Start the timer → let it count down a few seconds → click Reset → display returns to `25:00`.
- The button label returns to "Start".

---

### Task 12 — Timer completion visual cue
✅

**What to do:**
In `js/script.js`:
- Write `timerFinished()`:
  - Calls `stopTimer()`.
  - Adds class `finished` to `#timer-display`.

In `css/style.css`:
- Add a `@keyframes` pulse animation that flashes the timer display red.
- Apply it to `#timer-display.finished`.

**How to test:**
- In the console set `timeLeft = 2`, click Start → watch the timer reach `00:00` →
  the display flashes red and the button returns to "Start".

---

## Phase 7 — To-Do List

### Task 13 — localStorage helpers
✅

**What to do:**
In `js/script.js` (place near the top, before other features):
- Write `saveData(key, value)` — `localStorage.setItem(key, JSON.stringify(value))`.
- Write `loadData(key)` — returns `JSON.parse(localStorage.getItem(key))` or `null`.

**How to test:**
- In the browser console: `saveData('test', [1,2,3])` then `loadData('test')` → should
  return `[1, 2, 3]`.
- `loadData('nonexistent')` → should return `null`.

---

### Task 14 — Render the to-do list
✅

**What to do:**
In `js/script.js`:
- Declare `let tasks = []` (module-level).
- Write `renderTasks()`:
  - Clears `#todo-list`.
  - For each task in `tasks`, creates a `<li>` containing:
    - A `<input type="checkbox">` (checked if `task.done`).
    - A `<span>` with the task text (strikethrough + muted if `task.done`).
    - An Edit `<button>`.
    - A Delete `<button>`.
  - Appends each `<li>` to `#todo-list`.
- Write `loadTasks()`:
  - Reads from `loadData(LS_KEYS.tasks)` → assigns to `tasks` (default `[]`).
  - Calls `renderTasks()`.
- Call `loadTasks()` inside `init()`.

In `css/style.css`:
- Style `.todo-item` as a flex row.
- Style `.todo-item.done span` with `text-decoration: line-through` and muted color.

**How to test:**
- Manually insert test data in localStorage: `localStorage.setItem('dashboard_tasks',
  JSON.stringify([{id:1, text:"Test task", done:false}]))`.
- Refresh the page → the task appears in the list.

---

### Task 15 — Add a task
✅

**What to do:**
In `js/script.js`:
- Write `addTask()`:
  - Reads and trims `#todo-input` value.
  - If empty, do nothing (return early).
  - If duplicate (call `isDuplicate(text, null)`), show `#todo-warning` and return.
  - Otherwise: hide warning, push `{ id: Date.now(), text, done: false }` to `tasks`.
  - Calls `saveTasks()` then `renderTasks()`.
  - Clears `#todo-input`.
- Write `saveTasks()` — calls `saveData(LS_KEYS.tasks, tasks)`.
- Write `isDuplicate(text, excludeId)` — returns `true` if any task (other than
  `excludeId`) has the same trimmed, lowercased text.
- Attach: `#todo-add` → `addTask`; `#todo-input` keydown Enter → `addTask`.

**How to test:**
- Type a task → click Add (or press Enter) → task appears in list.
- Refresh → task is still there.
- Add the same task again → warning message appears, task is NOT added twice.
- Add a different task → warning disappears and task is added.

---

### Task 16 — Mark task done / undone
✅

**What to do:**
In `js/script.js`:
- Write `toggleDone(id)`:
  - Finds the task with matching `id` in `tasks`.
  - Flips its `done` property.
  - Calls `saveTasks()` then `renderTasks()`.
- In `renderTasks()`: attach checkbox `change` event → `toggleDone(task.id)`.
- In `css/style.css`: ensure `.todo-item.done span` is visually distinct (strikethrough).

**How to test:**
- Check a task's checkbox → text gets strikethrough styling.
- Refresh → task remains checked.
- Uncheck it → styling reverts.

---

### Task 17 — Delete a task
✅

**What to do:**
In `js/script.js`:
- Write `deleteTask(id)`:
  - Filters out the task with matching `id` from `tasks`.
  - Calls `saveTasks()` then `renderTasks()`.
- In `renderTasks()`: attach Delete button `click` event → `deleteTask(task.id)`.

**How to test:**
- Add two tasks → delete one → only the other remains.
- Refresh → deleted task does not reappear.

---

### Task 18 — Edit a task
✅

**What to do:**
In `js/script.js`:
- Write `startEdit(id)`:
  - Finds the `<li>` for this task.
  - Replaces the `<span>` with an `<input type="text">` pre-filled with current text.
  - Changes the Edit button label to "Save".
  - Re-binds the Edit button click → `saveEdit(id)`.
- Write `saveEdit(id)`:
  - Reads and trims the inline input value.
  - If empty, cancels (reverts to `renderTasks()`).
  - If duplicate (call `isDuplicate(newText, id)`), shows `#todo-warning`, returns.
  - Updates the matching task's `text` in `tasks`.
  - Calls `saveTasks()` then `renderTasks()`.
- In `renderTasks()`: attach Edit button click → `startEdit(task.id)`.

**How to test:**
- Click Edit on a task → text becomes an input field.
- Change the text → click Save → list updates with new text.
- Try saving with the same text as another task → warning appears, edit is not saved.
- Refresh → edited text persists.

---

## Phase 8 — Quick Links

### Task 19 — Render quick links
✅

**What to do:**
In `js/script.js`:
- Declare `let links = []` (module-level).
- Write `renderLinks()`:
  - Clears `#link-list`.
  - For each link, creates a wrapper `<div>` containing:
    - A `<button>` with the label (or truncated URL) that calls `openLink(link.url)`.
    - A small delete `<button>` (×) that calls `deleteLink(link.id)`.
- Write `loadLinks()`:
  - Reads from `loadData(LS_KEYS.links)` → assigns to `links` (default `[]`).
  - Calls `renderLinks()`.
- Call `loadLinks()` inside `init()`.

In `css/style.css`:
- Style `.link-btn` as a pill-shaped button (accent color).
- Style the delete button as a small inline ×.

**How to test:**
- Manually insert: `localStorage.setItem('dashboard_links',
  JSON.stringify([{id:1,url:"https://github.com",label:"GitHub"}]))`.
- Refresh → "GitHub" button appears; click it → opens GitHub in a new tab.

---

### Task 20 — Add and delete quick links
✅

**What to do:**
In `js/script.js`:
- Write `saveLinks()` — `saveData(LS_KEYS.links, links)`.
- Write `addLink()`:
  - Reads and trims `#link-url` and `#link-label`.
  - If URL is empty, do nothing.
  - Pushes `{ id: Date.now(), url, label }` to `links`.
  - Calls `saveLinks()` then `renderLinks()`.
  - Clears both inputs.
- Write `deleteLink(id)`:
  - Filters out the link with matching `id`.
  - Calls `saveLinks()` then `renderLinks()`.
- Write `openLink(url)` — `window.open(url, '_blank')`.
- Attach: `#link-add` → `addLink`.

**How to test:**
- Enter a URL + label → click Save → button appears in the links area.
- Enter a URL with no label → button shows the URL text.
- Click a link button → opens in a new tab.
- Click × on a link → it disappears.
- Refresh → saved links are still there; deleted ones are gone.

---

## Phase 9 — Polish & Accessibility

### Task 21 — Responsive layout check
✅

**What to do:**
- Open DevTools → toggle device toolbar.
- At 375 px width: all sections stack vertically, no horizontal scroll, text is readable.
- At 1024 px: Timer and To-Do are side by side.
- Fix any overflow or font-size issues found.

**How to test:**
- Visually confirm both breakpoints look clean.

---

### Task 22 — Accessibility: labels and focus styles
✅

**What to do:**
In `index.html`:
- Add `aria-label` to icon-only buttons (theme toggle, delete ×).
- Add `<label>` elements (or `aria-label`) to all `<input>` fields.
- Ensure every interactive element is reachable by Tab key.

In `css/style.css`:
- Add a visible `:focus-visible` outline to all buttons and inputs
  (do not remove the default outline without replacing it).

**How to test:**
- Tab through the entire page — focus indicator is always visible.
- Screen reader (or DevTools Accessibility panel) shows meaningful labels on all controls.

---

### Task 23 — Final wiring and smoke test
✅

**What to do:**
- Review `init()` — confirm every event listener is attached and every load/apply
  function is called.
- Open the page fresh (clear localStorage first via DevTools → Application →
  Storage → Clear All).
- Run through every feature manually:
  - [ ] Clock ticks, greeting changes by time of day.
  - [ ] Theme toggle persists after refresh.
  - [ ] Name save/clear updates greeting and persists.
  - [ ] Timer Start/Stop/Reset work; finishes with visual cue.
  - [ ] Tasks add (Enter + button), duplicate blocked, edit, check, delete, persist.
  - [ ] Links add, open in new tab, delete, persist.
- Open DevTools Console — zero errors.

---

## Task Summary

| # | Task | Phase |
|---|---|---|
| 1 | Create folder structure | Scaffold |
| 2 | HTML skeleton with all IDs | Scaffold |
| 3 | CSS variables and base styles | Styling |
| 4 | Responsive layout (mobile + desktop) | Styling |
| 5 | Live clock and date display | Greeting |
| 6 | Time-of-day greeting text | Greeting |
| 7 | Light / Dark mode toggle | Theme (Challenge) |
| 8 | Save and display custom name | Name (Challenge) |
| 9 | Timer display and formatTime() | Timer |
| 10 | Start / Stop timer | Timer |
| 11 | Reset timer | Timer |
| 12 | Timer completion visual cue | Timer |
| 13 | localStorage helpers | To-Do |
| 14 | Render to-do list | To-Do |
| 15 | Add a task + duplicate check | To-Do (Challenge) |
| 16 | Mark task done / undone | To-Do |
| 17 | Delete a task | To-Do |
| 18 | Edit a task | To-Do |
| 19 | Render quick links | Links |
| 20 | Add and delete quick links | Links |
| 21 | Responsive layout check | Polish |
| 22 | Accessibility labels + focus styles | Polish |
| 23 | Final wiring and smoke test | Polish |
