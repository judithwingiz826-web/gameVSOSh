namespace GameVSOSh.Assessments
{
    public sealed record TaskDefinition(
        string Id,
        string Prompt,
        string CorrectAnswer,
        string SkillCode,
        string SourceTrack,
        string Subtopic
    );
}
