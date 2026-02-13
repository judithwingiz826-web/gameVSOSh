using GameVSOSh.Game.Flow;
using GameVSOSh.Systems.Save;

namespace GameVSOSh.Game.Bootstrap
{
    public sealed class GameBootstrap
    {
        public GameFlowController Flow { get; }
        public SaveSystem Saves { get; }

        public GameBootstrap()
        {
            Flow = new GameFlowController();
            Saves = new SaveSystem();
        }

        public void Initialize()
        {
            Saves.LoadOrCreateDefaultProfile();
            Flow.StartGameLoop();
        }
    }
}
