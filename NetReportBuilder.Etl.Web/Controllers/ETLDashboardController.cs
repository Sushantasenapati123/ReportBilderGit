using DatabaseConfiguration.Models.DatabaseConfiguration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using NetReportBuilder.Etl.Business;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using NetReportBuilder.Etl.Model.ViewModel;
using NetReportBuilder.Etl.Web;
using NetReportBuilder.Etl.Web.Controllers;
using Newtonsoft.Json;
using NPOI.POIFS.NIO;
using NPOI.SS.UserModel.Charts;
using Org.BouncyCastle.Asn1.X509.Qualified;
using System.Data;
using System.Text;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace DatabaseConfiguration.Controllers
{
    public class ETLDashboardController : BaseController
    {
        private readonly IDataMapperBusinessService _dataMapperBusinessService;
        private readonly IDataTransformationBusiness _dataTransformationBusiness;
        private readonly IPipelineConfigurationBusiness _pipelineConfigurationBusiness;

        private readonly CustomCSharpCodeExecuterResolver _codeExecuterResolver;
        public ETLDashboardController(CustomCSharpCodeExecuterResolver codeExecuterResolver, IPipelineConfigurationBusiness pipelineConfigurationBusiness, IWebHostEnvironment webHost, IConfiguration configuration, IDataMapperBusinessService dataMapperBusinessService, IHttpContextAccessor httpContextAccessor, ILogger<ETLDashboardController> logger, IDataTransformationBusiness dataTransformationBusiness) : base(logger, configuration, httpContextAccessor, webHost)
        {
            _dataMapperBusinessService = dataMapperBusinessService;
            _dataTransformationBusiness = dataTransformationBusiness;
            _pipelineConfigurationBusiness = pipelineConfigurationBusiness;
            _codeExecuterResolver = codeExecuterResolver;
        }


        [HttpGet]

        public async Task<JsonResult> LoadPipeLineConfigDesign(string PipeLineName)
        {
            PipelineModel lst = new PipelineModel();
            try
            {

                var res = await _pipelineConfigurationBusiness.FetchPipelineConfigurationByName(PipeLineName);//Data Flow API
                PipelineConfigurationModel pipelIneInfo = new PipelineConfigurationModel();
                if (res != null)
                {
                    pipelIneInfo = CommonExtensionMethods.DeserializeFromByteArray<PipelineConfigurationModel>(res.FileContent);

                    // Serialize the object to JSON
                    string jsonString = JsonConvert.SerializeObject(pipelIneInfo);



                    _httpContextAccessor.HttpContext.Session.SetString("CurrentPipeline", PipeLineName);
                    string pipelinePath = Path.Combine(_webHost.WebRootPath, @"Pipelines");
                    string filePath = Path.Combine(pipelinePath, $"{PipeLineName}.json");

                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }

                    System.IO.File.WriteAllText(filePath, pipelIneInfo.ToString());

                }
                var jsonres = JsonConvert.SerializeObject(res);
                return Json(jsonres);
            }
            catch
            {
                return Json("Fail");
            }


        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            return View();
        }
        public async Task<IActionResult> New()
        {
            return View();

        }

        [HttpGet]
        public async Task<IActionResult> ConnectApi()
        {

            ConnectApiViewModel vm = new ConnectApiViewModel();
            //binding Method
            vm.MethodTypes = Enum.GetNames(typeof(MethodType)).ToList();
            //binding apitype
            vm.ApiTypes = Enum.GetNames(typeof(ParameterType)).ToList();
            return PartialView("_ConnectApi", vm);

        }
        [HttpGet]
        public async Task<IActionResult> LoadDataBaseConfigModal()
        {


            return PartialView("_DataBaseConnector");

        }
        [HttpGet]
        public async Task<IActionResult> LoadExcelModal()
        {


            return PartialView("_ExcelUploadView");

        }

        [HttpGet]
        public async Task<IActionResult> OpenJoinConditionModal()
        {
            ConnectApiViewModel vm = new ConnectApiViewModel();
            //binding Method
            vm.MethodTypes = Enum.GetNames(typeof(MethodType)).ToList();
            //binding apitype
            vm.ApiTypes = Enum.GetNames(typeof(ParameterType)).ToList();
            return PartialView("_JoinConditionControl", vm);

        }
        [HttpGet]
        public async Task<IActionResult> OpenConditionModal()
        {
            ConnectApiViewModel vm = new ConnectApiViewModel();
            //binding Method
            vm.MethodTypes = Enum.GetNames(typeof(MethodType)).ToList();
            //binding apitype
            vm.ApiTypes = Enum.GetNames(typeof(ParameterType)).ToList();
            return PartialView("_ConditionControl", vm);

        }
        [HttpGet]
        public async Task<IActionResult> OpenGroupByModal()
        {

            return PartialView("_GroupByControl");

        }
        [HttpGet]
        public async Task<IActionResult> MappingData()
        {

            try
            {


                //var executionmode = Enum.GetNames(typeof(ExecutionMode)).ToList();
                //ViewBag.executionMode = executionmode;

                return PartialView("_DataMapping");
            }
            catch (Exception ex)
            {
                return PartialView("_DataMapping");
            }

        }

        [HttpGet]
        public async Task<IActionResult> JoinTransformData()
        {
            try
            {
                var dataSources = await _dataTransformationBusiness.FetchDataSources();
                return PartialView("_JoinTransformData", dataSources);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in JoinTransformData {ex}");
                return BadRequest("Unable to fetch Data Sources");
            }

        }

        [HttpGet]
        public async Task<IActionResult> GetOutputResultData(string entityName, string CurrentModel, string SaveType)//Use For Filter/Groupe BY:Source ModelFor Filter
        {
            try
            {

                if (entityName is not null)
                {


                    var res = await _dataTransformationBusiness.GetOutputColumnWithCode_ForFilter(entityName, CurrentModel, SaveType);
                    var resultTable = new DataTable();
                    if (CurrentModel != null)
                    {


                        if (CurrentModel.StartsWith("dT"))
                        {
                            #region Dynamically Code Execute For Filter Result

                            ICSharpCodeExecuter codeExecuter = _codeExecuterResolver("RDBMS");
                            if (codeExecuter is null)
                                return Json("Please Select Correct Code Type");


                            var executionResult = await codeExecuter.Execute(new CustomCodeConfiguration { InputCode = res.AccumulateCode });

                            if (executionResult is null)
                                return Json("Unable to compile the input c# Code.");

                            string viewTable = string.Empty;
                            if (executionResult.IsSuccessfullyCompile)
                            {
                                resultTable = JsonConvert.DeserializeObject<DataTable>(executionResult.Result);
                                res.Output = resultTable.ConvertToJson();

                                //Output = JsonConvert.SerializeObject(resultTable.AsEnumerable().Take(5).CopyToDataTable());
                            }


                            if (!executionResult.IsSuccessfullyCompile)//Fail
                            {
                                var resultFail = new
                                {

                                    ErrorMsg = string.Join(Environment.NewLine + Environment.NewLine, executionResult.Message.Select((msg, index) => $"{index + 1}. {msg}")),
                                    IsSuccess = false,
                                    ListOfOutputColumn = res.ListOfOutputColumn

                                };
                                return Json(JsonConvert.SerializeObject(resultFail));

                            }


                            #endregion
                        }

                    }
                    return Json(JsonConvert.SerializeObject(res));

                }
                else
                {

                    return BadRequest("Entity is Null");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                return BadRequest("PipeLineNotFound");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetOutputResultDataForJoin(string entityName, string SaveType)//Use For Join:Source ModelFor Join While Edit Join
        {
            try
            {
                if (entityName is not null)
                {

                    var res = await _dataTransformationBusiness.GetOutputColumnWithCode_ForJoin(entityName, SaveType);

                    #region Dynamically Code Execute For Filter Result

                    var resultTable = new DataTable();
                    if (entityName != null)
                    {


                        if (entityName.StartsWith("dT"))
                        {

                            ICSharpCodeExecuter codeExecuter = _codeExecuterResolver("RDBMS");
                            if (codeExecuter is null)
                                return Json("Please Select Correct Code Type");


                            var executionResult = await codeExecuter.Execute(new CustomCodeConfiguration { InputCode = res.AccumulateCode });

                            if (executionResult is null)
                                return Json("Unable to compile the input c# Code.");

                            string viewTable = string.Empty;
                            if (executionResult.IsSuccessfullyCompile)
                            {
                                resultTable = JsonConvert.DeserializeObject<DataTable>(executionResult.Result);
                                res.Output = resultTable.ConvertToJson();
                                //Output = JsonConvert.SerializeObject(resultTable.AsEnumerable().Take(5).CopyToDataTable());
                            }


                            if (!executionResult.IsSuccessfullyCompile)//Fail
                            {
                                var resultFail = new
                                {

                                    ErrorMsg = string.Join(Environment.NewLine + Environment.NewLine, executionResult.Message.Select((msg, index) => $"{index + 1}. {msg}")),
                                    IsSuccess = false


                                };
                                return Json(JsonConvert.SerializeObject(resultFail));
                                //return Ok(resultFail);
                            }



                        }

                    }
                    #endregion

                    return Json(JsonConvert.SerializeObject(res));

                }
                else
                {

                    return BadRequest("Entity is Null");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                return BadRequest("PipeLineNotFound");
            }
        }

        [HttpGet]
        public async Task<IActionResult> FetchDataSources(string entityName)//use by JoinTransform while Connection Create
        {
            try
            {
                if (entityName is null)
                    return View();
                var selectedDataSource = await _dataTransformationBusiness.FetchDataSourceByName(entityName);



                if (selectedDataSource == null)
                {
                    return NotFound("Entity not found");
                }
                return Json(JsonConvert.SerializeObject(selectedDataSource));

            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                return BadRequest("Entity not found");
            }
        }
        [HttpGet]
        public async Task<IActionResult> FetchConfigurationByTableName(string entityName, string SaveType)//DataBase//For API//Bind in GroupBY Div
        {
            if (HttpContext.Session.GetString("CurrentPipeline") != "")///In Create
            {
                var dbConfig = await _dataTransformationBusiness.FetchConfigurationByTable(entityName, SaveType);

                #region Dynamically Code Execute For Filter Result
                var resultTable = new DataTable();
                ICSharpCodeExecuter codeExecuter = _codeExecuterResolver("RDBMS");
                if (codeExecuter is null)
                    return Json("Please Select Correct Code Type");


                var executionResult = await codeExecuter.Execute(new CustomCodeConfiguration { InputCode = dbConfig.AccumulateCode });

                if (executionResult is null)
                    return Json("Unable to compile the input c# Code.");

                string viewTable = string.Empty;
                if (executionResult.IsSuccessfullyCompile)
                {
                    resultTable = JsonConvert.DeserializeObject<DataTable>(executionResult.Result);
                    dbConfig.Output = resultTable.ConvertToJson();
                    //Output = JsonConvert.SerializeObject(resultTable.AsEnumerable().Take(5).CopyToDataTable());
                }


                if (!executionResult.IsSuccessfullyCompile)//Fail
                {
                    var resultFail = new
                    {

                        ErrorMsg = string.Join(Environment.NewLine + Environment.NewLine, executionResult.Message.Select((msg, index) => $"{index + 1}. {msg}")),
                        IsSuccess = false

                    };
                    return Json(resultFail);
                }



                #endregion

                return Json(dbConfig);
            }
            else
            {
                return Json("");
            }
        }

        [HttpGet]
        public async Task<IActionResult> SaveConfiguration()
        {
            try
            {
                SavePipelineConfigurationViewModel vm = new SavePipelineConfigurationViewModel();
                vm.PipelineName = HttpContext.Session.GetString("CurrentPipeline");

                var pipelinePath = Path.Combine(_webHost.WebRootPath, "Pipelines");
                var filePath = Path.Combine(pipelinePath, $"{vm.PipelineName}.json");
                var jsonContent = System.IO.File.ReadAllText(filePath);
                var pipeLineInfo = JsonConvert.DeserializeObject<PipelineConfiguration<ApiConfiguration>>(jsonContent);

                // Set the ViewBag value
                vm.DataSourceType = pipeLineInfo.DataSourceType;
                vm.ExecutionMode = string.Empty;
                vm.ExecutionInterval = new ExecutionInterval { Day = -1, Hour = -1, Minute = -1, WeekDay = string.Empty, MinutesInterval = 0, HoursInterval = 0 };
                vm.Description = string.Empty;


                ViewBag.ExecutionModes = Enum.GetNames(typeof(ExecutionMode)).Select(en => new SelectListItem { Text = en, Value = en, Selected = false }).ToList();


                var dataSyncModes = Enum.GetValues(typeof(DataSyncModes))
                                    .Cast<DataSyncModes>()
                                    .Select(d => new SelectListItem
                                    {
                                        Value = ((int)d).ToString(),
                                        Text = d.ToString()
                                    }).ToList();
                ViewBag.DataSyncModes = dataSyncModes;


                ViewBag.WeekDays = Enum.GetNames(typeof(DayOfWeek)).Select(en => new SelectListItem { Text = en, Value = en, Selected = false }).ToList();
                ViewBag.Days = Enumerable.Range(1, 31).Select(en => new SelectListItem { Text = en.ParseToText(), Value = en.ParseToText(), Selected = false }).ToList();
                ViewBag.Hours = Enumerable.Range(0, 23).Select(en => new SelectListItem { Text = en.ParseToText(), Value = en.ParseToText(), Selected = false }).ToList();

                ViewBag.Minutes = Enumerable.Range(0, 59).Select(en => new SelectListItem { Text = en.ParseToText(), Value = en.ParseToText(), Selected = false }).ToList();
                ViewBag.ScheduledHours = Enumerable.Range(1, 24).Select(en => new SelectListItem { Text = en.ParseToText(), Value = en.ParseToText(), Selected = false }).ToList();
                ViewBag.ScheduledMinutes = Enumerable.Range(1, 1440).Select(en => new SelectListItem { Text = en.ParseToText(), Value = en.ParseToText(), Selected = false }).ToList();

                ViewBag.DataSourceType = pipeLineInfo.DataSourceType;
                ViewBag.PipelineName = vm.PipelineName;

                return PartialView("_SaveConfiguration");
            }
            catch (Exception ex)
            {
                return PartialView("_SaveConfiguration");
            }
        }
        [HttpGet]
        public IActionResult CustomCodeEditor()
        {

            return PartialView("_CustomCodeEditor");

        }
        [HttpPost]
        public IActionResult UpdatePipelineConfiguration(string configuration)
        {
            System.IO.File.WriteAllText(PipelineConfigPath, configuration);
            return Ok("Success");
        }


    }
}
