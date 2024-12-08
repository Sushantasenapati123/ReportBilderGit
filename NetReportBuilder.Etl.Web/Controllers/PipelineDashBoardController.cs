using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using NetReportBuilder.Etl.Business;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;

using NetReportBuilder.Etl.Web.Models;
using Newtonsoft.Json;
using System.Diagnostics;

namespace NetReportBuilder.Etl.Web.Controllers
{
    public class PipelineDashBoardController : BaseController
    {
        private HttpClient _httpClient;
        private readonly IPipelineConfigurationBusiness _pipelineConfigurationBusiness;


        public PipelineDashBoardController(IPipelineConfigurationBusiness pipelineConfigurationBusiness, ILogger<PipelineDashBoardController> logger, IWebHostEnvironment webHostEnvironment, IConfiguration configuration, IHttpContextAccessor httpContextAccessor) : base(logger, configuration, httpContextAccessor, webHostEnvironment)
        {

            _pipelineConfigurationBusiness = pipelineConfigurationBusiness;
            var handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (message, cert, chain, sslPolicyErrors) => true
            };

            _httpClient = new HttpClient(handler);
        }

        public async Task<IActionResult> Index()
        
        {

            try
            {

                #region Remove The PIpeLineFolder
                if (_httpContextAccessor.HttpContext.Session.GetString("CurrentPipeline") != null)
                {

                    string pipelinePath = Path.Combine(_webHost.WebRootPath, @"Pipelines");

                    string filePath = Path.Combine(pipelinePath, $"{_httpContextAccessor.HttpContext.Session.GetString("CurrentPipeline")}.json");

                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }

                    // Remove the session variable
                    _httpContextAccessor.HttpContext.Session.Remove("CurrentPipeline");
                }
                #endregion


                if (TempData.TryFetch<MessageInfo>("MessageInfo", out MessageInfo messageInfo))
                {
                    ViewBag.MessageInfo = messageInfo;
                }
                DashBoardViewModel vm = new DashBoardViewModel
                {
                    CurrentPipeline = new PipelineModel(),
                    PipeLines = new List<PipelineModel>()
                };
                var fetchPipelineEndpoint = $@"{_configuration["BaseApiUrl"].ParseToText()}/{_configuration["FetcPipelineEndpoint"].ParseToText()}";
               // using (var httpClient = new HttpClient())//commented by Aniruddha
                using (var httpClient = _httpClient)
                {
                    using (var request = new HttpRequestMessage(new HttpMethod("GET"), fetchPipelineEndpoint))
                    {
                        request.Headers.TryAddWithoutValidation("accept", "*/*");
                        var response = await httpClient.SendAsync(request);
                        response.EnsureSuccessStatusCode();
                        string responseBody = await response.Content.ReadAsStringAsync();
                        vm.PipeLines = JsonConvert.DeserializeObject<List<PipelineModel>>(responseBody);
                    }
                }
                ViewBag.DataSourceTypes = Enum.GetNames(typeof(DataSourceTypes)).Select(ds => new SelectListItem { Value = ds, Text = ds }).ToList();
                return View(vm);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in Dashboard {ex}");
                return RedirectToAction("Error");
            }
        }
        private async Task GeneratePipeline(PipelineInput pipelineInput)
        {
            try
            {
                string pipelinePath = Path.Combine(_webHost.WebRootPath, @"Pipelines");
                if (!Directory.Exists(pipelinePath))
                {
                    Directory.CreateDirectory(pipelinePath);
                }
                string filePath = Path.Combine(pipelinePath, $"{pipelineInput.PipelineName}.json");
                PipelineConfigurationModel pipelineConfiguration = new PipelineConfigurationModel();

                if (!System.IO.File.Exists(filePath))
                {
                    System.IO.File.WriteAllText(filePath, pipelineConfiguration.ToString());
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }

        }

        public async Task<IActionResult> FetchPipelineExecutionHistoryById(int id)
        {
            var history = await _pipelineConfigurationBusiness.FetchPipelineExecutionHistoryById(id); // Fetch the data

            return PartialView("_PipelineExecutionHistory", history); // Return a partial view with the data

        }

        [HttpPost]
        public async Task<IActionResult> CreatePipeline()
        {
            try
            {



                //PipelineConfigurationModel p = CommonExtensionMethods.DeserializeFromByteArray<PipelineConfigurationModel>(x.FileContent);


                var pipelineName = Request.Form["pipelineName"].ParseToText();
                await GeneratePipeline(new PipelineInput { PipelineName = pipelineName, PipelineType = string.Empty, PipelineConfiguration = "{}" });


                _httpContextAccessor.HttpContext.Session.SetString("CurrentPipeline", pipelineName);

                return RedirectToAction("Index", "ETLDashboard");

            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in CreatePipeline {ex}");
                var messageInfo = new MessageInfo
                {
                    Message = "An unexception has been occured.",
                    HasIssue = true
                };
                TempData.Put("MessageInfo", messageInfo);
            }
            return RedirectToAction("Index");
        }




        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
