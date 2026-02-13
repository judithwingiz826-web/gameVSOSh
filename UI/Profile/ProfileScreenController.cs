using GameVSOSh.Game.Flow;
using GameVSOSh.Systems.Save;

namespace GameVSOSh.UI.Profile
{
    public sealed class ProfileScreenController
    {
        private readonly GameFlowController _flow;
        private readonly SaveSystem _saves;

        public ProfileScreenController(GameFlowController flow, SaveSystem saves)
        {
            _flow = flow;
            _saves = saves;
        }

        public void ConfirmProfile(string studentName)
        {
            var profile = _saves.CurrentProfile;
            profile.StudentName = studentName;
            _saves.SaveLocal();
            _flow.OpenHub();
        }
    }
}
