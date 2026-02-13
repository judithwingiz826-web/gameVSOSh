using GameVSOSh.Game.Flow;

namespace GameVSOSh.UI.Hub
{
    public sealed class HubMapController
    {
        private readonly GameFlowController _flow;

        public HubMapController(GameFlowController flow) => _flow = flow;

        public void SelectCityAndTopic()
        {
            _flow.LoadModule();
            _flow.OpenTheory();
        }
    }
}
