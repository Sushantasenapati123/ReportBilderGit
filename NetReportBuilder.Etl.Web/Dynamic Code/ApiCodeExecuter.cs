using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis;
using NetReportBuilder.Etl.Web.Helper;
using System.Data.SqlClient;
using System.Data;
using System.Reflection;
using Newtonsoft.Json;
using NetReportBuilder.Etl.Model;
using NetReportBuilder.Etl.Core;
using System.Configuration;
using etReportBuilder.Etl.Web;

namespace NetReportBuilder.Etl.Web
{
    public class ApiCodeExecuter : ICSharpCodeExecuter
    {
        private readonly ILogger<ApiCodeExecuter> _logger;
        public ApiCodeExecuter(ILogger<ApiCodeExecuter> logger)
        {
            _logger = logger;
        }

        public async Task<Response> Execute(CustomCodeConfiguration codeConfiguration)
        {
            if (codeConfiguration is null || string.IsNullOrEmpty(codeConfiguration.InputCode))
                throw new MissingFieldException("Required parameters are missing.");
            Response queryResponce = new Response()
            {
                IsSuccessfullyCompile = false,
                ListOfProperties = new List<ColumnDetails>(),
                Message = new List<string>(),
                Result = string.Empty
            };
            try
            {
                var DymnamicQuery = CommonMethodForExecuteQuery.GenarateCSharpCodeForAPIToExecute(codeConfiguration.InputCode);
                var response = await DynamicCodeLibrary.ExecuteCSharpCode<object>(DymnamicQuery);
                if (response is null)
                {
                    //queryResponce.Message.Add("Unable to invoke the API with given inputs.");
                    return queryResponce;
                }
                if (response.MessageList is not null)
                    queryResponce.Message.AddRange(response.MessageList);
                queryResponce.IsSuccessfullyExecute = response.IsSuccessfullyExecute;
                queryResponce.RuntimeExceptionMsg = response.RuntimeExceptionMsg;
                queryResponce.IsSuccessfullyCompile = response.CompiledSuccessfully;
                var apiResponse = response.Output as Task<string>;
                
            
                //var dt = JsonConvert.DeserializeObject<DataTable>(apiResponse.Result);
                //if (dt is null)
                //{
                //    queryResponce.Message.Add("Invalid Api Response.");
                //    return queryResponce;
                //}
                //var classType = dt.GenerateModelClassCode();
                //queryResponce.SchemaInfo = classType.Schema;
                //queryResponce.ListOfProperties = classType.Fields;


                
                return queryResponce;
            }
            catch (Exception ex)
            {
                queryResponce.IsSuccessfullyCompile = false ;
                _logger.LogError($"{ex}");
                throw;
            }



        }
    }



}
