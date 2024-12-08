using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.CompilerServices;

using NetReportBuilder.ReportSource.Model;
using NetReportBuilder.ReportSource.Api;
using System.Data;
using System.Reflection;


namespace NetReportBuilder.ReportSource.Utility
{
    public static class Extensions
    {
        public static DatabaseInterpreter.Model.ConnectionInfo CreateConnectionInfo(this ServerInfoInput serverInfoInput)
        {
            DatabaseInterpreter.Model.ConnectionInfo connectionInfo = new DatabaseInterpreter.Model.ConnectionInfo()
            {

                Server = serverInfoInput.Host,
                Port = serverInfoInput.Port.ToString(),
                IntegratedSecurity = serverInfoInput.Authentication != DatabaseManager.Model.AuthenticationType.Password.ToString(),
                UserId = serverInfoInput.UserId,
                Password = serverInfoInput.Password,
                Database = serverInfoInput.DataBase
            };


            return connectionInfo;

        }


        public static DatabaseInterpreter.Model.ConnectionInfo CreateConnectionInfoServer(this DatabaseInfoInput databaseInfoInput)
        {
            DatabaseInterpreter.Model.ConnectionInfo connectionInfo = new DatabaseInterpreter.Model.ConnectionInfo()
            {

                Server = databaseInfoInput.Host,
                Port = databaseInfoInput.Port.ToString(),
                IntegratedSecurity = databaseInfoInput.Authentication != DatabaseManager.Model.AuthenticationType.Password.ToString(),
                UserId = databaseInfoInput.UserId,
                Password = databaseInfoInput.Password,
                //Database = serverInfoInput.DataBase
            };


            return connectionInfo;

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
        private static T CreateItemFromRow<T>(DataRow row, List<PropertyInfo> properties) where T : new()
        {
            T item = new T();
            foreach (var property in properties)
            {
                if (row.Table.Columns.Contains(property.Name))
                {
                    if (row[property.Name] != DBNull.Value)
                        property.SetValue(item, row[property.Name], null);
                }
            }
            return item;
        }
        public static T ConvertFromDataRow<T>(this DataRow row) where T : new()
        {
            T item = new T();
            List<PropertyInfo> properties = typeof(T).GetProperties().ToList();

            foreach (var property in properties)
            {
                if (row.Table.Columns.Contains(property.Name))
                {
                    if (row[property.Name] != DBNull.Value)
                        property.SetValue(item, row[property.Name], null);
                }
            }
            return item;
        }
        public static List<T> ToList<T>(this DataTable table) where T : new()
        {
            List<PropertyInfo> properties = typeof(T).GetProperties().ToList();
            List<T> results = new();

            foreach (var row in table.Rows)
            {
                var item = CreateItemFromRow<T>((DataRow)row, properties);
                results.Add(item);
            }
            return results;
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

    }
}
