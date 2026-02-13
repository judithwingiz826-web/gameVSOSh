using System;
using System.Collections.Generic;
using System.Linq;
using GameVSOSh.Systems.Save;

namespace GameVSOSh.Progression
{
    public static class ProgressionTracker
    {
        public static void CompleteTopic(PlayerProfile profile, string topicId, int correct, int total)
        {
            if (!profile.CompletedTopics.Contains(topicId))
            {
                profile.CompletedTopics.Add(topicId);
            }

            profile.TopicResults.RemoveAll(x => x.TopicId == topicId);
            profile.TopicResults.Add(new TopicResult
            {
                TopicId = topicId,
                Correct = correct,
                Total = total,
                BestStreak = correct
            });
        }

        public static TrackReadinessReport BuildTrackReadinessReport(PlayerProfile profile, string trackId)
        {
            var track = profile.TrackPerformances.Find(x => x.TrackId == trackId);
            if (track is null || track.TotalAnswers == 0)
            {
                return new TrackReadinessReport
                {
                    TrackId = trackId,
                    ReadinessPercent = 0,
                    AccuracyPercent = 0,
                    AverageAttempts = 0,
                    WeakSubtopics = new List<WeakSubtopicInsight>()
                };
            }

            var accuracy = (float)track.CorrectAnswers / track.TotalAnswers;
            var avgAttempts = (float)track.TotalAttempts / track.TotalAnswers;
            var attemptsScore = Math.Clamp((2.2f - avgAttempts) / 1.2f, 0f, 1f);

            var weakSubtopics = profile.WeakSubtopics
                .Where(x => x.TrackId == trackId)
                .OrderByDescending(x => x.MistakeCount)
                .Take(3)
                .Select(x => new WeakSubtopicInsight
                {
                    Subtopic = x.Subtopic,
                    Mistakes = x.MistakeCount,
                    SharePercent = (float)x.MistakeCount / Math.Max(1, profile.WeakSubtopics.Where(w => w.TrackId == trackId).Sum(w => w.MistakeCount)) * 100f
                })
                .ToList();

            var weaknessPenalty = Math.Min(0.2f, weakSubtopics.Count * 0.05f);
            var readiness = Math.Clamp((accuracy * 0.7f + attemptsScore * 0.3f) - weaknessPenalty, 0f, 1f);

            return new TrackReadinessReport
            {
                TrackId = trackId,
                ReadinessPercent = readiness * 100f,
                AccuracyPercent = accuracy * 100f,
                AverageAttempts = avgAttempts,
                WeakSubtopics = weakSubtopics
            };
        }
    }

    public sealed class TrackReadinessReport
    {
        public string TrackId { get; set; } = string.Empty;
        public float ReadinessPercent { get; set; }
        public float AccuracyPercent { get; set; }
        public float AverageAttempts { get; set; }
        public List<WeakSubtopicInsight> WeakSubtopics { get; set; } = new();
    }

    public sealed class WeakSubtopicInsight
    {
        public string Subtopic { get; set; } = string.Empty;
        public int Mistakes { get; set; }
        public float SharePercent { get; set; }
    }
}
