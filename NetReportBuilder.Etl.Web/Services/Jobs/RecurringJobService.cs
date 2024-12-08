using NetReportBuilder.Etl.Core;

using NetReportBuilder.Etl.Model;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Data;
using System.Text;
using System.Net.Http.Headers;
using MathNet.Numerics.Financial;
using NPOI.SS.Formula.Functions;
using NetReportBuilder.Etl.Business;

namespace NetReportBuilder.Etl.Web
{
    public abstract class RecurringJobService
    {
        protected readonly IWebHostEnvironment _webHost;
        protected readonly IConfiguration _configuration;
        protected readonly ILogger<RecurringJobService> _logger;
        protected readonly IDataSyncBusiness _dataSyncService;
        protected RecurringJobService(IWebHostEnvironment webHost, IConfiguration configuration, ILogger<RecurringJobService> logger, IDataSyncBusiness dataSyncService =null)
        {
            _webHost = webHost;
            _configuration = configuration;
            _logger = logger;
            _dataSyncService = dataSyncService;
        }       
        protected async Task<string> ReadPipeline(string jsonPath)
        {
            const Int32 BufferSize = 128;
            StringBuilder sb = new StringBuilder();
            using (var fileStream = File.OpenRead(jsonPath))
            using (var streamReader = new StreamReader(fileStream, Encoding.UTF8, true, BufferSize))
            {
                String line;
                while ((line = await streamReader.ReadLineAsync()) != null)
                {
                    sb.Append(line);
                }
            }
            return sb.ToString();
        }
        public abstract Task Execute(string pipelineName);
        public abstract Task<PipelineConfiguration<T>> ValidatePipelineConfiguration<T>(string pipelineName) where T:BaseConfiguration;

    }
}
