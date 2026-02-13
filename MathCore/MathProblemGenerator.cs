using System.Collections.Generic;
using GameVSOSh.Assessments;

namespace GameVSOSh.MathCore
{
    public static class MathProblemGenerator
    {
        public static List<TaskDefinition> BuildLinearEquationsSet10()
        {
            return new List<TaskDefinition>
            {
                new("task-01", "2x + 3 = 11", "4", "linear_eq", AnswerType.Integer),
                new("task-02", "5x - 10 = 0", "2", "linear_eq", AnswerType.Integer),
                new("task-03", "x/4 = 3", "12", "fraction", AnswerType.Rational, new[] { "12/1", "12.0" }),
                new("task-04", "3x + 6 = 0", "-2", "negative", AnswerType.Integer),
                new("task-05", "7 + x = 15", "8", "basic", AnswerType.Integer),
                new("task-06", "9x = 81", "9", "multiplication", AnswerType.Integer),
                new("task-07", "4x - 4 = 20", "6", "linear_eq", AnswerType.Integer),
                new("task-08", "x + x = 14", "7", "combining_terms", AnswerType.Integer),
                new("task-09", "10 - x = 1", "9", "signs", AnswerType.Integer),
                new("task-10", "6x + 12 = 30", "3", "linear_eq", AnswerType.Integer)
            };
        }
    }
}
