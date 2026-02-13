using System;
using System.Collections.Generic;

namespace GameVSOSh.Systems.Save
{
    [Serializable]
    public sealed class PlayerProfile
    {
        public string StudentId = Guid.NewGuid().ToString("N");
        public string StudentName = "New Student";

        public List<string> CompletedTopics = new();
        public List<TopicResult> TopicResults = new();
        public List<WeakSpot> WeakSpots = new();
        public List<SubtopicWeakSpot> WeakSubtopics = new();
        public List<TrackPerformance> TrackPerformances = new();
        public List<MiniDiagnosticSummary> MiniDiagnostics = new();

        public DateTime LastUpdatedUtc = DateTime.UtcNow;
    }

    [Serializable]
    public sealed class TopicResult
    {
        public string TopicId = string.Empty;
        public int Correct;
        public int Total;
        public int BestStreak;
    }

    [Serializable]
    public sealed class WeakSpot
    {
        public string SkillCode = string.Empty;
        public int MistakeCount;
        public string LastMistakeReason = string.Empty;
    }

    [Serializable]
    public sealed class SubtopicWeakSpot
    {
        public string TrackId = string.Empty;
        public string Subtopic = string.Empty;
        public int MistakeCount;
        public DateTime LastMistakeUtc = DateTime.UtcNow;
    }

    [Serializable]
    public sealed class TrackPerformance
    {
        public string TrackId = string.Empty;
        public int CorrectAnswers;
        public int TotalAnswers;
        public int TotalAttempts;
        public List<TrackPerformancePoint> Dynamics = new();
    }

    [Serializable]
    public sealed class TrackPerformancePoint
    {
        public DateTime CapturedAtUtc = DateTime.UtcNow;
        public float Accuracy;
        public float AvgAttempts;
    }

    [Serializable]
    public sealed class MiniDiagnosticSummary
    {
        public string TrackId = string.Empty;
        public DateTime CompletedAtUtc = DateTime.UtcNow;
        public int TasksCount;
        public int CorrectAnswers;
        public float ReadinessPercent;
        public List<string> WeakSubtopics = new();
        public List<string> Recommendations = new();
    }
}
