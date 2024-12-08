using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Business
{
    public class EtlBusinessService
    {
        protected readonly IHttpUtility _httpUtility;
        protected readonly ILogger<EtlBusinessService> _logger;
        protected readonly IWebHostEnvironment _webHostEnvironment;
        protected readonly IHttpContextAccessor _httpContextAccessor;
        protected readonly IConfiguration _configuration;
        protected ICodeGenerator _codeGenerator;
        public EtlBusinessService(IHttpUtility httpUtility, ILogger<EtlBusinessService> logger, IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor, IConfiguration configuration,ICodeGenerator codeGenerator)
        {
            _httpUtility = httpUtility;
            _logger = logger;
            _webHostEnvironment = webHostEnvironment;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _codeGenerator = codeGenerator;
        }
        protected string PipelineName
        {
            get
            {
                return _httpContextAccessor.HttpContext.Session.GetString("CurrentPipeline");
                    
            }
        }
        protected string PipelinePath
        {
            get
            {
                var pipelinePath= Path.Combine(_webHostEnvironment.WebRootPath, $@"Pipelines\{PipelineName}.json");
                return pipelinePath;
            }
        }
        protected async Task<PipelineConfigurationModel> ReadPipelineData()
        {
         
            var jsonString = await CommonUtility.ReadTexFile(PipelinePath);
            return JsonConvert.DeserializeObject<PipelineConfigurationModel>(jsonString);
        }
    }
}
