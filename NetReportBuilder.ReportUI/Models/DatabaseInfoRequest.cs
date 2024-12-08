namespace NetReportBuilder.ReportUI
{
    public class DatabaseInfoRequest
    {
        public string databaseType { get; set; }
        public string dataBase { get; set; }
        public string authentication { get; set; }
        public string host { get; set; }
        public string userId { get; set; }
        public string password { get; set; }
        public int port { get; set; }
    }
}
