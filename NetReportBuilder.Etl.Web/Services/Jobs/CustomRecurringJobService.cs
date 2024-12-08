
using NetReportBuilder.Etl.Model;
using Newtonsoft.Json;
using NPOI.HPSF;
using System.Text;
using ExtendedNumerics.Exceptions;
using Org.BouncyCastle.Pkcs;
using System.Data;
using NetReportBuilder.Etl.Web.Helper;
using NetReportBuilder.Etl.Web.Models;
using NetReportBuilder.Etl.Core;
using System.Data.SqlClient;
using static NPOI.HSSF.Util.HSSFColor;
using NPOI.OpenXmlFormats.Dml;
using System.Security.AccessControl;
using System.Net.Http.Headers;
using NPOI.Util;
using NetReportBuilder.Etl.Web.Controllers;
using NPOI.HSSF.Record.Chart;
using NetReportBuilder.Etl.Business;

namespace NetReportBuilder.Etl.Web
{
    public class CustomRecurringJobService : RecurringJobService
    {
        private readonly IHttpUtility _httpUtility;
        public CustomRecurringJobService(IWebHostEnvironment webHost, IConfiguration configuration, ILogger<ApiRecurringJobService> logger, IDataSyncBusiness dataSyncBusiness, IHttpUtility httpUtility) : base(webHost, configuration, logger, dataSyncBusiness)
        {
            _httpUtility = httpUtility;
        }

        public override async Task Execute(string pipelineName)
        {
            if (string.IsNullOrEmpty(pipelineName))
                throw new MissingFieldException("Pipeline name is missing.");
            try
            {
                //Validate the Pipeline Information
                var pipelineInfo = await ValidatePipelineConfiguration<ApiConfiguration>(pipelineName);
                if (pipelineInfo is null)
                    throw new ArgumentException("Unable to locate the Pipeline details");
                var apiResponse = await InvokeApi(pipelineInfo.DataConfiguration);
                if (string.IsNullOrEmpty(apiResponse))
                    throw new DataException("The API could not fetch any results.");

                var source = (pipelineInfo.DataConfiguration.ResponseType.ToLower() == "json") ? apiResponse.JsonToDataTable() : new DataTable();
                if (source is null)
                    throw new DataException("Unable to Parse the JSON result to Datatable");

                var destination = pipelineInfo.DataMappingConfigurationDetails.GenerateDestinationSchema(source);
                if (destination is null)
                    throw new DataException("Unable to create the destination datatable.");
                destination = source.FillSourceToDestination(pipelineInfo.DataMappingConfigurationDetails.MappingDetails, destination);
                if (destination is null)
                    throw new FormatException("Unable to Sync Source data into the Destination Datatable.");
                var syncResponse =await _dataSyncService.SyncData(destination, pipelineInfo.DataMappingConfigurationDetails);
                if (string.IsNullOrEmpty(syncResponse))
                    throw new InvalidOperationException("Unable to Sync the API data with the Target database.");
                if (syncResponse.ToLower() == "success")
                    _logger.LogInformation("The Data sync Process was successful");
                else
                    _logger.LogError("The Data Sync Process was failed.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error Execute Method: {ex}");

            }
        }

        public override async Task<PipelineConfiguration<ApiConfiguration>> ValidatePipelineConfiguration<ApiConfiguration>(string pipelineName)
        {
            
        }
    }

}
