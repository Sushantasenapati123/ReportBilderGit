//using System;
//using System.Collections.Generic;
//using System.Data;
//using System.Text;
//using System.IO;
//using MySql.Data.MySqlClient;
//using System.Data.SqlClient;
//using Oracle.ManagedDataAccess.Client;
//using Newtonsoft.Json;
//using System.Net.Http;
//using System.Threading.Tasks;
//using NetReportBuilder.Etl.Web.Helper;
//using NetReportBuilder.Etl.Web.Models;
//using NetReportBuilder.Etl.Core;
//using NetReportBuilder.Etl.Business;
//using NetReportBuilder.Etl.Model;
//using Microsoft.Extensions.Logging;



//namespace DynamicNamespace
//{
//    public class DynamicClass
//    {
//        private readonly IDataSyncBusiness _dataSyncBusiness;
//        private readonly ILogger<DynamicClass> _logger;

//        public DynamicClass(IDataSyncBusiness dataSyncBusiness, ILogger<DynamicClass> logger) { _dataSyncBusiness = dataSyncBusiness; _logger = logger; }

//        public async Task<DataTable> DynamicMethod()
//        {

//            {

//                try
//                {
//                    //Validate the Pipeline Information
//                    var pipelineInfo = await ValidatePipelineConfiguration<ApiConfiguration>(""Test Pipeline"");
//                    if (pipelineInfo is null)
//                        throw new ArgumentException(""Unable to locate the Pipeline details"");

//                    HttpClient client = new HttpClient();

//                    HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, ""https://localhost:7020/Api/CityModule/Get_City"");

//                    request.Headers.Add(""accept"", "" */*"");

//     var response = await client.SendAsync(request);
//     response.EnsureSuccessStatusCode();
//     string responseBody = await response.Content.ReadAsStringAsync();
//     if (string.IsNullOrWhiteSpace(responseBody))
//     {
//         throw new NullReferenceException();
//     }
//     var source= JsonConvert.DeserializeObject<DataTable>(responseBody );




//         if (source is null)
//             throw new DataException(""Unable to Parse the JSON result to Datatable"");

//         var destination = pipelineInfo.DataMappingConfigurationDetails.GenerateDestinationSchema(source);
//         if (destination is null)
//             throw new DataException(""Unable to create the destination datatable."");
//         destination = source.FillSourceToDestination(pipelineInfo.DataMappingConfigurationDetails.MappingDetails, destination);
//         if (destination is null)
//             throw new FormatException(""Unable to Sync Source data into the Destination Datatable."");
//         var syncResponse =await _dataSyncService.SyncData(destination, pipelineInfo.DataMappingConfigurationDetails);
//         if (string.IsNullOrEmpty(syncResponse))
//             throw new InvalidOperationException(""Unable to Sync the API data with the Target database."");
//         if (syncResponse.ToLower() == ""success"")
//             _logger.LogInformation(""The Data sync Process was successful"");
//         else
//             _logger.LogError(""The Data Sync Process was failed."");
//     }
//     catch (Exception ex)
//     {
//         _logger.LogError($""Error Execute Method: {ex}"");

//     }";
//                             }
                         
//                     }
//                 }
//             }
