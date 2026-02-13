using System;
using GameVSOSh.Systems.Save;

namespace GameVSOSh.Assessments
{
    public sealed class AssessmentSession
    {
        public int CorrectAnswers { get; private set; }
        public int TotalAnswers { get; private set; }

        public void Submit(TaskDefinition task, string answer, PlayerProfile profile, int attemptsUsed = 1)
        {
            TotalAnswers++;
            var isCorrect = answer.Trim() == task.CorrectAnswer;
            if (isCorrect)
            {
                CorrectAnswers++;
            }
            else
            {
                RegisterWeakSpot(task.SkillCode, profile);
                RegisterSubtopicWeakSpot(task.SourceTrack, task.Subtopic, profile);
            }

            UpdateTrackPerformance(task.SourceTrack, isCorrect, Math.Max(1, attemptsUsed), profile);
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

        private static void RegisterSubtopicWeakSpot(string trackId, string subtopic, PlayerProfile profile)
        {
            var item = profile.WeakSubtopics.Find(x => x.TrackId == trackId && x.Subtopic == subtopic);
            if (item is null)
            {
                profile.WeakSubtopics.Add(new SubtopicWeakSpot
                {
                    TrackId = trackId,
                    Subtopic = subtopic,
                    MistakeCount = 1,
                    LastMistakeUtc = DateTime.UtcNow
                });
                return;
            }

            item.MistakeCount++;
            item.LastMistakeUtc = DateTime.UtcNow;
        }

        private static void UpdateTrackPerformance(string trackId, bool isCorrect, int attemptsUsed, PlayerProfile profile)
        {
            var track = profile.TrackPerformances.Find(x => x.TrackId == trackId);
            if (track is null)
            {
                track = new TrackPerformance { TrackId = trackId };
                profile.TrackPerformances.Add(track);
            }

            track.TotalAnswers++;
            track.TotalAttempts += attemptsUsed;
            if (isCorrect)
            {
                track.CorrectAnswers++;
            }

            var accuracy = track.TotalAnswers == 0 ? 0f : (float)track.CorrectAnswers / track.TotalAnswers;
            var avgAttempts = track.TotalAnswers == 0 ? 0f : (float)track.TotalAttempts / track.TotalAnswers;
            track.Dynamics.Add(new TrackPerformancePoint
            {
                CapturedAtUtc = DateTime.UtcNow,
                Accuracy = accuracy,
                AvgAttempts = avgAttempts
            });
        }
    }
}
