using Microsoft.AspNetCore.Mvc;
using NetReportBuilder.Etl.Web.Helper;
using System.Data;
using System.Text.Json;
using NetReportBuilder.Etl.Web.Models;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;
using Microsoft.AspNetCore.Http;
using System.Data.SqlClient;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Hosting;
using System.Xml;
using Microsoft.Extensions.Primitives;
using Microsoft.AspNetCore;
using System.Text.RegularExpressions;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;

using System.Collections.Generic;
using NPOI.HPSF;
using System.ComponentModel;
using Microsoft.AspNetCore.Mvc.Rendering;
using NPOI.SS.Formula.Functions;
using Hangfire;
using static Mysqlx.Expect.Open.Types.Condition.Types;
using System.Data.Entity.Validation;
using Formatting = Newtonsoft.Json.Formatting;
using NetReportBuilder.Etl.Business;

namespace NetReportBuilder.Etl.Web.Controllers
{


    public class PipelineConfigurationController : BaseController
    {
        private readonly IPipelineManagementService _pipelineManagementService;
        private readonly IPipelineConfigurationBusiness _pipelineConfigurationBusiness;
        private readonly IDataTransformationBusiness _dataTransformationBusiness;
        public PipelineConfigurationController(IDataTransformationBusiness dataTransformationBusiness, ILogger<PipelineConfigurationController> logger,
            IConfiguration configuration, IPipelineManagementService pipelineManagementService, IHttpContextAccessor httpContextAccessor, IPipelineConfigurationBusiness pipelineConfigurationBusiness, IWebHostEnvironment webHost) : base(logger, configuration, httpContextAccessor, webHost)
        {
            _pipelineManagementService = pipelineManagementService;
            _pipelineConfigurationBusiness = pipelineConfigurationBusiness;
            _dataTransformationBusiness = dataTransformationBusiness;
        }


        public async Task<IActionResult> Index()
        {
            try
            {
                var pipelineInfo = await _pipelineConfigurationBusiness.LoadConfiguration();
                await InitializePipelineConfiguration(pipelineInfo.PipelineName, pipelineInfo.DataSourceType);
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                return RedirectToAction("Error");
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeletePipeLine(string PipeLineName)
        {
            try
            {


                var DeleteStatus = await _pipelineConfigurationBusiness.DeleteConfiguration(PipeLineName);

                return Ok(new { message = $"{DeleteStatus}" });

            }
            catch (Exception ex)
            {
                return Ok(new { message = $"{ex.Message}" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Save([FromBody] SavePipelineConfigurationViewModel model)
        {

            try
            {
                #region CMT Replace Last DatasourceList DatatableName To Source   CMT

                //var res = await _pipelineConfigurationBusiness.UpdateLastDataTableEntityToSource();
                //if (res != "Success")
                //{
                //    return Ok(new { message = "Error Occur in Update Source Code" });
                //}


                #endregion


                #region If Update Remove The Old Pipeline Configuration
                if (model.SaveType == "Update")
                {
                    var DeleteStatus = await _pipelineConfigurationBusiness.DeleteConfiguration(_httpContextAccessor.HttpContext.Session.GetString("CurrentPipeline"));
                    if (DeleteStatus != "success")
                    {
                        return Ok(new { message = $"{DeleteStatus}" });
                    }
                }
                #endregion

                if (model is null)
                    return Ok(new { message = "The Provided Model Was null." });


                DataSyncModes dataSyncMode = (DataSyncModes)model.DataSyncModes.ParseToInteger();
                var updateJsonStatus = await _pipelineConfigurationBusiness.UpdatePipelineConfigurationFileForDataSyncMode(dataSyncMode.ToString(), model.ExecutionMode, model.ExecutionInterval, model.Description);
                if (string.IsNullOrEmpty(updateJsonStatus))
                    return Ok(new { message = $"failed" });

                var requestModel = await _pipelineConfigurationBusiness.GenerateApiRequestFromModel(model);
                if (requestModel is null)
                    return Ok(new { message = $"failed" });
                requestModel.DrowFlowJson = model.DrowFlowJson;

                var saveConfigStatus = await _pipelineConfigurationBusiness.SaveConfiguration(requestModel);
                if (string.IsNullOrEmpty(saveConfigStatus))
                    return Ok(new { message = $"failed" });
                if (saveConfigStatus == "Fail")
                {
                    return Ok(new { message = $"The Pipeline could not be registered." });
                }
                await _pipelineManagementService.ScheduleJob(model);

                #region Remove The PIpeLineFolder

                string pipelinePath = Path.Combine(_webHost.WebRootPath, @"Pipelines");

                string filePath = Path.Combine(pipelinePath, $"{_httpContextAccessor.HttpContext.Session.GetString("CurrentPipeline")}.json");

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
                #endregion

                return Ok(new { message = $"success" });
            }
            catch (Exception ex)
            {
                return Ok(new { message = $"The Pipeline could not be registered." });
            }
        }

        [HttpGet]
        public async Task<IActionResult> BindSaveConfigurationModalForEdit(string PipelineName)
        {
            try
            {

                if (HttpContext.Session.GetString("CurrentPipeline") != "")///In Create
                {
                    var dbConfig = await _dataTransformationBusiness.ReadConfiguration();
                    return Json(dbConfig.SyncConfiguration);
                }
                else
                {
                    return Json("Session Is Out");
                }
            }
            catch (Exception ex)
            {
                return Json("Something went Wrong");
            }
        }


    }

}

