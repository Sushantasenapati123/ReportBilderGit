namespace NetReportBuilder.ReportUI.Models
{
    public class TableData
    {
        public int PortletId { get; set; }
        public List<Dictionary<string, object>> tbody { get; set; }
        public List<string> thead { get; set; }
    }
}
