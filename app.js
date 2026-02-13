const STORAGE_KEY = 'math_odyssey_state_v2';
const RECENT_WINDOW = 4;

const tracks = {
  'СПб город': ['Числа', 'Комбинаторика', 'Геометрия', 'Неравенства'],
  'Курчатов': ['Алгебра', 'Графы', 'Комбинаторика', 'Функциональные уравнения'],
  'ВСОШ': ['Теория чисел', 'Комбинаторика', 'Планиметрия', 'Алгебра'],
  'Перечневые': ['Смешанные техники', 'Оценки и инварианты', 'Графы']
};

const theory = {
  'Числа': 'Делимость, НОД/НОК, остатки, алгоритм Евклида и модульная арифметика.',
  'Комбинаторика': 'Перебор, принцип Дирихле, инварианты, двойной подсчёт.',
  'Геометрия': 'Подобие, окружности, степени точек, базовые векторные приёмы.',
  'Неравенства': 'AM-GM, КБШ, приёмы оценки сверху/снизу.',
  'Алгебра': 'Тождества, замены, симметрия и оценочные подходы.',
  'Графы': 'Степени, компоненты связности, деревья, инварианты.',
  'Функциональные уравнения': 'Подстановки, инъективность/сюръективность, экстремальные точки.',
  'Теория чисел': 'Остатки, сравнения, разложение на простые, диофантовы идеи.',
  'Планиметрия': 'Углы, хорды, касательные, подобие и площади.',
  'Смешанные техники': 'Комбинации методов из разных разделов.',
  'Оценки и инварианты': 'Моноинварианты, экстремальный принцип, оценочные барьеры.'
};

const problems = [
  { id: 1, t: 'Числа', q: 'Найдите НОД(84, 126).', a: '42', answerType: 'integer', hints: ['Разложи числа на простые множители.'] },
  { id: 2, t: 'Комбинаторика', q: 'Сколькими способами выбрать 2 человека из 6?', a: '15', answerType: 'integer', hints: ['Это C(6,2).'] },
  { id: 3, t: 'Геометрия', q: 'Сумма углов треугольника равна?', a: '180', answerType: 'integer', hints: ['Классический факт евклидовой геометрии.'] },
  { id: 4, t: 'Неравенства', q: 'Минимум x+1/x при x>0?', a: '2', answerType: 'number', hints: ['Примени AM-GM к x и 1/x.'] },
  { id: 5, t: 'Алгебра', q: 'Решите: x^2-5x+6=0. Введите меньший корень.', a: '2', answerType: 'integer', hints: ['Разложи квадратный трёхчлен.'] },
  { id: 6, t: 'Графы', q: 'В дереве с 12 вершинами сколько рёбер?', a: '11', answerType: 'integer', hints: ['В дереве всегда n-1 ребро.'] },
  { id: 7, t: 'Функциональные уравнения', q: 'Если f(x)=2x+3, найдите f(5).', a: '13', answerType: 'integer', hints: ['Подставь x=5.'] },
  { id: 8, t: 'Теория чисел', q: 'Остаток от 29 при делении на 6?', a: '5', answerType: 'integer', hints: ['29=24+5.'] },
  { id: 9, t: 'Планиметрия', q: 'Площадь квадрата со стороной 7?', a: '49', answerType: 'integer', hints: ['S=a^2.'] },
  { id: 10, t: 'Оценки и инварианты', q: 'Верно ли: сумма двух чётных всегда чётна? (да/нет)', a: 'да', answerType: 'boolean', hints: ['2a+2b=2(a+b).'] },
  { id: 11, t: 'Комбинаторика', q: 'Вероятность орла при честной монете.', a: '1/2', answerType: 'fraction', hints: ['2 равновозможных исхода.'] }
].map((p) => ({ ...p, skill: p.t }));

const el = {
  track: document.getElementById('track'),
  topic: document.getElementById('topicSelect'),
  theory: document.getElementById('theoryText'),
  problem: document.getElementById('problemBox'),
  answer: document.getElementById('answerInput'),
  feedback: document.getElementById('feedback'),
  stats: document.getElementById('stats'),
  check: document.getElementById('checkBtn'),
  hint: document.getElementById('hintBtn'),
  next: document.getElementById('nextBtn'),
  reset: document.getElementById('resetBtn')
};

const defaultState = {
  track: Object.keys(tracks)[0],
  topic: tracks[Object.keys(tracks)[0]][0],
  solved: 0,
  attempts: 0,
  weak: {},
  current: null,
  hintStep: 0,
  recentIds: []
};

const state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    return { ...structuredClone(defaultState), ...JSON.parse(raw) };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      track: state.track,
      topic: state.topic,
      solved: state.solved,
      attempts: state.attempts,
      weak: state.weak,
      recentIds: state.recentIds
    })
  );
}

function normalizeText(value) {
  return String(value).trim().toLowerCase().replace(',', '.');
}

function parseNumber(value) {
  const cleaned = normalizeText(value);
  if (cleaned.includes('/')) {
    const [a, b] = cleaned.split('/').map(Number);
    if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return null;
    return a / b;
  }
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function isCorrectAnswer(problem, input) {
  if (problem.answerType === 'boolean') {
    const trueSet = ['да', 'yes', 'true', '1'];
    const falseSet = ['нет', 'no', 'false', '0'];
    const got = normalizeText(input);
    const expected = normalizeText(problem.a);
    return (trueSet.includes(got) && trueSet.includes(expected)) || (falseSet.includes(got) && falseSet.includes(expected));
  }

  if (['integer', 'number', 'fraction'].includes(problem.answerType)) {
    const got = parseNumber(input);
    const expected = parseNumber(problem.a);
    if (got === null || expected === null) return false;
    return Math.abs(got - expected) < 1e-9;
  }

  return normalizeText(input) === normalizeText(problem.a);
}

function initSelectors() {
  el.track.innerHTML = Object.keys(tracks).map((t) => `<option>${t}</option>`).join('');
  if (!tracks[state.track]) state.track = Object.keys(tracks)[0];
  el.track.value = state.track;
  rebuildTopics();
}

function rebuildTopics() {
  const topics = tracks[state.track] || [];
  el.topic.innerHTML = topics.map((t) => `<option>${t}</option>`).join('');
  if (!topics.includes(state.topic)) state.topic = topics[0];
  el.topic.value = state.topic;
  updateTheory();
  nextProblem();
  saveState();
}

function updateTheory() {
  el.theory.textContent = theory[state.topic] || 'Теория будет добавлена.';
}

function pickProblem() {
  const pool = problems.filter((p) => p.t === state.topic);
  if (!pool.length) return { id: -1, q: 'Для этой темы задачи скоро появятся.', a: '', answerType: 'text', hints: [] };

  const weighted = pool.map((p) => {
    const weakness = state.weak[p.skill] || 0;
    const recentPenalty = state.recentIds.includes(p.id) ? 0.2 : 1;
    const score = (1 + weakness) * recentPenalty * Math.random();
    return { p, score };
  });

  weighted.sort((a, b) => b.score - a.score);
  return weighted[0].p;
}

function nextProblem() {
  state.current = pickProblem();
  state.hintStep = 0;
  el.problem.textContent = state.current.q;
  el.answer.value = '';
  el.feedback.textContent = '';
  if (state.current.id > 0) {
    state.recentIds.push(state.current.id);
    state.recentIds = state.recentIds.slice(-RECENT_WINDOW);
  }
  saveState();
}

function renderStats() {
  const accuracy = state.attempts ? Math.round((state.solved / state.attempts) * 100) : 0;
  const weak = Object.entries(state.weak).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k).join(', ') || 'нет';
  const readiness = Math.max(0, Math.min(100, accuracy - (state.weak[state.topic] || 0) * 3));

  el.stats.innerHTML = `
    <li>Решено верно: <b>${state.solved}</b></li>
    <li>Попыток: <b>${state.attempts}</b></li>
    <li>Точность: <b>${accuracy}%</b></li>
    <li>Слабые темы: <b>${weak}</b></li>
    <li>Готовность по текущей теме: <b>${readiness}%</b></li>
  `;
}

function checkAnswer() {
  if (!state.current) return;
  state.attempts += 1;
  const ok = isCorrectAnswer(state.current, el.answer.value);
  if (ok) {
    state.solved += 1;
    el.feedback.textContent = 'Верно! Отлично. Переходим дальше.';
  } else {
    state.weak[state.topic] = (state.weak[state.topic] || 0) + 1;
    el.feedback.textContent = 'Пока неверно. Проверь формат и попробуй ещё раз.';
  }
  renderStats();
  saveState();
}

function giveHint() {
  const hints = state.current?.hints || [];
  if (!hints.length) {
    el.feedback.textContent = 'Для этой задачи подсказок пока нет.';
    return;
  }
  const h = hints[Math.min(state.hintStep, hints.length - 1)];
  state.hintStep += 1;
  el.feedback.textContent = `Подсказка ${state.hintStep}: ${h}`;
}

function resetProgress() {
  if (!window.confirm('Сбросить весь прогресс?')) return;
  Object.assign(state, structuredClone(defaultState));
  initSelectors();
  renderStats();
  saveState();
}

el.track.addEventListener('change', () => {
  state.track = el.track.value;
  rebuildTopics();
});
el.topic.addEventListener('change', () => {
  state.topic = el.topic.value;
  updateTheory();
  nextProblem();
  saveState();
});
el.check.addEventListener('click', checkAnswer);
el.hint.addEventListener('click', giveHint);
el.next.addEventListener('click', nextProblem);
el.reset.addEventListener('click', resetProgress);

initSelectors();
renderStats();

const canvas = document.getElementById('bg3d');
const ctx = canvas.getContext('2d');
const stars = Array.from({ length: 120 }, () => ({
  x: Math.random(),
  y: Math.random(),
  z: Math.random() * 0.8 + 0.2,
  speed: Math.random() * 0.0005 + 0.0002
}));

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawBackground() {
  const w = canvas.width;
  const h = canvas.height;
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, '#070b1f');
  gradient.addColorStop(1, '#120c2c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  stars.forEach((star) => {
    star.y += star.speed;
    if (star.y > 1.05) {
      star.y = -0.05;
      star.x = Math.random();
    }
    const px = star.x * w;
    const py = star.y * h;
    const size = 1.5 * star.z;
    ctx.fillStyle = `rgba(205, 220, 255, ${0.5 + star.z * 0.5})`;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  });

  const t = performance.now() * 0.001;
  const cx = w * 0.5;
  const cy = h * 0.35;
  const radius = Math.min(w, h) * 0.14;
  ctx.strokeStyle = 'rgba(124, 158, 255, 0.65)';
  ctx.lineWidth = Math.max(2, radius * 0.05);
  ctx.beginPath();
  for (let i = 0; i <= 160; i += 1) {
    const a = (i / 160) * Math.PI * 2;
    const r = radius * (1 + 0.2 * Math.sin(3 * a + t));
    const x = cx + Math.cos(a + t * 0.4) * r;
    const y = cy + Math.sin(a + t * 0.35) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
}

function animate() {
  drawBackground();
  requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
resize();
animate();
