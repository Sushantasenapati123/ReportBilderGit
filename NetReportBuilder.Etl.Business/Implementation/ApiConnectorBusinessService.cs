using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Reflection;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using NetReportBuilder.Etl.Model;
using Microsoft.VisualBasic;
using NetReportBuilder.Etl.Model.Data_Mapping;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace NetReportBuilder.Etl.Business
{

    public class ApiConnectorBusinessService : EtlBusinessService, IApiConnectorBusinessService
    {

        public ApiConnectorBusinessService(IHttpUtility httpUtility, ILogger<ApiConnectorBusinessService> logger, IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor, ICodeGenerator codeGenerator, IConfiguration configuration) : base(httpUtility, logger, webHostEnvironment, httpContextAccessor, configuration, codeGenerator)
        {
        }
        async Task<string> ValidateApiRequest(RestMethodParameterModel model)
        {
            List<KeyValuePair<string, string>> tabledata = null;
            if (string.IsNullOrEmpty(model.ApiUrl) || string.IsNullOrEmpty(model.SelectedMethod))
            {
                return "API URL and method are required.";
            }
            if (!Uri.IsWellFormedUriString(model.ApiUrl, UriKind.Absolute))
            {
                return "Invalid API URL format.";
            }
            if (!Enum.TryParse(typeof(MethodType), model.SelectedMethod, true, out var method))
            {
                return "Invalid HTTP method. Allowed methods are GET, POST, PUT, DELETE.";
            }

            if (model.ApiType == "noparameter")
            {
                if (!string.IsNullOrEmpty(model.TableData))
                {
                    return "No parameters should be provided when apiType is 'noparameter.";
                }
                tabledata = null;
            }
            else if (model.ApiType == "raw")
            {
                try
                {
                    var rawJson = JsonConvert.DeserializeObject<JObject>(model.RawParam);
                }
                catch (JsonException)
                {
                    return "Invalid JSON format in rawparam.";
                }
            }
            else
            {
                try
                {
                    tabledata = JsonConvert.DeserializeObject<List<KeyValuePair<string, string>>>(model.TableData);
                }
                catch (JsonException)
                {
                    return "Invalid JSON format in tableData.";
                }
            }
            return string.Empty;
        }

        public async Task<ApiBusinessModel> InvokeApi(RestMethodParameterModel restMethodParameterModel)
        {
            try
            {

                var validateRequestMessage = await ValidateApiRequest(restMethodParameterModel);
                if (!string.IsNullOrEmpty(validateRequestMessage))
                    return new ApiBusinessModel { ErrorMessage = validateRequestMessage };
                List<KeyValuePair<string, string>> tabledata = null;

                if (restMethodParameterModel.ApiType.Trim().ToLower() != ParameterType.Raw.ToString().Trim().ToLower())
                {
                    tabledata = JsonConvert.DeserializeObject<List<KeyValuePair<string, string>>>(restMethodParameterModel.TableData);
                }

                var apiResponse = await _httpUtility.SendRequest(restMethodParameterModel.ApiUrl, restMethodParameterModel.SelectedMethod, restMethodParameterModel.ApiType, tabledata, restMethodParameterModel.RawParam);

                var sourceCode = await _codeGenerator.GenerateHttpCode(restMethodParameterModel.ConvertApiInfo());



                return new ApiBusinessModel { ApiResponse = apiResponse, GeneratedCode = sourceCode.Code, EntityName = sourceCode.EntityName };

            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }

        public async Task<string> SaveApiConfiguration(ApiDetails request)
        {
            try
            {


                bool isJson = request.Configuration.Response.IsJson();
                var pipeLineInfo = await ReadPipelineData();
                var msg = "";
                var sourceCodeListObj = pipeLineInfo.ListOfSource
                .FirstOrDefault(dc =>  dc.EntityName == request.EntityName);

                request.Configuration.ResponseType = isJson ? "JSON" : "XML";
                if (sourceCodeListObj is null)//Insert New Configuration
                {
                    var DataConfiguration = new ApiConfiguration();
                    DataConfiguration.EndPoint = request.Configuration.EndPoint;
                    DataConfiguration.Parameters = request.Configuration.Parameters;
                    DataConfiguration.HeaderDetails = new List<Parameters>();
                    DataConfiguration.MethodType = request.Configuration.MethodType;
                    DataConfiguration.ParameterType = request.Configuration.ParameterType;
                    DataConfiguration.Response = request.Configuration.Response;
                    DataConfiguration.ResponseType = request.Configuration.ResponseType;
                    DataConfiguration.RawBody = request.Configuration.RawBody;
                    var sourceCode = request.Configuration.DynamicAPICode;// await _dynamicHttpCodeGenerator.GenerateHttpCode(request.GenerateApiModel());
                    
                  

                    int counter_ListOfDataSource = 0;
                    if (pipeLineInfo.ListOfSource.Count > 0)
                        counter_ListOfDataSource = pipeLineInfo.ListOfSource.Count + 1;
                    else
                        counter_ListOfDataSource = 1;



                   

                    pipeLineInfo.ListOfSource.Add(new DataSources { Index = counter_ListOfDataSource, SourceCode = sourceCode, EntityName = request.EntityName,Output= request.Configuration.Response,Configuration= JsonConvert.SerializeObject(DataConfiguration) });

                    msg = "Data submitted and saved successfully.";
                }
                else//Update that one
                {
                

                    if (sourceCodeListObj != null)
                    {
                        // Deserialize the existing configuration
                        var apiConfiguration = JsonConvert.DeserializeObject<ApiConfiguration>(sourceCodeListObj.Configuration);
                        // Update the existing configuration with new values
                        apiConfiguration.EndPoint = request.Configuration.EndPoint;
                        apiConfiguration.Parameters = request.Configuration.Parameters;
                        apiConfiguration.MethodType = request.Configuration.MethodType;
                        apiConfiguration.ParameterType = request.Configuration.ParameterType;
                     
                        apiConfiguration.ResponseType = request.Configuration.ResponseType;
                        apiConfiguration.RawBody = request.Configuration.RawBody;
                        sourceCodeListObj.SourceCode = request.Configuration.DynamicAPICode;
                        sourceCodeListObj.Output = request.Configuration.Response;
                        sourceCodeListObj.Configuration= JsonConvert.SerializeObject(apiConfiguration);

                    }

                    msg = "Data Updated successfully.";
                }
                System.IO.File.WriteAllText(PipelinePath, JsonConvert.SerializeObject(pipeLineInfo));
                return msg;
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }
    }
}
