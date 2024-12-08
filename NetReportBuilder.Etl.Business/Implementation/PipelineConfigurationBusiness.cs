using DocumentFormat.OpenXml.Office2010.Excel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MySqlX.XDevAPI.Common;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http.Json;

//using System.Net.Http.Json;
using System.Text;
using System.Text.RegularExpressions;


namespace NetReportBuilder.Etl.Business
{
    public class PipelineConfigurationBusiness : EtlBusinessService, IPipelineConfigurationBusiness
    {


        private readonly Dictionary<ExecutionMode, Func<SavePipelineConfigurationViewModel, CreatePipelineModel, CreatePipelineModel>>
           _executionModelGenerator = new Dictionary<ExecutionMode, Func<SavePipelineConfigurationViewModel, CreatePipelineModel, CreatePipelineModel>>();

        public PipelineConfigurationBusiness(IHttpContextAccessor httpContext, IWebHostEnvironment webHost, ILogger<PipelineConfigurationBusiness> logger, IConfiguration configuration, IHttpUtility httpUtility, ICodeGenerator codeGenerator) : base(httpUtility, logger, webHost, httpContext, configuration, codeGenerator)
        {
            _executionModelGenerator.Add(ExecutionMode.Hourly, GenerateHourlyPipelineModel);
            _executionModelGenerator.Add(ExecutionMode.Minutely, GenerateMinutelyPipelineModel);
            _executionModelGenerator.Add(ExecutionMode.Weekly, GenerateWeeklyPipelineModel);
            _executionModelGenerator.Add(ExecutionMode.Monthly, GenerateMonthlyPipelineModel);
            _executionModelGenerator.Add(ExecutionMode.Daily, GenerateDailyPipelineModel);
        }





        public async Task<PipelineDetails> LoadConfiguration()
        {
            try
            {
                var pipelineDetails = await ReadPipelineData();
                return new PipelineDetails { PipelineName = PipelineName };
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }
        public async Task<CreatePipelineModel> GenerateApiRequestFromModel(SavePipelineConfigurationViewModel model)
        {
            var currentExecutionMode = (ExecutionMode)Enum.Parse(typeof(ExecutionMode), model.ExecutionMode);
            var CurrentDataSyncModes = (DataSyncModes)Enum.Parse(typeof(DataSyncModes), model.DataSyncModes);

            var pipelineConfig = new CreatePipelineModel
            {
                FileName = model.PipelineName,
                Description = model.Description,
                Status = (int)PipelineStatus.NotStarted,
                ExecutionMode = (int)currentExecutionMode,
                DataSyncModes = (int)CurrentDataSyncModes,
                WeekDay = -1,
                Day = -1,
                Hour = -1,
                Minute = -1
            };

            pipelineConfig = _executionModelGenerator[currentExecutionMode].Invoke(model, pipelineConfig);
            return pipelineConfig;

        }





        #region Private methods

        CreatePipelineModel GenerateWeeklyPipelineModel(SavePipelineConfigurationViewModel model, CreatePipelineModel pipelineConfig)
        {
            pipelineConfig.WeekDay = (int)(DayOfWeek)Enum.Parse(typeof(DayOfWeek), model.ExecutionInterval.WeekDay);
            pipelineConfig.Day = model.ExecutionInterval.Day;
            pipelineConfig.Hour = model.ExecutionInterval.Hour;
            pipelineConfig.Minute = model.ExecutionInterval.Minute;
            return pipelineConfig;
        }
        CreatePipelineModel GenerateDailyPipelineModel(SavePipelineConfigurationViewModel model, CreatePipelineModel pipelineConfig)
        {
            pipelineConfig.WeekDay = -1;
            pipelineConfig.Day = -1;
            pipelineConfig.Hour = model.ExecutionInterval.Hour;
            pipelineConfig.Minute = model.ExecutionInterval.Minute;
            return pipelineConfig;
        }
        CreatePipelineModel GenerateHourlyPipelineModel(SavePipelineConfigurationViewModel model, CreatePipelineModel pipelineConfig)
        {
            pipelineConfig.WeekDay = -1;
            pipelineConfig.Day = -1;
            pipelineConfig.Hour = model.ExecutionInterval.HoursInterval;
            pipelineConfig.Minute = -1;
            return pipelineConfig;
        }
        CreatePipelineModel GenerateMinutelyPipelineModel(SavePipelineConfigurationViewModel model, CreatePipelineModel pipelineConfig)
        {
            pipelineConfig.WeekDay = -1;
            pipelineConfig.Day = -1;
            pipelineConfig.Hour = -1;
            pipelineConfig.Minute = model.ExecutionInterval.MinutesInterval;
            return pipelineConfig;
        }
        CreatePipelineModel GenerateMonthlyPipelineModel(SavePipelineConfigurationViewModel model, CreatePipelineModel pipelineConfig)
        {
            pipelineConfig.WeekDay = -1;
            pipelineConfig.Day = model.ExecutionInterval.Day;
            pipelineConfig.Hour = model.ExecutionInterval.Hour;
            pipelineConfig.Minute = model.ExecutionInterval.Minute;
            return pipelineConfig;
        }

       
        public async Task<string> UpdatePipelineConfigurationFileForDataSyncMode(string DataSyncMode, string ExecutionModes, ExecutionInterval ev, string descrption)
        {
            try
            {
                var pipelineInfo = await ReadPipelineData();
                pipelineInfo.SyncConfiguration.DataSyncMode = (DataSyncModes)Enum.Parse(typeof(DataSyncModes), DataSyncMode);
                pipelineInfo.SyncConfiguration.ExecutionMode = (ExecutionMode)Enum.Parse(typeof(ExecutionMode), ExecutionModes);
                pipelineInfo.SyncConfiguration.ExecutionInterval = ev;
                pipelineInfo.SyncConfiguration.Description = descrption;



                var sourceCode = await _codeGenerator.GenerateSyncingCode(
                    new SyncingModel
                    {
                        TruncateEndPoint = $@"{_configuration["BaseApiUrl"].ParseToText()}/{_configuration["TruncateTableEndpoint"].ParseToText()}?tableName={pipelineInfo.DataMappingConfigurationDetails.TargetTable}"
                    ,
                        ConnectionString = _configuration.GetConnectionString("SqlConnetion"),
                        TargetTable = pipelineInfo.DataMappingConfigurationDetails.TargetTable
                    }
                );
                pipelineInfo.SyncConfiguration.SourceCode = sourceCode;
                // Serialize the updated JSON back to the file
                System.IO.File.WriteAllText(PipelinePath, JsonConvert.SerializeObject(pipelineInfo));
                return "success";
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }

        public async Task<string> SaveConfiguration(CreatePipelineModel createPipelineModel)
        {
            try
            {
                var pipelineInfo = await ReadPipelineData();

                byte[] serializedData = CommonExtensionMethods.SerializeToByteArray(pipelineInfo);

                PipelineConfigurationModel convertToModel = CommonExtensionMethods.RetrieveFromDatabase(serializedData);


                createPipelineModel.FileContent = serializedData;
                var baseUrl = _configuration["BaseApiUrl"].ParseToText();
                var endpoint = _configuration["CreatePipelineConfigurationEndpoint"].ParseToText();
                var res = await _httpUtility.SendRequest($"{baseUrl}/{endpoint}", MethodType.POST.ParseToText(), ParameterType.Raw.ParseToText(), new List<KeyValuePair<string, string>>(), JsonConvert.SerializeObject(createPipelineModel));
                if (res == "")
                    return "Fail";
                else

                    return "success";
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }
        public async Task<PipelineModel> FetchPipelineConfigurationByName(string Name)
        {
            var baseUrl = _configuration["BaseApiUrl"];
            var endpoint = _configuration["FetchPipelineConfigurationByName"];

            var fullUrl = $"{baseUrl}/{endpoint}?Name={Name}";
            string msg = "";
            try
            {

                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync(fullUrl);

                    if (response.IsSuccessStatusCode)
                    {
                        string jsonResponse = await response.Content.ReadAsStringAsync();
                        PipelineModel pipelineModel = JsonConvert.DeserializeObject<PipelineModel>(jsonResponse);
                        return pipelineModel;
                    }
                    else
                    {
                        string errorResponse = await response.Content.ReadAsStringAsync();
                        Console.WriteLine("Error Response: " + errorResponse);
                        return null;
                    }
                }

                //return msg;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<List<PipelineModel>> FetchPipelineExecutionHistoryById(int Id)
        {
            var baseUrl = _configuration["BaseApiUrl"];
            var endpoint = _configuration["FetchPipelineExecutionHistoryById"];

            var fullUrl = $"{baseUrl}/{endpoint}?Id={Id}";

            try
            {

                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync(fullUrl);

                    if (response.IsSuccessStatusCode)
                    {
                        string jsonResponse = await response.Content.ReadAsStringAsync();
                        List<PipelineModel> pipelineModel = JsonConvert.DeserializeObject<List<PipelineModel>>(jsonResponse);
                        return pipelineModel;
                    }
                    else
                    {
                        string errorResponse = await response.Content.ReadAsStringAsync();
                        Console.WriteLine("Error Response: " + errorResponse);
                        return null;
                    }
                }

                //return msg;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<string> DeleteConfiguration(string PipeLineName)
        {
            try
            {
                var baseUrl = _configuration["BaseApiUrl"].ParseToText();
                var endpoint = _configuration["DeletePipelineConfiguration"].ParseToText();

                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(baseUrl);

                    // Use string interpolation for cleaner URL creation
                    var requestUri = $"{endpoint}?PipeLineName={PipeLineName}";

                    // Await the DELETE request asynchronously
                    HttpResponseMessage response = await client.DeleteAsync(requestUri);

                    // Read the JSON response
                    string jsonResponse = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("JSON Response: " + jsonResponse);


                    return jsonResponse; // Adjust this based on your actual response structure

                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }
        #endregion
    }
}
