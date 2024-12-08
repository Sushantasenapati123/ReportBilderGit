using DatabaseConfiguration.Models.DatabaseConfiguration;
using Hangfire.Storage;
using Microsoft.AspNetCore.Mvc;
using Mysqlx.Session;
using NetReportBuilder.Etl.Business;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using NetReportBuilder.Etl.Model.ViewModel;
using NetReportBuilder.ReportSource.Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NPOI.HSSF.UserModel;
using NPOI.SS.Formula.Functions;
using Org.BouncyCastle.Asn1.Ocsp;
using Org.BouncyCastle.Tls;
using System;
using System.Data;
using System.DirectoryServices.Protocols;
using System.Net.Http;
using System.Security.Policy;
using System.Text;

namespace NetReportBuilder.Etl.Web.Controllers
{
    public class MultiDataBaseConfigurationController : BaseController
    {





        protected readonly IConfiguration _configuration;
        HttpClient client;
        public readonly IDataBaseConnectorBusinessService _IDBConnect;
        public MultiDataBaseConfigurationController(IDataBaseConnectorBusinessService IDBConnect, ILogger<APIConnectorController> logger, IWebHostEnvironment webHostEnvironment, IConfiguration configuration, IHttpContextAccessor httpContextAccessor) : base(logger, configuration, httpContextAccessor, webHostEnvironment)
        {
            _configuration = configuration;
            
            var handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (message, cert, chain, sslPolicyErrors) => true

            };
            client = new HttpClient(handler);

            _IDBConnect = IDBConnect;
        }
        [HttpGet]
        public async Task<IActionResult> AddConnection()
        {
            return View();
        }


        [HttpGet]
        public async Task<IActionResult> TestDatabsesInformations(AddDatabaseConfigurationsPipeline_Model jsonData)
        {
            if (jsonData.Authentication.ToLower() == "integrated")
            {
                ModelState.Remove("UserName");
                ModelState.Remove("Password");
            }
            if (jsonData.DatabaseType.ToLower() == "sqlserver")
            {
                ModelState.Remove("Port");

            }
            if (!ModelState.IsValid)
            {
                var message = string.Join(" | ", ModelState.Values
                 .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage));

                var databaseInfo = new
                {
                    IsSucess = false,
                    Messgae = message
                };

                // Return JSON result with the list of databases
                return Json(databaseInfo);
                // return Json(new { sucess = false, responseMessage = message, responseText = "Model State is invalid", data = "" });
            }


            if (jsonData == null)
            {
                return BadRequest(new { message = "Invalid input data." });
            }

            try
            {


                var IsValidConnection = CommonExtensionMethods.TestDatabaseConnection(CommonExtensionMethods.BuildConnectionString(jsonData), jsonData.DatabaseType);

                if (IsValidConnection)
                {
                    var databaseInfo = new
                    {
                        IsSucess = true,
                        Messgae = "Valid Connection"

                    };
                    return Json(databaseInfo);
                }
                else
                {
                    var databaseInfo = new
                    {
                        IsSucess = false,
                        Messgae = "Invalid Connection"

                    };
                    return Json(databaseInfo);
                }


                // Return JSON result with the list of databases


            }
            catch (Exception ex)
            {

                var databaseInfo = new
                {
                    IsSucess = false,
                    Messgae = ex.Message

                };

                // Return JSON result with the list of databases
                return Json(databaseInfo);

            }



        }



        [HttpPost]
        public async Task<IActionResult> tbl_AddDatabaseConfigurationsPipeline(AddDatabaseConfigurationsPipeline_Model TBL)
        {
            if (TBL.Authentication.ToLower() == "integrated")
            {
                ModelState.Remove("UserName");
                ModelState.Remove("Password");
            }
            if (TBL.DatabaseType.ToLower() == "sqlserver")
            {
                ModelState.Remove("Port");

            }
            var responseData = new ApiResponse();

            if (!ModelState.IsValid)
            {
                var message = string.Join(" | ", ModelState.Values
                 .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage));

                var databaseInfo = new
                {
                    IsSucess = false,
                    Messgae = message
                };
                return Json(databaseInfo);
                //return Json(new { sucess = false, responseMessage = message, responseText = "Model State is invalid", data = "" });
            }



            else
            {
                try
                {
                    #region Again Check Connection
                    var IsValidConnection = CommonExtensionMethods.TestDatabaseConnection(CommonExtensionMethods.BuildConnectionString(TBL), TBL.DatabaseType);

                    if (!IsValidConnection)
                    {
                        var databaseInfo = new
                        {
                            IsSucess = true,
                            Messgae = "InValid Connection"

                        };
                        return Json(databaseInfo);
                    }

                    #endregion



                    if (TBL.DatabaseType.ToLower() == "sqlserver")
                    {
                        TBL.Port = "0";

                    }


                    var response = await client.PostAsync(_configuration["AddUpdateConnectionString"].ParseToText(), new StringContent(JsonConvert.SerializeObject(TBL), Encoding.UTF8, "application/json")
                    );

                    // Ensure the response status code is successful
                    if (response.IsSuccessStatusCode)
                    {
                        // Read and parse the response content
                        var responseString = await response.Content.ReadAsStringAsync();
                        responseData = JsonConvert.DeserializeObject<ApiResponse>(responseString);

                        var databaseInfo = new
                        {
                            IsSucess = true,
                            Messgae = responseData
                        };
                        return Json(databaseInfo);

                        //return Json(new { sucess = true, responseMessage = responseData.responseMessage, responseText = "Success", data = "" });

                    }
                    else
                    {
                        // Handle non-success status code
                        Console.WriteLine("Error: " + response.StatusCode);
                        var errorContent = await response.Content.ReadAsStringAsync();
                        Console.WriteLine("Error Content: " + errorContent);
                        var databaseInfo = new
                        {
                            IsSucess = false,
                            Messgae = responseData.responseMessage
                        };
                        return Json(databaseInfo);

                        //return Json(new { sucess = false, responseMessage = responseData.responseMessage, responseText = "Success", data = "" });
                    }





                }
                catch (Exception ex)
                {
                    var databaseInfo = new
                    {
                        IsSucess = false,
                        Messgae = ex.Message
                    };
                    return Json(databaseInfo);

                }
            }

        }

        [HttpGet]
        public async Task<JsonResult> Get_tbl_AddDatabaseConfigurationsPipeline()
        {
            if (!ModelState.IsValid)
            {
                var message = string.Join(" | ", ModelState.Values
     .SelectMany(v => v.Errors)
    .Select(e => e.ErrorMessage));
                return Json(new { sucess = false, responseMessage = message, responseText = "Model State is invalid", data = "" });
            }
            else
            {
                try
                {
                    var data = JsonConvert.DeserializeObject<List<AddDatabaseConfigurationsPipeline_Model>>(await client.GetStringAsync(_configuration["GettAllConnectionString"].ParseToText()));
                    return Json(JsonConvert.SerializeObject(data));
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        [HttpGet]
        public async Task<JsonResult> Get_tbl_AddDatabaseConfigurationsPipelineByDBType(string dbType)
        {

            try
            {
                var data = JsonConvert.DeserializeObject<List<AddDatabaseConfigurationsPipeline_Model>>(await client.GetStringAsync(_configuration["GettAllConnectionString"].ParseToText()));

                var SelectedServer = data.Where(d => d.DatabaseType.ToLower() == dbType.ToLower()).ToList();


                return Json(JsonConvert.SerializeObject(SelectedServer));
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }


        [HttpDelete]

        public async Task<JsonResult> Delete_tbl_AddDatabaseConfigurationsPipeline(int Id)
        {
            var result = 0;
            var responseData = new ApiResponse();
            if (!ModelState.IsValid)
            {
                var message = string.Join(" | ", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage));
                return Json(new { sucess = false, responseMessage = message, responseText = "Model State is invalid", data = "" });
            }
            else
            {
                var response = client.DeleteAsync(_configuration["DeleteConnectionString"].ParseToText() + "?Id=" + Id).Result;
                string jsonResponse = await response.Content.ReadAsStringAsync();
                Console.WriteLine("JSON Response: " + jsonResponse);


                if (response.IsSuccessStatusCode)
                {
                    // Read and parse the response content
                    var responseString = await response.Content.ReadAsStringAsync();
                    responseData = JsonConvert.DeserializeObject<ApiResponse>(responseString);
                    return Json(new { sucess = true, responseMessage = responseData.responseMessage, responseText = "Success", data = "" });

                }
                else
                {
                    // Handle non-success status code
                    Console.WriteLine("Error: " + response.StatusCode);
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("Error Content: " + errorContent);
                    return Json(new { sucess = false, responseMessage = responseData.responseMessage, responseText = "Success", data = "" });
                }



            }

        }
        [HttpGet]

        public async Task<JsonResult> GetByID_tbl_AddDatabaseConfigurationsPipeline(int Id)
        {
            AddDatabaseConfigurationsPipeline_Model lst = new AddDatabaseConfigurationsPipeline_Model();
            if (!ModelState.IsValid)
            {
                var message = string.Join(" | ", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage));
                return Json(new { sucess = false, responseMessage = message, responseText = "Model State is invalid", data = "" });
            }
            else
            {
                HttpResponseMessage response = client.GetAsync(_configuration["GetByIdConnectionString"].ParseToText() + "?Id=" + Id).Result;
                string errorResponse = await response.Content.ReadAsStringAsync();
                Console.WriteLine("Error Response: " + errorResponse);
                if (response.IsSuccessStatusCode)
                {
                    string data = response.Content.ReadAsStringAsync().Result;
                    lst = JsonConvert.DeserializeObject<AddDatabaseConfigurationsPipeline_Model>(data);
                }

                var jsonres = JsonConvert.SerializeObject(lst);
                return Json(jsonres);
            }
        }
        [HttpGet]
        public async Task<IActionResult> ViewConnection()
        {
            return View();
        }






















        protected static string g_EntityName;
        protected static string g_output;

        [HttpPost]
        public async Task<IActionResult> GetResult(ServerInputViewModel databaseModel)
        {
            try
            {
                string ServerName = databaseModel.ConcatServerAndDatabase.Split("/")[0].Trim();
                string DataBaseName = databaseModel.ConcatServerAndDatabase.Split("/")[1].Trim();
                string servertype = databaseModel.DatabaseType.Trim();


                var data = JsonConvert.DeserializeObject<List<AddDatabaseConfigurationsPipeline_Model>>(await client.GetStringAsync(_configuration["GettAllConnectionString"].ParseToText()));

                var selectedServer = data.FirstOrDefault(d => d.HostName.ToLower() == ServerName.ToLower()
                                  && d.DatabaseName.ToLower() == DataBaseName.ToLower()
                                  && d.DatabaseType.ToLower() == servertype.ToLower());

                AddDatabaseConfigurationsPipeline_Model AD = new AddDatabaseConfigurationsPipeline_Model()
                {
                    DatabaseType = selectedServer.DatabaseType,
                    DatabaseName = selectedServer.DatabaseName,
                    Authentication = selectedServer.Authentication,
                    HostName = selectedServer.HostName,
                    Port = selectedServer.Port,
                    UserName = selectedServer.UserName,
                    Password = selectedServer.Password,
                    Query = databaseModel.Query,
                    EntityName = databaseModel.EntityName

                };


                string ConnectionString = CommonExtensionMethods.BuildConnectionString(AD);

                var DataTable = CommonExtensionMethods.ExecuteQuery(databaseModel.Query, ConnectionString, selectedServer.DatabaseType);

                var outputTemp = DataTable.Tables[0].AsEnumerable()
               .Take(5)                       // Get the top 10 records
               .CopyToDataTable();

                var output = DataTable.Tables[0].ConvertToJson();


                //AddDatabaseConfigurationsPipeline_Model

                DataSources Res = await _IDBConnect.GetTableResultFromDataBase(AD);

                g_EntityName = Res.EntityName;
                g_output = outputTemp.ConvertToJson();//output;// 
                // Finalize the response with the content
                var result = new
                {
                    TableResponse = output,
                    Code = Res.SourceCode,
                    EntiyName = Res.EntityName,

                };
                //Count++;
                return Content(JsonConvert.SerializeObject(result), "application/json");
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                return BadRequest(ex.Message);
            }
        }



        [HttpPost]
        public async Task<IActionResult> SubmitDBConnection(ServerInputViewModel request)
        {
            try
            {
                string ServerName = request.ConcatServerAndDatabase.Split("/")[0].Trim();
                string DataBaseName = request.ConcatServerAndDatabase.Split("/")[1].Trim();
                string servertype = request.DatabaseType.Trim();


                var data = JsonConvert.DeserializeObject<List<AddDatabaseConfigurationsPipeline_Model>>(await client.GetStringAsync(_configuration["GettAllConnectionString"].ParseToText()));

                var selectedServer = data.FirstOrDefault(d => d.HostName.ToLower() == ServerName.ToLower()
                                  && d.DatabaseName.ToLower() == DataBaseName.ToLower()
                                  && d.DatabaseType.ToLower() == servertype.ToLower());

                AddDatabaseConfigurationsPipeline_Model AD = new AddDatabaseConfigurationsPipeline_Model()
                {
                    DatabaseType = selectedServer.DatabaseType,
                    DatabaseName = selectedServer.DatabaseName,
                    Authentication = selectedServer.Authentication,
                    HostName = selectedServer.HostName,
                    Port = selectedServer.Port,
                    UserName = selectedServer.UserName,
                    Password = selectedServer.Password,
                    Query = request.Query,
                    EntityName = request.EntityName == null ? g_EntityName : request.EntityName,
                    Output = g_output,
                    SourceCode = request.SourceCode


                };

                g_EntityName = "";


                var saveConfigMessage =await _IDBConnect.SaveDataBaseConfiguration(AD);
                return Json(new { success = true, message = saveConfigMessage });
            }
            catch (Exception ex)
            {

                return Json(new { success = false, message = "There was a problem in saving the configuration of the selected API" });
            }


        }
    }
}
