using Hangfire;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis;
using MySql.Data.MySqlClient;
using NetReportBuilder.Etl.Model;
using NetReportBuilder.Etl.Web.Helper;
using Oracle.ManagedDataAccess.Client;
using System.Data.SqlClient;
using System.Data;
using System.Reflection;
using Newtonsoft.Json;
using NetReportBuilder.Etl.Core;
using NPOI.SS.Formula.Functions;

namespace NetReportBuilder.Etl.Web
{

    public class CustomDatabaseCodeExecuter : ICustomCodeExecuter
    {

        private readonly ILogger<CustomDatabaseCodeExecuter> _logger;
        public CustomDatabaseCodeExecuter(ILogger<CustomDatabaseCodeExecuter> logger)
        {

            _logger = logger;
        }

        public async Task<string> Execute(string cSharpCode)
        {
            try
            {
            
                QueryResponce queryResponce = new QueryResponce();
                var methodResultInJson = "";

                var DymnamicQuery = CommonMethodForExecuteQuery.GenarateCSharpCodeForQueryToExecute(cSharpCode);

                CompilationModel vm = CompilationModel.Instance;
                
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
                #endregion 
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



                        dynamic task = method.Invoke(obj, null);
                        await task;
                        object output1 = task.GetAwaiter().GetResult();
                        








                        // }
                    }
                    return "";
                }

            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}
