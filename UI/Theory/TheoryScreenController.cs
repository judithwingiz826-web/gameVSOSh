using GameVSOSh.Game.Flow;

namespace GameVSOSh.UI.Theory
{
    public sealed class TheoryScreenController
    {
        private readonly GameFlowController _flow;

        public TheoryScreenController(GameFlowController flow) => _flow = flow;

        public void CompleteTheory()
        {
            _flow.OpenPractice();
        }
    }
}
