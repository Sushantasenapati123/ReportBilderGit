using Dapper;

using NetReportBuilder.ReportUI.Models;
using NetReportBuilder.ReportUI.Repository;
using NetReportBuilder.ReportUI.Factory;
//using NuGet.Protocol.Plugins;
using System.Data;
using static Dapper.SqlMapper;

namespace NetReportBuilder.ReportUI.Repositories
{
    public class ConfigurationDetails : RepositoryBase, IConfigurationDetails
    {
        public ConfigurationDetails(IConnectionFactory connectionFactory) : base(connectionFactory)
        {

        }
        public async Task<int> InsertDashboardConfiguration(DashboardConfigurationSaveDB entity)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@DashboardConfigurationId", entity.DashboardConfigurationId);
                param.Add("@PortletId", entity.PortletId);
                param.Add("@DataSource", entity.DataSource);
                param.Add("@ReportType", entity.ReportType);
                param.Add("@ReportDetails", entity.ReportDetails);
                param.Add("@XAxis", entity.XAxis);
                param.Add("@XAxisTitle", entity.XAxisTitle);
                param.Add("@YAxis", entity.YAxis);
                param.Add("@YAxisTitle", entity.YAxisTitle);
                param.Add("@Title", entity.Title);
                param.Add("@BackgroundColor", entity.BackgroundColor);
                param.Add("@FontColor", entity.FontColor);
                param.Add("@FontStyle", entity.FontStyle);
                param.Add("@ImageFile", entity.ImageFile);
                param.Add("@Icon", entity.Icon);
                param.Add("@BorderWidth", entity.BorderWidth);
                param.Add("@BorderStyle", entity.BorderStyle);
                param.Add("@BorderRadius", entity.BorderRadius);
                param.Add("@Width", entity.Width);
                param.Add("@Height", entity.Height);
                param.Add("@TextMarginLeft", entity.TextMarginLeft);
                param.Add("@TextMarginRight", entity.TextMarginRight);
                param.Add("@TextMarginTop", entity.TextMarginTop);
                param.Add("@TextMarginBottom", entity.TextMarginBottom);
                param.Add("@BackgroundImageFile", entity.BackgroundImageFile);
                param.Add("@CSSInlineCode", entity.CSSInlineCode);
                param.Add("@PMSGOUT", dbType: DbType.String, direction: ParameterDirection.Output, size: 5215585);
                if (entity.DashboardConfigurationId == 0)
                {
                    param.Add("@action", "Insert");
                }
                var query = "Usp_TblDashboardConfiguration";
                Connection.Execute(query, param, commandType: CommandType.StoredProcedure);
                int result = Convert.ToInt32(param.Get<string>("@PMSGOUT"));
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<int> Create(ChartDataModel entity)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@ConfigurationId", entity.ConfigurationId);
                param.Add("@DataSource", entity.DataSource);
                param.Add("@ReportType", entity.ReportType);
                param.Add("@ReportDetails", entity.ReportDetails);
                param.Add("@XAxis", entity.XAxis);
                param.Add("@XAxisTitle", entity.XAxisTitle);
                param.Add("@YAxis", entity.YAxis);
                param.Add("@YAxisTitle", entity.YAxisTitle);
                param.Add("@Title", entity.Title);
                param.Add("@PMSGOUT", dbType: DbType.String, direction: ParameterDirection.Output, size: 5215585);
                if (entity.ConfigurationId == 0)
                {
                    param.Add("@action", "Insert");
                }
                var query = "Usp_TblSaveConfiguration";
                Connection.Execute(query, param, commandType: CommandType.StoredProcedure);
                int result = Convert.ToInt32(param.Get<string>("@PMSGOUT"));
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ChartDataModel> GetChartDetails(int ConfigurationId)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@ConfigurationId", ConfigurationId);
                param.Add("@action", "GetChart");
                param.Add("@PMSGOUT", dbType: DbType.String, direction: ParameterDirection.Output, size: 5215585);
                var x = Connection.Query<ChartDataModel>("Usp_TblSaveConfiguration", param, commandType: CommandType.StoredProcedure).FirstOrDefault();
                return x;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
