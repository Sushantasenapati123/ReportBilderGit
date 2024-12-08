using NetReportBuilder.Etl.Model;
using NetReportBuilder.Etl.Web.Models;
using ScriptingEngine.Models;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using NetReportBuilder.Etl.Core;
namespace NetReportBuilder.Etl.Web.Helper
{
    public class CommonMethodForExecuteQuery
    {


        //To Execute Only Query
        public static string GenarateCSharpCodeForQueryToExecute(string connectionString, string query, string databaseType)
        {
            string connectionType = "";
            string commandType = "";
            string openConnection = "";
            string executeCommand = "";

            if (databaseType == "mysql")
            {
                connectionType = "MySql.Data.MySqlClient.MySqlConnection";
                commandType = "MySql.Data.MySqlClient.MySqlCommand";
                openConnection = "connection.Open();";
                executeCommand = @"if (commandText.TrimStart().StartsWith(""SELECT"", StringComparison.OrdinalIgnoreCase))
                             {
                                 using (var reader = command.ExecuteReader())
                                 {
                                     var dataTable = new DataTable();
                                     dataTable.Load(reader);
                                     return dataTable;
                                 }
                             }
                             else
                             {
                                 var rowsAffected = command.ExecuteNonQuery();
                                 Console.WriteLine($""Total {rowsAffected} numbers of records were affected"");
                                 return null;
                             }";
            }
            else if (databaseType == "SqlServer")// Default to SQL Server
            {
                connectionType = "System.Data.SqlClient.SqlConnection";
                commandType = "System.Data.SqlClient.SqlCommand";
                openConnection = "connection.Open();";
                executeCommand = @"if (commandText.TrimStart().StartsWith(""SELECT"", StringComparison.OrdinalIgnoreCase))
                             {
                                 using (var reader = command.ExecuteReader())
                                 {
                                     var dataTable = new DataTable();
                                     dataTable.Load(reader);
                                     return dataTable;
                                 }
                             }
                             else
                             {
                                 var rowsAffected = command.ExecuteNonQuery();
                                 Console.WriteLine($""Total {rowsAffected} numbers of records were affected"");
                                 return null;
                             }";
            }

            return $@"using System;
             using System.Collections.Generic;
             using System.Data;
             using System.Text;
             using System.IO;
             {(databaseType == "mysql" ? "using MySql.Data.MySqlClient;" : "using System.Data.SqlClient;")}

             namespace DynamicNamespace
             {{
                 public class DynamicClass
                 {{
                     public DataTable DynamicMethod()
                     {{
                         using (var connection = new {connectionType}(""{connectionString}""))
                         {{
                             {openConnection}
                             var commandText = @""{query}"";
                             using (var command = new {commandType}(commandText, connection))
                             {{
                                 {executeCommand}
                             }}
                         }}
                     }}
                 }}
             }}";
        }
        
       
        //To Execuete ADO DOT NET CODE
        public static string GenarateCSharpCodeForQueryToExecute(string InlineCodeCsharp)
        {
          
            return $@"using System;
             using System.Collections.Generic;
             using System.Data;
             using System.Text;
             using System.IO;
             using MySql.Data.MySqlClient;
             using System.Data.SqlClient;
             using Oracle.ManagedDataAccess.Client;
             
             namespace DynamicNamespace
             {{
                 public class DynamicClass
                 {{
                     public DataTable DynamicMethod()
                     {{
                         
                             {{
                                 {InlineCodeCsharp}
                             }}
                         
                     }}
                 }}
             }}";
        }
        
        
        
        
        //To Execute API Code
        public static string GenarateCSharpCodeForAPIToExecute(string customCode)
        {
            return $@"using System;
            using System.Net.Http;
            using System.Threading.Tasks;
            using Newtonsoft.Json;
            using System.Data;

            namespace DynamicNamespace
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

        
        
        public static void SaveModelClassToFile(string classCode, string filePath)
        {
            System.IO.File.WriteAllText(filePath, classCode);
        }

        private static string GetCSharpType(Type type)
        {
            switch (Type.GetTypeCode(type))
            {
                case TypeCode.Boolean: return "bool";
                case TypeCode.Byte: return "byte";
                case TypeCode.Char: return "char";
                case TypeCode.DateTime: return "DateTime";
                case TypeCode.Decimal: return "decimal";
                case TypeCode.Double: return "double";
                case TypeCode.Int16: return "short";
                case TypeCode.Int32: return "int";
                case TypeCode.Int64: return "long";
                case TypeCode.String: return "string";
                default: return "object";
            }
        }



        public static (string ClassCode, List<ColumnDetails> ListOfProperties) GenerateModelClassCode(DataTable dataTable)
        {
            var className = "ResultModel";
            var sb = new StringBuilder();
            var columnNames = new List<string>();
            List<ColumnDetails> ListOfProperties = new List<ColumnDetails>();

            sb.AppendLine("public class " + className);
            sb.AppendLine("{");
            foreach (DataColumn column in dataTable.Columns)
            {
                ColumnDetails CD = new ColumnDetails();


                var columnName = column.ColumnName;
                var columnType = GetCSharpType(column.DataType);
                CD.Column_Name = columnName;
                CD.Column_Type = columnType;

                sb.AppendLine($"    public {columnType} {columnName} {{ get; set; }}");
                ListOfProperties.Add(CD);

            }
            sb.AppendLine("}");

            return (sb.ToString(), ListOfProperties);
        }

        public static string CreateTableInDataBase(string Target_connectionString, string TableName, List<Destination> List_DestinationColumnType = null)
        {
            try
            {


                using (var connection = new SqlConnection(Target_connectionString))
                {
                    connection.Open();
                    using (var bulkCopy = new SqlBulkCopy(connection))
                    {


                        // Create the destination table in the new database
                        StringBuilder Query = new StringBuilder();
                        Query.AppendLine($"CREATE TABLE [{TableName}] (");

                        for (int i = 0; i < List_DestinationColumnType.Count; i++)
                        {
                            Destination column = List_DestinationColumnType[i];

                            Query.AppendLine($"[{column.ColumnName}] {GetSqlDataTypeCSharp(column.Type)}{(i < List_DestinationColumnType.Count - 1 ? "," : "")}");
                        }

                        Query.AppendLine(");");


                        //return sb.ToString();



                        return Query.ToString();
                        ////var createTableQuery = GenerateCreateTableQuery(List_NewColumnNameWithType, TableName);

                        //using (var command = new SqlCommand(Query.ToString(), connection))
                        //{
                        //    command.ExecuteNonQuery();
                        //}



                    }

                }
                return "Success";
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //New Table Create
        public static List<string> ExportTableInBatches(DataTable tableViewData, string Target_connectionString, string TableName, List<Source> List_NewColumnNameWithType = null)
        {
            List<string> outputMessages = new List<string>();

            using (var connection = new SqlConnection(Target_connectionString))
            {
                connection.Open();
                using (var bulkCopy = new SqlBulkCopy(connection))
                {
                    bulkCopy.DestinationTableName = TableName;

                    try
                    {
                        // Create the destination table in the new database

                        var createTableQuery = GenerateCreateTableQuery(List_NewColumnNameWithType, TableName);

                        using (var command = new SqlCommand(createTableQuery, connection))
                        {
                            command.ExecuteNonQuery();
                        }

                        // Export the data in batches of 4000 records
                        var chunks = tableViewData.AsEnumerable().ToChunks(4000)
                                                  .Select(rows => rows.CopyToDataTable());

                        foreach (var tableChunk in chunks)
                        {
                            bulkCopy.WriteToServer(tableChunk);
                            // outputMessages.Add("<span style='color:green;'> " + tableChunk.Rows.Count + " records were exported successfully. </span>");
                            outputMessages.Add(tableChunk.Rows.Count + " records were exported successfully");
                        }
                        //15 records were exported successfully.

                        //outputMessages.Add("<span style='color:green;'>Whole Table exported successfully With Name: " + TableName + " in Target Server</span>");
                        outputMessages.Add("Whole Table exported successfully With Name: " + TableName + " in Target Server");
                        return outputMessages;
                    }
                    catch (Exception ex)
                    {
                        outputMessages.Add("<span style='color:red;'>Error exporting table: " + ex.Message + "</span>");
                        return outputMessages;
                    }
                }
            }
        }

        //Existing Table Use
        public static List<string> ExportTableInBatchesExisting1(DataTable tableViewData, string Target_connectionString, string TableName, List<Mapping> MapppingData)
        {





            List<string> outputMessages = new List<string>();

            using (var connection = new SqlConnection(Target_connectionString))
            {
                connection.Open();
                using (var bulkCopy = new SqlBulkCopy(connection))
                {
                    bulkCopy.DestinationTableName = TableName;

                    try
                    {
                        //// Create the destination table in the new database
                        //var createTableQuery = GenerateCreateTableQuery(tableViewData, TableName);
                        //using (var command = new SqlCommand(createTableQuery, connection))
                        //{
                        //    command.ExecuteNonQuery();
                        //}



                        // Export the data in batches of 4000 records
                        var chunks = tableViewData.AsEnumerable().ToChunks(4000)
                                                  .Select(rows => rows.CopyToDataTable());

                        foreach (var tableChunk in chunks)
                        {
                            bulkCopy.WriteToServer(tableChunk);
                            outputMessages.Add("<span style='color:green;'> " + tableChunk.Rows.Count + " records were exported successfully. </span>");
                        }
                        //15 records were exported successfully.

                        outputMessages.Add("<span style='color:green;'>Whole Table exported successfully With Name: " + TableName + " in Target Server</span>");
                        return outputMessages;
                    }
                    catch (Exception ex)
                    {
                        outputMessages.Add("<span style='color:red;'>Error exporting table: " + ex.Message + "</span>");
                        return outputMessages;
                    }
                }
            }
        }

        public static List<string> ExportTableInBatchesExisting(DataTable tableViewData, string Target_connectionString, string TableName, List<Mapping> MappingData)
        {
            try
            {


                List<string> outputMessages = new List<string>();

                // Create a new DataTable with the desired column order based on MappingData
                DataTable reorderedTable = new DataTable();
                foreach (var mapping in MappingData)
                {
#pragma warning disable CS8602 // Dereference of a possibly null reference.
                    reorderedTable.Columns.Add(mapping.Destination.ColumnName, tableViewData.Columns[mapping.Source.FieldName].DataType);
#pragma warning restore CS8602 // Dereference of a possibly null reference.
                }

                // Copy data from the original DataTable to the new DataTable in the desired order
                foreach (DataRow row in tableViewData.Rows)
                {
                    DataRow newRow = reorderedTable.NewRow();
                    foreach (var mapping in MappingData)
                    {
                        newRow[mapping.Destination.ColumnName] = row[mapping.Source.FieldName];
                    }
                    reorderedTable.Rows.Add(newRow);
                }

                using (var connection = new SqlConnection(Target_connectionString))
                {
                    connection.Open();
                    using (var bulkCopy = new SqlBulkCopy(connection))
                    {
                        bulkCopy.DestinationTableName = TableName;

                        // Add column mappings
                        foreach (var mapping in MappingData)
                        {
                            bulkCopy.ColumnMappings.Add(mapping.Destination.ColumnName, mapping.Destination.ColumnName);
                        }

                        try
                        {
                            // Export the data in batches of 4000 records
                            var chunks = reorderedTable.AsEnumerable().ToChunks(4000)
                                                       .Select(rows => rows.CopyToDataTable());

                            foreach (var tableChunk in chunks)
                            {
                                bulkCopy.WriteToServer(tableChunk);
                                outputMessages.Add("<span style='color:green;'> " + tableChunk.Rows.Count + " records were exported successfully. </span>");
                            }

                            outputMessages.Add("<span style='color:green;'>Whole Table exported successfully With Name: " + TableName + " in Target Server</span>");
                            return outputMessages;
                        }
                        catch (Exception ex)
                        {
                            outputMessages.Add("<span style='color:red;'>Error exporting table: " + ex.Message + "</span>");
                            return outputMessages;
                        }
                    }
                }
            }
            catch (Exception ex) { throw ex; }

        }



        private static string GenerateCreateTableQuery(List<Source> List_NewColumnNameWithType, string TableName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine($"CREATE TABLE [{TableName}] (");

            for (int i = 0; i < List_NewColumnNameWithType.Count; i++)
            {
                Source column = List_NewColumnNameWithType[i];
                sb.AppendLine($"[{column.FieldName}] {GetSqlDataTypeCSharp(column.DataType)}{(i < List_NewColumnNameWithType.Count - 1 ? "," : "")}");
            }

            sb.AppendLine(");");

            return sb.ToString();
        }
        private static string GetSqlDataType(Type type)
        {
            if (type == typeof(int)) return "INT";
            if (type == typeof(string)) return "NVARCHAR(MAX)";
            if (type == typeof(DateTime)) return "DATETIME";
            if (type == typeof(bool)) return "BIT";
            if (type == typeof(decimal)) return "DECIMAL(18,2)";
            // Add other type mappings as needed
            return "NVARCHAR(MAX)";
        }
        private static string GetSqlDataTypeCSharp(string typeName)
        {

            // Handle known SQL data types
            if (typeName.ToLower() == "int") return "INT";
            if (typeName.ToLower() == "string") return "NVARCHAR(MAX)";
            if (typeName.ToLower() == "datetime") return "DATETIME";
            if (typeName.ToLower() == "bool") return "BIT";
            if (typeName.ToLower() == "decimal") return "DECIMAL(18,2)";
            if (typeName.ToLower() == "float") return "REAL";
            if (typeName.ToLower() == "double") return "FLOAT";
            if (typeName.ToLower() == "byte") return "TINYINT";
            if (typeName.ToLower() == "short") return "SMALLINT";
            if (typeName.ToLower() == "long") return "BIGINT";
            if (typeName.ToLower() == "Guid") return "UNIQUEIDENTIFIER";
            // Add other type mappings as needed

            return "NVARCHAR(MAX)"; // Default SQL data type if typeName does not match any known type
        }

        public static string DataTableToHtml(DataTable dataTable)
        {
            if (dataTable != null)
            {


                StringBuilder html = new StringBuilder();

                html.Append("<table class='table'>");
                html.Append("<thead>");
                html.Append("<tr>");
                foreach (DataColumn column in dataTable.Columns)
                {
                    html.Append("<th>").Append(column.ColumnName).Append("</th>");
                }
                html.Append("</tr>");
                html.Append("</thead>");
                html.Append("<tbody>");
                foreach (DataRow row in dataTable.Rows)
                {
                    html.Append("<tr>");
                    foreach (DataColumn column in dataTable.Columns)
                    {
                        html.Append("<td>").Append(row[column.ColumnName]).Append("</td>");
                    }
                    html.Append("</tr>");
                }
                html.Append("</tbody>");
                html.Append("</table>");

                return html.ToString();
            }
            else
            {
                return "";
            }
        }



        public static string GenerateInsertSelectQuery(List<Mapping> mappings)
        {
            // Assuming the target table name and columns are determined from the mappings
            if (mappings.Count == 0) return string.Empty;

            // Extract the table name from the first destination mapping (assuming all rows have the same table)
            string targetTable = mappings[0].Destination.TableName;

            // Construct the column names and source columns
            List<string> targetColumns = new List<string>();
            List<string> sourceColumns = new List<string>();

            foreach (var mapping in mappings)
            {
                targetColumns.Add(mapping.Destination.ColumnName);
                sourceColumns.Add(mapping.Source.FieldName);
            }

            // Generate the SQL query
            StringBuilder queryBuilder = new StringBuilder();
            queryBuilder.Append($"INSERT INTO {targetTable} (");
            queryBuilder.Append(string.Join(", ", targetColumns));
            queryBuilder.Append(")\nSELECT ");
            queryBuilder.Append(string.Join(", ", sourceColumns));
            queryBuilder.Append("\nFROM tblDtlEmployee;"); // Replace 'source_table' with actual source table name if known

            return queryBuilder.ToString();
        }


        public static string GenerateCreateTableScript(string TableName, List<Destination> List_DestinationColumnType)
        {
            try
            {
                StringBuilder Query = new StringBuilder();
                Query.AppendLine($"CREATE TABLE [{TableName}] (");

                for (int i = 0; i < List_DestinationColumnType.Count; i++)
                {
                    Destination column = List_DestinationColumnType[i];
                    StringBuilder columnDefinition = new StringBuilder();
                    columnDefinition.Append($"[{column.ColumnName}] {GetSqlDataTypeCSharp(column.Type)}");

                    if (!string.IsNullOrEmpty(column.constraints))
                    {
                        if (column.constraints.Contains("Identity"))
                        {
                            columnDefinition.Append(" IDENTITY(1,1)");
                        }
                        if (column.constraints.Contains("Primary"))
                        {
                            columnDefinition.Append(" PRIMARY KEY");
                        }
                        if (column.constraints.Contains("Null"))
                        {
                            columnDefinition.Append(" NULL");
                        }
                        else
                        {
                            columnDefinition.Append(" NOT NULL");
                        }
                    }
                    else
                    {
                        columnDefinition.Append(" NOT NULL");
                    }

                    if (i < List_DestinationColumnType.Count - 1)
                    {
                        columnDefinition.Append(",");
                    }

                    Query.AppendLine(columnDefinition.ToString());
                }

                Query.AppendLine(");");
                return Query.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static string GenerateCreateTableScript1(string TableName, List<Destination> List_DestinationColumnType)
        {
            try
            {
                StringBuilder Query = new StringBuilder();
                Query.AppendLine($"CREATE TABLE [{TableName}] (");

                for (int i = 0; i < List_DestinationColumnType.Count; i++)
                {
                    Destination column = List_DestinationColumnType[i];

                    Query.AppendLine($"[{column.ColumnName}] {GetSqlDataTypeCSharp(column.Type)}{(i < List_DestinationColumnType.Count - 1 ? "," : "")}");
                }

                Query.AppendLine(");");
                return Query.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}





