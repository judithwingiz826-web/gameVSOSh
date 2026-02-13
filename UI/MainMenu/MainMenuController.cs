using GameVSOSh.Game.Flow;

namespace GameVSOSh.UI.MainMenu
{
    public sealed class MainMenuController
    {
        private readonly GameFlowController _flow;

        public MainMenuController(GameFlowController flow) => _flow = flow;

        public void OnStartClicked() => _flow.OpenProfile();
    }
}
