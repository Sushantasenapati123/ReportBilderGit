using NetReportBuilder.Etl.Business;
using NetReportBuilder.Etl.Model;
using Newtonsoft.Json;
using System.Linq.Expressions;
using System.Text;

namespace NetReportBuilder.Etl.Web.Services.Jobs
{
    public interface IRecurringJobService
    {
        Task Execute(string pipelineName);
    }
    public class PipelineRecurringJobService:IRecurringJobService
    {
        private  readonly IWebHostEnvironment _webHost;
        private  readonly IConfiguration _configuration;
        private  readonly ILogger<RecurringJobService> _logger;
        private  readonly IDataSyncBusiness _dataSyncService;
        public PipelineRecurringJobService(IWebHostEnvironment webHost, IConfiguration configuration, ILogger<RecurringJobService> logger, IDataSyncBusiness dataSyncService = null)
        {
            _webHost = webHost;
            _configuration = configuration;
            _logger = logger;
            _dataSyncService = dataSyncService;
        }
       
        public async Task Execute(string pipelineName)
        {
            try
            {
                if (string.IsNullOrEmpty(pipelineName))
                    throw new ArgumentException("The Pipeline is missing");

                var pipelinePath = Path.Combine(_webHost.WebRootPath, "Pipelines");
                var filePath = Path.Combine(pipelinePath, $"{pipelineName}.json");
                var jsonData = await CommonUtility.ReadTexFile(filePath);
                var pipeLineInfo = JsonConvert.DeserializeObject<PipelineConfigurationModel>(jsonData);

                if (pipeLineInfo is null )
                    throw new InvalidCastException("Could not Convert the JSON object to Pipeline Configuration");
                
                
               
            }
            catch(Exception ex)
            {

            }
        }
    }
}
