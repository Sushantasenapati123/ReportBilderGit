using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis;
using MySql.Data.MySqlClient;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using Oracle.ManagedDataAccess.Client;
using System.Data.SqlClient;
using System.Data;
using System.Reflection;
using NPOI.SS.Formula.Functions;

namespace NetReportBuilder.Etl.Web
{
    


   
    public class DynamicCodeLibrary
    {

        public static async Task<DynamicCodeResponse<T>> ExecuteCSharpCode<T>(string code) where T : new()
        {
            DynamicCodeResponse<T> response = new DynamicCodeResponse<T>
            {
                MessageList = new List<string>(),
                Output = default(T),
                CompiledSuccessfully = false,
                IsSuccessfullyExecute=false
            };
            try
            {
                
                CompilationModel vm = CompilationModel.Instance;
                // Parse the input code
                var syntaxTree = CSharpSyntaxTree.ParseText(code);
                response.MessageList.Add("Starting Index action.");
                response.MessageList.Add("Compiling code.");
                var assemblyName = $"{DateTime.Now:ddMMyyHHmmss}";
                response.MessageList.Add($"Generated assembly name: {assemblyName}");
                var assemblies = AppDomain.CurrentDomain.GetAssemblies()
                    .Where(a => !a.IsDynamic && !string.IsNullOrEmpty(a.Location))
                    .Select(a => MetadataReference.CreateFromFile(a.Location))
                    .Cast<MetadataReference>()
                    .ToList();
                response.MessageList.Add("Retrieved references to all loaded assemblies.");
                // Add core assembly references
                assemblies.Add(MetadataReference.CreateFromFile(typeof(object).Assembly.Location));
                assemblies.Add(MetadataReference.CreateFromFile(typeof(SqlConnection).Assembly.Location));
                assemblies.Add(MetadataReference.CreateFromFile(typeof(MySqlConnection).Assembly.Location));
                assemblies.Add(MetadataReference.CreateFromFile(typeof(OracleConnection).Assembly.Location));
                assemblies.Add(MetadataReference.CreateFromFile(typeof(ClosedXML.Excel.XLWorkbook).Assembly.Location));


                response.MessageList.Add("Added additional references.");

                // Create the compilation
                var compilation = CSharpCompilation.Create(assemblyName,
                        new[] { syntaxTree },
                        assemblies,
                        new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary));
                response.MessageList.Add("Compilation object created.");

                using (var ms = new MemoryStream())
                {
                    var result = compilation.Emit(ms);
                    response.MessageList.Add("Compilation process completed.");

                    if (!result.Success)
                    {
                        response.MessageList.Add("<span style='color:red;'>Compilation failed with errors:</span>");

                        // Handle compilation errors
                        var failures = result.Diagnostics.Where(diagnostic =>
                        diagnostic.IsWarningAsError ||
                            diagnostic.Severity == DiagnosticSeverity.Error);
                        foreach (var diagnostic in failures)
                        {
                            response.MessageList.Add($"<span style='color:red;'>{diagnostic.Id}: {diagnostic.GetMessage()}</span>");
                        }
                    }
                    else
                    {
                        response.CompiledSuccessfully = true;
                        response.MessageList.Add("<span style='color:green;'>Compilation succeeded.</span>");
                        // Load the assembly
                        ms.Seek(0, SeekOrigin.Begin);
                        var assembly = Assembly.Load(ms.ToArray());
                        response.MessageList.Add("<span style='color:green;'>Assembly loaded into memory.</span>");

                        // Create an instance of the dynamic class and invoke the method
                        var type = assembly.GetType("DynamicNamespace.DynamicClass");
                        var method = type.GetMethod("DynamicMethod");
                        var obj = Activator.CreateInstance(type);

                        response.MessageList.Add("<span style='color:green;'>Dynamic class instance created and method retrieved.</span>");
                        if (typeof(Task).IsAssignableFrom(method.ReturnType))
                        {
                            dynamic task = method.Invoke(obj, null);
                            await task;
                            object output1 = task.GetAwaiter().GetResult();
                            response.Output = output1.ConvertToType<T>();
                            response.IsSuccessfullyExecute = true;
                            response.RuntimeExceptionMsg = "NA";
                        }
                        else
                        {

                            var output = method.Invoke(obj, null);
                            response.Output = output.ConvertToType<T>();
                            response.IsSuccessfullyExecute = true;
                            response.RuntimeExceptionMsg = "NA";
                        }
                    }

                }
                return response;
            }
            catch(Exception ex)
            {
                response.IsSuccessfullyExecute = false;
                response.RuntimeExceptionMsg = ex.Message;
                
                response.MessageList.Add($"<span style='color:red;'>{ex}</span>");

                return response;
            }

        }
    }
}
