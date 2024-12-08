using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Reflection;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using NetReportBuilder.Etl.Web.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore;
using System.Net.Http.Headers;
using Microsoft.VisualBasic;
using System.Linq.Expressions;
using System.Text;

namespace NetReportBuilder.Etl.Business
{

    public class DataMapperBusinessService : EtlBusinessService, IDataMapperBusinessService
    {

        Dictionary<DataSourceType, Func<string, Task<DataMapperInitParams>>> InitParamGetter = new Dictionary<DataSourceType, Func<string, Task<DataMapperInitParams>>>();
        public DataMapperBusinessService(IHttpUtility httpUtility, ILogger<ApiConnectorBusinessService> logger, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment webHostEnvironment, ICodeGenerator codeGenerator) : base(httpUtility, logger, webHostEnvironment, httpContextAccessor, configuration, codeGenerator)
        {

            InitParamGetter.Add(DataSourceType.RDBMS, GetDatabaseInitParams);
            InitParamGetter.Add(DataSourceType.API, GetApiInitParams);
            InitParamGetter.Add(DataSourceType.FILE, GetFileInitParams);
            InitParamGetter.Add(DataSourceType.CUSTOMCODE, GetCustomCodeInitParam);
        }

        public async Task<List<Tables>> FetchTableList(DatabaseObjectSearchModel databaseObjectSearchModel)
        {
            try
            {
                var endPoint = $@"{_configuration["BaseApiUrl"].ParseToText()}/{_configuration["FetchDataSourceEndpoint"].ParseToText()}";
                var tableResponse = await _httpUtility.SendRequest(endPoint, MethodType.POST.ParseToText(), ParameterType.Raw.ParseToText(), null, JsonConvert.SerializeObject(databaseObjectSearchModel));

                var tableData = JsonConvert.DeserializeObject<BindTables>(tableResponse);
                return tableData.tables;
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }

        public async Task<List<TableColumn>> FetchColumnsLit(DatabaseObjectSearchModel databaseObjectSearchModel)
        {
            try
            {
                var endPoint = $@"{_configuration["BaseApiUrl"].ParseToText()}/{_configuration["FetchDataSourceEndpoint"].ParseToText()}";
                var tableResponse = await _httpUtility.SendRequest(endPoint, MethodType.POST.ParseToText(), ParameterType.Raw.ParseToText(), null, JsonConvert.SerializeObject(databaseObjectSearchModel));

                var tableData = JsonConvert.DeserializeObject<BindTables>(tableResponse);
                return tableData.tables.FirstOrDefault().columns;
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }

        }

        //public async Task<DataMapperInitParams> LoadConfigurations()
        //{
        //    try
        //    {
        //        var pipelineInfo = await ReadPipelineData();
        //        var firstItem = pipelineInfo.DataConfigurations.FirstOrDefault();
        //        var initParam = await InitParamGetter[firstItem.DataSource].Invoke(firstItem.Configuration);
        //        initParam.PipelineName = PipelineName;
        //        return initParam;
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError($"{ex}");
        //        throw;
        //    }
        //}

        private static readonly object fileLock = new object();


        async Task<DataMapperInitParams> GetApiInitParams(string jsonConfiguration)
        {
            var apiConfiguration = JsonConvert.DeserializeObject<ApiConfiguration>(jsonConfiguration);
            return new DataMapperInitParams
            {
                DisplaySection = DataSourceType.API.ParseToText(),
                APIResponseTYpe = apiConfiguration.ResponseType,
                DataSourceType = DataSourceType.API.ParseToText(),
                Response = JsonConvert.SerializeObject(apiConfiguration.Response).Trim('"')
            };

        }
        async Task<DataMapperInitParams> GetCustomCodeInitParam(string jsonConfiguration)
        {
            throw new NotImplementedException();
            //var customCodeConfig = JsonConvert.DeserializeObject<PipelineConfiguration<CustomCodeConfiguration>>(jsonConfiguration);
            //return new DataMapperInitParams
            //{
            //    DisplaySection = DataSourceType.CUSTOMCODE.ParseToText(),
            //    APIResponseTYpe = "JSON",
            //    DataSourceType = customCodeConfig.DataSourceType,
            //    Response = JsonConvert.SerializeObject(customCodeConfig.DataConfiguration.JsonData).Trim('"')
            //};


        }
        async Task<DataMapperInitParams> GetDatabaseInitParams(string jsonConfiguration)
        {
            throw new NotImplementedException();
        }
        async Task<DataMapperInitParams> GetFileInitParams(string jsonConfiguration)
        {
            throw new NotImplementedException();
        }


        public async Task<List<Destination>> UpdatePipelineConfigurationFile(MappingRequest data)
        {
            try
            {
                var mappingConfiguration = await PrepareDataMapping(data);
                var pipelineInfo = await ReadPipelineData();
                var mappingData = mappingConfiguration.MappingDetails.ModelMapping();
                // Form the variable declaration
                string destinationColumns = $"List<string> destinationColumns = new List<string> {{ {String.Join(", ", mappingConfiguration.Destination.Select(dest => dest.ColumnName).ToList().ConvertAll(s => $"\"{s}\""))} }};";

                string sourceCode;
                if (string.IsNullOrEmpty(data.SourceCode)) // Generate Source Code
                {
                    sourceCode = await _codeGenerator.GenerateMappingCode(mappingData, destinationColumns);
                }
                else // Update Source code
                {
                    sourceCode = data.SourceCode;
                }
                pipelineInfo.DataMappingConfigurationDetails = mappingConfiguration;
                pipelineInfo.DataMappingConfigurationDetails.SourceCode = sourceCode;

                var updatedJsonContent = JsonConvert.SerializeObject(pipelineInfo, Formatting.Indented);

                await File.WriteAllTextAsync(PipelinePath, updatedJsonContent);

                return mappingConfiguration.Destination;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating the pipeline configuration file.");
                throw;
            }
        }

        async Task<DataMappingConfiguration> PrepareDataMapping(MappingRequest data)
        {
            DataMappingConfiguration mappingModel = new DataMappingConfiguration { Destination = new List<Destination>(), MappingDetails = new List<MappingModel>(), Source = new List<Source>(), TargetTable = string.Empty };
            try
            {
                if (string.IsNullOrEmpty(data.TableName))//for Existing
                {

                    mappingModel.TargetTable = data.Mapping[0].Destination.TableName;

                    foreach (var Mapping in data.Mapping)
                    {
                        mappingModel.Source.Add(new Source { FieldName = Mapping.Source.FieldName, Original_FieldName = Mapping.Source.FieldName, DataType = Mapping.Source.DataType });

                        mappingModel.Destination.Add(new Destination { Type = Mapping.Source.DataType, TableName = Mapping.Destination.TableName, ColumnName = Mapping.Destination.ColumnName });

                        mappingModel.MappingDetails.Add(new MappingModel { SourceColumn = Mapping.Source.FieldName, DestinationColumn = Mapping.Destination.ColumnName });
                    }
                }
                else
                {
                    mappingModel.TargetTable = data.TableName;
                    //for New Table
                    foreach (var Mapping in data.List_NewColumnNameWithType)
                    {
                        mappingModel.Source.Add(new Source { FieldName = Mapping.FieldName, Original_FieldName = Mapping.Original_FieldName, DataType = Mapping.DataType });

                        mappingModel.Destination.Add(new Destination { Type = Mapping.DataType, TableName = data.TableName, ColumnName = Mapping.FieldName, constraints = Mapping.constraints });

                        mappingModel.MappingDetails.Add(new MappingModel { SourceColumn = Mapping.Original_FieldName, DestinationColumn = Mapping.FieldName });
                    }

                }
                return mappingModel;
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }
        public async Task<string> GetDataMappingConfigurationSourceCode(MappingRequest mappingRequest)
        {
            var mappingConfiguration = await PrepareDataMapping(mappingRequest);
            var pipelineInfo = await ReadPipelineData();
            var mappingData = mappingConfiguration.MappingDetails.ModelMapping();
            // Form the variable declaration
            string destinationColumns = $"List<string> destinationColumns = new List<string> {{ {String.Join(", ", mappingConfiguration.Destination.Select(dest => dest.ColumnName).ToList().ConvertAll(s => $"\"{s}\""))} }};";

            string sourceCode = "";

            sourceCode = await _codeGenerator.GenerateMappingCode(mappingData, destinationColumns);






            return sourceCode;
        }

        public async Task<string> SaveDataMappingConfiguration(MappingRequest mappingRequest)
        {
            try
            {
                var msg = "Success";

                var destinationList = await UpdatePipelineConfigurationFile(mappingRequest);

                if (mappingRequest.TableName != "")
                {

                    var createTableQuery = CommonMethodForExecuteQuery.GenerateCreateTableScript(mappingRequest.TableName, destinationList);
                    using (var httpClient = new HttpClient())
                    {
                        using (var request = new HttpRequestMessage(new HttpMethod("POST"), $@"{_configuration["BaseApiUrl"].ParseToText()}/{_configuration["CreateTableEndpoint"].ParseToText()}?createTableScript=" + createTableQuery))
                        {
                            request.Headers.TryAddWithoutValidation("accept", "*/*");

                            request.Content = new StringContent("");
                            request.Content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/x-www-form-urlencoded");

                            var response = await httpClient.SendAsync(request);
                            if (!response.IsSuccessStatusCode)
                            {
                                // Log details of the failure and update the return message.
                                var errorContent = await response.Content.ReadAsStringAsync();
                                _logger.LogError($"Failed to create table. Status: {response.StatusCode}, Error: {errorContent}");
                                msg = $"Failed to create table. Error: {errorContent}";
                            }

                        }
                    }
                }

                return msg;

            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }

        public async Task<string> ApiResponse()
        {
            try
            {
                var pipelineInfo = await ReadPipelineData();
                //return pipelineInfo.DataTransformation.Output;
                //return pipelineInfo.DataTransformation.FirstOrDefault().Output;

                return pipelineInfo.ListOfSource.OrderByDescending(source => source.Index).FirstOrDefault()?.Output;



                throw new NotImplementedException();
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }

        public  async Task<DataMappingConfiguration> GetMappingConfiguration()
        {
            try
            {
                var pipelineInfo = await ReadPipelineData();
                return pipelineInfo.DataMappingConfigurationDetails;



                throw new NotImplementedException();
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }
    }
}
