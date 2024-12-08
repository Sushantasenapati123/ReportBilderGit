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
using DatabaseConfiguration.Models.DatabaseConfiguration;
using System.Data.Common;
using System.Data;
using NetReportBuilder.Etl.Model.ViewModel;
using NetReportBuilder.ReportSource.Model;

namespace NetReportBuilder.Etl.Business
{

    public class DataBaseConnectorBusinessService : EtlBusinessService, IDataBaseConnectorBusinessService
    {
     
        public DataBaseConnectorBusinessService(IHttpUtility httpUtility, ILogger<ApiConnectorBusinessService> logger, IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor, ICodeGenerator codeGenerator, IConfiguration configuration) : base(httpUtility, logger, webHostEnvironment, httpContextAccessor, configuration, codeGenerator)
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

        public async Task<DataSources> GetTableResultFromDataBase(AddDatabaseConfigurationsPipeline_Model serverInputsModel)
        {
            try
            {
             
                var sourceCode = await _codeGenerator.GenerateInlineQueryCode(serverInputsModel);



                return new DataSources {SourceCode = sourceCode.Code, EntityName = sourceCode.EntityName };

            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }

        public async Task<string> SaveDataBaseConfiguration(AddDatabaseConfigurationsPipeline_Model request)
        {
            try
            {
                string path = PipelinePath;



                var pipeLineInfo = await ReadPipelineData();
                var msg = "";
                var sourceCodeListObj = pipeLineInfo.ListOfSource
                .FirstOrDefault(dc => dc.EntityName == request.EntityName);


                if (sourceCodeListObj is null)//Insert New Configuration
                {
                    var DataConfiguration = new ServerInputsModel();
                    DataConfiguration.Authentication = request.Authentication;
                 
                    DataConfiguration.Host = request.HostName;
                    DataConfiguration.DataBase = request.DatabaseName;
                    DataConfiguration.DatabaseType = request.DatabaseType;
                    DataConfiguration.UserId = request.UserName;
                    DataConfiguration.Password = request.Password;
                    DataConfiguration.Port = Convert.ToInt32(request.Port);
                    DataConfiguration.Query = request.Query;
                    var sourceCode = request.SourceCode;// await _dynamicHttpCodeGenerator.GenerateHttpCode(request.GenerateApiModel());



                    int counter_ListOfDataSource = 0;
                    if (pipeLineInfo.ListOfSource.Count > 0)
                        counter_ListOfDataSource = pipeLineInfo.ListOfSource.Count + 1;
                    else
                        counter_ListOfDataSource = 1;

                    pipeLineInfo.ListOfSource.Add(new DataSources { Index = counter_ListOfDataSource, SourceCode = sourceCode, EntityName = request.EntityName, Output = request.Output, DataBaseInputsModel = JsonConvert.SerializeObject(DataConfiguration) });

                    msg = "Data submitted and saved successfully.";
                }


                else//Update that one
                {


                    if (sourceCodeListObj != null)
                    {
                        // Deserialize the existing configuration
                        var DataConfiguration = JsonConvert.DeserializeObject<ServerInputsModel>(sourceCodeListObj.DataBaseInputsModel);

                        
                        DataConfiguration.Authentication = request.Authentication;
                        DataConfiguration.DataBase = request.Authentication;
                        DataConfiguration.Host = request.HostName;
                        DataConfiguration.DataBase = request.DatabaseName;
                        DataConfiguration.DatabaseType = request.DatabaseType;
                        DataConfiguration.UserId = request.UserName;
                        DataConfiguration.Password = request.Password;
                        DataConfiguration.Port = Convert.ToInt32(request.Port);
                        DataConfiguration.Query = request.Query;
                        

                        sourceCodeListObj.SourceCode = request.SourceCode;
                        sourceCodeListObj.Output = request.Output;
                        sourceCodeListObj.DataBaseInputsModel = JsonConvert.SerializeObject(DataConfiguration);

                    }

                    msg = "Data Updated successfully.";
                }

                
                System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(pipeLineInfo));
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
