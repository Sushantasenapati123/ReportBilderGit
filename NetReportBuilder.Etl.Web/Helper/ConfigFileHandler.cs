public static class ConfigFileHandler
{
    private static readonly string _fileName = "database_configurations.json";
    private static readonly string _solutionPath = Directory.GetParent(Directory.GetParent(Directory.GetParent(Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).FullName).FullName).FullName).FullName;

    // This method returns the full file path (combining base path and file name)
    public static string GetFilePath()
    {
        string configFolderPath = Path.Combine(_solutionPath, "ConfigFile");
        if (!Directory.Exists(configFolderPath))
        {
            Directory.CreateDirectory(configFolderPath);
        }

        string fullPath = Path.Combine(configFolderPath, _fileName);

        // Check if the file exists; if not, create it
        if (!File.Exists(fullPath))
        {
            CreateConfigFile(fullPath);
        }

        return fullPath;
    }

    // Static method to create the config file if it doesn't exist
    private static void CreateConfigFile(string path)
    {
        // Create an empty JSON file if it doesn't exist
        File.WriteAllText(path, "[]");  // Initialize with an empty JSON array

        Console.WriteLine($"Configuration file created at: {path}");
    }
}
