const STATE_VERSION = 1;
const STATE_STORAGE_KEY = `math_odyssey_state_v${STATE_VERSION}`;
const LEGACY_STATE_KEYS = ["math_odyssey_state"];

const DEFAULT_STATE = {
  version: STATE_VERSION,
  track: "algebra",
  topic: "linear_equations",
  solved: 0,
  attempts: 0,
  weak: [],
};

let state = { ...DEFAULT_STATE };

const el = {
  track: document.getElementById("track"),
  topic: document.getElementById("topic"),
  answer: document.getElementById("answer"),
  check: document.getElementById("check-answer"),
  next: document.getElementById("next-task"),
  reset: document.getElementById("reset-progress"),
  stats: document.getElementById("stats"),
  result: document.getElementById("result"),
};

let currentTask = buildTask(state.topic);

function sanitizeState(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return { ...DEFAULT_STATE };
  }

  const safe = {
    version: STATE_VERSION,
    track: typeof candidate.track === "string" && candidate.track ? candidate.track : DEFAULT_STATE.track,
    topic: typeof candidate.topic === "string" && candidate.topic ? candidate.topic : DEFAULT_STATE.topic,
    solved: Number.isInteger(candidate.solved) && candidate.solved >= 0 ? candidate.solved : 0,
    attempts: Number.isInteger(candidate.attempts) && candidate.attempts >= 0 ? candidate.attempts : 0,
    weak: Array.isArray(candidate.weak)
      ? [...new Set(candidate.weak.filter((item) => typeof item === "string" && item.trim() !== ""))]
      : [],
  };

  return safe;
}

function migrateLegacyState() {
  for (const legacyKey of LEGACY_STATE_KEYS) {
    const raw = localStorage.getItem(legacyKey);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      state = sanitizeState(parsed);
      saveState();
      localStorage.removeItem(legacyKey);
      return true;
    } catch {
      localStorage.removeItem(legacyKey);
    }
  }

  return false;
}

function loadState() {
  const raw = localStorage.getItem(STATE_STORAGE_KEY);

  if (!raw) {
    const migrated = migrateLegacyState();
    if (!migrated) {
      state = { ...DEFAULT_STATE };
      saveState();
    }

    applyStateToUi();
    currentTask = buildTask(state.topic);
    renderTask();
    return;
  }

  try {
    const parsed = JSON.parse(raw);

    if (parsed.version !== STATE_VERSION) {
      migrateLegacyState();
      state = sanitizeState(parsed);
      state.version = STATE_VERSION;
      saveState();
    } else {
      state = sanitizeState(parsed);
    }
  } catch {
    state = { ...DEFAULT_STATE };
    saveState();
  }

  applyStateToUi();
  currentTask = buildTask(state.topic);
  renderTask();
}

function saveState() {
  localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
}

function applyStateToUi() {
  el.track.value = state.track;
  el.topic.value = state.topic;
  renderStats();
}

function renderStats() {
  const weakList = state.weak.length ? state.weak.join(", ") : "—";
  el.stats.textContent = `Решено: ${state.solved} | Попыток: ${state.attempts} | Слабые темы: ${weakList}`;
}

function buildTask(topic) {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;

  return {
    topic,
    question: `Тема ${topic}: ${a} + ${b} = ?`,
    answer: a + b,
  };
}

function renderTask() {
  document.getElementById("question").textContent = currentTask.question;
  el.answer.value = "";
  el.result.textContent = "";
}

function markWeakTopic(topic) {
  if (!state.weak.includes(topic)) {
    state.weak.push(topic);
  }
}

function resolveWeakTopic(topic) {
  state.weak = state.weak.filter((item) => item !== topic);
}

function checkAnswer() {
  const userValue = Number(el.answer.value);
  state.attempts += 1;

  if (userValue === currentTask.answer) {
    state.solved += 1;
    resolveWeakTopic(state.topic);
    el.result.textContent = "Верно!";
  } else {
    markWeakTopic(state.topic);
    el.result.textContent = `Неверно. Правильный ответ: ${currentTask.answer}`;
  }

  saveState();
  renderStats();
}

function nextTask() {
  currentTask = buildTask(state.topic);
  saveState();
  renderTask();
  renderStats();
}

function onTrackChange(event) {
  state.track = event.target.value;
  saveState();
  renderStats();
}

function onTopicChange(event) {
  state.topic = event.target.value;
  currentTask = buildTask(state.topic);
  saveState();
  renderTask();
  renderStats();
}

function resetProgress() {
  const approved = window.confirm("Сбросить весь прогресс? Это действие нельзя отменить.");
  if (!approved) return;

  state = { ...DEFAULT_STATE };
  localStorage.removeItem(STATE_STORAGE_KEY);
  for (const legacyKey of LEGACY_STATE_KEYS) {
    localStorage.removeItem(legacyKey);
  }
  saveState();

  applyStateToUi();
  currentTask = buildTask(state.topic);
  renderTask();
}

function attachEvents() {
  el.check.addEventListener("click", checkAnswer);
  el.next.addEventListener("click", nextTask);
  el.track.addEventListener("change", onTrackChange);
  el.topic.addEventListener("change", onTopicChange);
  el.reset.addEventListener("click", resetProgress);
}

attachEvents();
loadState();
