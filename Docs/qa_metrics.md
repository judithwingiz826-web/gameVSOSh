# QA Metrics

Ниже зафиксированы обязательные метрики качества для образовательной части и игрового контура.

## Core product metrics

| Metric | Что измеряем | Формула | Целевое значение | Частота |
|---|---|---|---|---|
| Crash-free sessions | Стабильность клиента | `1 - (sessions_with_crash / total_sessions)` | >= 99.5% | Daily |
| Completion rate | Доходимость до финала темы/трека | `completed_runs / started_runs` | >= 65% (topic), >= 45% (track) | Weekly |
| Retention | Возврат пользователей | `active_d7 / cohort_d0` и `active_d30 / cohort_d0` | D7 >= 30%, D30 >= 12% | Weekly |
| Accuracy per topic | Усвоение знаний по темам | `correct_answers / all_answers` по topic_id | >= 80% | Daily |
| Time-to-solve | Скорость решения задач | p50/p75 времени от старта до валидного решения | p50 <= 4 мин, p75 <= 8 мин | Daily |

## Quality gates tied to metrics

- Любой релиз блокируется, если crash-free sessions падает ниже 99.0% за 24 часа.
- Любой релиз блокируется, если completion rate новой ветки хуже контроля более чем на 10%.
- Любой релиз блокируется, если accuracy per topic снижается более чем на 7 п.п. относительно последнего стабильного билда.
- Time-to-solve для новых задач не должен деградировать более чем на 15% без педагогического обоснования.

## Reporting cadence

- Daily dashboard: стабильность, accuracy per topic, time-to-solve.
- Weekly review: completion rate, retention, динамика качества по темам/трекам.
- Release review: статус всех обязательных QA/контент-ворот перед публикацией.
