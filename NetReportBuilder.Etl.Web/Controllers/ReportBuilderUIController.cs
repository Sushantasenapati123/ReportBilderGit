using Microsoft.AspNetCore.Mvc;
using NetReportBuilder.ReportUI.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Net.Http.Headers;
using System.Security.Policy;
using static NetReportBuilder.ReportUI.Models.ReportConfigurationModel;
using System.Xml.Serialization;
using System.Text;
using System;
using TestChart.Models;
using System.Data;
using System.Data.SqlClient;
using NetReportBuilder.ReportUI.Repositories;
using static Dapper.SqlMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using NetReportBuilder.ReportUI.Utility;
using System.Security.AccessControl;
using Microsoft.SqlServer.Server;
using Microsoft.AspNetCore.Cors.Infrastructure;
using System.Net.Http;
using System.Xml.Linq;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace NetReportBuilder.ReportUI.Controllers
{
    public class ReportBuilderUIController : Controller
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IConfiguration _configuration;
        private readonly IConfigurationDetails _configurationDetsilsRepository;
        private readonly IDashBoardConfig _dashBoardConfig;
        private readonly ILogger<ReportBuilderUIController> _logger;
        private readonly IMemCache _cache;
        Uri url = new Uri("https://localhost:44382");
        HttpClient client;
        string connectionString = "Data Source=Server6;Initial Catalog=CachDB10;User ID=user10;Password=csmpl@132;TrustServerCertificate=true";
        public ReportBuilderUIController(IWebHostEnvironment hostingEnvironment, IConfiguration configuration, IConfigurationDetails configurationDetsilsRepository, IDashBoardConfig dashBoardConfig, ILogger<ReportBuilderUIController> logger, IMemCache cache)
        {
            _hostingEnvironment = hostingEnvironment;
            _logger = logger;
            _configuration = configuration;
            _configurationDetsilsRepository = configurationDetsilsRepository;
            _dashBoardConfig = dashBoardConfig;
            client = new HttpClient();
            client.BaseAddress = url;
            _cache = cache;
        }
        //Bind Table Column(X-Axis,Y-Axis)
        [HttpGet]
        public async Task<IActionResult> Get_ColumnsByTable(int order)
        {
            if (!ModelState.IsValid)
            {
                var message = string.Join(" | ", ModelState.Values
                                             .SelectMany(v => v.Errors)
                                             .Select(e => e.ErrorMessage));
                return Json(new { success = false, responseMessage = message, responseText = "Model State is invalid", data = "" });
            }

            try
            {
                Common common = new Common(_configuration);

                // Asynchronously bind table column
                var dataSource = await common.GetDataSource();
                var table = dataSource.tables.FirstOrDefault(u => u.order == order);

                if (table == null)
                {
                    // Return an appropriate response if the table is not found
                    return Json(new { success = false, responseMessage = "Table not found.", data = "" });
                }

                var columns = table.columns ?? new List<TableColumn>();
                string connectionString = "Data Source=Server6;Initial Catalog=CachDB10;User ID=user10;Password=csmpl@132;TrustServerCertificate=true";

                if (columns.Any())
                {
                    string tableName = table.name;

                    // Assuming GetTopMostRecordFromTable is a synchronous method
                    Dictionary<string, object> topRecord = GetTopMostRecordFromTable(connectionString, tableName);

                    if (topRecord != null && topRecord.Any())
                    {
                        foreach (var column in columns)
                        {
                            if (column != null && topRecord.ContainsKey(column.name) && topRecord[column.name] != null)
                            {
                                column.value = topRecord[column.name].ToString();
                            }
                        }
                    }
                }

                return Json(new { success = true, data = columns });
            }
            catch (Exception ex)
            {
                // Capture the full exception message
                return Json(new { success = false, responseMessage = ex.Message });
            }
        }

        public class TableAndColumnsDetail
        {
            public string DataSource { get; set; }
        }
        //Bind Table Using DataSource 


        [HttpGet]
        public async Task<IActionResult> GetDataSource()
        {
            try
            {
                IEnumerable<DataSourceQuery> dataSources = await _dashBoardConfig.BindDatasource();

                return Json(dataSources.Select(ds => new { ds.id, ds.Name }));
            }
            catch (Exception ex)
            {
                // Handle exceptions, maybe log the error
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetColumnsByDataSource(int dataSourceId)
        {
            try
            {
                // Retrieve the query based on dataSourceId
                var query = await _dashBoardConfig.GetDataSourceQueryByIdAsync(dataSourceId);

                if (string.IsNullOrEmpty(query))
                {
                    return NotFound("No query found for the given data source ID.");
                }

                using (var connection = new SqlConnection(connectionString))
                {
                    var result = await connection.QueryAsync<dynamic>(query);

                    if (!result.Any())
                    {
                        return NotFound("No data returned from the query.");
                    }

                    // Map the column headers and values for each row
                    var mappedResults = result.Select(row =>
                    {
                        var dictionaryRow = (IDictionary<string, object>)row;
                        return dictionaryRow.ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
                    }).ToList();

                    // Extract the column headers (keys) from the first row
                    var columnHeaders = mappedResults.First().Keys.ToList();

                    // Return both the mapped results and the column headers
                    return Json(new
                    {
                        MappedResults = mappedResults,  // Entire result set
                        Headers = columnHeaders         // Column headers
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


        public async Task<IActionResult> TableDetail(string DataSource)
        {
            TableAndColumnsDetail data = new TableAndColumnsDetail();
            data.DataSource = DataSource;
            //convert datatable to json
            DataTable dt =await GetDataa(data);
            TableData table = new TableData();
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            Dictionary<string, object> row;
            if (dt != null && dt.Rows.Count > 0)
            {
                foreach (DataRow dr in dt.Rows)
                {
                    row = new Dictionary<string, object>();
                    foreach (DataColumn col in dt.Columns)
                    {
                        row.Add(col.ColumnName, dr[col]);
                    }
                    rows.Add(row);
                }
                table.tbody = rows;
                List<string> theaders = new List<string>();
                foreach (DataColumn col in dt.Columns)
                {
                    theaders.Add(col.ColumnName);
                }
                table.thead = theaders;
            }

            return Ok(JsonConvert.SerializeObject(table));
        }


        public async Task<IActionResult> TableDetail2(string DataSource)
        {
            TableAndColumnsDetail data = new TableAndColumnsDetail();
            data.DataSource = DataSource;
            //convert datatable to json
            DataTable dt = await GetDataa(data);
            TableData table = new TableData();
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            Dictionary<string, object> row;
            if (dt != null && dt.Rows.Count > 0)
            {
                foreach (DataRow dr in dt.Rows)
                {
                    row = new Dictionary<string, object>();
                    foreach (DataColumn col in dt.Columns)
                    {
                        row.Add(col.ColumnName, dr[col]);
                    }
                    rows.Add(row);
                }
                table.tbody = rows;
                List<string> theaders = new List<string>();
                foreach (DataColumn col in dt.Columns)
                {
                    theaders.Add(col.ColumnName);
                }
                table.thead = theaders;
            }

            return Ok(JsonConvert.SerializeObject(table));
        }
        public async Task<DataTable> GetTableData(string DataSource)
        {
            TableAndColumnsDetail data = new TableAndColumnsDetail();
            data.DataSource = DataSource;

            // Call the async method to get the data
            DataTable dt = await GetDataa(data);

            // Return the DataTable (or convert to JSON if necessary)
            return dt;
        }


        public async Task<DataTable> GetDataa(TableAndColumnsDetail MD)
        {
            // Use the appropriate connection string for your SQL Server setup
            // string connectionString = "YourConnectionStringHere";

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync(); // Open the connection asynchronously

                    // Fetch the query string asynchronously
                    var query = await _dashBoardConfig.GetDataSourceQueryByIdAsync(MD.DataSource);

                    if (string.IsNullOrEmpty(query))
                    {
                        Console.WriteLine("Query is null or empty.");
                        return null;
                    }

                    using (var command = new SqlCommand(query, connection))
                    {
                        // Check if the command is a SELECT statement
                        if (query.TrimStart().StartsWith("SELECT", StringComparison.OrdinalIgnoreCase))
                        {
                            using (var reader = await command.ExecuteReaderAsync()) // Asynchronously execute reader
                            {
                                var dataTable = new DataTable();
                                dataTable.Load(reader);
                                return dataTable;
                            }
                        }
                        else
                        {
                            // Handle non-SELECT queries (e.g., INSERT, UPDATE)
                            var rowsAffected = await command.ExecuteNonQueryAsync(); // Asynchronously execute non-query
                            Console.WriteLine($"Total {rowsAffected} number of records were affected");
                            return null;
                        }
                    }
                }
            }
            catch (SqlException ex)
            {
                Console.WriteLine($"SQL Server error: {ex.Message}");
                return null;
            }
        }

        public async Task<IActionResult> RenderReport(int DashboardId)
        {
            string ThemeConfiguartionPath = Path.Combine(_hostingEnvironment.WebRootPath, "ThemeConfiguartionDetails");
            if (!Directory.Exists(ThemeConfiguartionPath))
            {
                Directory.CreateDirectory(ThemeConfiguartionPath);
            }
            string filePath = Path.Combine(ThemeConfiguartionPath, "Theme_" + DashboardId + ".json");
            List<ThemeConfiguration> ConfigurationData = new List<ThemeConfiguration>();
            if (System.IO.File.Exists(filePath))
            {
                string existjson = System.IO.File.ReadAllText(filePath);
                if (!string.IsNullOrWhiteSpace(existjson))
                {
                    ConfigurationData = JsonConvert.DeserializeObject<List<ThemeConfiguration>>(existjson);
                }
            }
            string jscode = string.Empty;
            List<TableData> tables = new List<TableData>();
            jscode += " $(document).ready(function () {";
            foreach (var item in ConfigurationData)
            {
                if (item.DataSourceText != null && item.ReportDetails != null)
                {
                    DataTable dt = new DataTable();
                    #region get table data
                   
                    dt = await GetTableData(item.DataSourceText);
                    TableData table = new TableData();
                    table.PortletId = item.PortletId;
                    List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
                    Dictionary<string, object> row;
                    foreach (DataRow dr in dt.Rows)
                    {
                        row = new Dictionary<string, object>();
                        foreach (DataColumn col in dt.Columns)
                        {
                            row.Add(col.ColumnName, dr[col]);
                        }
                        rows.Add(row);
                    }
                    table.tbody = rows;
                    List<string> theaders = new List<string>();
                    foreach (DataColumn col in dt.Columns)
                    {
                        theaders.Add(col.ColumnName);
                    }
                    table.thead = theaders;
                    tables.Add(table);
                    #endregion
                    jscode += "\r\nHighcharts.getJSON('/ReportBuilderUI/TableDetail?DataSource=" + item.DataSourceText + "', function (response) {\r\n            var xaxis = [];\r\n            var yaxis = [];\r\n            for (var j = 0; j < response.tbody.length; j++) {\r\n                for (var i = 0; i < response.thead.length; i++) {\r\n                    if ('" + item.XAxisText + "' == response.thead[i]) {\r\n                        xaxis.push(response.tbody[j][response.thead[i]]);\r\n                    }\r\n                    else if ('" + item.YAxisText + "' == response.thead[i]) {\r\n                        yaxis.push(response.tbody[j][response.thead[i]]);\r\n                    }\r\n                }\r\n            }\r\n            Highcharts.chart('container_" + item.PortletId + "', {\r\n                chart: {\r\n                    type: '" + item.ReportDetails + "'\r\n                },\r\n                title: {\r\n                    text: '" + item.Title + "',\r\n                    align: 'center'\r\n                },\r\n                subtitle: {\r\n                    text: ''\r\n                },\r\n                xAxis: {\r\n                   categories: xaxis,\r\n                    type: xaxis,\r\n                    title: {\r\n                        text: '" + item.XAxisTitle + "'\r\n                    }\r\n                },\r\n                yAxis: {\r\n                    allowDecimals: false,\r\n                    type: yaxis,\r\n                    title: {\r\n                        text: '" + item.YAxisTitle + "'\r\n                    }\r\n                },\r\n                series: [{\r\n                    name: '" + item.YAxisText + "',\r\n                    data: yaxis\r\n                }]\r\n        });\r\n    });";
                }

            }
            jscode += "\r\n  });";
            string jsflodername = "js";
            string webrootpath = _hostingEnvironment.WebRootPath + "/ThemeConfiguartionDetails";
            string jsProcDocPath = Path.Combine(webrootpath, jsflodername);
            if (!Directory.Exists(jsProcDocPath))
            {
                Directory.CreateDirectory(jsProcDocPath);
            }
            string jsfilePath = Path.Combine(jsProcDocPath, "chartjs" + DashboardId + ".js");
            System.IO.File.WriteAllText(jsfilePath, jscode);
            ViewBag.JSFilePath = "/ThemeConfiguartionDetails/js/chartjs" + DashboardId + ".js";
            ViewBag.ConfigurationData = ConfigurationData;
            ViewBag.Tables = tables;
            ViewBag.GridHTML = ConfigurationData[0].HTMLElement;
            return View();
        }
        //Dashboard Preview
        [HttpGet]
        public IActionResult DashboardPreview(string EncId)
        {
            //string enc = DESEncrypt.Encrypt("6");
            //string dc = DESEncrypt.Decrypt(EncId);
            ViewBag.ID = EncId;
            return View();
        }
        [HttpGet]
        public IActionResult DashboardEdit(string EncId) 
        {
            //string enc = DESEncrypt.Encrypt("6");
            //string dc = DESEncrypt.Decrypt(EncId);
            ViewBag.EncId = EncId;
            ViewBag.Id = DESEncrypt.Decrypt(EncId);
            Common common = new Common(_configuration);
            ViewBag.DataSource = common.GetDataSource().Result.tables;
            return View();
        }
        [HttpPost]
        public IActionResult GetPageDetails(string EncId)
        {
            try
            {
                var cacheKey = EncId;
                List<DashboardDetail> objCacheDash = _cache.GetCache<List<DashboardDetail>>(cacheKey);
                if (objCacheDash != null)
                {
                    return Content(JsonConvert.SerializeObject(new { data = objCacheDash, message = "data fetched successfully", status = "success" }), "application/json");
                }
                else
                {
                    int Id = Convert.ToInt32(DESEncrypt.Decrypt(EncId));
                    var res = _dashBoardConfig.SelectOneAsync(Id).Result;
                    var pageContents = _dashBoardConfig.SelectOnePageContents(Id).Result;
                    res.PageContent = JsonConvert.SerializeObject(pageContents);
                    _cache.SetCache(res, cacheKey);
                    if (res != null)
                    {
                        return Content(JsonConvert.SerializeObject(new { data = res, message = "data fetched successfully", status = "success" }), "application/json");
                    }
                    else
                    {
                        return Content(JsonConvert.SerializeObject(new { data = res, message = "failed", status = "warning" }), "application/json");
                    }
                }
            }
            catch (Exception ex)
            {
                return Content(JsonConvert.SerializeObject(new { data = "", message = ex.Message, status = "error" }), "application/json");
            }
        }
        [HttpPost]
        public IActionResult InsertPageDetails(DashboardDetail detail)
        {
            try
            {
                string ss=DESEncrypt.Decrypt(detail.EncId);
                int res = _dashBoardConfig.InsertAsync(detail).Result;
                if (res == 1)
                {
                    string EncId = DESEncrypt.Encrypt(res.ToString());
                    return Content(JsonConvert.SerializeObject(new { data = res, encid = EncId, message = "Data Save Sucessfully", status = "success" }));
                }
                else if (res == 2)
                {
                    string EncId = DESEncrypt.Encrypt(res.ToString());
                    return Content(JsonConvert.SerializeObject(new { data = res, encid = EncId, message = "Data Updated Successfully", status = "success" }));
                }
                else
                {
                    return Content(JsonConvert.SerializeObject(new { data = res, message = "failed", status = "warning" }));
                }
            }
            catch (Exception ex)
            {
                return Content(JsonConvert.SerializeObject(new { data = "", message = ex.Message, status = "error" }));
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetPortletData(string dashboardId, string portletId)
        {
            try
            {
                // Decrypt and convert the dashboardId and portletId to integers
                int dashid = Convert.ToInt32(DESEncrypt.Decrypt(dashboardId));
                int portid = Convert.ToInt32((portletId));  // Assuming portletId is encrypted

                // Call the method to get portlet contents
                var res = await _dashBoardConfig.SelectPortletContents(dashid, portid);

                // Check if data exists and return appropriate message
                if (res != null && res.Count > 0)
                {
                    return Json(new { success = true, data = res, message = "Data retrieved successfully" });
                }
                else
                {
                    return Json(new { success = false, data = res, message = "No data found" });
                }
            }
            catch (Exception ex)
            {
                // Log the error if necessary and return an error response
                return Json(new { success = false, message = ex.Message });
            }
        }



        public async Task<IActionResult> ReportPotlate(string EncId,string PageName)
        {
            int? DashboardId = null;
            if (EncId != null)
            {
                DashboardId = Convert.ToInt32(DESEncrypt.Decrypt(EncId));
            }
            ViewBag.ID = DashboardId;
            if (DashboardId != null)
            {
                string colordivjson = string.Empty;
                string ThemeConfiguartionPath = Path.Combine(_hostingEnvironment.WebRootPath, "ThemeConfiguartionDetails");
                if (!Directory.Exists(ThemeConfiguartionPath))
                {
                    Directory.CreateDirectory(ThemeConfiguartionPath);
                }
                string jsonfilePath = Path.Combine(ThemeConfiguartionPath, "Theme_" + DashboardId + ".json");
                List<ThemeConfiguration> ConfigurationData = new List<ThemeConfiguration>();
                if (System.IO.File.Exists(jsonfilePath))
                {
                    string existjson = System.IO.File.ReadAllText(jsonfilePath);
                    if (!string.IsNullOrWhiteSpace(existjson))
                    {
                        ConfigurationData = JsonConvert.DeserializeObject<List<ThemeConfiguration>>(existjson);
                        colordivjson = ConfigurationData[0].HTMLElement;
                    }
                }
                ViewBag.GridHTML = colordivjson;
                Common common = new Common(_configuration);
                ViewBag.DataSource = common.GetDataSource().Result.tables;
                ViewBag.Result = await _dashBoardConfig.SelectAllAsync(PageName);
                ViewBag.Icons = common.GetAllIcon();
                return View();
            }
            else
            {
                if (PageName == null)
                    PageName = "";
                Common common = new Common(_configuration);
                ViewBag.DataSource = common.GetDataSource().Result.tables;
                ViewBag.Result = await _dashBoardConfig.SelectAllAsync(PageName);
                ViewBag.Icons = common.GetAllIcon();
                return View();
            }
        }
        //Auto Fill Search
        [HttpPost]
        public async Task<IActionResult> BindReportWithSearch(string PageName)
        {
            if (PageName == null)
                PageName = "";
            var result = await _dashBoardConfig.SelectAllAsync(PageName);
            return Json(result);
        }
        public async Task<IActionResult> FilterDataOnTextChange(string PageNAme)
        {
            Common common = new Common(_configuration);
            ViewBag.DataSource = common.GetDataSource().Result.tables;
            ViewBag.Result = await _dashBoardConfig.SelectAllAsync(PageNAme);
            ViewBag.Icons = common.GetAllIcon();
            return View();
        }
        [HttpPost]
        public IActionResult DeleteDashboard(int id)
        {
            try
            {
                int deletedashboard = _dashBoardConfig.DeleteAsync(id).Result;
                return Json(deletedashboard);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        [HttpGet]
        public IActionResult GetDashboardById(int id)
        {
            var dashboards = _dashBoardConfig.SelectOneAsync(id).Result;
            return Ok(JsonConvert.SerializeObject(dashboards));
        }
        //Save In JSON
        [HttpPost]
        public async Task<JsonResult> ThemeConfigurationSave(ThemeConfiguration request)
        {
            try
            {
                request.DashboardId = 1;
                string webrootpath = _hostingEnvironment.WebRootPath + "/ThemeConfiguartionDetails";
                string ThemeConfiguartionPath = Path.Combine(_hostingEnvironment.WebRootPath, "ThemeConfiguartionDetails");
                if (!Directory.Exists(ThemeConfiguartionPath))
                {
                    Directory.CreateDirectory(ThemeConfiguartionPath);
                }
                string filePath = Path.Combine(ThemeConfiguartionPath, "Theme_" + request.DashboardId + ".json");
                List<ThemeConfiguration> ConfigurationData = new List<ThemeConfiguration>();
                ConfigurationData.Add(request);
                string json = JsonConvert.SerializeObject(ConfigurationData, Formatting.Indented);
                System.IO.File.WriteAllText(filePath, json);
                return Json(new { success = true, message = "Data submitted and saved successfully." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        //Get Top Most Record Feom Table 
        public static Dictionary<string, object> GetTopMostRecordFromTable(string connectionString, string tableName)
        {
            var topRecord = new Dictionary<string, object>();
            string query = $"SELECT TOP 1 * FROM {tableName}";
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection); connection.Open();
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            string columnName = reader.GetName(i); object value = reader.IsDBNull(i) ? null : reader.GetValue(i); topRecord[columnName] = value;
                        }
                    }
                }
            }
            return topRecord;
        }







        #region BACKUP
        //[HttpPost]
        //public async Task<JsonResult> ThemeConfigurationSave(ThemeConfiguration request)
        //{
        //    try
        //    {
        //        request.DashboardId = 1;
        //        string flodername = "Image";
        //        string bgflodername = "BackGroundImage";
        //        string webrootpath = _hostingEnvironment.WebRootPath + "/ThemeConfiguartionDetails";
        //        string ProcDocPath = Path.Combine(webrootpath, flodername);
        //        string bgProcDocPath = Path.Combine(webrootpath, bgflodername);
        //        string ThemeConfiguartionPath = Path.Combine(_hostingEnvironment.WebRootPath, "ThemeConfiguartionDetails");
        //        if (!Directory.Exists(ThemeConfiguartionPath))
        //        {
        //            Directory.CreateDirectory(ThemeConfiguartionPath);
        //        }
        //        string filePath = Path.Combine(ThemeConfiguartionPath, "Theme_" + request.DashboardId + ".json");
        //        List<ThemeConfiguration> ConfigurationData = new List<ThemeConfiguration>();
        //        if (System.IO.File.Exists(filePath))
        //        {
        //            string existjson = System.IO.File.ReadAllText(filePath);
        //            if (!string.IsNullOrWhiteSpace(existjson))
        //            {
        //                ConfigurationData = JsonConvert.DeserializeObject<List<ThemeConfiguration>>(existjson);
        //                if (ConfigurationData.Any(u => u.PortletId == request.PortletId))
        //                {
        //                    ConfigurationData.Remove(ConfigurationData.Where(u => u.PortletId == request.PortletId).FirstOrDefault());
        //                }
        //            }
        //        }

        //        Image Upload
        //        if (!Directory.Exists(ProcDocPath))
        //            Directory.CreateDirectory(ProcDocPath);
        //        if (request.ImageFile != null)
        //        {
        //            var filename = Path.GetExtension(ContentDispositionHeaderValue.Parse(request.ImageFile.ContentDisposition).FileName.Trim('"'));
        //            var timestamp = DateTime.Now.ToString("yyyyMMddHHmmssfff");
        //            request.ImagePath = "Project" + timestamp + "" + filename;
        //            using (var stream = new FileStream(Path.Combine(ProcDocPath, request.ImagePath), FileMode.Create))
        //            {
        //                request.ImageFile.CopyTo(stream);
        //            }
        //        }
        //        Background Image Upload
        //        if (!Directory.Exists(bgProcDocPath))
        //            Directory.CreateDirectory(bgProcDocPath);
        //        if (request.BackgroundImageFile != null)
        //        {
        //            var filename = Path.GetExtension(ContentDispositionHeaderValue.Parse(request.BackgroundImageFile.ContentDisposition).FileName.Trim('"'));
        //            var timestamp = DateTime.Now.ToString("yyyyMMddHHmmssfff");
        //            request.BackgroundImage = "Project" + timestamp + "" + filename;
        //            using (var stream = new FileStream(Path.Combine(bgProcDocPath, request.BackgroundImage), FileMode.Create))
        //            {
        //                request.BackgroundImageFile.CopyTo(stream);
        //            }
        //        }
        //        ConfigurationData.Add(request);
        //        string json = JsonConvert.SerializeObject(ConfigurationData, Formatting.Indented);
        //        System.IO.File.WriteAllText(filePath, json);
        //        return Json(new { success = true, message = "Data submitted and saved successfully." });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { success = false, message = ex.Message });
        //    }
        //}
        //[HttpPost]
        //public IActionResult UploadImage(IFormFile MyUploader)
        //{
        //    if (MyUploader != null)
        //    {
        //        string uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "images");
        //        string filePath = Path.Combine(uploadsFolder, MyUploader.FileName);
        //        using (var fileStream = new FileStream(filePath, FileMode.Create))
        //        {
        //            MyUploader.CopyTo(fileStream);
        //        }
        //        return new ObjectResult(new { status = "success" });
        //    }
        //    return new ObjectResult(new { status = "fail" });

        //}
        //public async Task<IActionResult> ReportBuilderUI(string EncId)
        //{
        //    int? DashboardId = null;
        //    if (EncId != null)
        //    {
        //        DashboardId = Convert.ToInt32(DESEncrypt.Decrypt(EncId));
        //    }
        //    ViewBag.ID = DashboardId;
        //    if (DashboardId != null)
        //    {
        //        string colordivjson = string.Empty;
        //        string ThemeConfiguartionPath = Path.Combine(_hostingEnvironment.WebRootPath, "ThemeConfiguartionDetails");
        //        if (!Directory.Exists(ThemeConfiguartionPath))
        //        {
        //            Directory.CreateDirectory(ThemeConfiguartionPath);
        //        }
        //        string jsonfilePath = Path.Combine(ThemeConfiguartionPath, "Theme_" + DashboardId + ".json");
        //        List<ThemeConfiguration> ConfigurationData = new List<ThemeConfiguration>();
        //        if (System.IO.File.Exists(jsonfilePath))
        //        {
        //            string existjson = System.IO.File.ReadAllText(jsonfilePath);
        //            if (!string.IsNullOrWhiteSpace(existjson))
        //            {
        //                ConfigurationData = JsonConvert.DeserializeObject<List<ThemeConfiguration>>(existjson);
        //                colordivjson = ConfigurationData[0].HTMLElement;
        //            }
        //        }
        //        ViewBag.GridHTML = colordivjson;


        //        Common common = new Common(_configuration);
        //        ViewBag.DataSource = common.GetDataSource().Result.tables;
        //        Bind Report Type
        //        ReportTypes reportTypes = null;
        //        string filePath = Path.Combine(_hostingEnvironment.WebRootPath, "ReportConfiguration.xml");
        //        try
        //        {
        //            XmlSerializer serializer = new XmlSerializer(typeof(ReportTypes));
        //            using (StreamReader reader = new StreamReader(filePath))
        //            {
        //                reportTypes = (ReportTypes)serializer.Deserialize(reader);
        //            }
        //        }
        //        catch (FileNotFoundException ex)
        //        {
        //            ViewBag.ErrorMessage = "Configuration file not found.";
        //        }
        //        catch (InvalidOperationException ex)
        //        {
        //            ViewBag.ErrorMessage = "Error processing the configuration file.";
        //        }
        //        catch (Exception ex)
        //        {
        //            ViewBag.ErrorMessage = "An unexpected error occurred.";
        //        }

        //        if (reportTypes == null)
        //        {
        //            return View("Error");
        //        }
        //        ViewBag.Icons = common.GetAllIcon();
        //        return View(reportTypes);
        //    }
        //    else
        //    {
        //        Common common = new Common(_configuration);
        //        ViewBag.DataSource = common.GetDataSource().Result.tables;
        //        Bind Report Type
        //        ReportTypes reportTypes = null;
        //        string filePath = Path.Combine(_hostingEnvironment.WebRootPath, "ReportConfiguration.xml");
        //        try
        //        {
        //            XmlSerializer serializer = new XmlSerializer(typeof(ReportTypes));
        //            using (StreamReader reader = new StreamReader(filePath))
        //            {
        //                reportTypes = (ReportTypes)serializer.Deserialize(reader);
        //            }
        //        }
        //        catch (FileNotFoundException ex)
        //        {
        //            ViewBag.ErrorMessage = "Configuration file not found.";
        //        }
        //        catch (InvalidOperationException ex)
        //        {
        //            ViewBag.ErrorMessage = "Error processing the configuration file.";
        //        }
        //        catch (Exception ex)
        //        {
        //            ViewBag.ErrorMessage = "An unexpected error occurred.";
        //        }

        //        if (reportTypes == null)
        //        {
        //            return View("Error");
        //        }
        //        ViewBag.Icons = common.GetAllIcon();
        //        return View(reportTypes);
        //    }
        //}
        #endregion
    }

}
