using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.Extensions.Hosting;
using MySql.Data.MySqlClient;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using NetReportBuilder.Etl.Web;
using NetReportBuilder.Etl.Web.Helper;
using Oracle.ManagedDataAccess.Client;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;
using System.Linq;

namespace etReportBuilder.Etl.Web
{
    public class GenericDatabaseQueryExecutor : ICSharpCodeExecuter
    {
        private readonly ILogger<GenericDatabaseQueryExecutor> _logger;
        public GenericDatabaseQueryExecutor(ILogger<GenericDatabaseQueryExecutor> logger)
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

                var DymnamicQuery = CommonMethodForExecuteQuery.ApiExecutorClass(codeConfiguration.InputCode);

                var response = await DynamicCodeLibrary.ExecuteCSharpCode<DataTable>(DymnamicQuery);

                if (response is null)
                {
                    queryResponce.Message.Add("Unable to execute the given c# code.");
                    return queryResponce;
                }
                if (response.MessageList != null)
                    queryResponce.Message.AddRange(response.MessageList);

                if (!response.CompiledSuccessfully)
                {
                    queryResponce.Message.Add("Unable to compile the given c# code"); 
                    return queryResponce;
                }                
                if(response.Output is null)
                {
                    queryResponce.Message.Add("Unable to fetch the output");
                    return queryResponce;
                }
                queryResponce.Result = response.Output.ConvertToJson();
                queryResponce.IsSuccessfullyCompile = response.CompiledSuccessfully;
                queryResponce.IsSuccessfullyExecute = response.IsSuccessfullyExecute;
                var classType = response.Output.GenerateModelClassCode();
                queryResponce.SchemaInfo = classType.Schema;
                queryResponce.ListOfProperties = classType.Fields;
                return queryResponce;
            }
            catch(Exception ex)
            {
               
                queryResponce.Message.Add($"<span style='color:red;'>{ex}</span>");
               
                queryResponce.IsSuccessfullyCompile = false;
                return queryResponce;
                //_logger.LogError($"{ex}");
                //throw;
            }
        }

       
    }

    

   

    



}
