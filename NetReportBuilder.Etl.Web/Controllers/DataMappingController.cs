using Microsoft.AspNetCore.Mvc;
using NetReportBuilder.Etl.Business;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using NetReportBuilder.Etl.Web.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Text;

namespace NetReportBuilder.Etl.Web.Controllers
{


    public class DataMappingController : BaseController
    {

        private readonly IDataMapperBusinessService _dataMapperBusinessService;
        private readonly IDataTransformationBusiness _dataTransformationBusiness;
        public DataMappingController(IDataTransformationBusiness dataTransformationBusiness, ILogger<DataMappingController> logger, IConfiguration configuration, IWebHostEnvironment webHost, IDataMapperBusinessService dataMapperBusinessService, IHttpContextAccessor httpContextAccessor) : base(logger, configuration, httpContextAccessor, webHost)
        {
            _dataMapperBusinessService = dataMapperBusinessService;
            _dataTransformationBusiness = dataTransformationBusiness;
        }




        public async Task<IActionResult> Index()
        {
            try
            {

                //var initParam = await _dataMapperBusinessService.LoadConfigurations();
                //ViewBag.DisplaySection = initParam.DisplaySection;
                //ViewBag.Response = initParam.Response;
                //ViewBag.APIResponseTYpe = initParam.APIResponseTYpe;
                //HttpContext.Session.SetString("DataSourceType", initParam.DataSourceType);


                var executionmode = Enum.GetNames(typeof(ExecutionMode)).ToList();
                ViewBag.executionMode = executionmode;
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                return RedirectToAction("Error");
            }
        }



        async Task<List<Tables>> BindTable()
        {
            return await _dataMapperBusinessService.FetchTableList(new DatabaseObjectSearchModel { Tables = null });

        }
        [HttpGet]
        public async Task<IActionResult> Get_ColumnsByTable(string TableName)
        {
            return Ok(await _dataMapperBusinessService.FetchColumnsLit(new DatabaseObjectSearchModel { Tables = new string[] { TableName } }));

        }

        [HttpPost]
        public async Task<IActionResult> GetPostMappingDataSourceCode([FromBody] MappingRequest data)
        {
            try
            {
                var savemappingResponse = await _dataMapperBusinessService.GetDataMappingConfigurationSourceCode(data);
                var result = new
                {
                    Message = "Success",
                    Code = savemappingResponse

                };

                return Content(JsonConvert.SerializeObject(result), "application/json");


            }
            catch (Exception ex)
            {
                var result = new
                {
                    Message = ex.Message,
                    Code = ""

                };
                //Count++;
                return Content(JsonConvert.SerializeObject(result), "application/json");

            }

        }


        [HttpPost]
        public async Task<IActionResult> PostMappingData([FromBody] MappingRequest data)
        {
            try
            {

                var savemappingResponse = await _dataMapperBusinessService.SaveDataMappingConfiguration(data);
                if (savemappingResponse != "Success")
                {
                    var resultt = new
                    {
                        Message = savemappingResponse,
                        Code = ""

                    };
                    //Count++;
                    return Content(JsonConvert.SerializeObject(resultt), "application/json");

                }

                var filePath = Path.Combine(Path.Combine(_webHost.WebRootPath, "Pipelines"), $"{HttpContext.Session.GetString("CurrentPipeline")}.json");
                var jsonString = await CommonUtility.ReadTexFile(filePath);
                PipelineConfigurationModel dataMapping = JsonConvert.DeserializeObject<PipelineConfigurationModel>(jsonString);

                var result = new
                {
                    Message = savemappingResponse,
                    Code = dataMapping.DataMappingConfigurationDetails.SourceCode

                };
                //Count++;
                return Content(JsonConvert.SerializeObject(result), "application/json");



            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }






        [HttpPost]
        public async Task<IActionResult> GetJsonData([FromForm] string input, [FromForm] string SaveType)//Simple
        {
            List<string> outputMessages = new List<string>();
            DataTable DT = new DataTable();
            DataSet dataSet = new DataSet();
            bool IsSuccessfullyCompile = false;
            JArray jsonArray = null;

            List<ColumnDetails> sourceListWithNameAndType = new List<ColumnDetails>();
            try
            {
                input = await _dataMapperBusinessService.ApiResponse();
                input = input.Replace("\\\"", "\"").Replace("\\\\", "\\");
                List<string> lsk = JsonUtility.ProcessJsonData(input, "");
                //if (SaveType == "Update")
                //{
                //    var mappingConfig=await _dataMapperBusinessService.GetMappingConfiguration();
                //    foreach(var x in mappingConfig.Destination)
                //    {
                //        sourceListWithNameAndType.Add(new ColumnDetails() { Column_Name = x.ColumnName,Column_Type=x.Type }) ;
                //    }
                //    sourceListWithNameAndType = OtherExtensions.SourceListWithNameAndType(input);
                //}
                //else
                //{
                    //sourceListWithNameAndType = lsk[0].Trim().ExtractPropertiesFromClassString().Skip(1).ToList();
                    sourceListWithNameAndType = OtherExtensions.SourceListWithNameAndType(input);
                //}






                // Try parsing the input as JArray
                jsonArray = JArray.Parse(input);
            }
            catch (JsonReaderException)
            {
                try
                {
                    // If parsing as JArray fails, try parsing as JObject
                    JObject jsonObject = JObject.Parse(input);
                    jsonArray = (JArray)jsonObject["data"];
                }
                catch (JsonReaderException)
                {
                    // If parsing as both JObject and JArray fails, handle the error
                    outputMessages.Add("Invalid JSON input.");
                    return Json(new { Messages = outputMessages });
                }
            }
            catch (Exception ex)
            {
                // If parsing as both JObject and JArray fails, handle the error
                outputMessages.Add(ex.Message);
                return Json(new { Messages = outputMessages });
            }
            string htmlOutput = "";
            string OutputMSG = "";
            (List<string> Model, StringBuilder Ss) result;
            try
            {
                outputMessages.Add($"<span style='color:green;'>Process Json Data</span>");
                result = OtherExtensions.ProcessJsonData(input, "DemoClass");
                DT = input.ConvertJsonToDataTable();

                // Store DataTable in session
                HttpContext.Session.SetObjectAsJson("UploadedDataTable", DT);
                // Convert DataSet to HTML
                // Create a new DataSet
                // Add the DataTable to the DataSet
                dataSet.Tables.Add(DT);
                htmlOutput = dataSet.ParseToHtml();
                outputMessages.Add($"<span style='color:green;'>Process Successfuly</span>");
                IsSuccessfullyCompile = true;
                //CommonMethodForExecuteQuery.SaveModelClassToFile(result.Ss.ToString(), @$"{_hostEnvironment.ContentRootPath}\DynamicClass.cs");
                //outputMessages.Add(@$"<span style='color:green;'>Class is Create At Location : {_hostEnvironment.ContentRootPath}\DynamicClass.cs</span>");

            }
            catch (Exception ex)
            {
                outputMessages.Add($"<span style='color:red;'>{ex.Message}</span>");
                IsSuccessfullyCompile = false;
                return Json(new { IsSuccessfullyCompile = IsSuccessfullyCompile, Messages = outputMessages });
            }
            List<Tables> listOfTables = null;
            try
            {
                listOfTables = await BindTable();
                if (listOfTables == null)
                {
                    outputMessages.Add("<span style='color:red;'>Failed to bind tables.</span>");
                    listOfTables = new List<Tables>(); // Initialize as an empty list
                    IsSuccessfullyCompile = false;
                }
            }
            catch (Exception ex)
            {
                outputMessages.Add($"<span style='color:red;'>{ex.Message}</span>");
                listOfTables = new List<Tables>(); // Initialize as an empty list
            }

            return Json(new
            {
                ViewTable = htmlOutput,
                SchemaInfo = "",
                ListOfProperty = sourceListWithNameAndType,//dataSet.GetHeadersWithTypes(),
                IsSuccessfullyCompile = IsSuccessfullyCompile,
                Messages = outputMessages[0],
                ListOfTable = listOfTables
            });// ;

        }


        [HttpGet]
        public async Task<IActionResult> FetchConfigurationForMapping(string PipelineName)
        {
            try
            {

                if (HttpContext.Session.GetString("CurrentPipeline") != "")///In Create
                {
                    var dbConfig = await _dataTransformationBusiness.ReadConfiguration();
                    return Json(dbConfig.DataMappingConfigurationDetails);
                }
                else
                {
                    return Json("Session Is Out");
                }
            }
            catch (Exception ex)
            {
                return Json("Something went Wrong");
            }
        }


    }

}

