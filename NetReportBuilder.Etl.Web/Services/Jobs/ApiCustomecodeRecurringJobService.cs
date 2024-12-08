
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
using MySqlX.XDevAPI;
using System.Collections.Generic;
using Microsoft.AspNetCore.WebUtilities;
using System.Text.RegularExpressions;

namespace NetReportBuilder.Etl.Web
{
    public class ApiCustomecodeRecurringJobService : RecurringJobService
    {
        private readonly IPipelineConfigurationBusiness _pipelineConfigurationBusiness;

        private readonly CustomCodeExecuterResolver _customCodeExecuterResolver;
        private readonly IHttpUtility _httpUtility;
        private readonly CustomCSharpCodeExecuterResolver _codeExecuterResolver;
        HttpClient client;
        public ApiCustomecodeRecurringJobService(IPipelineConfigurationBusiness pipelineConfigurationBusiness, IWebHostEnvironment webHost, CustomCodeExecuterResolver customCodeExecuterResolver, IConfiguration configuration, ILogger<ApiRecurringJobService> logger, IDataSyncBusiness dataSyncBusiness, IHttpUtility httpUtility, CustomCSharpCodeExecuterResolver codeExecuterResolver) : base(webHost, configuration, logger, dataSyncBusiness)
        {
            _httpUtility = httpUtility;
            client = new HttpClient();
            _customCodeExecuterResolver = customCodeExecuterResolver;
            _codeExecuterResolver = codeExecuterResolver;
            _pipelineConfigurationBusiness = pipelineConfigurationBusiness;
        }

        public async Task<string> UpdatePipelineLastExecutionTimeAsync(string pipelineName, string StatusMessage)
        {
            var baseUrl = _configuration["BaseApiUrl"];
            var endpoint = _configuration["UpdatePipelineLastExecutionTimeEndpoint"];
            var fullUrl = $"{baseUrl}/{endpoint}";
            string msg = "";

            try
            {
                // Create a new anonymous object for the request body
                var requestBody = new
                {
                    PipeLineName = pipelineName,
                    StatusMessage = StatusMessage
                };

                // Serialize the request body to JSON
                var jsonContent = new StringContent(
                    System.Text.Json.JsonSerializer.Serialize(requestBody),
                    Encoding.UTF8,
                    "application/json");

                // Send POST request with the serialized JSON body
                HttpResponseMessage response = await client.PostAsync(fullUrl, jsonContent);

                if (response.IsSuccessStatusCode)
                {
                    // Read the response content as a string
                    msg = await response.Content.ReadAsStringAsync();
                }
                else
                {
                    string errorResponse = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("Error Response: " + errorResponse);
                }

                return msg;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while calling {Url}", fullUrl);
                return "failure";  // Optionally, return a more descriptive error message
            }
        }



        public override async Task Execute(string pipelineName)
        {
            // var msg=await UpdatePipelineLastExecutionTimeAsync(pipelineName);
            try
            {
                var PipeLineConfiguration = await _pipelineConfigurationBusiness.FetchPipelineConfigurationByName(pipelineName);
                PipelineConfigurationModel pipelIneInfo = new PipelineConfigurationModel();
                if (PipeLineConfiguration != null)
                {


                    pipelIneInfo = CommonExtensionMethods.DeserializeFromByteArray<PipelineConfigurationModel>(PipeLineConfiguration.FileContent);

                }



                #region Replace Last DatasourceList DatatableName To Source

                var lastHighestIndexObject = pipelIneInfo.ListOfSource.LastOrDefault();
                if (lastHighestIndexObject != null)
                {
                    // Step 2: Retrieve the SourceCode
                    var sourceCode = lastHighestIndexObject.SourceCode;

                    var match = Regex.Match(sourceCode, @"var\s+(\w+)\s*=");
                    string EntityNameToReplace = "";

                    if (match.Success)
                    {

                        EntityNameToReplace = match.Groups[1].Value.Split("_")[1];
                        var replacedSourceCode = CommonExtensionMethods.ReplaceLastOccurrence(sourceCode, "dT_" + EntityNameToReplace, "source");
                        pipelIneInfo.ListOfSource.LastOrDefault().SourceCode = replacedSourceCode;

                    }

                }

                #endregion





                if (string.IsNullOrEmpty(pipelineName))
                    throw new MissingFieldException("Pipeline name is missing.");



                StringBuilder sb = new StringBuilder();
                foreach (var dataConfig in pipelIneInfo.ListOfSource.OrderBy(dc => dc.Index))
                {
                    sb.Append(dataConfig.SourceCode);
                }
                //sb.Append(pipelIneInfo.DataTransformation.FirstOrDefault().SourceCode);
                sb.Append(pipelIneInfo.DataMappingConfigurationDetails.SourceCode);
                sb.Append(pipelIneInfo.SyncConfiguration.SourceCode);
                var sourcecode = sb.ToString();


                ICSharpCodeExecuter codeExecuter = _codeExecuterResolver("API");
                if (codeExecuter is null)
                    throw new KeyNotFoundException("Please Select Correct Code Type");


                var executionResult = await codeExecuter.Execute(new CustomCodeConfiguration { InputCode = sourcecode });
                if (!executionResult.IsSuccessfullyExecute)
                {
                    if (executionResult.RuntimeExceptionMsg == null)
                    {
                        var msg = await UpdatePipelineLastExecutionTimeAsync(pipelineName, string.Join(" ", executionResult.Message));
                    }
                    else
                    {
                        var msg = await UpdatePipelineLastExecutionTimeAsync(pipelineName, executionResult.RuntimeExceptionMsg);
                    }

                }
                else
                {
                    var msg = await UpdatePipelineLastExecutionTimeAsync(pipelineName, "Success");
                }
                if (executionResult is null)
                    throw new Exception("Unable to compile the source code");


            }
            catch (Exception ex)
            {
                _logger.LogError($"Error Execute Method: {ex}");
                var msg = await UpdatePipelineLastExecutionTimeAsync(pipelineName, ex.Message);

            }
        }

        public override async Task<PipelineConfiguration<ApiConfiguration>> ValidatePipelineConfiguration<ApiConfiguration>(string pipelineName)
        {
            if (string.IsNullOrEmpty(pipelineName))
                throw new ArgumentNullException("The Pipeline is missing");
            var pipelinePath = Path.Combine(_webHost.WebRootPath, "Pipelines");
            var filePath = Path.Combine(pipelinePath, $"{pipelineName}.json");
            var jsonData = await ReadPipeline(filePath);
            var pipeLineInfo = JsonConvert.DeserializeObject<PipelineConfiguration<ApiConfiguration>>(jsonData);
            if (pipeLineInfo == null)
                throw new InvalidCastException("Could not Convert the JSON object to Api Configuration");
            if (string.IsNullOrEmpty(pipeLineInfo.DataSourceType))
                throw new InvalidOperationException("DataSource type is missing");
            if (pipeLineInfo.DataSourceType.ToLower() != DataSourceType.APICUSTOMCODE.ParseToText().ToLower()) throw new InvalidOperationException("The Configuration file seems to be corrupt.");
            if (pipeLineInfo.DataConfiguration == null)
                throw new InvalidOperationException("The Configuration file seems to be corrupt. Data Configuration is missing.");
            return pipeLineInfo;
        }
    }

}
