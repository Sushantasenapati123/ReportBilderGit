using DatabaseConfiguration.Models.DatabaseConfiguration;
using MySql.Data.MySqlClient;
using NetReportBuilder.Etl.Model;
using NetReportBuilder.Etl.Model.ViewModel;
using NetReportBuilder.ReportSource.Model;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Core
{
    public static class CommonExtensionMethods
    {
        private const string EncryptionDecryptionkey = "b14ca5898a4e4133bbce2ea2315a1916";
        public static string EncryptString(this string input)
        {
            return AesOperations.EncryptString(EncryptionDecryptionkey, input);
        }
        public static string DecryptString(this string input)
        {
            return AesOperations.DecryptString(EncryptionDecryptionkey, input);
        }
        public static bool IsJson(this string content)
        {
            return content.Trim().StartsWith("{") && content.EndsWith("}")
                        || content.StartsWith("[") && content.EndsWith("]");
        }
        public static string GenerateUrlParameters(this Dictionary<string, string> parameters)
        {
            StringBuilder parameterList = new StringBuilder();
            parameterList.Append("/");
            foreach (var obb in parameters)
            {
                parameterList.Append($"{obb.Value},");
            }
            return parameterList.ToString().TrimEnd(',');
        }
        public static string GenerateQueryParameters(this Dictionary<string, string> parameters)
        {
            StringBuilder parameterList = new StringBuilder();
            parameterList.Append("?");
            foreach (var obb in parameters)
            {
                parameterList.Append($"{obb.Key}={obb.Value}&");
            }
            return parameterList.ToString().TrimEnd('&');
        }
        //Method for the Querystring in cntrler
        public static string GenerateQueryParameter(this Dictionary<string, string> parameters)
        {
            StringBuilder parameterList = new StringBuilder();
            parameterList.Append("?"); ;
            foreach (var obb in parameters)
            {
                //parameterList.Append($"{obb.Key}={obb.Value}&");
                // parameterList.Append(obb.Key + "=" + "{" + obb.Key +"}"+"&");
                parameterList.Append(obb.Key + "=" + "{" + obb.Key + "}&");
            }
            // return parameterList.ToString();
            return parameterList.ToString().TrimEnd('&');
        }
        public static string GenerateQueryParameterurlparams(this Dictionary<string, string> parameters)
        {
            StringBuilder parameterList = new StringBuilder();
            parameterList.Append("/"); ;
            foreach (var obb in parameters)
            {
                //parameterList.Append($"{obb.Key}={obb.Value}&");
                // parameterList.Append(obb.Key + "=" + "{" + obb.Key +"}"+"&");
                parameterList.Append( "{" + obb.Key + "},");
            }
            // return parameterList.ToString();
            return parameterList.ToString().TrimEnd(',');
        }

        public static int ParseToInteger(this string str)
        {
            if (int.TryParse(str, out int result)) return result;
            return 0;
        }
        public static int ParseToInteger(this Object obj)
        {
            if (obj == null) return -1;
            if (int.TryParse(obj.ParseToText(), out int result)) return result;
            return -1;
        }
        public static string ParseToText(this Object obj)
        {
            if (obj == null)
                return string.Empty;
            return Convert.ToString(obj);
        }
        public static string ConvertToString(this object item)
        {
            if (item == null || item == DBNull.Value)
            {
                return "&nbsp;"; // display empty cell
            }
            else if (item is DateTime)
            {
                return ((DateTime)item).ToString("yyyy-MM-dd HH:mm:ss"); // format DateTime
            }
            else
            {
                return item.ToString(); // default conversion to string
            }
        }

        public static string ParseToHtml(this DataSet dataSet)
        {
            // Initialize StringBuilder for building HTML
            StringBuilder htmlBuilder = new StringBuilder();

            // Start building HTML
            htmlBuilder.Append("<html><head><title>Dataset to HTML</title>");
            htmlBuilder.Append("<style>");
            htmlBuilder.Append("table { border-collapse: collapse; width: 100%; }");
            htmlBuilder.Append("table, th, td { border: 1px solid black; }");
            htmlBuilder.Append("th, td { padding: 8px; text-align: left; }");
            htmlBuilder.Append("th { background-color: #f2f2f2; }");
            htmlBuilder.Append("</style>");
            htmlBuilder.Append("</head><body>");

            // Iterate through each DataTable in the DataSet
            foreach (DataTable table in dataSet.Tables)
            {
                // Add table header with table name
                htmlBuilder.Append("<h2>" + table.TableName + "</h2>");

                // Start building HTML table
                htmlBuilder.Append("<table>");

                // Add headers
                htmlBuilder.Append("<tr>");
                foreach (DataColumn column in table.Columns)
                {
                    htmlBuilder.Append("<th>" + column.ColumnName + "</th>");
                }
                htmlBuilder.Append("</tr>");

                // Add rows
                foreach (DataRow row in table.Rows)
                {
                    htmlBuilder.Append("<tr>");
                    foreach (object item in row.ItemArray)
                    {
                        htmlBuilder.Append("<td>" + item.ConvertToString() + "</td>");
                    }
                    htmlBuilder.Append("</tr>");
                }

                // End table
                htmlBuilder.Append("</table>");
            }

            // End building HTML
            htmlBuilder.Append("</body></html>");

            // Return the generated HTML
            return htmlBuilder.ToString();
        }

        public static int ParseInt(this string input)
        {
            if (int.TryParse(input, out int output))
            {
                return output;
            }
            return -1;
        }
        public static string NullifEmpty(this string input)
        {
            return input.NullIf(x => string.IsNullOrEmpty(x) || x.Trim().Length <= 0);
        }
        public static T NullIf<T>(this T @this, Func<T, bool> predicate) where T : class
        {
            if (predicate(@this))
            {
                return null;
            }
            return @this;
        }
        public static IEnumerable<IEnumerable<T>> ToChunks<T>(this IEnumerable<T> enumerable, int chunkSize)
        {
            int itemsReturned = 0;
            var list = enumerable.ToList(); // Prevent multiple execution of IEnumerable.
            int count = list.Count;
            while (itemsReturned < count)
            {
                int currentChunkSize = Math.Min(chunkSize, count - itemsReturned);
                yield return list.GetRange(itemsReturned, currentChunkSize);
                itemsReturned += currentChunkSize;
            }
        }

        public static byte[] SerializeToByteArray(PipelineConfigurationModel myObject)
        {
            // Convert the object to a JSON string


            string jsonString = System.Text.Json.JsonSerializer.Serialize(myObject);


            // Convert the JSON string to a byte array
            return System.Text.Encoding.UTF8.GetBytes(jsonString);
        }

        public static PipelineConfigurationModel RetrieveFromDatabase(byte[] serializedData)
        {
            //string connectionString = "Data Source=CSMBHUL954\\SQLEXPRESS;Initial Catalog=ReportBuilder;TrustServerCertificate=true;Integrated Security=true;";
            //string query = "SELECT SerializedData FROM MyClassTable WHERE Id = @Id;";

            //byte[] serializedData = null;

            //using (SqlConnection connection = new SqlConnection(connectionString))
            //{
            //    using (SqlCommand command = new SqlCommand(query, connection))
            //    {
            //        command.Parameters.Add("@Id", SqlDbType.Int).Value = id;

            //        connection.Open();
            //        using (SqlDataReader reader = command.ExecuteReader())
            //        {
            //            if (reader.Read())
            //            {
            //                serializedData = reader["SerializedData"] as byte[];
            //            }
            //        }
            //    }
            //}

            //if (serializedData != null)
            //{
            //    return DeserializeFromByteArray<MyClass>(serializedData);
            //}


            return DeserializeFromByteArray<PipelineConfigurationModel>(serializedData); ;
        }


        public static T DeserializeFromByteArray<T>(byte[] data)
        {
            if (data == null || data.Length == 0)
                return default(T);

            string jsonString = System.Text.Encoding.UTF8.GetString(data);
            return System.Text.Json.JsonSerializer.Deserialize<T>(jsonString);
        }


       
        
        public static string BuildConnectionString(AddDatabaseConfigurationsPipeline_Model serverInputsModel)
        {
            switch (serverInputsModel.DatabaseType?.ToLower())
            {
                case "sqlserver":
                    if (serverInputsModel.Authentication?.ToLower() == "integrated")
                    {
                        return $"Server={serverInputsModel.HostName};Database={serverInputsModel.DatabaseName};Integrated Security=True;";
                    }
                    else
                    {
                        return $"Server={serverInputsModel.HostName};Database={serverInputsModel.DatabaseName};User Id={serverInputsModel.UserName};Password={serverInputsModel.Password};";
                    }

                case "mysql":
                    return serverInputsModel.Authentication?.ToLower() == "integrated"
                        ? throw new NotSupportedException("Integrated security is not supported for MySQL.")
                        : $"Server={serverInputsModel.HostName};Port={serverInputsModel.Port};Database={serverInputsModel.DatabaseName};User={serverInputsModel.UserName};Password={serverInputsModel.Password};Connection Timeout=30";

                case "oracle":
                    if (serverInputsModel.Authentication?.ToLower() == "integrated")
                    {
                        // Oracle uses OS Authentication by specifying "/" as User ID and omitting the password
                        return $"Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST={serverInputsModel.HostName})(PORT={serverInputsModel.Port}))(CONNECT_DATA=(SERVICE_NAME={serverInputsModel.DatabaseName})));User Id=/;";
                    }
                    else
                    {
                        return $"Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST={serverInputsModel.HostName})(PORT={serverInputsModel.Port}))(CONNECT_DATA=(SERVICE_NAME={serverInputsModel.DatabaseName})));User Id={serverInputsModel.UserName};Password={serverInputsModel.Password};";
                    }

                default:
                    throw new NotSupportedException($"Database type {serverInputsModel.DatabaseType} is not supported.");
            }
        }

        public static bool TestDatabaseConnection(string connectionString, string databaseType)
        {
            try
            {
                switch (databaseType.ToLower())
                {
                    case "sqlserver":
                        using (var connection = new SqlConnection(connectionString))
                        {
                            connection.Open();
                            return true;
                        }

                    case "oracle":
                        using (var connection = new OracleConnection(connectionString))  // Requires Oracle.ManagedDataAccess
                        {
                            connection.Open();
                            return true;
                        }

                    case "mysql":
                        using (var connection = new MySqlConnection(connectionString))  // Requires MySql.Data package
                        {
                            connection.Open();
                            return true;
                        }

                    default:
                        throw new Exception("Unsupported database type");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Connection failed: " + ex.Message);
                return false;
            }
          
        }


        public static DataSet ExecuteQuery(string query, string connectionString, string databaseType)
        {
            DataSet dataTable = new DataSet();
            try
            {
                using (IDbConnection connection = CreateConnection(connectionString, databaseType))
                {
                    connection.Open();
                    using (IDbCommand command = connection.CreateCommand())
                    {
                        command.CommandText = query;

                        // Create data adapter
                        IDataAdapter adapter = CreateDataAdapter(command, databaseType);

                        // Fill DataTable
                        adapter.Fill(dataTable);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error executing query: " + ex.Message);
                // Handle exception (e.g., log the error, rethrow, or return an empty DataTable)
            }

            return dataTable;
        }

        private static IDbConnection CreateConnection(string connectionString, string databaseType)
        {
            switch (databaseType.ToLower())
            {
                case "sqlserver":
                    return new SqlConnection(connectionString);

                case "oracle":
                    return new OracleConnection(connectionString); // Requires Oracle.ManagedDataAccess

                case "mysql":
                    return new MySqlConnection(connectionString); // Requires MySql.Data

                default:
                    throw new Exception("Unsupported database type");
            }
        }

        private static IDataAdapter CreateDataAdapter(IDbCommand command, string databaseType)
        {
            switch (databaseType.ToLower())
            {
                case "sqlserver":
                    return new SqlDataAdapter((SqlCommand)command);

                case "oracle":
                    return new OracleDataAdapter((OracleCommand)command); // Requires Oracle.ManagedDataAccess

                case "mysql":
                    return new MySqlDataAdapter((MySqlCommand)command); // Requires MySql.Data

                default:
                    throw new Exception("Unsupported database type");
            }
        }

        public static string ReplaceLastOccurrence(string source, string oldValue, string newValue)
        {
            int place = source.LastIndexOf(oldValue);
            if (place == -1)
                return source;

            return source.Remove(place, oldValue.Length).Insert(place, newValue);
        }

    }
}
