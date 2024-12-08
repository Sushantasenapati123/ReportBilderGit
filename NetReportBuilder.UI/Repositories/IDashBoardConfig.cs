using NetReportBuilder.ReportUI.Models;

namespace NetReportBuilder.ReportUI.Repositories
{
    public interface IDashBoardConfig
    {
        Task<int> InsertAsync(DashboardDetail dashboardDetail);
        Task<int> UpdateAsync(DashboardDetail dashboardDetail);
        Task<int> DeleteAsync(int id);
        Task<DashboardDetail> SelectOneAsync(int id);
        Task<List<DashboardPageContents>> SelectOnePageContents(int DashboardId);
        Task<List<DashboardPageContents>> SelectPortletContents(int DashboardId, int PotlateId);
        Task<IEnumerable<DashboardDetail>> SelectAllAsync(string PageName);
        Task<IEnumerable<DataSourceQuery>> BindDatasource();
        Task<string> GetDataSourceQueryByIdAsync(int id);
        Task<string> GetDataSourceQueryByIdAsync(string queryname);
    }

}
