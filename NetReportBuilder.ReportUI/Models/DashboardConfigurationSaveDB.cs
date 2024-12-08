namespace NetReportBuilder.ReportUI.Models
{
    public class DashboardConfigurationSaveDB
    {
        public int DashboardConfigurationId { get; set; }
        public int PortletId { get; set; }
        public int ConfigurationId { get; set; }
        public string DataSource { get; set; }
        public string ReportType { get; set; }
        public string ReportDetails { get; set; }
        public string XAxis { get; set; }
        public string XAxisTitle { get; set; }
        public string YAxis { get; set; }
        public string YAxisTitle { get; set; }
        public string Title { get; set; }
        public string BackgroundColor { get; set; }
        public string FontColor { get; set; }
        public string FontStyle { get; set; }
        public string ImageFile { get; set; }
        public string Icon { get; set; }
        public int BorderWidth { get; set; }
        public string BorderStyle { get; set; }
        public int BorderRadius { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public int TextMarginLeft { get; set; }
        public int TextMarginRight { get; set; }
        public int TextMarginTop { get; set; }
        public int TextMarginBottom { get; set; }
        public string BackgroundImageFile { get; set; }
        public string CSSInlineCode { get; set; }
    }
}
