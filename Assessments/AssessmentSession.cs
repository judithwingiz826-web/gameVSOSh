using GameVSOSh.Systems.Save;

namespace GameVSOSh.Assessments
{
    public sealed class AssessmentSession
    {
        public int CorrectAnswers { get; private set; }
        public int TotalAnswers { get; private set; }

        public ValidationResult Submit(TaskDefinition task, string answer, PlayerProfile profile)
        {
            TotalAnswers++;

            var validation = AnswerValidator.Validate(task, answer);
            if (validation.IsCorrect)
            {
                CorrectAnswers++;
                return validation;
            }

            RegisterWeakSpot(task.SkillCode, profile, validation.ErrorMessage);
            return validation;
        }

        private static void RegisterWeakSpot(string skillCode, PlayerProfile profile, string reason)
        {
            var item = profile.WeakSpots.Find(x => x.SkillCode == skillCode);
            if (item is null)
            {
                profile.WeakSpots.Add(new WeakSpot
                {
                    SkillCode = skillCode,
                    MistakeCount = 1,
                    LastMistakeReason = reason
                });
                return;
            }

            item.MistakeCount++;
            item.LastMistakeReason = reason;
        }
    }
}
