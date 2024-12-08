namespace NetReportBuilder.ReportUI.Models
{
    public class DashboardDetail : BaseEntity
    {
        public string? PageName { get; set; }
        public string? PageLayout { get; set; }
        public string? PageContent { get; set; }
        public string? CreatedOn { get; set; }
    }
}
