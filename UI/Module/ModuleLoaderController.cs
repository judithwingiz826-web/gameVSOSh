using GameVSOSh.Game.Flow;

namespace GameVSOSh.UI.Module
{
    public sealed class ModuleLoaderController
    {
        private readonly GameFlowController _flow;

        public ModuleLoaderController(GameFlowController flow) => _flow = flow;

        public void OnModuleLoaded()
        {
            _flow.OpenTheory();
        }
    }
}
