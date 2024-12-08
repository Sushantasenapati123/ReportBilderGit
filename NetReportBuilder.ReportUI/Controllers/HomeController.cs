using Microsoft.AspNetCore.Mvc;
using NetReportBuilder.ReportUI.Models;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Net.Http.Headers;
using TestChart.Models;

namespace NetReportBuilder.ReportUI.Controllers
{


    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration _configuration;
        public HomeController(ILogger<HomeController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        public async Task<IActionResult> Index()
        {
            HttpClient client = new HttpClient();
            var fetchTableUrl = $@"{_configuration["BaseApiUrl"]}/{_configuration["FetchDataSourceDetailsEndPoint"]}";
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, fetchTableUrl);

            request.Headers.Add("accept", "*/*");

            var apiRequest = new DatabaseInfoRequest
            {
                databaseType = _configuration["TargetDatabaseDetails:DatabaseType"].ToString(),
                dataBase = _configuration["TargetDatabaseDetails:Database"].ToString(),
                authentication = _configuration["TargetDatabaseDetails:Authentication"].ToString(),
                host = _configuration["TargetDatabaseDetails:Host"].ToString(),
                userId = _configuration["TargetDatabaseDetails:UserId"].ToString(),
                password = _configuration["TargetDatabaseDetails:Password"].ToString(),
                port = Convert.ToInt32(_configuration["TargetDatabaseDetails:Port"].ToString())
            };
            var jsonContent = JsonConvert.SerializeObject(apiRequest);
            request.Content = new StringContent(jsonContent, null, "application/json");

            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            string responseBody = await response.Content.ReadAsStringAsync();

            return View();
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
