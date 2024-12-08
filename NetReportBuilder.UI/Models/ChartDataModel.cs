namespace NetReportBuilder.ReportUI.Models
{
    public class ChartDataModel
    {
        public int ConfigurationId { get; set; }
        public string DataSource { get; set; }
        public string ReportType { get; set; }
        public string ReportDetails { get; set; }
        public string XAxis { get; set; }
        public string XAxisTitle { get; set; }
        public string YAxis { get; set; }
        public string YAxisTitle { get; set; }
        public string Title { get; set; }

    }
}
