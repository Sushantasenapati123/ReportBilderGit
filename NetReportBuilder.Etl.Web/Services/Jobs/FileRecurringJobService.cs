
using NetReportBuilder.Etl.Model;
using Newtonsoft.Json;
using NPOI.HPSF;
using System.Text;
using ExtendedNumerics.Exceptions;
using Org.BouncyCastle.Pkcs;
using System.Data;
using NetReportBuilder.Etl.Web.Helper;
using NetReportBuilder.Etl.Web.Models;
using NetReportBuilder.Etl.Core;
using System.Data.SqlClient;
using static NPOI.HSSF.Util.HSSFColor;
using NPOI.OpenXmlFormats.Dml;
using System.Security.AccessControl;
using System.Net.Http.Headers;
using NPOI.Util;
using NetReportBuilder.Etl.Web.Controllers;

namespace NetReportBuilder.Etl.Web
{
    public class FileRecurringJobService : RecurringJobService
    {
       
        public FileRecurringJobService(IWebHostEnvironment webHost,IConfiguration configuration, ILogger<FileRecurringJobService> logger):base(webHost,configuration,logger)
        {
            
        }
     
        public override async Task Execute(string pipelineName)
        {
            throw new NotImplementedException();
        }

        public override async Task<PipelineConfiguration<T>> ValidatePipelineConfiguration<T>(string pipelineName)
        {
            throw new NotImplementedException();
        }
    }
  
}
