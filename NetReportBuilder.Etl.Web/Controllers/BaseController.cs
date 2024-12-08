using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.Mvc.Rendering;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using NetReportBuilder.Etl.Web.Models;
using System.Collections;
using System.Diagnostics;

namespace NetReportBuilder.Etl.Web.Controllers
{
    public class BaseController : Controller
    {
        protected readonly ILogger<BaseController> _logger;
        protected readonly IConfiguration _configuration;
        protected readonly IHttpContextAccessor _httpContextAccessor;
        protected readonly IWebHostEnvironment _webHost;

        public BaseController(ILogger<BaseController> logger,IConfiguration configuration,IHttpContextAccessor httpContextAccessor, IWebHostEnvironment webHost)
        {
            _logger = logger;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _webHost = webHost;
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        protected async Task InitializePipelineConfiguration(string pipelineName,string datsourceType)
        {
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

            ViewBag.DataSourceType = datsourceType;
            ViewBag.PipelineName = pipelineName;
        }
        protected string PipelineName
        {
            get
            {
                return _httpContextAccessor.HttpContext.Session.GetString("CurrentPipeline");

            }
        }
        protected string PipelinePath
        {
            get
            {
                var pipelinePath = Path.Combine(_webHost.WebRootPath, $@"Pipelines\{PipelineName}.json");
                return pipelinePath;
            }
        }
        protected string PipelineConfigPath
        {
            get
            {
                var pipelinePath = Path.Combine(_webHost.WebRootPath, $@"Pipelines\{PipelineName}_Config.json");
                return pipelinePath;
            }
        }
        protected string CurrentPipeline
        {
            get
            {
                if(_httpContextAccessor.HttpContext.Session.TryGetValue("CurrentPipeline", out byte[] retVal))
               
                    return System.Text.Encoding.UTF8.GetString(retVal);

                return string.Empty;

            }
        }
    }
}
