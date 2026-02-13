using System.Collections.Generic;

namespace GameVSOSh.Assessments
{
    public sealed record TaskDefinition(
        string Id,
        string Prompt,
        string CorrectAnswer,
        string SkillCode,
        AnswerType AnswerType = AnswerType.Integer,
        IReadOnlyList<string> AcceptedAnswers = null
    );
}
