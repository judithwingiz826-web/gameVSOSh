using System;

namespace GameVSOSh.Game.Flow
{
    public sealed class GameFlowController
    {
        public GameState CurrentState { get; private set; } = GameState.MainMenu;

        public event Action<GameState>? OnStateChanged;

        public void StartGameLoop() => ChangeState(GameState.MainMenu);
        public void OpenProfile() => ChangeState(GameState.StudentProfile);
        public void OpenHub() => ChangeState(GameState.HubMap);
        public void LoadModule() => ChangeState(GameState.ModuleLoading);
        public void OpenTheory() => ChangeState(GameState.Theory);
        public void OpenPractice() => ChangeState(GameState.Practice);
        public void StartBossAssessment() => ChangeState(GameState.AssessmentBoss);
        public void CompleteVerticalSlice() => ChangeState(GameState.Completed);

        private void ChangeState(GameState next)
        {
            CurrentState = next;
            OnStateChanged?.Invoke(CurrentState);
        }
    }
}
