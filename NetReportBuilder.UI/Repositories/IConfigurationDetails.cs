using NetReportBuilder.ReportUI.Models;

namespace NetReportBuilder.ReportUI.Repositories
{
    public interface IConfigurationDetails
    {
        Task<int> InsertDashboardConfiguration(DashboardConfigurationSaveDB entity);//Insert Dashboard Configuration
        Task<int> Create(ChartDataModel entity);//Insert
        Task<ChartDataModel> GetChartDetails(int ConfigurationId);//Get
    }
}
