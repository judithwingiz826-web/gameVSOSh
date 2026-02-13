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
}
