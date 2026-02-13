using System.Text.Json;

namespace GameVSOSh.Systems.Save
{
    public static class PortableProfileSerializer
    {
        private static readonly JsonSerializerOptions Options = new()
        {
            WriteIndented = true
        };

        public static string Serialize(PlayerProfile profile)
            => JsonSerializer.Serialize(profile, Options);

        public static PlayerProfile Deserialize(string payload)
            => JsonSerializer.Deserialize<PlayerProfile>(payload, Options) ?? new PlayerProfile();
    }
}
