import random
from math import comb


def arithmetic_variant():
    a = random.randint(10, 99)
    b = random.randint(2, 12)
    c = random.randint(1, 9)
    statement = f"Вычислите: ({a} + {b}) * {c}"
    answer = (a + b) * c
    return statement, answer


def algebra_transform_variant():
    x = random.randint(2, 20)
    a = random.randint(2, 8)
    b = random.randint(1, 15)
    statement = f"Решите: {a}x - {b} = {a * x - b}"
    answer = x
    return statement, answer


def combinatorics_variant():
    n = random.randint(6, 20)
    k = random.randint(2, min(5, n - 1))
    statement = f"Сколько сочетаний C({n}, {k})?"
    answer = comb(n, k)
    return statement, answer


def build_set(size=20):
    generators = [arithmetic_variant, algebra_transform_variant, combinatorics_variant]
    result = []
    for _ in range(size):
        g = random.choice(generators)
        statement, answer = g()
        result.append({"statement": statement, "answer": str(answer)})
    return result


if __name__ == "__main__":
    for item in build_set(10):
        print(item)
