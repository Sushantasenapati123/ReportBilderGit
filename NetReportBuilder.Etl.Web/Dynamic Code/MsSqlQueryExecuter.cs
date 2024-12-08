using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis;
using MySql.Data.MySqlClient;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using Oracle.ManagedDataAccess.Client;
using System.Data.SqlClient;
using System.Data;
using System.Reflection;

namespace NetReportBuilder.Etl.Web
{
    public class MsSqlQueryExecuter : IQueryExecuter
    {
        public QueryResponce Execute(QueryRequest queryParams)
        {
            QueryResponce queryResponce = new QueryResponce();
            var methodResult = new DataTable();
            var DymnamicQuery = CommonMethodForExecuteQuery.GenarateCSharpCodeForQueryToExecute(queryParams.ConnectionString, queryParams.Query, "SqlServer");


            CompilationModel vm = CompilationModel.Instance;
            DataTable TableViewData = new DataTable();
#pragma warning disable CS0219 // Variable is assigned but its value is never used
            string SchemaInfo = "";
#pragma warning restore CS0219 // Variable is assigned but its value is never used
            // Parse the input code
            var syntaxTree = CSharpSyntaxTree.ParseText(DymnamicQuery);
            queryResponce.Message.Add("Starting Index action.");
            #region CompileProcess
            queryResponce.Message.Add("Compiling code.");
            var assemblyName = $"{DateTime.Now:ddMMyyHHmmss}";
            queryResponce.Message.Add($"Generated assembly name: {assemblyName}");

            var assemblies = AppDomain.CurrentDomain.GetAssemblies()
                .Where(a => !a.IsDynamic && !string.IsNullOrEmpty(a.Location))
                .Select(a => MetadataReference.CreateFromFile(a.Location))
                .Cast<MetadataReference>()
                .ToList();
            queryResponce.Message.Add("Retrieved references to all loaded assemblies.");
            // Add core assembly references
            assemblies.Add(MetadataReference.CreateFromFile(typeof(object).Assembly.Location));
            assemblies.Add(MetadataReference.CreateFromFile(typeof(SqlConnection).Assembly.Location));
            assemblies.Add(MetadataReference.CreateFromFile(typeof(MySqlConnection).Assembly.Location));
            assemblies.Add(MetadataReference.CreateFromFile(typeof(OracleConnection).Assembly.Location));

            queryResponce.Message.Add("Added additional references.");

            // Create the compilation
            var compilation = CSharpCompilation.Create(assemblyName,
                    new[] { syntaxTree },
                    assemblies,
                    new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary));
            queryResponce.Message.Add("Compilation object created.");

            using (var ms = new MemoryStream())
            {
                var result = compilation.Emit(ms);
                queryResponce.Message.Add("Compilation process completed.");

                if (!result.Success)
                {
                    queryResponce.Message.Add("<span style='color:red;'>Compilation failed with errors:</span>");

                    // Handle compilation errors
                    var failures = result.Diagnostics.Where(diagnostic =>
                        diagnostic.IsWarningAsError ||
                        diagnostic.Severity == DiagnosticSeverity.Error);
                    foreach (var diagnostic in failures)
                    {
                        queryResponce.Message.Add($"<span style='color:red;'>{diagnostic.Id}: {diagnostic.GetMessage()}</span>");
                    }
                }
                else
                {
                    queryResponce.IsSuccessfullyCompile = true;


                    queryResponce.Message.Add("<span style='color:green;'>Compilation succeeded.</span>");

                    // Load the assembly
                    ms.Seek(0, SeekOrigin.Begin);
                    var assembly = Assembly.Load(ms.ToArray());

                    queryResponce.Message.Add("<span style='color:green;'>Assembly loaded into memory.</span>");

                    // Create an instance of the dynamic class and invoke the method
                    var type = assembly.GetType("DynamicNamespace.DynamicClass");

#pragma warning disable CS8604 // Possible null reference argument.
                    var obj = Activator.CreateInstance(type);
#pragma warning restore CS8604 // Possible null reference argument.
                    var method = type.GetMethod("DynamicMethod");

                    queryResponce.Message.Add("<span style='color:green;'>Dynamic class instance created and method retrieved.</span>");




                    queryResponce.Result = method.Invoke(obj, null) as DataTable;


                    queryResponce.Message.Add("<span style='color:green;'>Method invocation result:" + methodResult + "</span>");

                    if (queryParams.Query.TrimStart().StartsWith("SELECT", StringComparison.OrdinalIgnoreCase))
                    {
                        TableViewData = methodResult as DataTable;
#pragma warning disable CS8604 // Possible null reference argument.
                        var DynamicList = CommonMethodForExecuteQuery.GenerateModelClassCode(queryResponce.Result as DataTable);
#pragma warning restore CS8604 // Possible null reference argument.

                        queryResponce.SchemaInfo = DynamicList.ClassCode;
                        queryResponce.ListOfProperties = DynamicList.ListOfProperties;
                        //CommonMethodForExecuteQuery.SaveModelClassToFile(DynamicList, @$"{_hostEnvironment.ContentRootPath}\DynamicClass.cs");




                    }
                }
            }
            #endregion


            return queryResponce;


        }
    }
}
