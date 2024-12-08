
namespace NetReportBuilder.ReportUI.Models
{
    public class DashboardPageContents
    {
        public int id { get; set; }
        public int dashboardid { get; set; }
        public int portletid { get; set; }
        public string? datasource { get; set; }
        public string? designtype { get; set; } 
        public string? title { get; set; }
        public string? titlewidget { get; set; }
        public string? tableTitle { get; set; }
        public string? GaugeTitle { get; set; }
        public string? charttype { get; set; }
        public string? xaxis { get; set; }
        public string? xtitle { get; set; }
        public string? yaxis { get; set; }
        public string? ytitle { get; set; }
        
        public string? potlateheight { get; set; }
        public string? potlatewidth { get; set; }
        public string? height { get; set; }
        public string? width { get; set; }
        public string? datacolumnwidget { get; set; }
        public string? percentagewidget { get; set; }
        public string? faicon { get; set; }
        public string? createdon { get; set; }
    }

}
