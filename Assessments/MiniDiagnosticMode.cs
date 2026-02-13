using System;
using System.Collections.Generic;
using System.Linq;
using GameVSOSh.Progression;
using GameVSOSh.Systems.Save;

namespace GameVSOSh.Assessments
{
    public sealed class MiniDiagnosticMode
    {
        private readonly AssessmentSession _session = new();

        public MiniDiagnosticReport Run(
            PlayerProfile profile,
            string trackId,
            IReadOnlyList<TaskDefinition> tasks,
            IReadOnlyDictionary<string, DiagnosticAnswer> answersByTask)
        {
            if (tasks.Count < 8 || tasks.Count > 12)
            {
                throw new ArgumentOutOfRangeException(nameof(tasks), "Mini diagnostic expects 8-12 tasks.");
            }

            foreach (var task in tasks)
            {
                if (!answersByTask.TryGetValue(task.Id, out var answer))
                {
                    continue;
                }

                _session.Submit(task, answer.Answer, profile, answer.AttemptsUsed);
            }

            var readiness = ProgressionTracker.BuildTrackReadinessReport(profile, trackId);
            var recommendations = BuildRecommendations(readiness);

            var report = new MiniDiagnosticReport
            {
                TrackId = trackId,
                TasksCount = tasks.Count,
                CorrectAnswers = _session.CorrectAnswers,
                AccuracyPercent = tasks.Count == 0 ? 0f : (float)_session.CorrectAnswers / tasks.Count * 100f,
                ReadinessPercent = readiness.ReadinessPercent,
                WeakSubtopics = readiness.WeakSubtopics,
                Recommendations = recommendations
            };

            profile.MiniDiagnostics.Add(new MiniDiagnosticSummary
            {
                TrackId = trackId,
                CompletedAtUtc = DateTime.UtcNow,
                TasksCount = report.TasksCount,
                CorrectAnswers = report.CorrectAnswers,
                ReadinessPercent = report.ReadinessPercent,
                WeakSubtopics = report.WeakSubtopics.Select(x => x.Subtopic).ToList(),
                Recommendations = report.Recommendations.ToList()
            });

            return report;
        }

        private static List<string> BuildRecommendations(TrackReadinessReport readiness)
        {
            var recommendations = new List<string>();

            if (readiness.ReadinessPercent < 60)
            {
                recommendations.Add("Повторить базовую теорию и решить 20 задач по ключевым подтемам.");
            }
            else if (readiness.ReadinessPercent < 80)
            {
                recommendations.Add("Усилить скорость: 2 коротких сета по 10 задач с лимитом времени.");
            }
            else
            {
                recommendations.Add("Готовность высокая: переходите к полноценному тренировочному туру.");
            }

            if (readiness.WeakSubtopics.Count > 0)
            {
                recommendations.Add($"Сфокусироваться на подтемах: {string.Join(", ", readiness.WeakSubtopics.Select(x => x.Subtopic))}.");
            }

            return recommendations;
        }
    }

    public sealed class DiagnosticAnswer
    {
        public string Answer { get; set; } = string.Empty;
        public int AttemptsUsed { get; set; } = 1;
    }

    public sealed class MiniDiagnosticReport
    {
        public string TrackId { get; set; } = string.Empty;
        public int TasksCount { get; set; }
        public int CorrectAnswers { get; set; }
        public float AccuracyPercent { get; set; }
        public float ReadinessPercent { get; set; }
        public IReadOnlyList<WeakSubtopicInsight> WeakSubtopics { get; set; } = Array.Empty<WeakSubtopicInsight>();
        public IReadOnlyList<string> Recommendations { get; set; } = Array.Empty<string>();
    }
}
