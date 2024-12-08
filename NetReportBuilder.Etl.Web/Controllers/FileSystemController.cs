using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using NetReportBuilder.Etl.Web.Helper;
using NetReportBuilder.Etl.Web.Models;
using Newtonsoft.Json;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System.Collections.Generic;
using System.Data;

namespace NetReportBuilder.Etl.Web.Controllers
{
    public class FileSystemController : BaseController
    {
        HttpClient client;
      
        public FileSystemController(ILogger<DataMappingController> logger, IConfiguration configuration, IWebHostEnvironment webHost,IHttpContextAccessor httpContextAccessor) : base(logger, configuration, httpContextAccessor, webHost)
        {
            client = new HttpClient();
        }
        public IActionResult Index()
        {
            return View();
        }
        public async Task<List<Tables>> BindTable()
        {
            client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, _configuration["ReportBuilderReportSourceApiUrl"].ToString());
            request.Headers.Add("accept", "*/*");
            HttpResponseMessage response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            string responseBody = await response.Content.ReadAsStringAsync();
            var tableData = JsonConvert.DeserializeObject<BindTables>(responseBody);
            return tableData.tables;

        }

        [HttpPost("UploadExcel")]
        public async Task<IActionResult> UploadExcel(IFormFile file)
        {

            DataTable DT = new DataTable();
            DataSet dataSet = new DataSet();
            DT = file.ConvertExcelToDataTable();
            var dbType = Request.Form["DBType"];
            string htmlOutput = "";
            string OutputMSG = "";
            bool IsSuccessfullyCompile = false;
            List<string> outputMessages = new List<string>();
            try
            {
                outputMessages.Add($"<span style='color:green;'>Process Xcel Data</span>");

                outputMessages.Add($"<span style='color:green;'>Process Successfuly</span>");

                if (DT != null)
                {

                    dataSet.Tables.Add(DT);
                    // Convert DataSet to HTML
                    htmlOutput = dataSet.DatasetToHtml();

                    // Store DataTable in session
                    HttpContext.Session.SetObjectAsJson("UploadedDataTable", DT);
                }
                else
                {
                    outputMessages.Add("Failed to load Xcel into DataSet.");
                    // Handle case where loadedDataSet is null (error occurred)

                }
                IsSuccessfullyCompile = true;
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
                Messages = outputMessages,
                ViewTable = htmlOutput,
                SchemaInfo = "",
                ListOfProperty = dataSet.GetHeadersWithTypes(),
                IsSuccessfullyCompile = IsSuccessfullyCompile,
                ListOfTable = listOfTables,//BindTable(),
            });


        }


        [HttpPost]
        public async Task<JsonResult> SubmitApi(ApiDetails request, string pipelineName)
        {
            try
            {

                var contentType = request.Configuration.Response;
                // bool isJson = IsJson(request.ApiResponse);
                var IsJson = contentType.Trim().StartsWith("{") && contentType.EndsWith("}")
                         || contentType.StartsWith("[") && contentType.EndsWith("]");
                if (IsJson)
                {
                    request.Configuration.ResponseType = "JSON";
                }
                else
                {
                    request.Configuration.ResponseType = "XML";
                }

                var pipelineNameFromSeson = HttpContext.Session.GetString("PipelineName");

                request.DataPipeLineName = pipelineNameFromSeson;
                request.DataSourceType = "API";
                string pipelinePath = Path.Combine(_webHost.WebRootPath, "Pipelines");
                if (!Directory.Exists(pipelinePath))
                {
                    Directory.CreateDirectory(pipelinePath);
                }
                string filePath = Path.Combine(pipelinePath, $"{pipelineNameFromSeson}.json");
                string json = JsonConvert.SerializeObject(request, Formatting.Indented);
                System.IO.File.WriteAllText(filePath, json);
                return Json(new { success = true, message = "Data submitted and saved successfully." });
            }
            catch (Exception ex)
            {

                return Json(new { success = false, message = ex.Message });
            }


        }


        [HttpPost]
        public IActionResult ExportExcel([FromBody] MappingRequest data)
        {
            // Retrieve DataTable from session
            var loadedDataTable = HttpContext.Session.GetObjectFromJson<DataTable>("UploadedDataTable");


            var mappings = data.Mapping;
            List<string> outputMessages = new List<string>();



            var Target_connectionString = "Data Source=CSMBHUL954\\SQLEXPRESS;Initial Catalog=WizTest;TrustServerCertificate=true;Integrated Security=true;";

            outputMessages.Add("<span style='color:green;' Target Connection String Set.</span>");
            try
            {
                outputMessages.Add("<span style='color:green;' Export Process Start</span>");

                if (data.TableName != "")
                {
                    outputMessages.Add("<span style='color:green;' Expert Table In Batches Starts</span>");
                    outputMessages.AddRange(CommonMethodForExecuteQuery.ExportTableInBatches(loadedDataTable, Target_connectionString, data.TableName));
                    outputMessages.Add("<span style='color:green;' Export Process End</span>");
                }
                else
                {
                    outputMessages.Add("<span style='color:green;' Expert Table In Batches Starts</span>");
                    // DataTable tableViewData, string Target_connectionString, string TableName, List< Mapping > MappingData
                    // outputMessages.AddRange(results.Message);loadedDataSet
                    outputMessages.AddRange(CommonMethodForExecuteQuery.ExportTableInBatchesExisting(loadedDataTable, Target_connectionString, mappings[0].Destination.TableName, mappings));
                    outputMessages.Add("<span style='color:green;' Export Process End</span>");
                }

            }

            catch (Exception ex)
            {

                _logger.LogError(ex.ToString());
                outputMessages.Add($"<span style='color:red;'>Exception occurred: {ex.Message}</span>");
            }

            return Json(new { Messages = outputMessages });

        }




    }
}
