import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

const tracks = {
  'СПб город': ['Числа', 'Комбинаторика', 'Геометрия', 'Неравенства'],
  'Курчатов': ['Алгебра', 'Графы', 'Комбинаторика', 'Функциональные уравнения'],
  'ВСОШ': ['Теория чисел', 'Комбинаторика', 'Планиметрия', 'Алгебра'],
  'Перечневые': ['Смешанные техники', 'Оценки и инварианты', 'Графы']
};

const theory = {
  'Числа': 'Делимость, НОД/НОК, остатки, p-адические оценки. Начни с алгоритма Евклида и арифметики по модулю.',
  'Комбинаторика': 'Перебор, принцип Дирихле, инварианты, двойной подсчёт. Ищи структуру и симметрию.',
  'Геометрия': 'Углы, подобие, степени точек, окружности, координатные/векторные методы.',
  'Неравенства': 'AM-GM, КБШ, Йенсен (базово), оценка сверху/снизу через стандартные преобразования.',
  'Алгебра': 'Преобразования, тождества, симметрия, замены переменных, оценочные подходы.',
  'Графы': 'Степени вершин, компоненты, деревья, инварианты, раскраски.',
  'Функциональные уравнения': 'Подстановки специальных значений, инъективность/сюръективность, композиции.',
  'Теория чисел': 'Сравнения по модулю, малая теорема Ферма, разложение на простые.',
  'Планиметрия': 'Подобие, биссектрисы, медианы, окружности, радикальная ось.',
  'Смешанные техники': 'Комбинация алгебры, геометрии и чисел в одной задаче.',
  'Оценки и инварианты': 'Выделяй величину, сохраняющуюся при операции, и строй невозможность.',
};

const problems = [
  { topic: 'Числа', q: 'Найдите НОД(252, 198)', a: '18', hints: ['Алгоритм Евклида.', '252=198+54, 198=3*54+36, ...', 'НОД=18'] },
  { topic: 'Числа', q: 'Последняя цифра 7^2024?', a: '1', hints: ['Период последних цифр.', '7,9,3,1 — период 4.', '2024 кратно 4, ответ 1.'] },
  { topic: 'Комбинаторика', q: 'Сколькими способами выбрать 2 человека из 8?', a: '28', hints: ['Сочетания C(8,2).', '8*7/2.', '28'] },
  { topic: 'Комбинаторика', q: 'Сумма C(5,0)+...+C(5,5)?', a: '32', hints: ['Бином Ньютона.', '(1+1)^5', '32'] },
  { topic: 'Геометрия', q: 'Углы треугольника: 50° и 60°. Третий?', a: '70', hints: ['Сумма углов треугольника 180.', '180-50-60', '70'] },
  { topic: 'Неравенства', q: 'Минимум x^2+1/x^2 при x>0?', a: '2', hints: ['AM-GM или (x-1/x)^2>=0', 'x^2+1/x^2>=2', '2'] },
  { topic: 'Алгебра', q: 'Решите: x^2-5x+6=0. Меньший корень?', a: '2', hints: ['Разложение.', '(x-2)(x-3)=0', '2'] },
  { topic: 'Графы', q: 'Сумма степеней вершин в графе с 7 рёбрами?', a: '14', hints: ['Лемма о рукопожатиях.', '2m', '14'] },
  { topic: 'Функциональные уравнения', q: 'Если f(x)=2x+1, то f(10)?', a: '21', hints: ['Подстановка.', '2*10+1', '21'] },
  { topic: 'Теория чисел', q: 'Остаток 1001 при делении на 7?', a: '0', hints: ['7*143=1001', 'кратно 7', '0'] },
  { topic: 'Планиметрия', q: 'В равностороннем треугольнике каждый угол равен?', a: '60', hints: ['Все равны и сумма 180.', '180/3', '60'] },
  { topic: 'Оценки и инварианты', q: 'Чётность суммы двух нечётных чисел?', a: 'чётная', hints: ['(2a+1)+(2b+1)=2(a+b+1).', 'делится на 2', 'чётная'] },
  { topic: 'Смешанные техники', q: 'Решите в целых: x+y=10, xy=21, найдите x^2+y^2', a: '58', hints: ['(x+y)^2=x^2+y^2+2xy', '100-42', '58'] },
  { topic: 'Комбинаторика', q: 'Сколько подмножеств у множества из 6 элементов?', a: '64', hints: ['2^n', '2^6', '64'] },
  { topic: 'Неравенства', q: 'Верно ли: (a-b)^2>=0?', a: 'да', hints: ['Квадрат неотрицателен.', 'всегда >=0', 'да'] },
  { topic: 'Алгебра', q: 'Если x+1/x=3, найдите x^2+1/x^2', a: '7', hints: ['Квадрат суммы.', '9= x^2+2+1/x^2', '7'] },
];

const state = {
  track: 'СПб город',
  topic: 'Числа',
  current: null,
  hintStep: 0,
  solved: 0,
  attempts: 0,
  weak: {}
};

const el = {
  track: document.getElementById('track'),
  topic: document.getElementById('topicSelect'),
  theory: document.getElementById('theoryText'),
  box: document.getElementById('problemBox'),
  answer: document.getElementById('answerInput'),
  feedback: document.getElementById('feedback'),
  stats: document.getElementById('stats'),
  check: document.getElementById('checkBtn'),
  hint: document.getElementById('hintBtn'),
  next: document.getElementById('nextBtn')
};

function initSelectors() {
  Object.keys(tracks).forEach(name => {
    const o = document.createElement('option');
    o.value = o.textContent = name;
    el.track.appendChild(o);
  });
  el.track.value = state.track;
  rebuildTopics();
}

function rebuildTopics() {
  el.topic.innerHTML = '';
  tracks[state.track].forEach(t => {
    const o = document.createElement('option');
    o.value = o.textContent = t;
    el.topic.appendChild(o);
  });
  state.topic = tracks[state.track][0];
  el.topic.value = state.topic;
  updateTheory();
  nextProblem();
}

function updateTheory() {
  el.theory.textContent = theory[state.topic] ?? 'Теория скоро будет расширена.';
}

function pickProblem() {
  const pool = problems.filter(p => p.topic === state.topic);
  if (!pool.length) return { q: 'Для темы пока нет задачи. Переключи тему.', a: '', hints: [] };
  return pool[Math.floor(Math.random() * pool.length)];
}

function nextProblem() {
  state.current = pickProblem();
  state.hintStep = 0;
  el.box.textContent = state.current.q;
  el.answer.value = '';
  el.feedback.textContent = '';
}

function norm(s) {
  return String(s).trim().toLowerCase().replace(',', '.');
}

function renderStats() {
  const accuracy = state.attempts ? Math.round((state.solved / state.attempts) * 100) : 0;
  const weak = Object.entries(state.weak)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k)
    .join(', ') || 'нет';

  el.stats.innerHTML = `
    <li>Решено верно: <b>${state.solved}</b></li>
    <li>Попыток: <b>${state.attempts}</b></li>
    <li>Точность: <b>${accuracy}%</b></li>
    <li>Слабые темы: <b>${weak}</b></li>
  `;
}

function checkAnswer() {
  if (!state.current) return;
  state.attempts += 1;
  const ok = norm(el.answer.value) === norm(state.current.a);
  if (ok) {
    state.solved += 1;
    el.feedback.textContent = 'Верно! Отлично. Переходим дальше.';
  } else {
    state.weak[state.topic] = (state.weak[state.topic] || 0) + 1;
    el.feedback.textContent = `Пока неверно. Попробуй ещё или возьми подсказку.`;
  }
  renderStats();
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

el.track.addEventListener('change', () => {
  state.track = el.track.value;
  rebuildTopics();
});
el.topic.addEventListener('change', () => {
  state.topic = el.topic.value;
  updateTheory();
  nextProblem();
});
el.check.addEventListener('click', checkAnswer);
el.hint.addEventListener('click', giveHint);
el.next.addEventListener('click', nextProblem);

initSelectors();
renderStats();

const canvas = document.getElementById('bg3d');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.z = 6;

const torus = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1.3, 0.35, 140, 20),
  new THREE.MeshStandardMaterial({ color: 0x7c9eff, metalness: 0.7, roughness: 0.2 })
);
scene.add(torus);

const light1 = new THREE.PointLight(0x88aaff, 40, 100);
light1.position.set(3, 2, 4);
const light2 = new THREE.PointLight(0xff66cc, 25, 100);
light2.position.set(-3, -2, 3);
scene.add(light1, light2);

const starsGeo = new THREE.BufferGeometry();
const starCount = 1200;
const points = new Float32Array(starCount * 3);
for (let i = 0; i < points.length; i += 3) {
  points[i] = (Math.random() - 0.5) * 30;
  points[i + 1] = (Math.random() - 0.5) * 30;
  points[i + 2] = (Math.random() - 0.5) * 30;
}
starsGeo.setAttribute('position', new THREE.BufferAttribute(points, 3));
const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({ size: 0.03, color: 0xcdd8ff }));
scene.add(stars);

function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();

function animate() {
  torus.rotation.x += 0.004;
  torus.rotation.y += 0.005;
  stars.rotation.y += 0.0008;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
