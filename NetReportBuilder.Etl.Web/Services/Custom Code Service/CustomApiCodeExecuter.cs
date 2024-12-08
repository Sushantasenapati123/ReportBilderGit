using Hangfire;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis;
using NetReportBuilder.Etl.Model;
using NetReportBuilder.Etl.Web.Helper;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Data;
using System.Reflection;
using NetReportBuilder.Etl.Core;

namespace NetReportBuilder.Etl.Web
{
   
    public class CustomApiCodeExecuter : ICustomCodeExecuter
    {
       
        private readonly ILogger<CustomApiCodeExecuter> _logger;
        public CustomApiCodeExecuter(ILogger<CustomApiCodeExecuter> logger)
        {
            
            _logger = logger;
        }

        public async Task<string> Execute(string cSharpCode)
        {
            try
            {
                var jsonResponse = "";
                
                var DymnamicQuery = CommonMethodForExecuteQuery.GenarateCSharpCodeForAPIToExecute(cSharpCode);

                CompilationModel vm = CompilationModel.Instance;
                DataTable TableViewData = new DataTable();
#pragma warning disable CS0219 // Variable is assigned but its value is never used
                string SchemaInfo = "";
#pragma warning restore CS0219 // Variable is assigned but its value is never used
                // Parse the input code
                var syntaxTree = CSharpSyntaxTree.ParseText(DymnamicQuery);
                //queryResponce.Message.Add("Starting Index action.");
                #region CompileProcess
                //queryResponce.Message.Add("Compiling code.");
                var assemblyName = $"{DateTime.Now:ddMMyyHHmmss}";
                //queryResponce.Message.Add($"Generated assembly name: {assemblyName}");

                var assemblies = AppDomain.CurrentDomain.GetAssemblies()
                .Where(a => !a.IsDynamic && !string.IsNullOrEmpty(a.Location))
                    .Select(a => MetadataReference.CreateFromFile(a.Location))
                    .Cast<MetadataReference>()
                    .ToList();
                //queryResponce.Message.Add("Retrieved references to all loaded assemblies.");
                // Add core assembly references
                assemblies.Add(MetadataReference.CreateFromFile(typeof(object).Assembly.Location));
                assemblies.Add(MetadataReference.CreateFromFile(typeof(SqlConnection).Assembly.Location));

                assemblies.Add(MetadataReference.CreateFromFile(typeof(HttpClient).Assembly.Location));
                assemblies.Add(MetadataReference.CreateFromFile(typeof(JsonConvert).Assembly.Location));


                //queryResponce.Message.Add("Added additional references.");

                // Create the compilation
                var compilation = CSharpCompilation.Create(assemblyName,
                        new[] { syntaxTree },
                        assemblies,
                        new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary));
                //queryResponce.Message.Add("Compilation object created.");

                using (var ms = new MemoryStream())
                {
                    var result = compilation.Emit(ms);
                    //queryResponce.Message.Add("Compilation process completed.");

                    if (!result.Success)
                    {
                        //queryResponce.IsSuccessfullyCompile = false;
                        //queryResponce.Message.Add("<span style='color:red;'>Compilation failed with errors:</span>");

                        // Handle compilation errors
                        var failures = result.Diagnostics.Where(diagnostic =>
                        diagnostic.IsWarningAsError ||
                            diagnostic.Severity == DiagnosticSeverity.Error);
                        foreach (var diagnostic in failures)
                        {
                            //queryResponce.Message.Add($"<span style='color:red;'>{diagnostic.Id}: {diagnostic.GetMessage()}</span>");
                        }
                    }
                    else
                    {
                        //queryResponce.IsSuccessfullyCompile = true;
                        //queryResponce.Message.Add("<span style='color:green;'>Compilation succeeded.</span>");

                        // Load the assembly
                        ms.Seek(0, SeekOrigin.Begin);
                        var assembly = Assembly.Load(ms.ToArray());

                        //queryResponce.Message.Add("<span style='color:green;'>Assembly loaded into memory.</span>");

                        // Create an instance of the dynamic class and invoke the method
                        var type = assembly.GetType("DynamicNamespace.DynamicClass");
                        var obj = Activator.CreateInstance(type);
                        var method = type.GetMethod("DynamicMethod");//DynamicMethod



                        //queryResponce.Message.Add("<span style='color:green;'>Dynamic class instance created and method retrieved.</span>");

                        // Asynchronously invoke the method and handle the JSON result
                        var task = (Task<string>)method.Invoke(obj, null);
                        task.Wait();

                         jsonResponse = task.Result;
                        //queryResponce.Result = jsonResponse; // Store the JSON result



                        //queryResponce.Message.Add("<span style='color:green;'>API response received.</span>");



                    }
                    return jsonResponse;
                }

                #endregion

            }
            catch (Exception ex)
            {
                //queryResponce.IsSuccessfullyCompile = false;

                return ex.Message;

            }

        }
    }
}
