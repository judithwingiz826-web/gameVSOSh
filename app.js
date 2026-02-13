const ANTI_DUPLICATE_WINDOW = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

const state = {
  problems: [],
  topicStats: {},
  recentProblemIds: [],
};

function normalizeProblem(problem) {
  return {
    ...problem,
    difficulty: Number(problem.difficulty ?? 1),
    skills: Array.isArray(problem.skills)
      ? problem.skills
      : problem.skill
        ? [problem.skill]
        : [],
    lastSeen: problem.lastSeen ?? null,
    correctStreak: Number(problem.correctStreak ?? 0),
    errorCount: Number(problem.errorCount ?? 0),
    attempts: Number(problem.attempts ?? 0),
    correctCount: Number(problem.correctCount ?? 0),
    solvedTypes: new Set(problem.solvedTypes ?? []),
    topic: problem.topic ?? (Array.isArray(problem.skills) && problem.skills[0]) ?? problem.skill ?? "general",
    type: problem.type ?? problem.id ?? "default",
  };
}

function setProblems(problems) {
  state.problems = problems.map(normalizeProblem);
  state.topicStats = buildTopicStats();
  renderStats();
}

function buildTopicStats() {
  const topicStats = {};

  for (const problem of state.problems) {
    const topic = problem.topic;
    if (!topicStats[topic]) {
      topicStats[topic] = {
        topic,
        attempts: 0,
        correct: 0,
        maxStreak: 0,
        solvedTypes: new Set(),
        score: 0,
      };
    }

    const bucket = topicStats[topic];
    bucket.attempts += problem.attempts;
    bucket.correct += problem.correctCount;
    bucket.maxStreak = Math.max(bucket.maxStreak, problem.correctStreak);
    problem.solvedTypes.forEach((t) => bucket.solvedTypes.add(t));
  }

  for (const topic of Object.keys(topicStats)) {
    const bucket = topicStats[topic];
    const accuracy = bucket.attempts ? bucket.correct / bucket.attempts : 0;
    const streakFactor = Math.min(bucket.maxStreak / 5, 1);
    const typeFactor = Math.min(bucket.solvedTypes.size / 3, 1);

    // Mastery rule by topic: accuracy + stable streak + variety of solved task types.
    bucket.score = Math.round((accuracy * 0.6 + streakFactor * 0.25 + typeFactor * 0.15) * 100);
  }

  return topicStats;
}

function getSkillWeakness(problem) {
  if (!problem.skills.length) return 1;

  const topicGaps = problem.skills.map((skill) => {
    const mastery = state.topicStats[skill]?.score ?? 0;
    return 1 + (100 - mastery) / 100;
  });

  return topicGaps.reduce((sum, n) => sum + n, 0) / topicGaps.length;
}

function getRecencyBoost(problem, now) {
  if (!problem.lastSeen) return 2;
  const ageDays = Math.max((now - problem.lastSeen) / DAY_MS, 0);
  return 1 + Math.min(ageDays / 7, 2);
}

function getDuplicatePenalty(problem) {
  return state.recentProblemIds.includes(problem.id) ? 0 : 1;
}

function pickProblem() {
  const now = Date.now();
  const scored = state.problems
    .map((problem) => {
      const weakness = getSkillWeakness(problem);
      const recency = getRecencyBoost(problem, now);
      const difficulty = 1 + Math.min(problem.difficulty, 5) * 0.1;
      const duplicatePenalty = getDuplicatePenalty(problem);
      const score = weakness * recency * difficulty * duplicatePenalty;

      return { problem, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) {
    // fallback if anti-duplicate filtered everything out
    return state.problems[Math.floor(Math.random() * state.problems.length)] ?? null;
  }

  return scored[0].problem;
}

function registerAttempt(problemId, isCorrect) {
  const problem = state.problems.find((p) => p.id === problemId);
  if (!problem) return;

  problem.lastSeen = Date.now();
  problem.attempts += 1;

  if (isCorrect) {
    problem.correctCount += 1;
    problem.correctStreak += 1;
    problem.solvedTypes.add(problem.type);
  } else {
    problem.correctStreak = 0;
    problem.errorCount += 1;
  }

  state.recentProblemIds.push(problem.id);
  if (state.recentProblemIds.length > ANTI_DUPLICATE_WINDOW) {
    state.recentProblemIds.shift();
  }

  state.topicStats = buildTopicStats();
  renderStats();
}

function getPriorityRecommendation() {
  const topics = Object.values(state.topicStats);
  if (!topics.length) return "Начните с любой темы: пока недостаточно данных.";

  const weakest = topics
    .map((topic) => {
      const topicProblems = state.problems.filter((p) => p.topic === topic.topic);
      const errors = topicProblems.reduce((acc, p) => acc + p.errorCount, 0);
      const priority = (100 - topic.score) * 0.7 + errors * 3;
      return { ...topic, errors, priority };
    })
    .sort((a, b) => b.priority - a.priority)[0];

  return `Сейчас учить: ${weakest.topic} (mastery ${weakest.score}%, ошибок ${weakest.errors}).`;
}

function renderStats() {
  if (typeof document === "undefined") return;

  const statsNode = document.getElementById("stats");
  if (!statsNode) return;

  const topics = Object.values(state.topicStats).sort((a, b) => a.score - b.score);
  const masteryMarkup = topics.length
    ? topics
        .map((topic) => `<li><strong>${topic.topic}</strong>: mastery ${topic.score}%</li>`)
        .join("")
    : "<li>Пока нет статистики.</li>";

  statsNode.innerHTML = `
    <h3>Прогресс по темам</h3>
    <ul>${masteryMarkup}</ul>
    <p class="recommendation">${getPriorityRecommendation()}</p>
  `;
}

if (typeof window !== "undefined") {
  window.practiceEngine = {
    setProblems,
    pickProblem,
    registerAttempt,
    renderStats,
    getPriorityRecommendation,
  };
}

module.exports = {
  ANTI_DUPLICATE_WINDOW,
  state,
  setProblems,
  pickProblem,
  registerAttempt,
  getPriorityRecommendation,
  renderStats,
};
