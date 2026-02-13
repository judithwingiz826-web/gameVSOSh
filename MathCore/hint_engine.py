from dataclasses import dataclass
from typing import List, Dict

@dataclass
class HintStep:
    step: int
    title: str
    text: str

class ProgressiveHintEngine:
    """Выдаёт подсказки по шагам без преждевременного спойлера."""

    ORDER = ["Идея", "Метод", "Почти решение", "Полное решение"]

    def __init__(self, hints: List[Dict]):
        self.hints = sorted([HintStep(**h) for h in hints], key=lambda x: x.step)

    def get_hint(self, current_step: int) -> str:
        if current_step < 1:
            current_step = 1
        if current_step > len(self.hints):
            current_step = len(self.hints)
        hint = self.hints[current_step - 1]
        return f"Шаг {hint.step} ({hint.title}): {hint.text}"

    def reveal_sequence(self) -> List[str]:
        return [self.get_hint(i) for i in range(1, len(self.hints) + 1)]
