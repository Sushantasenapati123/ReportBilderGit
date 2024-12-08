using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI;
using NetReportBuilder.Etl.Model;
using Newtonsoft.Json;
using System.Text;

namespace NetReportBuilder.Etl.Web.Controllers
{
    public class QueryController : Controller
    {
        private HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        public QueryController(IConfiguration configuration)
        {
            _configuration = configuration;
            var handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (message, cert, chain, sslPolicyErrors) => true
            };

            _httpClient = new HttpClient(handler);

        }
        [HttpPost]
        public async Task<IActionResult> InsertQuery(Query query)
        {
            try
            {
                if(query == null)
                {
                    throw new ArgumentNullException(nameof(query));
                }
                string configJson = JsonConvert.SerializeObject(query);
                //HttpClient client = new HttpClient();
                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, _configuration["QueryInsertURL"]);
                request.Headers.Add("accept", "*/*");
                request.Content = new StringContent(configJson, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await _httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();
                return Ok(response);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<IActionResult> GetallQuery()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> GetQuery()
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, "https://localhost:44382/Query/GetQuery");
                    request.Headers.Add("accept", "*/*");
                    HttpResponseMessage response = await _httpClient.SendAsync(request);
                    response.EnsureSuccessStatusCode();
                    string responseBody = await response.Content.ReadAsStringAsync();
                    var queryList = JsonConvert.DeserializeObject<List<Query>>(responseBody);
                    return Json(new { data = queryList });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }


    }
}
