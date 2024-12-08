
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
using NetReportBuilder.Etl.Business;
using Org.BouncyCastle.Pqc.Crypto.Saber;

namespace NetReportBuilder.Etl.Web
{
    public class CustomCodeRecurringJobService : RecurringJobService
    {
        
        private readonly CustomCodeExecuterResolver _customCodeExecuterResolver;
        public CustomCodeRecurringJobService(IWebHostEnvironment webHost,IConfiguration configuration, ILogger<CustomCodeRecurringJobService> logger,CustomCodeExecuterResolver customCodeExecuterResolver,IDataSyncBusiness dataSyncService):base(webHost,configuration,logger,dataSyncService)
        {
           
            _customCodeExecuterResolver = customCodeExecuterResolver;
        }
       
        public override async Task Execute(string pipelineName)
        {
            if (string.IsNullOrEmpty(pipelineName))
                throw new MissingFieldException("Pipeline name is missing.");
            try
            {

                var pipelineInfo = await ValidatePipelineConfiguration<CustomCodeConfiguration>(pipelineName);
                if (pipelineInfo is null)
                    throw new ArgumentException("Unable to locate the Pipeline details");

                ICustomCodeExecuter executor = _customCodeExecuterResolver(pipelineInfo.DataConfiguration.InputType);
                
                if (executor is null)
                    throw new KeyNotFoundException("Unable to resolve the Custom Code executor.");

                var apiResponse = await executor.Execute(pipelineInfo.DataConfiguration.InputCode);

                if (string.IsNullOrEmpty(apiResponse))
                    throw new DataException("The API could not fetch any results.");

                var source = apiResponse.JsonToDataTable();
                if (source is null)
                    throw new DataException("Unable to Parse the JSON result to Datatable");

                var destination = pipelineInfo.DataMappingConfigurationDetails.GenerateDestinationSchema(source);

                if (destination is null)
                    throw new DataException("Unable to create the destination datatable.");

                destination = source.FillSourceToDestination(pipelineInfo.DataMappingConfigurationDetails.MappingDetails, destination);

                if (destination is null)
                    throw new FormatException("Unable to Sync Source data into the Destination Datatable.");


                var syncResponse= await _dataSyncService.SyncData(destination, pipelineInfo.DataMappingConfigurationDetails);
                if (string.IsNullOrEmpty(syncResponse))
                    throw new InvalidOperationException("Unable to Sync the data with the Target database.");
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

        public override async Task<PipelineConfiguration<CustomCodeConfiguration>> ValidatePipelineConfiguration<CustomCodeConfiguration>(string pipelineName)
        {
            if (string.IsNullOrEmpty(pipelineName))
                throw new ArgumentNullException("The Pipeline is missing");
            var pipelinePath = Path.Combine(_webHost.WebRootPath, "Pipelines");
            var filePath = Path.Combine(pipelinePath, $"{pipelineName}.json");
            var jsonData = await ReadPipeline(filePath);
            var pipeLineInfo = JsonConvert.DeserializeObject<PipelineConfiguration<CustomCodeConfiguration>>(jsonData);
            if (pipeLineInfo == null)
                throw new InvalidCastException("Could not Convert the JSON object to Api Configuration");
            if (string.IsNullOrEmpty(pipeLineInfo.DataSourceType))
                throw new InvalidOperationException("DataSource type is missing");
            if (pipeLineInfo.DataSourceType.ToLower() != DataSourceType.CUSTOMCODE.ParseToText().ToLower()) throw new InvalidOperationException("The Configuration file seems to be corrupt.");
            if (pipeLineInfo.DataConfiguration == null)
                throw new InvalidOperationException("The Configuration file seems to be corrupt. Data Configuration is missing.");
            return pipeLineInfo;
        }
    }
  
}
