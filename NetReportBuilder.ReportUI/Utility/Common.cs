using NetReportBuilder.ReportUI.Models;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Net.Http.Headers;
using System.Security.Policy;

namespace NetReportBuilder.ReportUI.Utility
{
    public class Common
    {
        HttpClient client;
        Uri url = new Uri("https://localhost:44382");
        public Common(IConfiguration configuration)
        {
            _configuration = configuration;
            client = new HttpClient(new HttpClientHandler
            {
                // This is for debugging purposes only. 
                // For production, ensure your certificates are properly configured.
                ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
            });
            client.BaseAddress = url;
        }
        private readonly IConfiguration _configuration;
        public async Task<BindTables> GetDataSource()
        {
            //var fetchTableUrl = $@"{_configuration["BaseApiUrl"]}/{_configuration["FetchDataSourceDetailsEndPoint"]}";

            //HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, fetchTableUrl);
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, _configuration["ReportBuilderReportSourceApiUrl"].ToString());

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

            BindTables TablesData = new BindTables();
            TablesData = JsonConvert.DeserializeObject<BindTables>(responseBody);
            return TablesData;
        }



        
        public List<string> GetAllIcon()
        {
            //Icon List
            List<string> Icons = new List<string>() { "fas fa-home", "fas fa-user", "fas fa-cog", "fas fa-search", "fas fa-arrow-down", "fas fa-arrow-up", "fas fa-arrow-left", "fas fa-arrow-right", "fa fa-comment", "fa fa-desktop", "fa fa-edit", "fa fa-group", "fa fa-file", "fa fa-google", "fa fa-linkedin-square", "fa fa-youtube", "fa fa-area-chart", "fa fa-bar-chart", "fa fa-line-chart", "fa fa-pie-chart", "fa fa-inr", "fa fa-dollar", "fas fa-bell", "fas fa-microphone", "fas fa-music", "fas fa-play", "fas fa-pause", "fas fa-sync", "fas fa-video", "fas fa-volume-down", "fas fa-volume-mute", "fas fa-volume-off", "fas fa-volume-up", "fas fa-archive", "fas fa-book", "fas fa-cut", "fas fa-eraser", "fas fa-folder", "fas fa-highlighter", "fas fa-paperclip", "fas fa-paste", "fas fa-phone", "fas fa-print", "as fa-phone-volume", "fas fa-tags", "fas fa-tasks", "fas fa-wallet", "fas fa-route", "fas fa-map", "fas fa-fire", "fas fa-compass", "fas fa-gift", "fas fa-hands-helping", "fas fa-handshake", "fas fa-heart", "fas fa-user-tie", "fas fa-user-secret", "fas fa-window-maximize", "fas fa-address-book", "fab fa-bluetooth-b", "fas fa-mobile-alt", "fas fa-wifi", "fas fa-database", "fas fa-desktop", "fas fa-download", "fas fa-keyboard", "fas fa-laptop", "fas fa-headphones", "fas fa-plug", "fas fa-power-off", "fas fa-sd-card", "fas fa-upload", "fas fa-tablet-alt", "fas fa-stopwatch", "far fa-clock", "fas fa-heading", "far fa-file-pdf", "far fa-file-powerpoint", "far fa-file-word", "far fa-file-excel", "fas fa-file-image", "fas fa-file-archive", "fas fa-tv", "fas fa-fingerprint", "fas fa-filter", "fas fa-reply-all", "fas fa-reply", "fas fa-thumbs-up", "fas fa-thumbs-down", "fas fa-trash", "fas fa-trash-restore", "fas fa-undo", "fas fa-bookmark", "fas fa-car", "far fa-building", "fas fa-flag", "fas fa-heartbeat", "fas fa-map-pin", "fas fa-map-marker-alt", "fas fa-medkit", "far fa-newspaper", "fas fa-infinity", "fas fa-divide", "fas fa-equals", "fas fa-greater-than", "fas fa-greater-than-equal", "fas fa-less-than", "fas fa-less-than-equal", "fas fa-minus", "fas fa-not-equal", "fas fa-times", "fas fa-percentage", "fas fa-plus", "fas fa-square-root-alt", "fas fa-subscript", "fas fa-superscript", "fas fa-file-medical", "fas fa-file-prescription", "fas fa-camera", "fas fa-dice-six", "fas fa-eraser", "fas fa-ruler-horizontal", "fas fa-ruler-vertical", "fas fa-history", "fas fa-church", "fas fa-place-of-worship", "fas fa-om", "fas fa-user-lock", "fas fa-user-shield", "fas fa-unlock", "fas fa-lock", "fas fa-star", "fas fa-square", "fas fa-user-tag", "fas fa-user-shield", "fa fa-list-alt", "fa fa-battery-full", "fa fa-battery-empty", "fa fa-cloud-download", "fa fa-cloud", "fa fa-cloud-upload", "fa fa-envelope", "fa fa-recycle" };
            return Icons;
        }
    }
}
