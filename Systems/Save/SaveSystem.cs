using System;
using System.IO;

namespace GameVSOSh.Systems.Save
{
    public sealed class SaveSystem
    {
        private const string LocalSaveName = "student_profile.json";
        public PlayerProfile CurrentProfile { get; private set; } = new();

        private string SavePath => Path.Combine(Environment.CurrentDirectory, LocalSaveName);

        public void LoadOrCreateDefaultProfile()
        {
            if (!File.Exists(SavePath))
            {
                CurrentProfile = new PlayerProfile();
                SaveLocal();
                return;
            }

            var payload = File.ReadAllText(SavePath);
            CurrentProfile = PortableProfileSerializer.Deserialize(payload);
        }

        public void SaveLocal()
        {
            CurrentProfile.LastUpdatedUtc = DateTime.UtcNow;
            File.WriteAllText(SavePath, PortableProfileSerializer.Serialize(CurrentProfile));
        }

        public string ExportPortableProfile()
        {
            CurrentProfile.LastUpdatedUtc = DateTime.UtcNow;
            return PortableProfileSerializer.Serialize(CurrentProfile);
        }

        public void ImportPortableProfile(string portablePayload)
        {
            CurrentProfile = PortableProfileSerializer.Deserialize(portablePayload);
            SaveLocal();
        }
    }
}
