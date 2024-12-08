using Microsoft.AspNetCore.Mvc;
using NetReportBuilder.Etl.Web.Helper;
using System.Data;
using NetReportBuilder.Etl.Model;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using NetReportBuilder.Etl.Web.Models;
using NetReportBuilder.Etl.Core;
using etReportBuilder.Etl.Web;
using System.Data.Entity.Core.Metadata.Edm;
using Microsoft.AspNetCore.Hosting;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Net.Http.Headers;
using NPOI.SS.Formula.Functions;
using NetReportBuilder.Etl.Model.Data_Mapping;
namespace NetReportBuilder.Etl.Web.Controllers
{
    public class DataTransformModel
    {
        List<DataSourceModel> DataSources { get; set; }
        public List<string> SelectedColumns { get; set; }
    }
    public class DataSourceModel
    {
        public DataTable Source { get; set; }
        public List<SelectListItem> Columns { get; set; }
    }
    public class DataTransformViewModel
    {
        public DataTable ResultSet { get; set; }
        public List<SelectListItem> Fields { get; set; }    
        public List<string> FieldsCheck { get; set; }    
        public List<ColumnFilter> ColumnFilters { get; set; }

    }
    public class ColumnFilter
    {
        public string FieldName { get; set; }
        public string? Clause { get; set; }
        public string? Condition { get; set; }
        public string? ConditionValue { get; set; }
        public string? AggregateFunction { get; set; }
    }
    
     
   
    public class DataTransformFilter
    {
        public string[] SelectedFields { get; set; }
        List<ColumnFilter> ColumnFilters { get; set; }
    }
    public class DataTransformController : BaseController
    {


        public DataTransformController(ILogger<DataMappingController> logger,
            IConfiguration configuration, IWebHostEnvironment webHost,
            IHttpContextAccessor httpContextAccessor) : base(logger, configuration, httpContextAccessor,webHost)
        {

        }

        async Task<DataTable> LoadConfiguration()
        {
           

            var jsonContent = await CommonUtility.ReadTexFile(PipelineConfigPath);
            var pipeLineInfo = JsonConvert.DeserializeObject<PipelineConfigurationModel>(jsonContent);
            var apiConfig = JsonConvert.DeserializeObject<ApiConfiguration>(pipeLineInfo.DataConfigurations[0].Configuration);
            return apiConfig.Response.JsonToDataTable(); 
            

        }
        public async Task<IActionResult> Index()
        
        {
            try
            {
                var dt = await LoadConfiguration();
                List<SelectListItem> columnList = new List<SelectListItem>();
                columnList = dt.Columns.Cast<DataColumn>().
                Select(dc => new SelectListItem { Text = dc.ColumnName, Value = dc.ColumnName, Selected = true })
                .ToList();
                ViewBag.Clauses = ApplicationConstants.Clauses.Select(cls => new SelectListItem { Text = cls, Value = cls, Selected = false }).ToList();
                 ViewBag.Conditions = ApplicationConstants.Conditions.Select(cls => new SelectListItem { Text = cls, Value = cls, Selected = false }).ToList();
                ViewBag.AggegateFunctions = ApplicationConstants.AggregateMethods.Select(cls => new SelectListItem { Text = cls, Value = cls, Selected = false }).ToList();

                DataTransformViewModel vm = new DataTransformViewModel()
                { 
                  ResultSet=dt,
                  Fields    =columnList
                };
                
                return View(vm);
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                return RedirectToAction("Error");
            }
        }

        //private async Task<DataTable> WhereFilter()


        [HttpPost]
        public async Task<IActionResult> Apply([FromBody] DataTransformViewModel viewModel)
        {
            try
            {
                var dt = await LoadConfiguration();

                foreach (var columnFilter in viewModel.ColumnFilters)
                {
                    if (!string.IsNullOrEmpty(columnFilter.Clause) && !string.IsNullOrEmpty(columnFilter.Condition) && !string.IsNullOrEmpty(columnFilter.ConditionValue))
                    {
                        switch (columnFilter.Clause)
                        {
                            case "Where":
                                //"StartsWith", "EndsWith", "Contains"
                                var pattern = "";
                                if (columnFilter.Condition == "StartsWith")
                                {
                                    pattern = $"{columnFilter.ConditionValue}%";
                                }
                                if (columnFilter.Condition == "EndsWith")
                                {
                                    pattern = $"%{columnFilter.ConditionValue}";
                                }
                                if (columnFilter.Condition == "Contains")
                                {
                                    pattern = $"%{columnFilter.ConditionValue}%";
                                }

                                var query = (from row in dt.AsEnumerable()
                                             where row.Field<string>(columnFilter.FieldName).ToLower().Like(pattern.ToLower())
                                             select row).ToList();
                                dt = query.CopyToDataTable();
                                break;
                            case "order by":
                                break;
                        }
                    }

                }


                var columnList = dt.Columns.Cast<DataColumn>().
                                    Select(dc => new SelectListItem
                                    {
                                        Text = dc.ColumnName,
                                        Value = dc.ColumnName,
                                        Selected = viewModel.FieldsCheck.Contains(dc.ColumnName)
                                    }).ToList();


                var resultTable = new DataTable();
                var selectedData = dt.AsEnumerable()
                    .Select(row => viewModel.FieldsCheck.ToDictionary(
                        column => column,
                        column => row[column]
                    )).ToList();

                foreach (string col in viewModel.FieldsCheck)
                {
                    resultTable.Columns.Add(col, dt.Columns[col].DataType);
                }

                foreach (var rowDict in selectedData)
                {
                    DataRow newRow = resultTable.NewRow();
                    foreach (var kvp in rowDict)
                    {
                        newRow[kvp.Key] = kvp.Value;
                    }
                    resultTable.Rows.Add(newRow);
                }

                DataTransformViewModel vm = new DataTransformViewModel()
                {
                    ResultSet = resultTable,
                    Fields = columnList
                };

                return Json(JsonConvert.SerializeObject(vm));
            }
            catch(Exception ex)
            {
                return Json("Error Message");
            }
        }

    }

}

