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
    }
}
