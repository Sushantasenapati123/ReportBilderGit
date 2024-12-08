using Microsoft.AspNetCore.Mvc;
using NetReportBuilder.Etl.Business;
using NetReportBuilder.Etl.Model;
using Newtonsoft.Json;
using System.Data;

namespace NetReportBuilder.Etl.Web.Controllers
{
    public class UploadExcelController : Controller
    {
        private readonly IWebHostEnvironment hostingEnvironment;

        public IDataTransformationBusiness _IDataTransformationBusiness { get; }
        public ICodeGenerator _ICodeGenerator { get; }
        private readonly CustomCSharpCodeExecuterResolver _codeExecuterResolver;
        public UploadExcelController(CustomCSharpCodeExecuterResolver codeExecuterResolver, ICodeGenerator Codgen, IDataTransformationBusiness IDataTransformationBusiness, IWebHostEnvironment hostingEnvironment)
        {
            this._IDataTransformationBusiness = IDataTransformationBusiness;
            this.hostingEnvironment = hostingEnvironment;
            _ICodeGenerator = Codgen;
            _codeExecuterResolver = codeExecuterResolver;
        }
        public static string Output = "";
        public static string NewlyCreateEntityName = "";
        public static string FilePath = "";



        public IActionResult Index()
        {
            return View();
        }

        [HttpPost("UploadExcell")]
        public async Task<IActionResult> UploadExcell(IFormFile file, string EntityName)
        {

            DataTable resultTable = new DataTable();

            try
            {


                #region Excel File Upload to Root Folder


                // Define path to save the file in wwwroot/uploads folder
                var uploadPath = Path.Combine(hostingEnvironment.WebRootPath, "ExcelFile");
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                // Generate a unique filename to avoid conflicts
                var fileName = Path.GetFileName(file.FileName);
                var timeStamp = DateTime.Now.ToString("yyyyMMdd_HHmmssfff"); // e.g., 20230919_101523123 (YearMonthDay_HourMinuteSecondMillisecond)
                var fileExtension = Path.GetExtension(file.FileName); // Get the file extension
                var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(file.FileName); // Get the filename without extension
                var uniqueFileName = $"{fileNameWithoutExtension}_{timeStamp}{fileExtension}"; // Combine to create a unique name
                var filePath = Path.Combine(uploadPath, uniqueFileName); // Full path for saving the file
                FilePath = filePath;

                // Save the file to the specified path
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                #endregion

                var SourceCodeDetails = await _ICodeGenerator.GenerateExcelFileRetrivalCode(new Model.ExcelModal() { FilePath = filePath, EntityName = EntityName });

                NewlyCreateEntityName = SourceCodeDetails.EntityName;
                #region ExcuteCode To Get ExcelData
                ICSharpCodeExecuter codeExecuter = _codeExecuterResolver("RDBMS");
                var executionResult = await codeExecuter.Execute(new CustomCodeConfiguration { InputCode = SourceCodeDetails.Code.ToString() + "return " + SourceCodeDetails.EntityName + ";" });

                if (executionResult is null)
                    return Json("Unable to compile the input c# Code.");

                string viewTable = string.Empty;
                if (executionResult.IsSuccessfullyCompile)
                {
                    resultTable = JsonConvert.DeserializeObject<DataTable>(executionResult.Result);
                    //Output = JsonConvert.SerializeObject(resultTable);
                    Output = JsonConvert.SerializeObject(resultTable.AsEnumerable().Take(5).CopyToDataTable());
                }
                else
                {
                    var result1 = new
                    {
                        resultTable = "",
                        Code = executionResult.Message,
                        EntiyName = SourceCodeDetails.EntityName,
                        IsSuccess = false
                    };

                    return Ok(result1);
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
                    Code = SourceCodeDetails.Code,
                    EntiyName = SourceCodeDetails.EntityName,
                    IsSuccess = true
                };

                return Ok(result);

            }
            catch (Exception ex)
            {
                var resultFail = new
                {

                    Code = string.Join(Environment.NewLine, ex.Message),
                    IsSuccess = false

                };

                return Ok(resultFail);
            }




        }


        [HttpPost]
        public async Task<IActionResult> SaveExcelConfiguration([FromBody] ExcelModal entity)
        {
            try
            {
                if (string.IsNullOrEmpty(Output) || string.IsNullOrEmpty(NewlyCreateEntityName) || string.IsNullOrEmpty(FilePath))
                {
                    return Json(new { success = false, message = "Click On UploadButton", CurrentEntityName = NewlyCreateEntityName });
                }
                else
                {
                    ExcelModal ex = new ExcelModal() { FilePath = FilePath, Output = Output, EntityName = NewlyCreateEntityName,SourceCode=entity.SourceCode };
                    var result =await _IDataTransformationBusiness.SaveExcelConfiguration(ex);
                    return Json(new { success = true, message = result.ToString(), CurrentEntityName = NewlyCreateEntityName });
                }

                Output = "";
                NewlyCreateEntityName = "";
                FilePath = "";



            }
            catch (Exception ex)
            {
                Output = "";
                NewlyCreateEntityName = "";
                FilePath = "";
                return Json(new { success = false, message = "There was a problem in saving the configuration" });
            }


        }

    }
}
