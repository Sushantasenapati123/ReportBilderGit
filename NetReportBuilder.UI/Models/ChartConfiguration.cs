namespace NetReportBuilder.ReportUI.Models
{
    public class ChartConfiguration
    {
        public int DashboardId { get; set; }
        public int PortletId { get; set; }
        public string DataSourceText { get; set; }
        public string DataSourceValue { get; set; }
        public string ReportTypeText { get; set; }
        public string ReportTypeValue { get; set; }
        public string ReportDetails { get; set; }
        public string Title { get; set; }
        public string XAxisText { get; set; }
        public string XAxisValue { get; set; }
        public string XAxisTitle { get; set; }
        public string YAxisText { get; set; }
        public string YAxisValue { get; set; }
        public string YAxisTitle { get; set; }
    }
}
