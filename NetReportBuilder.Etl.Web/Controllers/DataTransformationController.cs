using Microsoft.AspNetCore.Mvc;
using Mysqlx;
using NetReportBuilder.Etl.Business;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NPOI.OpenXmlFormats.Shared;
using System.Collections.Generic;
using System.Data;
using System.Text;
using static NPOI.HSSF.Util.HSSFColor;

namespace NetReportBuilder.Etl.Web.Controllers
{

    public class DataTransformationController : BaseController
    {
        private readonly IDataTransformationBusiness _dataTransformationBusiness;
        private readonly CustomCSharpCodeExecuterResolver _codeExecuterResolver;

        public DataTransformationController(IDataTransformationBusiness dataTransformationBusiness, ILogger<DataTransformationController> logger, IWebHostEnvironment webHostEnvironment, IApiConnectorBusinessService apiConnectorBusinessService, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, CustomCSharpCodeExecuterResolver codeExecuterResolver
) : base(logger, configuration, httpContextAccessor, webHostEnvironment)
        {
            _dataTransformationBusiness = dataTransformationBusiness;
            _codeExecuterResolver = codeExecuterResolver;
        }
        public static string Output = "";
        public static string NewlyCreateEntityName = "";
        [HttpPost]
        public async Task<IActionResult> CheckJoin([FromBody] JoinTransformModel model)
        {
            try
            {
                var transformResult = await _dataTransformationBusiness.TransformData(model);
                var resultTable = new DataTable();
                NewlyCreateEntityName = transformResult.EntityName;

                if (model.ListOfJoinConditions.Count != 0)//For Multiple table
                {


                    ICSharpCodeExecuter codeExecuter = _codeExecuterResolver("RDBMS");
                    if (codeExecuter is null)
                        return Json("Please Select Correct Code Type");


                    var executionResult = await codeExecuter.Execute(new CustomCodeConfiguration { InputCode = transformResult.AccumulateSourceCode });

                    if (executionResult is null)
                        return Json("Unable to compile the input c# Code.");

                    string viewTable = string.Empty;
                    if (executionResult.IsSuccessfullyCompile)
                    {
                        resultTable = JsonConvert.DeserializeObject<DataTable>(executionResult.Result);
                        //Output = JsonConvert.SerializeObject(resultTable);
                        Output = JsonConvert.SerializeObject(resultTable.AsEnumerable().Take(5).CopyToDataTable());
                    }


                    if (!executionResult.IsSuccessfullyCompile)//Fail
                    {
                        var resultFail = new
                        {

                            Code = string.Join(Environment.NewLine, executionResult.Message),
                            IsSuccess = false

                        };

                        return Ok(resultFail);
                    }

                }

                else//for One Table
                {
                    resultTable = transformResult.Source;
                    Output = JsonConvert.SerializeObject(resultTable);
                }


                var resultTableForView = resultTable.AsEnumerable()
                                 .Select(row => resultTable.Columns.Cast<DataColumn>()
                                             .ToDictionary(col => col.ColumnName, col => row[col])
                                 ).ToList();
                var result = new
                {
                    resultTable = resultTableForView,
                    Code = transformResult.SourceCode,
                    EntiyName = transformResult.EntityName,
                    IsSuccess = true
                };






                return Ok(result);
            }
            catch (Exception ex)
            {
                var result = new
                {

                    Code = ex.Message,
                    IsSuccess = false
                };

                _logger.LogError($"{ex}");
                return Ok(result);
            }


        }

        [HttpPost]
        public async Task<IActionResult> SaveJoinTransformation([FromBody] DataTransformationModel model)
        {
            try
            {
                model.Output = Output;
                model.EntityName = NewlyCreateEntityName;
                var saveConfigMessage = await _dataTransformationBusiness.SaveJoinTransformation(model);
                return Json(new { success = true, message = saveConfigMessage });
            }
            catch (Exception ex)
            {

                return Json(new { success = false, message = "There was a problem in saving the configuration" });
            }


        }

        [HttpPost]
        public async Task<IActionResult> CheckFilter([FromBody] DataFilterModel model)
        {
            try
            {
                var resultTable = new DataTable();
                var transformResult = await _dataTransformationBusiness.FilterTransformData(model);


                #region Dynamically Code Execute For Filter Result

                ICSharpCodeExecuter codeExecuter = _codeExecuterResolver("RDBMS");
                if (codeExecuter is null)
                    return Json("Please Select Correct Code Type");


                var executionResult = await codeExecuter.Execute(new CustomCodeConfiguration { InputCode = transformResult.AccumulateSourceCode });

                if (executionResult is null)
                    return Json("Unable to compile the input c# Code.");

                string viewTable = string.Empty;
                if (executionResult.IsSuccessfullyCompile)
                {
                    resultTable = JsonConvert.DeserializeObject<DataTable>(executionResult.Result);
                    Output = JsonConvert.SerializeObject(resultTable.AsEnumerable().Take(5).CopyToDataTable());
                }


                if (!executionResult.IsSuccessfullyCompile)//Fail
                {
                    var resultFail = new
                    {

                        //Code = string.Join(Environment.NewLine, executionResult.Message),
                        //IsSuccess = false,
                        Code = string.Join(Environment.NewLine + Environment.NewLine, executionResult.Message.Select((msg, index) => $"{index + 1}. {msg}")),
                        IsSuccess = false

                    };

                    return Ok(resultFail);
                }


                #endregion


                //Output = JsonConvert.SerializeObject(transformResult.Source);
                NewlyCreateEntityName = transformResult.EntityName;

                var resultTableForView = new List<Dictionary<string, object>>();
                //if (transformResult.Source.Rows.Count > 0) // Check if there are any rows
                //{
                //    resultTableForView = transformResult.Source.AsEnumerable()
                //        .Select(row => transformResult.Source.Columns.Cast<DataColumn>()
                //            .ToDictionary(col => col.ColumnName, col => row[col]))
                //        .ToList();
                //}
                if (resultTable.Rows.Count > 0) // Check if there are any rows
                {
                    resultTableForView = resultTable.AsEnumerable()
                        .Select(row => resultTable.Columns.Cast<DataColumn>()
                            .ToDictionary(col => col.ColumnName, col => row[col]))
                        .ToList();
                }




                var result = new
                {
                    resultTable = resultTableForView,
                    Code = transformResult.SourceCode,
                    EntiyName = transformResult.EntityName,
                    IsSuccess = true
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                return Json("There was a problem while transforming the data.");
            }


        }

        [HttpPost]
        public async Task<IActionResult> SaveFilterCondition([FromBody] DataFilterModel model)
        {
            try
            {
                
                model.Output = Output;
                model.EntityName = NewlyCreateEntityName;
                var saveConfigMessage = await _dataTransformationBusiness.SaveFilterTransformation(model);
                return Json(new { success = true, message = saveConfigMessage });
            }
            catch (Exception ex)
            {

                return Json(new { success = false, message = "There was a problem in saving the configuration" });
            }


        }


        [HttpPost]
        public async Task<IActionResult> ApplyGroupBy([FromBody] GroupByConditionModel conditions)
        {
            try
            {
                if (conditions.GroupByConditionList.Count == 0)
                    return View();

                var transformResult = await _dataTransformationBusiness.ApplyGroupBy(conditions);

                var resultTable = new DataTable();

                var SourceCode = JsonConvert.SerializeObject(transformResult.Source);
                NewlyCreateEntityName = transformResult.EntityName;


                #region Dynamic Code Execute
                ICSharpCodeExecuter codeExecuter = _codeExecuterResolver("RDBMS");
                if (codeExecuter is null)
                    return Json("Please Select Correct Code Type");


                var executionResult = await codeExecuter.Execute(new CustomCodeConfiguration { InputCode = transformResult.AccumulateSourceCode });

                if (executionResult is null)
                    return Json("Unable to compile the input c# Code.");

                string viewTable = string.Empty;
                if (executionResult.IsSuccessfullyCompile)
                {
                    resultTable = JsonConvert.DeserializeObject<DataTable>(executionResult.Result);
                    //Output = JsonConvert.SerializeObject(resultTable);
                    Output = JsonConvert.SerializeObject(resultTable.AsEnumerable().Take(5).CopyToDataTable());
                }


                if (!executionResult.IsSuccessfullyCompile)//Fail
                {
                    var resultFail = new
                    {

                        Code = string.Join(Environment.NewLine, executionResult.Message),
                        IsSuccess = false

                    };

                    return Ok(resultFail);
                }


                #endregion


                var resultTableForView = new List<Dictionary<string, object>>();
                if (resultTable.Rows.Count > 0) // Check if there are any rows
                {
                    resultTableForView = resultTable.AsEnumerable()
                        .Select(row => resultTable.Columns.Cast<DataColumn>()
                            .ToDictionary(col => col.ColumnName, col => row[col]))
                        .ToList();
                }




                var result = new
                {
                    resultTable = resultTableForView,
                    Code = transformResult.SourceCode,
                    EntiyName = transformResult.EntityName,
                    IsSuccess = true
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                return Json("There was a problem while transforming the data.");
            }


        }

        [HttpPost]
        public async Task<IActionResult> SaveGroupByCondition([FromBody] GroupByConditionModel conditions)
        {
            try
            {
                conditions.Output = Output;
                conditions.CurrentEntityName = NewlyCreateEntityName;
                var saveConfigMessage = await _dataTransformationBusiness.SaveGroupByCondition(conditions);
                return Json(new { success = true, message = saveConfigMessage, CurrentEntityName = NewlyCreateEntityName });
            }
            catch (Exception ex)
            {

                return Json(new { success = false, message = "There was a problem in saving the configuration" });
            }


        }

        [HttpGet]
        public async Task<IActionResult> RemoveEntityFromJsonSourceList(string entityName)
        {
            try
            {
               
                if (entityName is null)
                    return View();
                var res = await _dataTransformationBusiness.RemoveEntityFromJsonSourceList(entityName);
                return Json(JsonConvert.SerializeObject(res));

            }
            catch (Exception ex)
            {
               
                return Json(JsonConvert.SerializeObject(ex.Message));
                
            }
        }
        [HttpGet]
        public async Task<IActionResult> ReOrderingListOfSource(string NewleyCreatedNode, string TargetNode)
        {
            try
            {

                if (NewleyCreatedNode is null || TargetNode is null)
                    return View();
                var res = await _dataTransformationBusiness.ReOrderingListOfSource(NewleyCreatedNode, TargetNode);
                return Json(JsonConvert.SerializeObject(res));

            }
            catch (Exception ex)
            {

                return Json(JsonConvert.SerializeObject(ex.Message));

            }
        }


    }
}
