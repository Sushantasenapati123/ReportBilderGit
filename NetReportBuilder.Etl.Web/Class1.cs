using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using NetReportBuilder.Etl.Web.Models;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using System.Net.Http.Headers;
//using static Hangfire.Storage.JobStorageFeatures;
using System.Linq;
using static Hangfire.Storage.JobStorageFeatures;
using MySql.Data.MySqlClient;
using Oracle.ManagedDataAccess.Client;
namespace NetReportBuilder.Etl.Web
{
    public class Class1
    {
        public void Test()
        {







        }
        public async Task Invoke()
        {

            try
            {





                var client_022227 = new HttpClient();
                var request_022227 = new HttpRequestMessage(HttpMethod.Get, "https://localhost:7020/Api/CityModule/Get_City/");
                var response_022227 = await client_022227.SendAsync(request_022227);
                response_022227.EnsureSuccessStatusCode();
                var responseString_022227 = await response_022227.Content.ReadAsStringAsync();
                if (string.IsNullOrWhiteSpace(responseString_022227))
                {
                    throw new NullReferenceException();
                }
                var dT_022227 = JsonConvert.DeserializeObject<DataTable>(responseString_022227);


                var Temp_051513 = new DataTable();
                using (var connection = new MySqlConnection(@"Server=127.0.0.1;Port=3306;Database=world;User=root;Password=csmpl@123;Connection Timeout=30"))
                {
                    var command = connection.CreateCommand();
                    command.CommandText = @"select * from statedata";
                    connection.Open();

                    var adapter = new MySqlDataAdapter(command);
                    adapter.Fill(Temp_051513);
                }
                var dT_051513 = Temp_051513;


                var query_5575482 = from dt_0222271 in dT_022227.AsEnumerable()
                                   join dt_0515131 in dT_051513.AsEnumerable() 
                                   on dt_0222271?["StateId"] equals dt_0515131?["StateId"]
                                   select new
                                   {
                                       CityId = dt_0222271?["CityId"]
                                   ,
                                       CityName = dt_0222271?["CityName"]
                                   ,
                                       StateName = dt_0515131?["StateName"]
                                   };
                var query_557548 = from dt_0222271 in dT_022227.AsEnumerable()
                                   join dt_0515131 in dT_051513.AsEnumerable()
                                   on Convert.ToInt64(dt_0222271?["StateId"]) equals Convert.ToInt64(dt_0515131?["StateId"])
                                   select new
                                   {
                                       CityId = dt_0222271?["CityId"],
                                       CityName = dt_0222271?["CityName"],
                                       StateName = dt_0515131?["StateName"]
                                   };
                //DataTable dT_5575482 = query_5575482.ConvertToDataTable();
                //DataTable dT_557548 = query_557548.ConvertToDataTable();

                //var s= dT_557548;





            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }






        }
    }
}
