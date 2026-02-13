using System.Collections.Generic;
using GameVSOSh.Systems.Save;

namespace GameVSOSh.Assessments
{
    public sealed class AssessmentSession
    {
        public int CorrectAnswers { get; private set; }
        public int TotalAnswers { get; private set; }

        public void Submit(TaskDefinition task, string answer, PlayerProfile profile)
        {
            TotalAnswers++;
            if (answer.Trim() == task.CorrectAnswer)
            {
                CorrectAnswers++;
                return;
            }

            RegisterWeakSpot(task.SkillCode, profile);
        }

        private static void RegisterWeakSpot(string skillCode, PlayerProfile profile)
        {
            var item = profile.WeakSpots.Find(x => x.SkillCode == skillCode);
            if (item is null)
            {
                profile.WeakSpots.Add(new WeakSpot
                {
                    SkillCode = skillCode,
                    MistakeCount = 1,
                    LastMistakeReason = "Incorrect answer"
                });
                return;
            }

            item.MistakeCount++;
            item.LastMistakeReason = "Incorrect answer";
        }
    }
}
