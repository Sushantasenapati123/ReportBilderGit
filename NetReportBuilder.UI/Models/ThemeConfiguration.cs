using Microsoft.AspNetCore.Http;

namespace NetReportBuilder.ReportUI.Models
{
    public class ThemeConfiguration
    {
        public int DashboardId { get; set; }
        public string HTMLElement { get; set; }
        public int PortletId { get; set; }
        public string PageLayout { get; set; }
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
        public string BackgroundColor { get; set; }
        public string FontColor { get; set; }
        public string FontStyleText { get; set; }
        public string FontStyleValue { get; set; }
        public int FontSize { get; set; }
        public string Header { get; set; }
      //  public IFormFile ImageFile { get; set; }
        public string ImagePath { get; set; }
        public string Icon { get; set; }
        public decimal BorderWidth { get; set; }
        public string BorderStyleText { get; set; }
        public string BorderStyleValue { get; set; }
        public int BorderRadius { get; set; }
        //public int Width { get; set; }
        public int BorderHeight { get; set; }
        public int TextMarginLeft { get; set; }
        public int TextMarginRight { get; set; }
        public int TextMarginTop { get; set; }
        public int TextMarginBottom { get; set; }
        public IFormFile BackgroundImageFile { get; set; }
        public string BackgroundImage { get; set; }
        public string CSSInlineCode { get; set; }

    }
}
