using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using NetReportBuilder.Etl.Model.ViewModel;
using NetReportBuilder.Etl.Web.Models;
using NetReportBuilder.ReportSource.Model;
using System.Diagnostics;
using System.Diagnostics.Metrics;
using System.Drawing;
using System.Net.Http.Headers;
using System.Reflection.Emit;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using static Mysqlx.Expect.Open.Types;

namespace NetReportBuilder.Etl.Business
{

    public class CodeGenerator : ICodeGenerator
    {
        private readonly IWebHostEnvironment _webHost;
        private readonly IConfiguration _configuration;
        public CodeGenerator(IConfiguration configuration, IWebHostEnvironment webHost)
        {
            _webHost = webHost;
            _configuration = configuration;
        }


        #region Filter and Join Condition Code


        public async Task<HttpCodeResponse> GenerateDataTransformJoinCode(JoinTransformModel joinTransform)//New
        {



            HttpCodeResponse HCR = new HttpCodeResponse();
            string generatedCode = string.Empty;
            string dateTimeSuffixFull = DateTime.Now.ToString("yyyyMMddHHmmssfff");
            string dateTimeSuffix = "";




            string dataTableVar = "";// $"dT_{dateTimeSuffix}";


            if (joinTransform.EntityName == "Source")
            {



                dateTimeSuffix = dateTimeSuffixFull.Substring(dateTimeSuffixFull.Length - 6);
                dataTableVar = $"dT_{dateTimeSuffix}";
                HCR.EntityName = dataTableVar;
            }
            else
            {
                HCR.EntityName = joinTransform.EntityName;
                dateTimeSuffix = joinTransform.EntityName.Split("_")[1];
                dataTableVar = joinTransform.EntityName;
            }



            //HCR.EntityName = dataTableVar;
            StringBuilder sb = new StringBuilder();
            if (joinTransform.ListOfJoinConditions.Count == 0)
            {
                sb.Append($"var query_{dateTimeSuffix} = {joinTransform.SelectedColumns.FirstOrDefault().EntityName}.AsEnumerable()");
                sb.AppendLine(".Select(row => new {");
                int counter = 1;

                foreach (var column in joinTransform.SelectedColumns)
                {
                    var columnName = $"\"{column.ColumnName}\"";
                    if (counter == 1)
                    {
                        sb.AppendLine($"{column.ColumnName} = row[\"{column.ColumnName}\"]");
                    }
                    else
                    {
                        sb.AppendLine($", {column.ColumnName} = row[\"{column.ColumnName}\"]");
                    }
                    counter++;
                }
                sb.AppendLine("}).ToList();");




                sb.AppendLine($"DataTable {dataTableVar} = query_{dateTimeSuffix}.ConvertToDataTable();");

            }
            else//for multiple table join
            {
                sb.Append($"var query_{dateTimeSuffix}=");
                int counter = 1;

                foreach (var criteria in joinTransform.ListOfJoinConditions)

                {

                    string leftColumn = $"\"{criteria.LeftTable.ColumnName}\"";
                    string rightColumn = $"\"{criteria.RightTable.ColumnName}\"";

                    // Apply Convert.ToInt64 to both the left and right columns
                    string leftColumnWithConvert = $"Convert.ToInt64({criteria.LeftTable.EntityName.ToLower()}1?[{leftColumn}])";
                    string rightColumnWithConvert = $"Convert.ToInt64({criteria.RightTable.EntityName.ToLower()}1?[{rightColumn}])";


                    string beginJoin, endJoin, joinedQuery = "";
                    //string leftColumn = $"\"{criteria.LeftTable.ColumnName}\"";
                    //string rightColumn = $"\"{criteria.RightTable.ColumnName}\"";
                    if (counter == 1)
                    {
                        //sb.AppendLine($"from {criteria.LeftTable.EntityName.ToLower()}1 in {criteria.LeftTable.EntityName}.AsEnumerable()");
                        //sb.AppendLine($"join {criteria.RightTable.EntityName.ToLower()}1 in {criteria.RightTable.EntityName}.AsEnumerable()" +
                        //    $" on {criteria.LeftTable.EntityName.ToLower()}1?[{leftColumn}] equals {criteria.RightTable.EntityName.ToLower()}1?[{rightColumn}] ");

                        sb.AppendLine($"from {criteria.LeftTable.EntityName.ToLower()}1 in {criteria.LeftTable.EntityName}.AsEnumerable()");
                        sb.AppendLine($"join {criteria.RightTable.EntityName.ToLower()}1 in {criteria.RightTable.EntityName}.AsEnumerable()" +
                            $" on {leftColumnWithConvert} equals {rightColumnWithConvert} ");

                    }
                    else
                    {

                        //sb.AppendLine($"join {criteria.RightTable.EntityName.ToLower()}1 in {criteria.RightTable.EntityName}.AsEnumerable() on {criteria.LeftTable.EntityName.ToLower()}1?[{leftColumn}] equals {criteria.RightTable.EntityName.ToLower()}1?[{rightColumn}] ");

                        sb.AppendLine($"join {criteria.RightTable.EntityName.ToLower()}1 in {criteria.RightTable.EntityName}.AsEnumerable()" +
            $" on {leftColumnWithConvert} equals {rightColumnWithConvert} ");

                    }
                    counter++;

                }


                sb.AppendLine("select new {");
                counter = 1;
                foreach (var column in joinTransform.SelectedColumns)

                {

                    var columnName = $"\"{column.ColumnName}\"";
                    if (counter == 1)
                    {

                        sb.AppendLine($"{column.ColumnName}={column.EntityName.ToLower()}1?[{columnName}]");
                    }
                    else
                    {

                        sb.AppendLine($",{column.ColumnName}={column.EntityName.ToLower()}1?[{columnName}]");
                    }
                    counter++;

                }
                sb.AppendLine("};");




                //sb.AppendLine($"DataTable {dataTableVar} = ConvertToDataTable(query_{dateTimeSuffix}.ToList());");
                sb.AppendLine($"DataTable {dataTableVar} = query_{dateTimeSuffix}.ConvertToDataTable();");
            }


            HCR.Code = sb.ToString();
            return HCR;
        }


        public async Task<HttpCodeResponse> GenerateFilterDataTransformCodeOld(DataFilterModel joinTransform)
        {
            HttpCodeResponse HCR = new HttpCodeResponse();
            string dateTimeSuffixFull = DateTime.Now.ToString("yyyyMMddHHmmssfff");
            string dateTimeSuffix = dateTimeSuffixFull.Substring(dateTimeSuffixFull.Length - 6);
            string dataTableVar = $"dT_{dateTimeSuffix}";
            if (joinTransform.EntityName == "NoEntity")
            {


                HCR.EntityName = dataTableVar;
            }
            else
            {
                HCR.EntityName = joinTransform.EntityName;
            }
            StringBuilder sb = new StringBuilder();
            sb.Append($"var {HCR.EntityName} = {joinTransform.SourceEntityName}.AsEnumerable()");

            foreach (var filter in joinTransform.Filters)
            {
                string conditionSnippet = filter.Condition switch
                {
                    "equals" => $"== \"{filter.ConditionValue.ToLower()}\"",
                    "contains" => $".Contains(\"{filter.ConditionValue.ToLower()}\")",
                    "startswith" => $".StartsWith(\"{filter.ConditionValue.ToLower()}\")",
                    "endswith" => $".EndsWith(\"{filter.ConditionValue.ToLower()}\")",
                    "greaterthan" => $"> \"{filter.ConditionValue.ToLower()}\"",
                    "lessthan" => $"< \"{filter.ConditionValue.ToLower()}\"",
                    _ => throw new ArgumentException($"Unsupported condition: {filter.Condition}")
                };

                sb.Append($".Where(row => row[\"{filter.FieldName}\"].ToString().ToLower(){conditionSnippet})");
            }

            sb.Append(".CopyToDataTable();");

            HCR.Code = sb.ToString();
            return HCR;
        }
        public async Task<HttpCodeResponse> GenerateFilterDataTransformCode(DataFilterModel joinTransform)
        {
            HttpCodeResponse HCR = new HttpCodeResponse();
            string dateTimeSuffixFull = DateTime.Now.ToString("yyyyMMddHHmmssfff");
            string dateTimeSuffix = dateTimeSuffixFull.Substring(dateTimeSuffixFull.Length - 6);
            string dataTableVar = $"dT_{dateTimeSuffix}";

            HCR.EntityName = joinTransform.EntityName == "NoEntity" ? dataTableVar : joinTransform.EntityName;

            StringBuilder sb = new StringBuilder();
            sb.Append($"var {HCR.EntityName} = {joinTransform.SourceEntityName}.AsEnumerable()");

            // Initialize a variable to track if any filters are added
            bool hasFilters = false;

            // Iterate through each filter
            foreach (var filter in joinTransform.Filters)
            {
                string conditionSnippet = filter.Condition switch
                {
                    "equals" => $"row[\"{filter.FieldName}\"].ToString().ToLower() == \"{filter.ConditionValue.ToLower()}\"",
                    "contains" => $"row[\"{filter.FieldName}\"].ToString().ToLower().Contains(\"{filter.ConditionValue.ToLower()}\")",
                    "startswith" => $"row[\"{filter.FieldName}\"].ToString().ToLower().StartsWith(\"{filter.ConditionValue.ToLower()}\")",
                    "endswith" => $"row[\"{filter.FieldName}\"].ToString().ToLower().EndsWith(\"{filter.ConditionValue.ToLower()}\")",
                    "greaterthan" => $"row[\"{filter.FieldName}\"].ToString().ToLower() > \"{filter.ConditionValue.ToLower()}\"",
                    "lessthan" => $"row[\"{filter.FieldName}\"].ToString().ToLower() < \"{filter.ConditionValue.ToLower()}\"",
                    _ => throw new ArgumentException($"Unsupported condition: {filter.Condition}")
                };

                // Append the condition to the StringBuilder, adding ".Where" only for the first filter
                if (!hasFilters)
                {
                    sb.Append(".Where(row => ");
                    hasFilters = true;
                }
                else
                {
                    sb.Append(" || ");
                }
                sb.Append(conditionSnippet);
            }

            // Close the Where clause and add CopyToDataTable
            if (hasFilters)
            {
                sb.Append(").CopyToDataTable();");
            }
            else
            {
                sb.Append(".CopyToDataTable();");
            }

            HCR.Code = sb.ToString();
            return HCR;
        }

        #endregion

        public async Task<HttpCodeResponse> GenerateHttpCode(ApiModel request)
        {
            if (!Enum.TryParse<MethodType>(request.MethodType, out MethodType currentMethodType))
            {
                throw new KeyNotFoundException(nameof(request.MethodType));
            }
            if (!Enum.TryParse<ParameterType>(request.ParameterType, out ParameterType currentParameterType))
            {
                throw new KeyNotFoundException(nameof(request.ParameterType));
            }
            Dictionary<string, string> paramList = new Dictionary<string, string>();

            // Generate unique variable names based on the current date and time
            //string dateTimeSuffix = DateTime.Now.ToString("yyyyMMddHHmmss");
            string dateTimeSuffixFull = DateTime.Now.ToString("yyyyMMddHHmmssfff");
            string dateTimeSuffix = "";
            if (request.EntityName is null)
            {
                dateTimeSuffix = dateTimeSuffixFull.Substring(dateTimeSuffixFull.Length - 6);
            }
            else
            {
                dateTimeSuffix = request.EntityName.Split('_')[1];
            }

            string clientVar = $"client_{dateTimeSuffix}";
            string requestVar = $"request_{dateTimeSuffix}";
            string responseVar = $"response_{dateTimeSuffix}";
            string responseStringVar = $"responseString_{dateTimeSuffix}";
            string dataTableVar = $"dT_{dateTimeSuffix}";

            var templateCode = DynamicTemplateDictionary.FetchHttpMethodTemplate(currentMethodType);

            // Replace placeholders in the template with the generated variable names
            templateCode = templateCode
                .Replace("CLIENT_VARIABLE", clientVar)
                .Replace("REQUEST_VARIABLE", requestVar)
                .Replace("RESPONSE_VARIABLE", responseVar)
                .Replace("RESPONSE_STRING_VARIABLE", responseStringVar)
                .Replace("DATATABLE_VARIABLE", dataTableVar);



            if (currentParameterType == ParameterType.QueryParams || currentParameterType == ParameterType.UrlParams)
            {
                paramList = request.Parameters;
            }
            if (currentMethodType == MethodType.GET)
            {
                var paramBody = paramList.ConvertToApiParam(currentParameterType);
                string endpoint = $"{request.EndPoint}/{paramBody}";
                templateCode = templateCode.Replace("ENDPOINT", endpoint);
            }
            if (currentMethodType == MethodType.POST)
            {
                if (currentParameterType == ParameterType.UrlParams)
                {
                    var paramBody = paramList.ConvertToApiParam(currentParameterType);
                    string endpoint = $"{request.EndPoint}/{paramBody}";
                    templateCode = templateCode.Replace("ENDPOINT", endpoint);
                    templateCode = templateCode.Replace("CONTENT", string.Empty);
                }

            }
            return new HttpCodeResponse() { Code = templateCode, EntityName = "dT_" + dateTimeSuffix };


        }

        #region Mapping and Sync Code


        public async Task<string> GenerateMappingCode(string mappingModel, string destinationColumns)
        {
            string mappingCode = @"            
             MAPPINGMODEL
             DESTINATIONCOLUMNS
             var destination = source.GenerateDestination(mapping, destinationColumns.ToArray());";
            mappingCode = mappingCode.Replace("MAPPINGMODEL", mappingModel);
            mappingCode = mappingCode.Replace("DESTINATIONCOLUMNS", destinationColumns);
            return mappingCode;
        }

        public async Task<string> GenerateSyncingCode(SyncingModel syncingModel)
        {
            var truncateCode = @"
            using (var httpClient = new HttpClient())
            {
                using (var request = new HttpRequestMessage(new HttpMethod(""POST""), ""TRUNCATEURL""))
                {
                    request.Headers.TryAddWithoutValidation(""accept"", ""*/*"");

                    request.Content = new StringContent("""");
                    request.Content.Headers.ContentType = MediaTypeHeaderValue.Parse(""application/x-www-form-urlencoded"");
                    var response = await httpClient.SendAsync(request);
                }
            }";
            truncateCode = truncateCode.Replace("TRUNCATEURL", syncingModel.TruncateEndPoint);

            var syncingCode = @"using (var connection = new SqlConnection(@""CONNECTIONSTRING""))
            {
                connection.Open();
                using (var bulkCopy = new SqlBulkCopy(connection))
                {
                    bulkCopy.DestinationTableName = ""TARGET"";
                    try
                    {
                        // Export the data in batches of 4000 records
                        var chunks = destination.AsEnumerable().ToChunks(4000)
                                                   .Select(rows => rows.CopyToDataTable());

                        foreach (var tableChunk in chunks)
                        {
                            bulkCopy.WriteToServer(tableChunk);
                        }                        
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                }
            }
            return ""success"";
";
            syncingCode = syncingCode.Replace("CONNECTIONSTRING", syncingModel.ConnectionString);
            syncingCode = syncingCode.Replace("TARGET", syncingModel.TargetTable);
            StringBuilder sb = new StringBuilder();
            sb.Append(truncateCode);
            sb.Append(Environment.NewLine);
            sb.Append(syncingCode);
            return sb.ToString();


        }

        #endregion

        #region Generating CreateConnection Code



        public async Task<HttpCodeResponse> GenerateInlineQueryCode(AddDatabaseConfigurationsPipeline_Model ServerDetails)
        {
            if (string.IsNullOrEmpty(ServerDetails.DatabaseType))
            {
                throw new ArgumentNullException("DatabaseType and TableName cannot be null");
            }

            HttpCodeResponse HCR = new HttpCodeResponse();
            string generatedCode = string.Empty;
            string dateTimeSuffixFull = DateTime.Now.ToString("yyyyMMddHHmmssfff");
            string dateTimeSuffix = "";

            string dataTableVar = "";

            string temp_dataTableVar = "";


            if (ServerDetails.EntityName == "Source")
            {



                dateTimeSuffix = dateTimeSuffixFull.Substring(dateTimeSuffixFull.Length - 6);
                dataTableVar = $"dT_{dateTimeSuffix}";
                temp_dataTableVar = $"Temp_{dateTimeSuffix}";
                HCR.EntityName = dataTableVar;
            }
            else
            {
                HCR.EntityName = ServerDetails.EntityName;
                dateTimeSuffix = ServerDetails.EntityName.Split("_")[1];
                dataTableVar = ServerDetails.EntityName;
                temp_dataTableVar = $"Temp_{dateTimeSuffix}";
            }


            // Step 1: Create the SQL Query based on TableName
            string query = $"{ServerDetails.Query}";

            string connectionString = CommonExtensionMethods.BuildConnectionString(ServerDetails);



            // Determine the database type to use appropriate connection class
            string dbConnectionClass = GetDbConnectionClass(ServerDetails.DatabaseType);

            // Template code to execute the query and convert the result to JSON
            string templateCode = $@"
        var {temp_dataTableVar} = new DataTable();
        using (var connection = new {GetConnectionType(ServerDetails.DatabaseType)}(@""{connectionString}""))
        {{
            var command = connection.CreateCommand();
            command.CommandText = @""{query}"";
            connection.Open();

            var adapter = new {GetDataAdapterType(ServerDetails.DatabaseType)}(command);
            adapter.Fill({temp_dataTableVar});
        }}
        var {dataTableVar} = {temp_dataTableVar};

";

            // Step 3: Return the generated code and other metadata
            return new HttpCodeResponse()
            {
                Code = templateCode,
                EntityName = dataTableVar
            };
        }





        // Helper method to get the correct connection class based on database type
        private string GetDbConnectionClass(string databaseType)
        {
            switch (databaseType.ToLower())
            {
                case "sqlserver":
                    return "System.Data.SqlClient";
                case "oracle":
                    return "Oracle.ManagedDataAccess.Client";
                case "mysql":
                    return "MySql.Data.MySqlClient";
                default:
                    throw new NotSupportedException($"{databaseType} is not supported");
            }
        }

        // Helper method to get the connection object based on database type
        private string GetConnectionType(string databaseType)
        {
            switch (databaseType.ToLower())
            {
                case "sqlserver":
                    return "SqlConnection";
                case "oracle":
                    return "OracleConnection";
                case "mysql":
                    return "MySqlConnection";
                default:
                    throw new NotSupportedException($"{databaseType} is not supported");
            }
        }

        // Helper method to get the data adapter type based on database type
        private string GetDataAdapterType(string databaseType)
        {
            switch (databaseType.ToLower())
            {
                case "sqlserver":
                    return "SqlDataAdapter";
                case "oracle":
                    return "OracleDataAdapter";
                case "mysql":
                    return "MySqlDataAdapter";
                default:
                    throw new NotSupportedException($"{databaseType} is not supported");
            }
        }
        #endregion


        public async Task<HttpCodeResponse> GenerateGroupByDataTransformCode(GroupByConditionModel FilterModel)
        {
            //if (string.IsNullOrEmpty(GroupByConditionModel.DatabaseType))
            //{
            //    throw new ArgumentNullException("DatabaseType and TableName cannot be null");
            //}

            HttpCodeResponse HCR = new HttpCodeResponse();
            string generatedCode = string.Empty;
            string dateTimeSuffixFull = DateTime.Now.ToString("yyyyMMddHHmmssfff");
            string dateTimeSuffix = "";

            string dataTableVar = "";

            string temp_dataTableVar = "";


            if (FilterModel.CurrentEntityName == "NoEntity")
            {

                dateTimeSuffix = dateTimeSuffixFull.Substring(dateTimeSuffixFull.Length - 6);
                dataTableVar = $"dT_{dateTimeSuffix}";
                temp_dataTableVar = $"Temp_{dateTimeSuffix}";
                HCR.EntityName = dataTableVar;
            }
            else
            {
                HCR.EntityName = FilterModel.CurrentEntityName;
                dateTimeSuffix = FilterModel.CurrentEntityName.Split("_")[1];
                dataTableVar = FilterModel.CurrentEntityName;
                temp_dataTableVar = $"Temp_{dateTimeSuffix}";
            }


            // Extract group by columns
            var groupByConditions = FilterModel.GroupByConditionList
                .Where(c => c.Operator == "Group By")
                .Select(c => new { c.ActualColumn, c.DataType })

                .ToList();

            // Extract aggregation functions
            var aggregationConditions = FilterModel.GroupByConditionList
                .Where(c => c.Operator != "Group By" && c.Operator != "Expression")
                .Select(c => new
                {
                    Column = c.ActualColumn,
                    Function = c.Operator,
                    OutputColumn = c.Alias,
                    DataType=c.DataType
                    
                })
                .ToList();

            // Base query
            var query = $"var query_{dateTimeSuffix} = {FilterModel.SourceEntityName}.AsEnumerable()\n";

            // Apply Group By
            if (groupByConditions.Any())
            {
                // Group by all columns in groupByConditions
                query += ".GroupBy(row => new\n{\n";

                foreach (var groupBy in groupByConditions)
                {
                    if (groupBy.DataType == "int")
                    {
                        query += $"    {groupBy.ActualColumn} = Convert.ToInt64(row.Field<object>(\"{groupBy.ActualColumn}\")),\n";//{groupBy.DataType}
                    }
                    else // assuming it's a string or another type that needs trimming
                    {
                        query += $"    {groupBy.ActualColumn.Trim().Replace(" ", "")} = row.Field<{groupBy.DataType}>(\"{groupBy.ActualColumn}\").Trim(),\n";
                    }
                }

                query = query.TrimEnd(',', '\n'); // Remove trailing comma
                query += "\n})\n";  // Close the anonymous object for GroupBy


                // Apply Aggregation
                // Apply Aggregation
                if (aggregationConditions.Any())
                {
                    query += ".Select(g => new\n{\n";

                    // Include the grouping keys
                    foreach (var groupBy in groupByConditions)
                    {
                        query += $"    {groupBy.ActualColumn.Trim().Replace(" ", "")} = g.Key.{groupBy.ActualColumn.Trim().Replace(" ", "")},\n";
                    }

                    foreach (var condition in aggregationConditions)
                    {
                        switch (condition.Function)
                        {
                            case "Max":
                                query += $"    {condition.OutputColumn} = g.Max(row => row.Field<{condition.DataType}>(\"{condition.Column}\")),\n";
                                break;
                            case "Min":
                                query += $"    {condition.OutputColumn} = g.Min(row => row.Field<{condition.DataType}>(\"{condition.Column}\")),\n";
                                break;
                            case "Count":
                                // Count operation
                                query += $"    {condition.OutputColumn} = g.Count(),\n";
                                break;
                                // Add cases for other aggregation functions as needed
                        }
                    }
                    query = query.TrimEnd(',', '\n'); // Remove trailing comma
                    query += "\n})\n"; // Close the Select projection
                }
               
            }

            #region To STore Having Condition

            // Add HAVING condition
            if (FilterModel.GroupByConditionList.Any())
            {
                var havingConditions = FilterModel.GroupByConditionList
                    .Where(item => !string.IsNullOrEmpty(item.FilterValue))
                    .Select(item => $"o.{item.Alias}{item.FilterValue}");

                if (havingConditions.Any())
                {
                    var combinedHavingCondition = string.Join(" && ", havingConditions);
                    query += $".Where(o => {combinedHavingCondition})\n";
                }
            }



            //var havingCondition = "";
            //foreach (var item in FilterModel.GroupByConditionList)
            //{
            //    if (item.FilterValue != "")
            //    {
            //        havingCondition += $"\n.Where(o => o.{item.Alias}{item.FilterValue});\n";
            //    }
            //}

            query += ";\n";

            #endregion









            query += $" DataTable {temp_dataTableVar} = new DataTable();";


            var queryToAddDataTable = "";
            foreach (var item in FilterModel.GroupByConditionList)
            {
                if (item.OutputColumn != "" && item.OutputColumn != null)
                {

                    query += $"\r\t{temp_dataTableVar}.Columns.Add(\"{item.Alias}\",typeof({item.DataType}));\n";
                    queryToAddDataTable += $"\r\t\nnewRow_{dateTimeSuffix}[\"{item.Alias}\"]=item.{item.Alias};\n";
                }
            }

            query += $"foreach (var item in query_{dateTimeSuffix})\n{{\n\r\nDataRow newRow_{dateTimeSuffix} = {temp_dataTableVar}.NewRow();\n";

            query += queryToAddDataTable;
            query += $"\n{temp_dataTableVar}.Rows.Add(newRow_{dateTimeSuffix});\n\r}}";

            query += $" \nvar {dataTableVar} = {temp_dataTableVar};\n";


            HCR.Code = query.ToString();
            return HCR;
            // return query;


        }

        public async Task<HttpCodeResponse> GenerateExcelFileRetrivalCode(ExcelModal Model)
        {
            try
            {
                HttpCodeResponse HCR = new HttpCodeResponse();
                string generatedCode = string.Empty;
                string dateTimeSuffixFull = DateTime.Now.ToString("yyyyMMddHHmmssfff");
                string dateTimeSuffix = "";

                string dataTableVar = "";

                string temp_dataTableVar = "";


                if (Model.EntityName == "NoEntity")
                {

                    dateTimeSuffix = dateTimeSuffixFull.Substring(dateTimeSuffixFull.Length - 6);
                    dataTableVar = $"dT_{dateTimeSuffix}";
                    temp_dataTableVar = $"Temp_{dateTimeSuffix}";
                    HCR.EntityName = dataTableVar;
                }
                else
                {
                    HCR.EntityName = Model.EntityName;
                    dateTimeSuffix = Model.EntityName.Split("_")[1];
                    dataTableVar = Model.EntityName;
                    temp_dataTableVar = $"Temp_{dateTimeSuffix}";
                }

                // Initialize a StringBuilder to build the C# code as a string
                StringBuilder sb = new StringBuilder();

                // Start building the code for DataTable creation
                sb.AppendLine($"DataTable {temp_dataTableVar} = new DataTable();");
                sb.AppendLine("");

                // Load the Excel file
                sb.AppendLine("// Load the Excel file using ClosedXML");
                sb.AppendLine($"using (XLWorkbook workBook = new XLWorkbook(\"{Model.FilePath.Replace("\\", "\\\\")}\"))");
                sb.AppendLine("{");
                sb.AppendLine("    IXLWorksheet workSheet = workBook.Worksheet(1); // Assuming the first sheet");
                sb.AppendLine("");
                sb.AppendLine("    bool firstRow = true;");
                sb.AppendLine("    foreach (IXLRow row in workSheet.RowsUsed())");
                sb.AppendLine("    {");
                sb.AppendLine("        if (firstRow)");
                sb.AppendLine("        {");
                sb.AppendLine("            // Add columns to DataTable");
                sb.AppendLine("            foreach (IXLCell cell in row.Cells())");
                sb.AppendLine("            {");
                sb.AppendLine($"                {temp_dataTableVar}.Columns.Add(cell.Value.ToString());");
                sb.AppendLine("            }");
                sb.AppendLine("            firstRow = false;");
                sb.AppendLine("        }");
                sb.AppendLine("        else");
                sb.AppendLine("        {");
                sb.AppendLine("            // Add rows to DataTable");
                sb.AppendLine($"            DataRow dataRow = {temp_dataTableVar}.NewRow();");
                sb.AppendLine("            int i = 0;");
                sb.AppendLine("            foreach (IXLCell cell in row.Cells())");
                sb.AppendLine("            {");
                sb.AppendLine("                dataRow[i] = cell.Value.ToString();");
                sb.AppendLine("                i++;");
                sb.AppendLine("            }");
                sb.AppendLine($"            {temp_dataTableVar}.Rows.Add(dataRow);");
                sb.AppendLine("        }");
                sb.AppendLine("    }");
                sb.AppendLine("}");
                sb.AppendLine("");

                // Return the DataTable
                sb.AppendLine($"var {dataTableVar}={temp_dataTableVar};");



                HCR.Code = sb.ToString();
                return HCR;
            }
            catch(Exception ex)
            {
                throw;
            }

        }
    }

}





