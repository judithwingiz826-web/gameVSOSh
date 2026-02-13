# MathCore Material Format

Формат хранения учебных материалов для платформы.

## Обязательные метаданные

- `id`: уникальный идентификатор материала.
- `type`: `problem | theory | example | training_block | control_block`.
- `topic`: тема (например, `arithmetic`, `algebra`, `combinatorics`, `geometry`, `number_theory`).
- `level`: уровень сложности (`starter`, `basic`, `intermediate`, `olympiad`).
- `olympiad`: объект с источником (`none`, `municipal`, `regional`, `national`, `international`) и названием тура.
- `tags`: массив тегов.
- `skills`: массив тренируемых навыков.
- `statement`: формулировка (для задач) или основное содержание (для теории).
- `hints`: ступенчатые подсказки.
- `solution`: полное решение.

## Структура JSON

```json
{
  "id": "ALG-001",
  "type": "problem",
  "topic": "algebra",
  "level": "basic",
  "olympiad": {
    "track": "none",
    "source": "internal"
  },
  "tags": ["equations", "linear"],
  "skills": ["solve_linear_equation", "substitution"],
  "statement": "Решите уравнение 3x + 5 = 20.",
  "hints": [
    {"step": 1, "title": "Идея", "text": "Изолируйте переменную, выполняя одинаковые действия с обеими частями."},
    {"step": 2, "title": "Метод", "text": "Сначала вычтите 5 из обеих частей, затем разделите на 3."},
    {"step": 3, "title": "Почти решение", "text": "3x = 15, значит x = 15/3."},
    {"step": 4, "title": "Полное решение", "text": "x = 5."}
  ],
  "solution": "Вычитаем 5: 3x = 15. Делим на 3: x = 5.",
  "answer": "5"
}
```

## Markdown-представление

Каждый материал может храниться в `.md` с YAML frontmatter:

```md
---
id: ALG-001
type: problem
topic: algebra
level: basic
olympiad:
  track: none
  source: internal
tags: [equations, linear]
skills: [solve_linear_equation, substitution]
---

# Формулировка
...
```

## Правила для ступенчатых подсказок

1. Шаг 1 (`Идея`) — без раскрытия ключевого вычисления.
2. Шаг 2 (`Метод`) — описывает инструмент/подход.
3. Шаг 3 (`Почти решение`) — доводит до 1-2 вычислительных шагов до ответа.
4. Шаг 4 (`Полное решение`) — детальный разбор.
