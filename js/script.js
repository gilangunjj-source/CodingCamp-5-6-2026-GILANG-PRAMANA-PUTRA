// ============================================================
// js/script.js — All JavaScript for the To-Do List Life Dashboard
// ============================================================


// ─── 1. CONSTANTS & STATE ───────────────────────────────────

// localStorage keys — namespaced to avoid collisions
const LS_KEYS = {
  tasks:    'dashboard_tasks',
  links:    'dashboard_links',
  theme:    'dashboard_theme',
  username: 'dashboard_username',
};

// Timer state (will be set up in Task 9)
let timerInterval = null;
let timeLeft = 25 * 60;  // 25 minutes in seconds (will be overridden by init())
let timerRunning = false;

// To-Do and Links arrays (will be populated from localStorage)
let tasks = [];
let links = [];


// ─── 2. LOCAL STORAGE HELPERS ───────────────────────────────

/**
 * Save any data to localStorage as JSON.
 * @param {string} key - The localStorage key
 * @param {*} value - Any JSON-serializable value
 */
function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Load data from localStorage and parse it as JSON.
 * @param {string} key - The localStorage key
 * @returns {*} The parsed value, or null if not found
 */
function loadData(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}


// ─── 3. GREETING & CLOCK ────────────────────────────────────

/**
 * Updates the greeting text and date/time display.
 * Called once immediately, then every second via setInterval.
 */
function updateClock() {
  const now = new Date();

  // Format the time as HH:MM:SS (zero-padded)
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;

  // Format the date using the browser's locale (e.g., "Friday, July 3, 2026")
  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Combine date and time with a bullet separator
  const dateTimeText = `${dateString} • ${timeString}`;

  // Update the date/time paragraph
  document.getElementById('datetime-text').textContent = dateTimeText;

  // Determine greeting word based on current hour (0–23)
  const hour = now.getHours();
  let greetingWord;

  if (hour >= 5 && hour < 12) {
    greetingWord = 'Good Morning';
  } else if (hour >= 12 && hour < 17) {
    greetingWord = 'Good Afternoon';
  } else if (hour >= 17 && hour < 21) {
    greetingWord = 'Good Evening';
  } else {
    // 21:00–04:59
    greetingWord = 'Good Night';
  }

  // Build final greeting with saved name (if any)
  const savedName = loadData(LS_KEYS.username);
  const greetingText = savedName ? `${greetingWord}, ${savedName}!` : `${greetingWord}!`;
  document.getElementById('greeting-text').textContent = greetingText;
}


// ─── 4. THEME TOGGLE ────────────────────────────────────────

/**
 * Apply the saved theme preference on page load.
 * Reads from localStorage; adds/removes 'dark-mode' class on <body>.
 */
function applyTheme() {
  const savedTheme = loadData(LS_KEYS.theme);
  const body = document.body;
  const toggleBtn = document.getElementById('theme-toggle');

  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    toggleBtn.textContent = '🌙';  // moon icon for dark mode
    toggleBtn.setAttribute('aria-label', 'Switch to light mode');
  } else {
    body.classList.remove('dark-mode');
    toggleBtn.textContent = '☀️';  // sun icon for light mode
    toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
  }
}

/**
 * Toggle between light and dark theme.
 * Flips the 'dark-mode' class on <body> and saves the new preference.
 */
function toggleTheme() {
  const body = document.body;
  const toggleBtn = document.getElementById('theme-toggle');

  // Flip the class
  body.classList.toggle('dark-mode');

  // Determine the new theme and save it
  const isDarkMode = body.classList.contains('dark-mode');
  const newTheme = isDarkMode ? 'dark' : 'light';
  saveData(LS_KEYS.theme, newTheme);

  // Update button icon and aria-label
  if (isDarkMode) {
    toggleBtn.textContent = '🌙';
    toggleBtn.setAttribute('aria-label', 'Switch to light mode');
  } else {
    toggleBtn.textContent = '☀️';
    toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
  }
}


// ─── 5. CUSTOM NAME ─────────────────────────────────────────

/**
 * Load the saved name from localStorage and pre-fill the input field.
 * Called once on page load inside init().
 */
function loadName() {
  const savedName = loadData(LS_KEYS.username);
  if (savedName) {
    document.getElementById('name-input').value = savedName;
  }
}

/**
 * Save the name from the input to localStorage, then refresh the greeting.
 * Does nothing if the input is blank.
 */
function saveName() {
  const input = document.getElementById('name-input');
  const name = input.value.trim();

  if (!name) return;  // ignore empty input

  saveData(LS_KEYS.username, name);
  updateClock();  // refresh greeting immediately to show the new name
}

/**
 * Clear the saved name from localStorage and the input field,
 * then refresh the greeting to remove the name.
 */
function clearName() {
  localStorage.removeItem(LS_KEYS.username);
  document.getElementById('name-input').value = '';
  updateClock();  // refresh greeting immediately to remove the name
}


// ─── 6. FOCUS TIMER ─────────────────────────────────────────

/**
 * Read the duration input and return the value in seconds.
 * Clamps to a minimum of 1 minute and a maximum of 180 minutes.
 * @returns {number} Duration in seconds
 */
function getDurationSeconds() {
  const input = document.getElementById('timer-duration');
  let minutes = parseInt(input.value, 10);

  // Guard: if the user clears the field or types something invalid, default to 25
  if (isNaN(minutes) || minutes < 1) minutes = 1;
  if (minutes > 180) minutes = 180;

  // Keep the input in sync with the clamped value
  input.value = minutes;

  return minutes * 60;
}

/**
 * Convert a number of seconds into a "MM:SS" string.
 * Examples: 1500 → "25:00", 65 → "01:05", 0 → "00:00"
 * @param {number} seconds - Total seconds remaining
 * @returns {string} Zero-padded MM:SS string
 */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);   // whole minutes
  const s = seconds % 60;               // leftover seconds
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Called every second while the timer is running.
 * Decrements timeLeft, updates the display, triggers finish if at zero.
 */
function timerTick() {
  timeLeft--;
  document.getElementById('timer-display').textContent = formatTime(timeLeft);

  if (timeLeft <= 0) {
    timerFinished();
  }
}

/**
 * Start the countdown.
 * Guards against starting an already-running timer.
 */
function startTimer() {
  if (timerRunning) return;

  timerRunning = true;
  document.getElementById('timer-start').textContent = 'Stop';

  // Disable the duration input while the timer is running so the user
  // can't change it mid-countdown (confusing behaviour)
  document.getElementById('timer-duration').disabled = true;

  // setInterval fires timerTick every 1000 ms; store the ID so we can cancel it
  timerInterval = setInterval(timerTick, 1000);
}

/**
 * Pause the countdown without resetting it.
 * The next Start click will resume from wherever it left off.
 */
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning = false;
  document.getElementById('timer-start').textContent = 'Start';
  // Re-enable the duration input when paused so the user can adjust
  document.getElementById('timer-duration').disabled = false;
}

/**
 * The Start button doubles as a Stop button — this handler checks
 * which state we're in and calls the right function.
 */
function handleTimerBtn() {
  if (timerRunning) {
    stopTimer();
  } else {
    startTimer();
  }
}

/**
 * Stop the countdown and reset to the currently entered duration.
 * Also removes the .finished animation class if it was applied.
 */
function resetTimer() {
  stopTimer();
  // Always reset to whatever is in the duration input, not a hardcoded 25 min
  timeLeft = getDurationSeconds();
  document.getElementById('timer-display').textContent = formatTime(timeLeft);
  document.getElementById('timer-display').classList.remove('finished');
}

/**
 * Called automatically when the countdown reaches 00:00.
 * Stops the timer and adds the .finished class to trigger the CSS pulse animation.
 */
function timerFinished() {
  stopTimer();
  document.getElementById('timer-display').classList.add('finished');
}


// ─── 7. TO-DO LIST ──────────────────────────────────────────

/**
 * Load tasks from localStorage.
 * Called once on page load inside init().
 */
function loadTasks() {
  const savedTasks = loadData(LS_KEYS.tasks);
  tasks = savedTasks || [];  // default to empty array if nothing saved
  renderTasks();
}

/**
 * Save the current tasks array to localStorage.
 * Called after every add, edit, delete, or toggle operation.
 */
function saveTasks() {
  saveData(LS_KEYS.tasks, tasks);
}

/**
 * Check if a task with the given text already exists (case-insensitive, trimmed).
 * @param {string} text - The task text to check
 * @param {number|null} excludeId - Optional ID to exclude (used during edit)
 * @returns {boolean} True if a duplicate exists
 */
function isDuplicate(text, excludeId = null) {
  const normalized = text.trim().toLowerCase();
  return tasks.some(task => 
    task.id !== excludeId && task.text.trim().toLowerCase() === normalized
  );
}

/**
 * Render the entire to-do list.
 * Clears the <ul> and rebuilds it from the tasks array.
 */
function renderTasks() {
  const listEl = document.getElementById('todo-list');
  listEl.innerHTML = '';  // clear existing items

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (task.done ? ' done' : '');

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => toggleDone(task.id));

    // Task text
    const span = document.createElement('span');
    span.textContent = task.text;

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'btn-edit';
    editBtn.addEventListener('click', () => startEdit(task.id));

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'btn-delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    li.append(checkbox, span, editBtn, deleteBtn);
    listEl.appendChild(li);
  });
}

/**
 * Add a new task from the input field.
 * Blocks duplicates (Challenge requirement).
 */
function addTask() {
  const input = document.getElementById('todo-input');
  const text = input.value.trim();

  // Ignore empty input
  if (!text) return;

  // Show warning if duplicate (Challenge)
  if (isDuplicate(text)) {
    const warning = document.getElementById('todo-warning');
    warning.removeAttribute('hidden');
    // Auto-hide the warning after 3 seconds
    setTimeout(() => warning.setAttribute('hidden', ''), 3000);
    return;
  }

  // Hide warning if it was shown before
  document.getElementById('todo-warning').setAttribute('hidden', '');

  // Create new task object
  const newTask = {
    id: Date.now(),  // simple unique ID
    text: text,
    done: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  input.value = '';  // clear input
}

/**
 * Toggle the done state of a task.
 * @param {number} id - Task ID
 */
function toggleDone(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    saveTasks();
    renderTasks();
  }
}

/**
 * Delete a task.
 * @param {number} id - Task ID
 */
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

/**
 * Start editing a task in-place.
 * Replaces the task text with an input field + Save button.
 * @param {number} id - Task ID
 */
function startEdit(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  // Find the <li> for this task
  const listEl = document.getElementById('todo-list');
  const li = Array.from(listEl.children).find(el => {
    // Match by checking if the Delete button's click handler matches this ID
    const span = el.querySelector('span');
    return span && span.textContent === task.text;
  });

  if (!li) return;

  // Replace the <span> with an <input>
  const span = li.querySelector('span');
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-input';
  input.value = task.text;
  li.replaceChild(input, span);

  // Change Edit button to Save
  const editBtn = li.querySelector('.btn-edit');
  editBtn.textContent = 'Save';
  editBtn.onclick = () => saveEdit(id);

  input.focus();
  input.select();
}

/**
 * Save the edited task text.
 * Blocks duplicates (Challenge requirement).
 * @param {number} id - Task ID
 */
function saveEdit(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  // Find the input field
  const listEl = document.getElementById('todo-list');
  const li = Array.from(listEl.children).find(el => {
    const input = el.querySelector('.edit-input');
    return input !== null;
  });

  if (!li) return;

  const input = li.querySelector('.edit-input');
  const newText = input.value.trim();

  // Cancel if empty
  if (!newText) {
    renderTasks();  // just re-render to cancel
    return;
  }

  // Show warning if duplicate (excluding this task itself)
  if (isDuplicate(newText, id)) {
    const warning = document.getElementById('todo-warning');
    warning.removeAttribute('hidden');
    setTimeout(() => warning.setAttribute('hidden', ''), 3000);
    return;
  }

  // Update the task
  task.text = newText;
  saveTasks();
  renderTasks();

  // Hide warning if it was shown
  document.getElementById('todo-warning').setAttribute('hidden', '');
}


// ─── 8. QUICK LINKS ─────────────────────────────────────────

/**
 * Load links from localStorage.
 * Called once on page load inside init().
 */
function loadLinks() {
  const savedLinks = loadData(LS_KEYS.links);
  links = savedLinks || [];  // default to empty array if nothing saved
  renderLinks();
}

/**
 * Save the current links array to localStorage.
 * Called after every add or delete operation.
 */
function saveLinks() {
  saveData(LS_KEYS.links, links);
}

/**
 * Open a URL in a new browser tab.
 * @param {string} url - The URL to open
 */
function openLink(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Render all quick link buttons.
 * Clears #link-list and rebuilds it from the links array.
 */
function renderLinks() {
  const listEl = document.getElementById('link-list');
  listEl.innerHTML = '';  // clear existing buttons

  links.forEach(link => {
    // Wrapper div holds the link button + delete button together
    const wrapper = document.createElement('div');
    wrapper.className = 'link-item';

    // The label to show: use the custom label, or fall back to the URL
    const displayLabel = link.label.trim() || link.url;

    // Link button — opens the URL in a new tab
    const linkBtn = document.createElement('button');
    linkBtn.textContent = displayLabel;
    linkBtn.className = 'link-btn';
    linkBtn.title = link.url;  // show full URL on hover
    linkBtn.setAttribute('aria-label', `Open ${displayLabel}`);
    linkBtn.addEventListener('click', () => openLink(link.url));

    // Delete button — small × to remove the link
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×';
    deleteBtn.className = 'link-delete';
    deleteBtn.setAttribute('aria-label', `Remove ${displayLabel}`);
    deleteBtn.addEventListener('click', () => deleteLink(link.id));

    wrapper.append(linkBtn, deleteBtn);
    listEl.appendChild(wrapper);
  });
}

/**
 * Add a new quick link from the URL and label inputs.
 * Does nothing if the URL field is empty.
 */
function addLink() {
  const urlInput   = document.getElementById('link-url');
  const labelInput = document.getElementById('link-label');

  const url   = urlInput.value.trim();
  const label = labelInput.value.trim();

  // Ignore if URL is empty
  if (!url) {
    urlInput.focus();
    return;
  }

  // Prepend https:// if the user forgot a protocol
  const fullUrl = url.startsWith('http://') || url.startsWith('https://')
    ? url
    : 'https://' + url;

  const newLink = {
    id: Date.now(),  // simple unique ID
    url: fullUrl,
    label: label
  };

  links.push(newLink);
  saveLinks();
  renderLinks();

  // Clear both inputs
  urlInput.value   = '';
  labelInput.value = '';
}

/**
 * Delete a quick link by ID.
 * @param {number} id - Link ID
 */
function deleteLink(id) {
  links = links.filter(l => l.id !== id);
  saveLinks();
  renderLinks();
}


// ─── 9. INIT (runs on page load) ────────────────────────────

/**
 * Initialization function — wires up everything on page load.
 * Called at the very bottom of this file.
 */
function init() {
  // 1. Apply saved theme FIRST — before anything renders (prevents flash)
  applyTheme();

  // 2. Load saved name into input field
  loadName();

  // 3. Start the clock immediately and tick every second
  updateClock();
  setInterval(updateClock, 1000);

  // 4. Set the initial timer display from the duration input (defaults to 25 min)
  timeLeft = getDurationSeconds();
  document.getElementById('timer-display').textContent = formatTime(timeLeft);

  // 5. Event listeners
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('name-save').addEventListener('click', saveName);
  document.getElementById('name-clear').addEventListener('click', clearName);
  document.getElementById('timer-start').addEventListener('click', handleTimerBtn);
  document.getElementById('timer-reset').addEventListener('click', resetTimer);
  // When the user changes the duration while the timer is stopped, update the display live
  document.getElementById('timer-duration').addEventListener('input', () => {
    if (!timerRunning) {
      timeLeft = getDurationSeconds();
      document.getElementById('timer-display').textContent = formatTime(timeLeft);
      document.getElementById('timer-display').classList.remove('finished');
    }
  });

  // More initialization will be added as we complete each task
  // 6. Load tasks
  loadTasks();

  // 7. To-Do event listeners
  document.getElementById('todo-add').addEventListener('click', addTask);
  document.getElementById('todo-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });

  // 8. Load links
  loadLinks();

  // 9. Quick Links event listener
  document.getElementById('link-add').addEventListener('click', addLink);
}

// Run init when the script loads (defer ensures DOM is ready)
init();
