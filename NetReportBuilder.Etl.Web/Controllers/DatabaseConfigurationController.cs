using DatabaseConfiguration.Models.DatabaseConfiguration;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;
using Microsoft.AspNetCore.Server;
//using Grpc.Core;
using System.IO;
using Newtonsoft.Json.Linq;
using NetReportBuilder.Etl.Web.Models.DatabaseConfiguration;

namespace DatabaseConfiguration.Controllers
{
    public class DatabaseConfigurationController : Controller
    {

        private HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public DatabaseConfigurationController(IConfiguration configuration)
        {
            _configuration = configuration;
            var handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (message, cert, chain, sslPolicyErrors) => true
            };

            _httpClient = new HttpClient(handler);

        }
    
       
        [HttpGet]
        public async Task<IActionResult> Index(string databaseName)
        {
            try
            {
                if (string.IsNullOrEmpty(databaseName))
                {
                    return View();
                }

                ServerInputsModel databaseConfig = GetDatabaseConfiguration(databaseName);
                if (databaseConfig != null)
                {

                    string configJson = JsonConvert.SerializeObject(databaseConfig);

                    HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, _configuration["DatabaseConfigurationDbObjectUrl"]);
                    request.Headers.Add("Accept", "*/*");


                    request.Content = new StringContent(configJson, Encoding.UTF8, "application/json");


                    HttpResponseMessage response = await _httpClient.SendAsync(request);
                    response.EnsureSuccessStatusCode();


                    string responseBody = await response.Content.ReadAsStringAsync();
                    var tables = JsonConvert.DeserializeObject<DatabaseModel>(responseBody);


                    return View(tables);
                }
                else
                {

                    return NotFound();
                }

                //HttpClient client = new HttpClient();

                //HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, "https://localhost:44382/ReportSource/FetchDatabaseObjectList");

                //request.Headers.Add("accept", "*/*");

                //request.Content = new StringContent("{\n  \"databaseType\": \"SqlServer\",\n  \"database\":\"AdConsole4\",\n  \"authentication\": \"Password\",\n  \"host\": \"CSMBHUL1072\\\\SQL2012\",\n  \"userId\": \"sa\",\n  \"password\": \"csmpl@123\",\n  \"port\": 0\n}");
                //request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                //HttpResponseMessage response = await client.SendAsync(request);
                //response.EnsureSuccessStatusCode();
                //string responseBody = await response.Content.ReadAsStringAsync();
                //var tables = JsonConvert.DeserializeObject<DatabaseModel>(responseBody);
                //return View(tables);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetTablesandViews(string databaseName)
        {
            try
            {
                if (string.IsNullOrEmpty(databaseName))
                {
                    return View();
                }

                ServerInputsModel databaseConfig = GetDatabaseConfiguration(databaseName);
                if (databaseConfig != null)
                {

                    string configJson = JsonConvert.SerializeObject(databaseConfig);

                    

                    HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, _configuration["DatabaseConfigurationDbObjectUrl"]);
                    request.Headers.Add("Accept", "*/*");


                    request.Content = new StringContent(configJson, Encoding.UTF8, "application/json");


                    HttpResponseMessage response = await _httpClient.SendAsync(request);
                    if (!response.IsSuccessStatusCode)
                    {
                        string responseBody1 = await response.Content.ReadAsStringAsync();
                    }
                    response.EnsureSuccessStatusCode();


                    string responseBody = await response.Content.ReadAsStringAsync();
                    var tables = JsonConvert.DeserializeObject<DatabaseModel>(responseBody);


                    return Ok(tables);
                }
                else
                {

                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        [HttpGet]
        public async Task<IActionResult> DatabsesInformations(ServerInputsModel jsonData)
        {
            if (jsonData == null)
            {
                return BadRequest(new { message = "Invalid input data." });
            }

            try
            {
                // Construct the request data
                var requestData = JsonConvert.SerializeObject(new
                {
                    databaseType = jsonData.DatabaseType,
                    dataBase = jsonData.DataBase,
                    authentication = jsonData.Authentication,
                    host = jsonData.Host,
                    userId = jsonData.UserId,
                    password = jsonData.Password,
                    port = Convert.ToInt32(jsonData.Port)
                });

                using (var client = _httpClient)
                {
                    var request = new HttpRequestMessage(HttpMethod.Get, _configuration["DatabaseConfigurationDbObjectUrl"])
                    {
                        Content = new StringContent(requestData, Encoding.UTF8, "application/json")
                    };

                    var response = await client.SendAsync(request);

                    if (!response.IsSuccessStatusCode)
                    {
                        // Log the response status and content for debugging purposes
                        var errorContent = await response.Content.ReadAsStringAsync();
                        return StatusCode((int)response.StatusCode, new { message = "Failed to fetch database object list.", error = errorContent });
                    }

                    var responseString = await response.Content.ReadAsStringAsync();
                    var databaseModel = JsonConvert.DeserializeObject<DatabaseModel>(responseString);

                    // Check if databaseModel is not null and contains valid data
                    if (databaseModel != null)
                    {
                        var databaseInfo = new
                        {
                            DatabaseId = databaseModel.DatabaseId,
                            DatabaseName = databaseModel.DatabaseName,
                            Tables = databaseModel.Tables,
                            Views = databaseModel.Views,
                            ServerInputs = databaseModel.ServerInputs
                        };

                        // Return JSON result with the list of databases
                        return Json(databaseModel);

                    }
                    else
                    {
                        return NotFound(new { message = "Database information not found." });
                    }

                }
            }
            catch (Exception ex)
            {
                // Handle exceptions and return appropriate error message
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }

        [HttpPost]
        //[Route("api/SaveDatabaseInfo")]
        public IActionResult SaveDatabaseInfo([FromBody] ServerInputsModel jsonData)
        {
            if (jsonData != null)
            {
                try
                {
                    string _filePath = ConfigFileHandler.GetFilePath();
                    // Read existing JSON array from the file
                    string jsonFromFile = System.IO.File.ReadAllText(_filePath);
                    var configurations = JsonConvert.DeserializeObject<List<ServerInputsModel>>(jsonFromFile) ?? new List<ServerInputsModel>();

                    // Add new data to the list
                    configurations.Add(jsonData);

                    // Serialize updated list back to JSON
                    string updatedJson = JsonConvert.SerializeObject(configurations, Formatting.Indented);

                    // Write JSON back to the file
                    System.IO.File.WriteAllText(_filePath, updatedJson, Encoding.UTF8);

                    return Json(new { success = true });
                }
                catch (Exception ex)
                {
                    return Json(new { success = false, message = ex.Message });
                }

            }

            return Json(new { success = false, message = "No data received" });
        }

        [HttpPost]
        public IActionResult DatabasesInformations()
        {
            string filePath = ConfigFileHandler.GetFilePath();


            try
            {
                string jsonContent = System.IO.File.ReadAllText(filePath);
                if (!System.IO.File.Exists(filePath))
                {
                    return Json(new { error = $"File '{filePath}' not found." });
                }
                dynamic jsonData = JsonConvert.DeserializeObject(jsonContent);
                if (jsonData is JArray)
                {
                    List<string> databases = new List<string>();
                    foreach (var item in jsonData)
                    {
                        string database = item["DataBase"]?.ToString();
                        if (database != null)
                        {
                            databases.Add(database);
                        }
                    }
                    if (databases.Count > 0)
                    {
                        return Json(databases);
                    }
                    else
                    {
                        return Json(new { error = "No valid Database entries found." });
                    }
                }
                else if (jsonData is JObject && jsonData.Database != null)
                {
                    // Handle as object
                    string database = jsonData.DataBase.ToString();
                    return Json(database);
                }
                else
                {
                    return Json(new { error = "Invalid JSON format: Missing DatabaseType field." });
                }

            }
            catch (FileNotFoundException)
            {
                return Json(new { error = $"File '{filePath}' not found." });
            }
            catch (JsonReaderException ex)
            {
                return Json(new { error = $"Error reading JSON from file '{filePath}': {ex.Message}" });
            }
            catch (Exception ex)
            {
                return Json(new { error = $"An error occurred: {ex.Message}" });
            }
        }

        private List<ServerInputsModel> ReadDatabaseConfigurations()
        {
            string jsonFilePath = ConfigFileHandler.GetFilePath();
            string jsonText = System.IO.File.ReadAllText(jsonFilePath);
            List<ServerInputsModel> configurations = JsonConvert.DeserializeObject<List<ServerInputsModel>>(jsonText);
            return configurations;
        }
        [HttpPost]
        public ServerInputsModel GetDatabaseConfiguration(string databaseName)
        {
            List<ServerInputsModel> configurations = ReadDatabaseConfigurations();

            // Find the configuration based on the provided databaseName
            ServerInputsModel config = configurations.FirstOrDefault(c => c.DataBase == databaseName);

            if (config != null)
            {
                return config;
            }
            else
            {
                return null;
            }
        }
        [HttpGet]
        public string QueryBuilder(QueryCreation queryCreation)
        {
            if (queryCreation == null)
            {
                throw new ArgumentNullException(nameof(queryCreation), "queryCreation cannot be null");
            }
            try
            {
                StringBuilder sb = new StringBuilder(" FROM " + queryCreation.leftTablevalue + " " + queryCreation.Joincellvalue + " " + queryCreation.rightTableCell + " ON " + queryCreation.leftTablevalue + "." + queryCreation.Leftcolumnvalue + " = " + queryCreation.rightTableCell + "." + queryCreation.Rightcolumnvalue);
                return sb.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpGet]
        public string QueryBuilderselect(string[] key)
        {
            if (key == null)
            {
                throw new ArgumentNullException(nameof(key), "key cannot be null");
            }
            try
            {
                StringBuilder sb = new StringBuilder("SELECT ");
                for (int i = 0; i < key.Length; i++)
                {
                    string column = key[i].Trim('[', ']', '"');
                    sb.Append(column);
                    //if (i < key.Length - 1)
                    //{
                    //    sb.Append(',');
                    //}
                }
                return sb.ToString();

                //StringBuilder sb = new StringBuilder("SELECT ");
                //sb.Append(key);
                //return sb.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetColumns(string dbname, string databasename)
        {
            try
            {
                if (string.IsNullOrEmpty(dbname))
                {
                    return View();
                }

                ServerInputsModel databaseConfig = GetDatabaseConfiguration(databasename);
                if (databaseConfig != null)
                {

                    string configJson = JsonConvert.SerializeObject(databaseConfig);

                    HttpClient client = new HttpClient();
                    // Construct the URL with dbname as a query parameter
                    string apiUrl = $"{_configuration["ColumnDetailsObjectURL"]}?dbname={dbname}";
                    HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, apiUrl);
                    request.Headers.Add("Accept", "*/*");


                    request.Content = new StringContent(configJson, Encoding.UTF8, "application/json");


                    HttpResponseMessage response = await _httpClient.SendAsync(request);
                    response.EnsureSuccessStatusCode();


                    string responseBody = await response.Content.ReadAsStringAsync();
                    List<string> columns = JsonConvert.DeserializeObject<List<string>>(responseBody);


                    return Ok(columns);
                }
                else
                {

                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
