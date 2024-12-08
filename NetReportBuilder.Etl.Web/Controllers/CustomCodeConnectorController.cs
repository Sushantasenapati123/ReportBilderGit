using Microsoft.AspNetCore.Mvc;
using NetReportBuilder.Etl.Web.Helper;
using System.Data;
using MySqlX.XDevAPI;
using NetReportBuilder.Etl.Model;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using NetReportBuilder.Etl.Web.Models;
using NetReportBuilder.Etl.Core;
using etReportBuilder.Etl.Web;
using System.Data.Entity.Core.Metadata.Edm;

namespace NetReportBuilder.Etl.Web.Controllers
{
    public class CustomCodeConnectorController : BaseController
    {
        private readonly CustomCodeExecuterResolver _customCodeExecuterResolver;
        private readonly CustomCSharpCodeExecuterResolver _codeExecuterResolver;


        public CustomCodeConnectorController(ILogger<DataMappingController> logger, IConfiguration configuration, IWebHostEnvironment webHost, CustomCodeExecuterResolver customCodeExecuterResolver, IHttpContextAccessor httpContextAccessor, CustomCSharpCodeExecuterResolver codeExecuterResolver) : base(logger, configuration, httpContextAccessor,webHost)
        {
            _customCodeExecuterResolver = customCodeExecuterResolver;
            _codeExecuterResolver = codeExecuterResolver;
        }


        public IActionResult Index()
        {
            try
            {
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                return RedirectToAction("Error");
            }
        }
        [HttpPost]
        public async Task<IActionResult> CompileCode([FromForm] string input, [FromForm] string Code_Type)
        {
            if (string.IsNullOrEmpty(input))
                return ErrorResponse("Input Code is missing");
            if (string.IsNullOrEmpty(Code_Type))
                return ErrorResponse("Code Type is missing");
            
            try
            {                

                ICSharpCodeExecuter codeExecuter = _codeExecuterResolver(Code_Type);
                if (codeExecuter is null)
                    return ErrorResponse("Please Select Correct Code Type");
                  
                
                var executionResult = await codeExecuter.Execute(new CustomCodeConfiguration { InputCode = input });

                if(executionResult is null)
                    return ErrorResponse("Unable to compile the input c# Code.");

                string viewTable = string.Empty;
                if(executionResult.IsSuccessfullyCompile)
                {
                    var dt = JsonConvert.DeserializeObject<DataTable>(executionResult.Result);
                    viewTable = dt.DataTableToHtml();
                }
                return Json(new
                {
                    Messages = executionResult.Message,
                    ViewTable = viewTable,
                    IsSuccessfullyCompile = executionResult.IsSuccessfullyCompile,
                    SchemaInfo = executionResult.SchemaInfo,
                    ListOfProperty = executionResult.ListOfProperties,
                }); 

            }
            catch (Exception ex)
            {
                
                _logger.LogError($"{ex}");
                return ErrorResponse($"{ex.Message}\n {ex.StackTrace}");
            }
         





        }

        private JsonResult ErrorResponse(string message)
        {
            return Json(new
            {
                Messages = $"<span style='color:red;'>{message}</span>",
                ViewTable = new DataTable().DataTableToHtml(),
                SchemaInfo = "",
                ListOfProperty = "",
                IsSuccessfullyCompile = false,

            });
        }

        [HttpPost]
        public async Task<IActionResult> Save([FromForm] string input, [FromForm] string Code_Type)
        {
            if (!HttpContext.Session.TryGetValue("CurrentPipeline", out byte[] sessionValue))
            {
                throw new InvalidOperationException();
            }
            try
            {
                PipelineConfiguration<CustomCodeConfiguration> configuration = new PipelineConfiguration<CustomCodeConfiguration>();
                configuration.DataMappingConfigurationDetails = new DataMappingConfiguration();
                configuration.DataConfiguration = new CustomCodeConfiguration()
                {
                    InputCode = input,
                    InputType = Code_Type,
                    JsonData = string.Empty,

                };
                configuration.DataSourceType = DataSourceType.CUSTOMCODE.ParseToText();

                ICustomCodeExecuter customCodeExecuter = (ICustomCodeExecuter)_customCodeExecuterResolver(Code_Type);


                var response = await customCodeExecuter.Execute(input);
                configuration.DataConfiguration.JsonData = response;
                var updatedJsonContent = JsonConvert.SerializeObject(configuration, Newtonsoft.Json.Formatting.Indented);
                //Update Json
                var pipelinePath = Path.Combine(_webHost.WebRootPath, "Pipelines");
                var filePath = Path.Combine(pipelinePath, $"{HttpContext.Session.GetString("CurrentPipeline")}.json");
                using (var writer = new StreamWriter(filePath))
                {
                    writer.Write(updatedJsonContent);
                }

                return Ok(new { message = $"The Pipeline for Custom Code  was successfully registered." });

            }
            catch (Exception ex)
            {
                return Ok(new { message = $"The Cutom Code Connection could not be registered." });

            }





        }


    }

}

