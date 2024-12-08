using System.Data;
using System;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Reflection;
using MySql.Data.MySqlClient;
using Oracle.ManagedDataAccess.Client;
namespace NetReportBuilder.Etl.Web
{
    public class DynamicCodeExecutor
    {
        readonly string code = @"var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Get, ""https://localhost:7020/Api/CityModule/Get_City"");
var response = await client.SendAsync(request);
string responseBody = await response.Content.ReadAsStringAsync();
return responseBody;";
        public async Task<string> Invoke()
        {
            try
            {
                var test = await ExecuteCSharpCode<object>(GenarateCSharpCodeForAPIToExecute(code));
                return "suiccess";
            }
            catch(Exception ex)
            {
                throw;
            }
        }
        private  string GenarateCSharpCodeForAPIToExecute(string customCode)
        {
            return $@"using System;
            using System.Net.Http;
            using System.Threading.Tasks;
            using Newtonsoft.Json;
            using System.Data;

            namespace DynamicNameSpace
            {{
                public class DynamicClass
                {{
                    public async Task<string> DynamicMethod()
                    {{
                        {customCode}
                       
                    }}

                    private static DataTable JsonToDataTable(string json)
                    {{
                        return JsonConvert.DeserializeObject<DataTable>(json);
                    }}
                }}
            }}";
        }

        async Task<DynamicCodeResponse<T>> ExecuteCSharpCode<T>(string code) where T : new()
        {
            DynamicCodeResponse<T> response = new DynamicCodeResponse<T>
            {
                MessageList = new List<string>(),
                Output = default(T),
                CompiledSuccessfully = false
            };
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
                    var type = assembly.GetType("DynamicNameSpace.DynamicClass");
                    var method = type.GetMethod("DynamicMethod");
                    var obj = Activator.CreateInstance(type);

                    response.MessageList.Add("<span style='color:green;'>Dynamic class instance created and method retrieved.</span>");
                    var output = method.Invoke(obj, null);
                    response.Output = output.ConvertToType<T>();
                }

            }
            return response;


        }

    }
}
