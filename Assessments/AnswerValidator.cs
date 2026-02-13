using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace GameVSOSh.Assessments
{
    public static class AnswerValidator
    {
        private const double DecimalTolerance = 0.001d;

        private static readonly Dictionary<string, bool> BooleanSynonyms = new(StringComparer.Ordinal)
        {
            ["да"] = true,
            ["yes"] = true,
            ["true"] = true,
            ["нет"] = false,
            ["no"] = false,
            ["false"] = false
        };

        public static ValidationResult Validate(TaskDefinition task, string answer)
        {
            var normalizedAnswer = NormalizeWhitespace(answer);
            if (string.IsNullOrWhiteSpace(normalizedAnswer))
            {
                return ValidationResult.Invalid($"Пустой ответ. Ожидаемый формат: {ExpectedFormat(task)}");
            }

            return task.AnswerType switch
            {
                AnswerType.Integer => ValidateInteger(task, normalizedAnswer),
                AnswerType.Rational => ValidateRational(task, normalizedAnswer),
                AnswerType.Boolean => ValidateBoolean(task, normalizedAnswer),
                AnswerType.Text => ValidateText(task, normalizedAnswer),
                _ => ValidationResult.Invalid($"Неизвестный тип ответа. Ожидаемый формат: {ExpectedFormat(task)}")
            };
        }

        private static ValidationResult ValidateInteger(TaskDefinition task, string answer)
        {
            if (!TryParseNumeric(answer, out var actual))
            {
                return ValidationResult.Invalid($"Неверный формат. Ожидается целое число (например, 4 или -2).");
            }

            if (Math.Abs(actual - Math.Round(actual)) > DecimalTolerance)
            {
                return ValidationResult.Invalid("Неверный формат. Ожидается целое число без дробной части.");
            }

            foreach (var expected in GetExpectedAnswers(task))
            {
                if (!TryParseNumeric(expected, out var expectedNumber))
                {
                    continue;
                }

                if (Math.Abs(actual - expectedNumber) <= DecimalTolerance)
                {
                    return ValidationResult.Correct();
                }
            }

            return ValidationResult.Invalid($"Неверный ответ. Ожидаемый формат: {ExpectedFormat(task)}");
        }

        private static ValidationResult ValidateRational(TaskDefinition task, string answer)
        {
            if (!TryParseNumeric(answer, out var actual))
            {
                return ValidationResult.Invalid("Неверный формат. Ожидается рациональное число: a/b или десятичное значение.");
            }

            foreach (var expected in GetExpectedAnswers(task))
            {
                if (!TryParseNumeric(expected, out var expectedNumber))
                {
                    continue;
                }

                if (Math.Abs(actual - expectedNumber) <= DecimalTolerance)
                {
                    return ValidationResult.Correct();
                }
            }

            return ValidationResult.Invalid($"Неверный ответ. Ожидаемый формат: {ExpectedFormat(task)}");
        }

        private static ValidationResult ValidateBoolean(TaskDefinition task, string answer)
        {
            if (!TryParseBoolean(answer, out var actual))
            {
                return ValidationResult.Invalid("Неверный формат. Ожидается булево значение: да/нет, yes/no, true/false.");
            }

            foreach (var expected in GetExpectedAnswers(task))
            {
                if (!TryParseBoolean(expected, out var expectedValue))
                {
                    continue;
                }

                if (actual == expectedValue)
                {
                    return ValidationResult.Correct();
                }
            }

            return ValidationResult.Invalid($"Неверный ответ. Ожидаемый формат: {ExpectedFormat(task)}");
        }

        private static ValidationResult ValidateText(TaskDefinition task, string answer)
        {
            foreach (var expected in GetExpectedAnswers(task))
            {
                if (string.Equals(NormalizeWhitespace(expected), answer, StringComparison.OrdinalIgnoreCase))
                {
                    return ValidationResult.Correct();
                }
            }

            return ValidationResult.Invalid($"Неверный ответ. Ожидаемый формат: {ExpectedFormat(task)}");
        }

        private static bool TryParseNumeric(string rawValue, out double value)
        {
            var normalized = NormalizeWhitespace(rawValue).Replace(',', '.');
            var fractionParts = normalized.Split('/');
            if (fractionParts.Length == 2)
            {
                if (!double.TryParse(fractionParts[0], NumberStyles.Float, CultureInfo.InvariantCulture, out var numerator) ||
                    !double.TryParse(fractionParts[1], NumberStyles.Float, CultureInfo.InvariantCulture, out var denominator) ||
                    Math.Abs(denominator) <= double.Epsilon)
                {
                    value = default;
                    return false;
                }

                value = numerator / denominator;
                return true;
            }

            return double.TryParse(normalized, NumberStyles.Float, CultureInfo.InvariantCulture, out value);
        }

        private static bool TryParseBoolean(string rawValue, out bool value)
        {
            var normalized = NormalizeWhitespace(rawValue).ToLowerInvariant();
            return BooleanSynonyms.TryGetValue(normalized, out value);
        }

        private static IEnumerable<string> GetExpectedAnswers(TaskDefinition task)
        {
            yield return task.CorrectAnswer;
            if (task.AcceptedAnswers is null)
            {
                yield break;
            }

            foreach (var accepted in task.AcceptedAnswers.Where(x => !string.IsNullOrWhiteSpace(x)))
            {
                yield return accepted;
            }
        }

        private static string NormalizeWhitespace(string value)
        {
            return string.Join(' ', (value ?? string.Empty)
                .Trim()
                .Split(' ', StringSplitOptions.RemoveEmptyEntries));
        }

        private static string ExpectedFormat(TaskDefinition task)
        {
            return task.AnswerType switch
            {
                AnswerType.Integer => "целое число (например, 4 или -2)",
                AnswerType.Rational => "рациональное число (например, 1/2 или 0.5)",
                AnswerType.Boolean => "булево значение (да/нет, yes/no, true/false)",
                AnswerType.Text => "текстовый ответ",
                _ => "неизвестный формат"
            };
        }
    }

    public readonly record struct ValidationResult(bool IsCorrect, string ErrorMessage)
    {
        public static ValidationResult Correct() => new(true, string.Empty);

        public static ValidationResult Invalid(string message) => new(false, message);
    }
}
