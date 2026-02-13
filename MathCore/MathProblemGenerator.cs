using System.Collections.Generic;
using GameVSOSh.Assessments;

namespace GameVSOSh.MathCore
{
    public static class MathProblemGenerator
    {
        public static List<TaskDefinition> BuildLinearEquationsSet10()
        {
            const string track = "vosh_track";

            return new List<TaskDefinition>
            {
                new("task-01", "2x + 3 = 11", "4", "linear_eq", track, "basic_linear_equations"),
                new("task-02", "5x - 10 = 0", "2", "linear_eq", track, "basic_linear_equations"),
                new("task-03", "x/4 = 3", "12", "fraction", track, "fractions_in_equations"),
                new("task-04", "3x + 6 = 0", "-2", "negative", track, "sign_handling"),
                new("task-05", "7 + x = 15", "8", "basic", track, "basic_linear_equations"),
                new("task-06", "9x = 81", "9", "multiplication", track, "multiplication_division_equations"),
                new("task-07", "4x - 4 = 20", "6", "linear_eq", track, "basic_linear_equations"),
                new("task-08", "x + x = 14", "7", "combining_terms", track, "combining_like_terms"),
                new("task-09", "10 - x = 1", "9", "signs", track, "sign_handling"),
                new("task-10", "6x + 12 = 30", "3", "linear_eq", track, "basic_linear_equations")
            };
        }
    }
}
