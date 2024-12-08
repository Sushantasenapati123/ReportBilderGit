namespace DatabaseConfiguration.Models.DatabaseConfiguration
{
    public class ServerInputsModel
    {
        public string? DatabaseType { get; set; }
        public string? DataBase { get; set; }
        public string? Authentication { get; set; }
        public string? Host { get; set; }
        public int? Port { get; set; }
        public string? UserId { get; set; }
        public string? Password { get; set; }   
        public string? Query { get; set; }
    }
}
