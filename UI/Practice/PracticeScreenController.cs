using GameVSOSh.Game.Flow;

namespace GameVSOSh.UI.Practice
{
    public sealed class PracticeScreenController
    {
        private readonly GameFlowController _flow;

        public PracticeScreenController(GameFlowController flow) => _flow = flow;

        public void FinishPracticeAndStartBoss()
        {
            _flow.StartBossAssessment();
        }
    }
}
