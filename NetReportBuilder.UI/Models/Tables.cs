namespace NetReportBuilder.ReportUI.Models
{
    public class Tables
    {
        public string schema { get; set; }
        public string name { get; set; }
        public int order { get; set; }
        public List<TableColumn> columns { get; set; }
    }
}
