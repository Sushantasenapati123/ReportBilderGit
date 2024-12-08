using Microsoft.AspNetCore.Mvc;
using Mysqlx;
using NetReportBuilder.Etl.Business;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NPOI.OpenXmlFormats.Shared;
using System.Collections.Generic;
using System.Data;
using System.Text;
using static NPOI.HSSF.Util.HSSFColor;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace NetReportBuilder.Etl.Web.Controllers
{

    public class APIConnectorController : BaseController
    {
        private readonly IApiConnectorBusinessService _apiConnectorBusinessService;
        private readonly CustomCSharpCodeExecuterResolver _codeExecuterResolver;
        public APIConnectorController(CustomCSharpCodeExecuterResolver codeExecuterResolver, ILogger<APIConnectorController> logger, IWebHostEnvironment webHostEnvironment, IApiConnectorBusinessService apiConnectorBusinessService,IConfiguration configuration,IHttpContextAccessor httpContextAccessor):base(logger,configuration,httpContextAccessor,webHostEnvironment)
        {
            _apiConnectorBusinessService = apiConnectorBusinessService;
            _codeExecuterResolver = codeExecuterResolver;
        }
        public static string Output = "";
        public static string NewlyCreateEntityName = "";
        public IActionResult Index()
        {
            try
            {
                //binding Method
                ViewBag.MethodTypes = Enum.GetValues(typeof(MethodType));
                //binding apitype
                ViewBag.apiTypes = Enum.GetValues(typeof(ParameterType));
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                return RedirectToAction("Error");

            }
        }
        public class returnAPIData
        {
            public string ApiResponse { get; set; }
            public string Code { get; set; }
        }
        private static int Count = 1;

        [HttpPost]
        public async Task<IActionResult> Invoke(string DataTableName,string apiUrl, string selectedMethod, string apiType, string tableData, string rawparam)
        {
            try
            {

                int currentCount = Count;
                // Create the StringBuilder for the code that will be executed
                StringBuilder sb = new StringBuilder();

                // Escape quotes for the tableData
                string escapedTableData = tableData.Replace("\"", "\\\"");

                // Invoke the actual API
                var apiResponse = await _apiConnectorBusinessService.InvokeApi(new RestMethodParameterModel
                {   
                    EntityName=DataTableName,
                    ApiUrl = apiUrl,
                    SelectedMethod = selectedMethod,
                    ApiType = apiType,
                    TableData = tableData,
                    RawParam = rawparam
                    
                });

                #region Dynamically Code Execute For Filter Result
                var resultTable = new DataTable();
                ICSharpCodeExecuter codeExecuter = _codeExecuterResolver("RDBMS");
                if (codeExecuter is null)
                    return Json("Please Select Correct Code Type");


                var executionResult = await codeExecuter.Execute(new CustomCodeConfiguration { InputCode = apiResponse.GeneratedCode +"return "+ apiResponse.EntityName+";" });

                if (executionResult is null)
                    return Json("Unable to compile the input c# Code.");

                string viewTable = string.Empty;
                if (executionResult.IsSuccessfullyCompile)
                {
                    resultTable = JsonConvert.DeserializeObject<DataTable>(executionResult.Result);
                    //dbConfig.Output = resultTable.ConvertToJson();
                    Output = JsonConvert.SerializeObject(resultTable.AsEnumerable().Take(5).CopyToDataTable());
                }


                if (!executionResult.IsSuccessfullyCompile)//Fail
                {
                    var resultFail = new
                    {

                        Code = string.Join(Environment.NewLine, executionResult.Message),
                        IsSuccess = false

                    };
                    return BadRequest("Error While Execute The Code");
                    //return Ok(resultFail);
                }


                #endregion



                var ress = resultTable.ConvertToJson();

                // Finalize the response with the content
                var result = new
                {
                    ApiResponse = resultTable.ConvertToJson(), // apiResponse.ApiResponse,
                    Code = apiResponse.GeneratedCode,
                    EntiyName = apiResponse.EntityName,

                };
                //Count++;
                return Content(JsonConvert.SerializeObject(result), "application/json");
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                return BadRequest("Unable to invoke the given API");
            }
        }

        

        [HttpPost]
        public async Task<IActionResult> SubmitApi(ApiDetails request)
        {
            try
            {
                request.Configuration.Response = Output;
                var saveConfigMessage = _apiConnectorBusinessService.SaveApiConfiguration(request);
                return Json(new { success = true, message = saveConfigMessage });
            }
            catch (Exception ex)
            {

                return Json(new { success = false, message = "There was a problem in saving the configuration of the selected API" });
            }


        }


    }
}
