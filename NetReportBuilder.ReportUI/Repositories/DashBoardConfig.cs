using Dapper;
using Microsoft.AspNetCore.Mvc.RazorPages;
using NetReportBuilder.ReportUI.Factory;
using NetReportBuilder.ReportUI.Models;
using NetReportBuilder.ReportUI.Repository;
using Newtonsoft.Json;
using System.Data;

namespace NetReportBuilder.ReportUI.Repositories
{
    public class DashBoardConfig : RepositoryBase, IDashBoardConfig
    {
        public DashBoardConfig(IConnectionFactory connectionFactory) : base(connectionFactory)
        {
        }
        public async Task<int> DeleteAsync(int id)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@ActionCode", "D");
                param.Add("@Id", id);
                param.Add("@PMSGOUT", dbType: DbType.String, direction: ParameterDirection.Output, size: 5215585);
                _ = await Connection.ExecuteAsync("sp_dashboard_details", param, commandType: CommandType.StoredProcedure);
                return 1;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<int> InsertAsync(DashboardDetail dashboardDetail)
        {
            try
            {
                int result = 0;
                DynamicParameters param = new DynamicParameters();
                if(dashboardDetail.Id!=0)
                {
                    param.Add("@ActionCode", "U"); 
                    param.Add("@Id", dashboardDetail.Id); 
                }
                else
                {
                    param.Add("@ActionCode", "I");
                }
               
                param.Add("@PageName", dashboardDetail.PageName);
                param.Add("@PageLayout", dashboardDetail.PageLayout);
                param.Add("@PageContent", dashboardDetail.PageContent);
                param.Add("@PMSGOUT", dbType: DbType.String, direction: ParameterDirection.Output, size: 5215585);
                var query = "sp_dashboard_details";
                Connection.Execute(query, param, commandType: CommandType.StoredProcedure);
                var returnedDashboardid = Convert.ToInt32(param.Get<string>("@PMSGOUT"));

                //Inserting to personlized page content table
                // Deserialize page contents
                List<DashboardPageContents> pageContentsList = JsonConvert.DeserializeObject<List<DashboardPageContents>>(dashboardDetail.PageContent);
                foreach (var pageContent in pageContentsList.OrderByDescending(i=>i.portletid))
                {
                    string title = GetFirstNonNull(pageContent.title, pageContent.titlewidget, pageContent.tableTitle,pageContent.GaugeTitle);

                    if (dashboardDetail.Id != 0)
                    {
                        param.Add("@ActionCode", "U2");
                        param.Add("@DashboardId", dashboardDetail.Id);
                    }
                    else
                    {
                        param.Add("@ActionCode", "I2");
                        param.Add("@DashboardId", returnedDashboardid);
                    }                    
                    param.Add("@PortletId", pageContent.portletid);
                    param.Add("@DataSource", pageContent.datasource);
                    param.Add("@DesignType", pageContent.designtype);
                    param.Add("@Title", title);
                    param.Add("@ChartType", pageContent.charttype);
                    param.Add("@Xaxis", pageContent.xaxis);
                    param.Add("@Xtitle", pageContent.xtitle);
                    param.Add("@Yaxis", pageContent.yaxis);
                    param.Add("@Ytitle", pageContent.ytitle);
                    param.Add("@PotlateHeight", pageContent.potlateheight);
                    param.Add("@PotlateWidth", pageContent.potlatewidth);
                    param.Add("@Height", pageContent.height);
                    param.Add("@Width", pageContent.width);
                    param.Add("@DataColumnWidget", pageContent.datacolumnwidget);
                    param.Add("@PercentageWidget", pageContent.percentagewidget);
                    param.Add("@faicon", pageContent.faicon);

                    // Execute the stored procedure for each item in the list
                    var query2 = "sp_dashboard_details";
                    await Connection.ExecuteAsync(query2, param, commandType: CommandType.StoredProcedure);
                }

                // Retrieve the result from the last execution
                result = Convert.ToInt32(param.Get<string>("@PMSGOUT"));
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        static string GetFirstNonNull(params string[] values)
        {
            foreach (var value in values)
            {
                if (value != null)
                {
                    return value;
                }
            }
            return null; // If all values are null
        }
        public async Task<IEnumerable<DashboardDetail>> SelectAllAsync(string PageName)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@ActionCode", "S");
                param.Add("@pagename", PageName);
                param.Add("@PMSGOUT", dbType: DbType.String, direction: ParameterDirection.Output, size: 5215585);
                var res = await Connection.QueryAsync<DashboardDetail>("sp_dashboard_details", param, commandType: CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<DashboardDetail> SelectOneAsync(int id)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@ActionCode", "SO");
                param.Add("@Id", id);
                param.Add("@PMSGOUT", dbType: DbType.String, direction: ParameterDirection.Output, size: 5215585);
                var res = await Connection.QueryAsync<DashboardDetail>("sp_dashboard_details", param, commandType: CommandType.StoredProcedure);
                return res.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<List<DashboardPageContents>> SelectOnePageContents(int DashboardId)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@ActionCode", "SOR");
                // param.Add("@PotlateId", PotlateId);
                param.Add("@DashboardId", DashboardId);
                param.Add("@PMSGOUT", dbType: DbType.String, direction: ParameterDirection.Output, size: 5215585);
                var res = await Connection.QueryAsync<DashboardPageContents>("sp_dashboard_details", param, commandType: CommandType.StoredProcedure);
                return res.ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<List<DashboardPageContents>> SelectPortletContents(int DashboardId,int PotlateId)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@ActionCode", "SUR");
                 param.Add("@PortletId", PotlateId);
                param.Add("@DashboardId", DashboardId);
                param.Add("@PMSGOUT", dbType: DbType.String, direction: ParameterDirection.Output, size: 5215585);
                var res = await Connection.QueryAsync<DashboardPageContents>("sp_dashboard_details", param, commandType: CommandType.StoredProcedure);
                return res.ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<int> UpdateAsync(DashboardDetail dashboardDetail)
        {
            try
            {
                int result = 0;
                DynamicParameters param = new DynamicParameters();
                param.Add("@ActionCode", "U");
                param.Add("@PageName", dashboardDetail.PageName);
                param.Add("@PageLayout", dashboardDetail.PageLayout);
                param.Add("@PMSGOUT", dbType: DbType.String, direction: ParameterDirection.Output, size: 5215585);
                var query = "sp_dashboard_details";
                Connection.Execute(query, param, commandType: CommandType.StoredProcedure);
                result = Convert.ToInt32(param.Get<string>("@PMSGOUT"));
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IEnumerable<DataSourceQuery>> BindDatasource()
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@ActionCode", "GDS");
                param.Add("@PMSGOUT", dbType: DbType.String, direction: ParameterDirection.Output, size: 5215585);
                var res = await Connection.QueryAsync<DataSourceQuery>("sp_dashboard_details", param, commandType: CommandType.StoredProcedure);
                return res.ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<string> GetDataSourceQueryByIdAsync(int id)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@ActionCode", "GQS"); // ActionCode for fetching the query
                param.Add("@Id", id);            // Pass the id parameter
                param.Add("@PMSGOUT", dbType: DbType.String, direction: ParameterDirection.Output, size: 5215585);

                // Execute the stored procedure
                var result = await Connection.QueryAsync<string>(
                    "sp_dashboard_details",
                    param,
                    commandType: CommandType.StoredProcedure
                );

                // Since it's returning a single query, we can get the first result
                return result.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error fetching query by id {id}: {ex.Message}", ex);
            }
        }
        public async Task<string> GetDataSourceQueryByIdAsync(string queryname)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@ActionCode", "GQS"); // ActionCode for fetching the query
                param.Add("@Name", queryname);   // Pass the queryname parameter
                param.Add("@PMSGOUT", dbType: DbType.String, direction: ParameterDirection.Output, size: 5215585);
                // Execute the stored procedure and fetch the result
                var result = await Connection.QueryFirstOrDefaultAsync<string>(
                    "sp_dashboard_details",
                    param,
                    commandType: CommandType.StoredProcedure
                );

                return result; // Return the first result (Query column)
            }
            catch (Exception ex)
            {
                throw new Exception($"Error fetching query by name {queryname}: {ex.Message}", ex);
            }
        }

    }
}
