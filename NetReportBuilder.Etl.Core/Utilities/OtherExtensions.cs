using Microsoft.AspNetCore.Builder;
using NetReportBuilder.Etl.Model;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Text.RegularExpressions;
using NetReportBuilder.Etl.Model.Data_Mapping;
using System.Runtime.CompilerServices;
using Microsoft.SqlServer.Server;
using System.Security.AccessControl;
using System.Globalization;
using FluentValidation.Validators;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using NetReportBuilder.Etl.Web.Models;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace NetReportBuilder.Etl.Core
{

    public static class OtherExtensions
    {
        public static List<SelectListItem> ConvertColumnsToSelectList(this DataColumnCollection columns)
        {
            try
            {
                List<SelectListItem> selectListItems = new List<SelectListItem>();

            foreach (DataColumn column in columns)
            {
                selectListItems.Add(new SelectListItem
                {
                    Value = column.ColumnName,
                    Text = column.ColumnName,
                    Selected = false
                });
            }

            return selectListItems;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public static DataTable SourceToDestination(this DataTable source, DataTable destination, List<MappingModel> mappingList)
        {
            try
            {
                foreach (DataRow dr in source.Rows)
            {
                var newRow = destination.NewRow();
                foreach (var mapping in mappingList)
                {
                    newRow[mapping.DestinationColumn] = dr[mapping.SourceColumn] ?? DBNull.Value;
                }
                destination.Rows.Add(newRow);
            }
            return destination;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public static string ModelMapping(this List<MappingModel> input)
        {
            try
            {
                StringBuilder sb = new StringBuilder();
            sb.Append("List<MappingModel> mapping = new List<MappingModel>()");
            sb.Append("{");
            foreach (var mappingModel in input)
            {
                sb.Append($"{{new MappingModel {{SourceColumn=\"{mappingModel.SourceColumn}\",DestinationColumn=\"{mappingModel.DestinationColumn}\" }}");
                sb.Append("},");
            }
            sb.Remove(sb.ToString().LastIndexOf(","), 1);
            sb.Append("};");
            return sb.ToString();
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static string ConvertToHttpContent(this ApiInfo apiConfiguration, ParameterType parameterType)
        {
            if (parameterType == ParameterType.Raw)
            {
                return $"new StringContent({apiConfiguration.RawBody},Encoding.UTF8,application/json)";
            }
            if (parameterType == ParameterType.FormData)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append("new MultipartFormDataContent();");

                foreach (var kvp in apiConfiguration.Parameters)
                {
                    sb.Append($"content.Add(new StringContent({kvp.Pvalue}), {kvp.Pkey}");
                }
                return sb.ToString();
            }


            throw new NotImplementedException();
        }
        public static string ConvertToApiParam(this Dictionary<string, string> parameters, ParameterType parameterType)
        {
            try
            {
                switch (parameterType)
            {
                case ParameterType.UrlParams:
                    return parameters.GenerateUrlParameters();
                    break;
                case ParameterType.QueryParams:
                    return parameters.GenerateQueryParameters();
                    break;
                case ParameterType.NoParameters:
                    return string.Empty;
                    break;
                default:
                    return string.Empty;
                    break;

            }
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        public static string DatasetToHtml(this DataSet dataSet)
        {
            try
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
            catch (Exception ex)
            {
                throw;
            }
        }



        private static string GetCSharpType(this Type type)
        {
            try
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
            catch (Exception ex)
            {
                throw;
            }
        }
        public static ClassDetail GenerateModelClassCode(this DataTable dataTable)
        {
            try
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
                    var columnType = column.DataType.GetCSharpType();
                    CD.Column_Name = columnName;
                    CD.Column_Type = columnType;

                    sb.AppendLine($"    public {columnType} {columnName} {{ get; set; }}");
                    ListOfProperties.Add(CD);

                }
                sb.AppendLine("}");

                return new ClassDetail { Schema = sb.ToString(), Fields = ListOfProperties };

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static string ConvertToJson(this DataTable dataTable)
        {
            try
            {
                if (dataTable == null)
                {
                    return string.Empty;
                }
                return Newtonsoft.Json.JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public static T ConvertToType<T>(this object obj)
        {
            try
            {
                if (obj == null)
                {
                    throw new ArgumentNullException(nameof(obj));
                }

                if (obj is T)
                {
                    return (T)obj; // Direct cast if possible
                }
                else
                {
                    // Handle case where obj cannot be directly cast to T
                    // This might involve custom conversion logic or throwing an exception
                    throw new InvalidCastException($"Cannot cast {obj.GetType().FullName} to {typeof(T).FullName}");
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        public static string DataTableToHtml(this DataTable dataTable)
        {
            try
            {
                if (dataTable is null)
                    return string.Empty;
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
            catch (Exception ex)
            {
                throw;
            }
        }

        public static (DataSet, StringBuilder) LoadXmlIntoDataSet(string xml)
        {
            DataSet dataSet = new DataSet();
            StringBuilder outputMessage = new StringBuilder();

            try
            {
                using (XmlReader xmlReader = XmlReader.Create(new StringReader(xml)))
                {
                    dataSet.Clear(); // Clear any existing data
                    dataSet.ReadXml(xmlReader); // Read XML into the DataSet
                }

                // Correct column data types based on the content
                foreach (DataTable table in dataSet.Tables)
                {
                    var newColumns = new List<DataColumn>();
                    var oldColumns = new List<DataColumn>();

                    // Determine new column types
                    foreach (DataColumn column in table.Columns)
                    {
                        bool isInt = true;
                        bool isDouble = true;

                        foreach (DataRow row in table.Rows)
                        {
                            if (row[column] != DBNull.Value)
                            {
                                string value = row[column].ToString();
                                if (!int.TryParse(value, out _))
                                {
                                    isInt = false;
                                }
                                if (!double.TryParse(value, out _))
                                {
                                    isDouble = false;
                                }
                            }
                        }

                        Type newType = column.DataType;
                        if (isInt)
                        {
                            newType = typeof(int);
                        }
                        else if (isDouble)
                        {
                            newType = typeof(double);
                        }

                        if (newType != column.DataType)
                        {
                            // Create a new column with the correct data type
                            DataColumn newColumn = new DataColumn(column.ColumnName + "_new", newType);
                            newColumns.Add(newColumn);
                            oldColumns.Add(column);
                        }
                    }

                    // Add new columns to the table
                    foreach (var newColumn in newColumns)
                    {
                        table.Columns.Add(newColumn);
                    }

                    // Copy data to new columns
                    foreach (DataRow row in table.Rows)
                    {
                        foreach (var oldColumn in oldColumns)
                        {
                            var newColumn = table.Columns[oldColumn.ColumnName + "_new"];
                            row[newColumn] = Convert.ChangeType(row[oldColumn], newColumn.DataType);
                        }
                    }

                    // Remove old columns and rename new columns
                    foreach (var oldColumn in oldColumns)
                    {
                        var newColumn = table.Columns[oldColumn.ColumnName + "_new"];
                        table.Columns.Remove(oldColumn);
                        newColumn.ColumnName = oldColumn.ColumnName;
                    }
                }

                outputMessage.Append("XML data successfully loaded into DataSet.");
            }
            catch (Exception ex)
            {
                outputMessage.Append($"<span style='color:red;'>{ex.Message}</span>");
            }

            return (dataSet, outputMessage);

        }

        public static string JsonArrayToHtml(this JArray jsonArray)
        {
            try
            {
                StringBuilder html = new StringBuilder();

                html.Append("<table class='table'>");
                html.Append("<thead>");
                html.Append("<tr>");

                // Get column names from the first object in the array
                JObject firstObject = (JObject)jsonArray[0];
                foreach (var property in firstObject.Properties())
                {
                    html.Append("<th>").Append(property.Name).Append("</th>");
                }

                html.Append("</tr>");
                html.Append("</thead>");
                html.Append("<tbody>");

                foreach (JObject jsonObject in jsonArray)
                {
                    html.Append("<tr>");

                    foreach (var property in jsonObject.Properties())
                    {
                        html.Append("<td>").Append(property.Value).Append("</td>");
                    }

                    html.Append("</tr>");
                }

                html.Append("</tbody>");
                html.Append("</table>");

                return html.ToString();
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        public static string GetSqlType(this JTokenType type)
        {
            return type switch
            {
                JTokenType.Integer => "INT",
                JTokenType.Float => "FLOAT",
                JTokenType.String => "NVARCHAR(MAX)",
                JTokenType.Boolean => "BIT",
                JTokenType.Date => "DATETIME",
                _ => "NVARCHAR(MAX)"
            };
        }

        public static (List<string> Model, StringBuilder Ss) ProcessJsonData(string jsonFilePath, string className)
        {

            List<string> MODEL = new List<string>();
            StringBuilder ss = new StringBuilder();
            try
            {
                string jsonData = jsonFilePath; /*File.ReadAllText(jsonFilePath);*/
                JToken token = JToken.Parse(jsonData);

                if (token.Type.ToString().ToLower() == "object")
                {
                    JArray array = new JArray(token);
                    jsonData = array.ToString();
                }

                List<dynamic> dynamicList = JsonConvert.DeserializeObject<List<dynamic>>(jsonData);
                List<Tuple<string, string, dynamic>> Records = new List<Tuple<string, string, dynamic>>();

                foreach (var dynamicObjectList in dynamicList)
                {
                    foreach (var item in dynamicObjectList)
                    {
                        string Type = item.Value.Type == null ? "object" : item.Value.Type.ToString();
                        string Name = item.Name.ToString();
                        dynamic Value = item.Value;

                        // Check if a tuple with the same key already exists in Records
                        var existingTuple = Records.FirstOrDefault(t => t.Item2 == Name);

                        if (existingTuple != null)
                        {
                            // Update the existing tuple with new data
                            if (Type.ToLower() != "null")
                            {
                                if (Type.ToLower() == "array")
                                {
                                    dynamic childTuple = ProcessNestedArray(Value);
                                    Records[Records.IndexOf(existingTuple)] = new Tuple<string, string, dynamic>(Type, Name, childTuple);
                                }
                                else if (Type.ToLower() == "object")
                                {
                                    dynamic childTuple = ProcessNestedObject(Value);
                                    Records[Records.IndexOf(existingTuple)] = new Tuple<string, string, dynamic>(Type, Name, childTuple);
                                }
                                else
                                {
                                    Records[Records.IndexOf(existingTuple)] = new Tuple<string, string, dynamic>(Type, Name, item.Value.Value);
                                }
                            }
                        }
                        else
                        {
                            // Add a new tuple if a tuple with the same key does not exist
                            if (Type.ToLower() == "array")
                            {
                                dynamic childTuple = ProcessNestedArray(Value);
                                Records.Add(new Tuple<string, string, dynamic>(Type, Name, childTuple));
                            }
                            else if (Type.ToLower() == "object")
                            {
                                dynamic childTuple = ProcessNestedObject(Value);
                                Records.Add(new Tuple<string, string, dynamic>(Type, Name, childTuple));
                            }
                            else
                            {
                                Records.Add(new Tuple<string, string, dynamic>(Type, Name, item.Value.Value));
                            }
                        }
                    }
                }


                List<List<Tuple<string, List<Tuple<string, string>>>>> dict = ProcessRecords(Records);
                dict = MergeAndRemoveDuplicates(dict);
                dict.Reverse();

                if (dict.Count > 0)
                {
                    foreach (var nestedList in dict)
                    {
                        foreach (var pair in nestedList)
                        {
                            StringBuilder nsb = new StringBuilder();

                            string ClassName = "";//pair.Item1;
                            if (pair.Item1 == "" || pair.Item1 == null)
                            {
                                ClassName = className + "_BindTableAdd";
                            }
                            else
                            {
                                ClassName = pair.Item1;
                            }

                            foreach (var propitem in pair.Item2)
                            {
                                string Name = propitem.Item1;
                                string Type = propitem.Item2;
                                nsb.Append(Type.GetPropertyString(Name));
                            }

                            string entity = nsb.ConvertToEntity(ClassName);
                            ss.Append(entity);

                            MODEL.Add(entity);


                        }
                    }
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return (MODEL, ss);
        }

        public static DataTable ConvertJsonToDataTable(this string json)
        {

            DataTable dataTable = new DataTable();

            try
            {
                // Parse the JSON array
                JArray jsonArray = JArray.Parse(json);

                // Determine the columns dynamically based on the JSON properties
                foreach (JToken token in jsonArray)
                {
                    foreach (JProperty property in token)
                    {
                        // Check if column already exists
                        if (!dataTable.Columns.Contains(property.Name))
                        {
                            // Add column if it doesn't exist
                            Type columnType = property.Value.GetType();
                            dataTable.Columns.Add(property.Name, Nullable.GetUnderlyingType(columnType) ?? columnType);
                        }
                    }
                }

                // Populate the DataTable
                foreach (JToken token in jsonArray)
                {
                    DataRow row = dataTable.NewRow();
                    foreach (JProperty property in token)
                    {
                        row[property.Name] = property.Value.ToObject(dataTable.Columns[property.Name].DataType);
                    }
                    dataTable.Rows.Add(row);
                }
            }
            catch (Exception ex)
            {
                // Handle exception or log it
                Console.WriteLine($"Error converting JSON to DataTable: {ex.Message}");
                // Optionally, rethrow the exception or return null/empty DataTable
                throw;
            }

            return dataTable;
        }

        public static List<List<Tuple<string, List<Tuple<string, string>>>>> ProcessRecords(List<Tuple<string, string, dynamic>> records, int level = 1, string keyname = "")
        {
            try
            {
                List<List<Tuple<string, List<Tuple<string, string>>>>> result = new List<List<Tuple<string, List<Tuple<string, string>>>>>();
                List<Tuple<string, List<Tuple<string, string>>>> currentList = new List<Tuple<string, List<Tuple<string, string>>>>();
                List<Tuple<string, string>> props = new List<Tuple<string, string>>();

                foreach (var record in records)
                {
                    string Type = record.Item1;
                    string Name = record.Item2;
                    dynamic Value = record.Item3;

                    if (Type.ToLower() == "array")
                    {
                        props.Add(new Tuple<string, string>(Name, Value.Count > 0 ? Type : "listobj"));
                        if (Value.Count > 0)
                        {
                            string arrayMemType = Value[0].GetType().BaseType.Name.ToString();
                            if (arrayMemType.ToLower() != "jtoken")
                            {
                                var res = ProcessRecords(Value, level + 1, Name);
                                result.AddRange(res);

                            }
                            else
                            {
                                var existingTuple = props.FirstOrDefault(x => x.Item1 == Name);
                                string memtype = Value.First.Type.ToString().ToLower();
                                props[props.IndexOf(existingTuple)] = new Tuple<string, string>(Name, "List" + memtype);
                            }
                        }
                    }
                    else if (Type.ToLower() == "object")
                    {
                        props.Add(new Tuple<string, string>(Name, Type));
                        var res = ProcessRecords(Value, level + 1, Name);
                        result.AddRange(res);
                    }
                    else
                    {
                        props.Add(new Tuple<string, string>(Name, Type));
                    }
                }
                currentList.Add(new Tuple<string, List<Tuple<string, string>>>(keyname, props));
                result.Add(currentList);

                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public static dynamic ProcessNestedArray(dynamic array, int depth = 1)
        {
            try
            {
                List<dynamic> nestedRecords = new List<dynamic>();
                List<Tuple<string, string, dynamic>> Records = new List<Tuple<string, string, dynamic>>();
                foreach (var nestedItem in array)
                {
                    foreach (var item in nestedItem)
                    {
                        string Type = item.Value.Type == null ? "object" : item.Value.Type.ToString();
                        string Name = item.Name.ToString();
                        dynamic Value = item.Value;

                        var existingTuple = Records.FirstOrDefault(t => t.Item2 == Name);
                        if (existingTuple != null)
                        {
                            if (Type.ToLower() != "null")
                            {
                                if (Type.ToLower() == "array")
                                {
                                    string arrayValueType = item.Value.First.Type == null ? "object" : item.Value.First.Type.ToString();
                                    if (arrayValueType.ToLower() == "string" || arrayValueType.ToLower() == "integer" ||
                                    arrayValueType.ToLower() == "float" || arrayValueType.ToLower() == "decimal")
                                    {
                                        Records[Records.IndexOf(existingTuple)] = new Tuple<string, string, dynamic>(Type, Name, Value);
                                    }
                                    // Recursively process nested arrays
                                    else
                                    {
                                        Records[Records.IndexOf(existingTuple)] = new Tuple<string, string, dynamic>(Type, Name, ProcessNestedArray(Value, depth + 1));
                                    }
                                }
                                else if (Type.ToLower() == "object")
                                {
                                    Records[Records.IndexOf(existingTuple)] = new Tuple<string, string, dynamic>(Type, Name, ProcessNestedObject(Value));
                                }
                                else
                                {
                                    Records[Records.IndexOf(existingTuple)] = new Tuple<string, string, dynamic>(Type, Name, item.Value.Value);
                                }
                            }
                        }
                        else
                        {
                            if (Type.ToLower() == "array")
                            {

                                string arrayValueType = item.Value.First.Type == null ? "object" : item.Value.First.Type.ToString();
                                if (arrayValueType.ToLower() == "string" || arrayValueType.ToLower() == "integer" ||
                                    arrayValueType.ToLower() == "float" || arrayValueType.ToLower() == "decimal")
                                {
                                    Records.Add(new Tuple<string, string, dynamic>(Type, Name, Value));
                                }
                                else
                                {
                                    // Recursively process nested arrays
                                    Records.Add(new Tuple<string, string, dynamic>(Type, Name, ProcessNestedArray(Value, depth + 1)));
                                }
                            }
                            else if (Type.ToLower() == "object")
                            {
                                Records.Add(new Tuple<string, string, dynamic>(Type, Name, ProcessNestedObject(Value)));
                            }
                            else
                            {
                                Records.Add(new Tuple<string, string, dynamic>(Type, Name, item.Value.Value));
                            }
                        }
                    }
                }
                return Records;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public static dynamic ProcessNestedObject(this JToken obj)
        {
            try
            {
                List<Tuple<string, string, dynamic>> Records = new List<Tuple<string, string, dynamic>>();

                foreach (var property in obj)
                {
                    string Type = property.First.Type == JTokenType.Object ? "object" : property.First.Type.ToString();
                    string[] namestrings = property.Path.Split('.');
                    string Name = namestrings[namestrings.Length - 1].ToString();
                    dynamic Value = property.First;

                    if (Type.ToLower() == "object")
                    {
                        Value = ProcessNestedObject(Value);
                    }
                    else if (Type.ToLower() == "array")
                    {
                        Value = ProcessNestedArray(Value);
                    }

                    // Add to records
                    Records.Add(new Tuple<string, string, dynamic>(Type, Name, Value));
                }

                return Records;
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        public static List<List<Tuple<string, List<Tuple<string, string>>>>> MergeAndRemoveDuplicates(List<List<Tuple<string, List<Tuple<string, string>>>>> originalList)
        {
            try
            {
                Dictionary<string, List<Tuple<string, string>>> mergedDict = new Dictionary<string, List<Tuple<string, string>>>();

                foreach (var group in originalList)
                {
                    foreach (var item in group)
                    {
                        string key = item.Item1;
                        List<Tuple<string, string>> properties = item.Item2;

                        if (!mergedDict.ContainsKey(key))
                        {
                            mergedDict[key] = new List<Tuple<string, string>>();
                        }

                        foreach (var prop in properties)
                        {
                            if (!mergedDict[key].Any(p => p.Item1 == prop.Item1 && p.Item2 == prop.Item2))
                            {
                                mergedDict[key].Add(prop);
                            }
                        }
                    }
                }

                // Convert back to the original structure
                List<List<Tuple<string, List<Tuple<string, string>>>>> mergedList = new List<List<Tuple<string, List<Tuple<string, string>>>>>();

                foreach (var kvp in mergedDict)
                {
                    mergedList.Add(new List<Tuple<string, List<Tuple<string, string>>>> { new Tuple<string, List<Tuple<string, string>>>(kvp.Key, kvp.Value) });
                }

                return mergedList;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static DataTable? JsonToDataTable(this string sampleJson)
        {
            try
            {
                DataTable? dataTable = new();
                if (string.IsNullOrWhiteSpace(sampleJson))
                {
                    return dataTable;
                }
                dataTable = JsonConvert.DeserializeObject<DataTable>(sampleJson);
                return dataTable;
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        public static string GetPropertyString(this string type, string propertyName)
        {
            try
            {
                string propertyString = "";

                switch (type.ToLower())
                {
                    case "integer":
                        propertyString = $"\tpublic int {propertyName} {{ get; set; }}\n";
                        break;
                    case "string":
                        propertyString = $"\tpublic string {propertyName} {{ get; set; }}\n";
                        break;
                    case "decimal":
                        propertyString = $"\tpublic decimal {propertyName} {{ get; set; }}\n";
                        break;
                    case "datetime":
                        propertyString = $"\tpublic datetime {propertyName} {{ get; set; }}\n";
                        break;
                    case "array":
                        propertyString = $"\tpublic List<{propertyName}> {propertyName} {{ get; set; }}\n";
                        break;
                    case "char":
                        propertyString = $"\tpublic char {propertyName} {{ get; set; }}\n";
                        break;
                    case "boolean":
                        propertyString = $"\tpublic bool {propertyName} {{ get; set; }}\n";
                        break;
                    case "float":
                        propertyString = $"\tpublic float {propertyName} {{ get; set; }}\n";
                        break;
                    case "object":
                        propertyString = $"\tpublic {propertyName} {propertyName} {{ get; set; }}\n";
                        break;
                    case "listobj":
                        propertyString = $"\tpublic List<Object> {propertyName} {{ get; set; }}\n";
                        break;
                    case "liststring":
                        propertyString = $"\tpublic List<string> {propertyName} {{ get; set; }}\n";
                        break;
                    default:
                        propertyString = $"\tpublic Object {propertyName} {{ get; set; }}\n";
                        break;
                }

                return propertyString;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static string ConvertToEntity(this StringBuilder sb, string name)
        {
            try
            {
                StringBuilder entityClass = new StringBuilder();
                //name = name != "" ? name : "root";
                name = name != "" ? name : name;
                // Start of the class
                entityClass.AppendLine($"public class {name}");
                entityClass.AppendLine("{");

                // Append the StringBuilder strings to the class
                entityClass.AppendLine(sb.ToString());

                // End of the class
                entityClass.AppendLine("}");

                return entityClass.ToString();
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private static string GetCurrentTypeName(this Type type)
        {
            try
            {
                if (type == typeof(string)) return "string";
                if (type == typeof(int)) return "int";
                if (type == typeof(decimal)) return "decimal";
                if (type == typeof(double)) return "double";
                if (type == typeof(float)) return "float";
                if (type == typeof(bool)) return "bool";
                if (type == typeof(DateTime)) return "DateTime";
                if (type == typeof(byte)) return "byte";
                // Add more types as needed
                return type.Name;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static List<ColumnDetails> GetHeadersWithTypes(this DataSet dataSet)
        {
            try
            {
                var headersWithTypes = new List<ColumnDetails>();

                if (dataSet.Tables.Count > 0)
                {
                    DataTable table = dataSet.Tables[0];

                    foreach (DataColumn column in table.Columns)
                    {
                        headersWithTypes.Add(new ColumnDetails
                        {
                            Column_Name = column.ColumnName,
                            Column_Type = column.DataType.GetCurrentTypeName()
                        });
                    }
                }


                return headersWithTypes;
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        private static T CreateItemFromRow<T>(DataRow row, List<PropertyInfo> properties) where T : new()
        {
            try
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
            catch (Exception ex)
            {
                throw;
            }
        }
        public static T ConvertFromDataRow<T>(this DataRow row) where T : new()
        {
            try
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
            catch (Exception ex)
            {
                throw;
            }
        }
        public static List<T> ToList<T>(this DataTable table) where T : new()
        {
            try
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
            catch (Exception ex)
            {
                throw;
            }
        }



        private static dynamic GetAnonymousObject(IEnumerable<string> columns, IEnumerable<object> values)
        {
            try
            {
                IDictionary<string, object> eo = new ExpandoObject() as IDictionary<string, object>;
                int i;
                for (i = 0; i < columns.Count(); i++)
                {
                    eo.Add(columns.ElementAt<string>(i), values.ElementAt<object>(i));
                }
                return eo;
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        public static IEnumerable<IEnumerable<T>> Split<T>(this IEnumerable<T> sourceList, int ListSize)
        {

            while (sourceList.Any())
            {
                yield return sourceList.Take(ListSize);
                sourceList = sourceList.Skip(ListSize);
            }
        }


        public static string RemoveDateColumnName(this string columnName)
        {
            try
            {
                if (columnName.Contains('_'))
                {
                    return columnName.Substring(columnName.LastIndexOf("_") + 1);
                }
                return columnName;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public static List<ColumnDetails> ExtractPropertiesFromClassString(this string classString)
        {
            try
            {
                List<ColumnDetails> sourceList = new List<ColumnDetails>();

                // Define a regular expression to match property definitions
                string pattern = @"public\s+(?<type>\w+)\s+(?<name>\w+)\s*\{";
                Regex regex = new Regex(pattern);

                // Find matches in the class string
                MatchCollection matches = regex.Matches(classString);

                foreach (Match match in matches)
                {
                    string type = match.Groups["type"].Value;
                    string name = match.Groups["name"].Value;

                    // Create a new Source object for each property
                    ColumnDetails source = new ColumnDetails
                    {
                        Column_Name = name,
                        Column_Type = type
                    };

                    // Add the Source object to the list
                    sourceList.Add(source);
                }

                return sourceList;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static string GenerateDictionaryBasedParameters(this ParameterBasedRequest parameterBasedRequest)
        {
            try
            {
                if (parameterBasedRequest == null)
                    throw new ArgumentNullException();
                if (parameterBasedRequest.CurrentParameterType == ParameterType.NoParameters)
                    return string.Empty;
                if (parameterBasedRequest.CurrentParameterType == ParameterType.UrlParams)
                    return parameterBasedRequest.Parameters.GenerateUrlParameters();
                if (parameterBasedRequest.CurrentParameterType == ParameterType.QueryParams)
                    return parameterBasedRequest.Parameters.GenerateQueryParameters();
                return string.Empty;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public static bool Like(this string source, string pattern)
        {
            try
            {
                pattern = pattern.Replace("%", ".*").Replace("_", ".");
                return System.Text.RegularExpressions.Regex.IsMatch(source, $"^{pattern}$");
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        static DataTable JoinTables(DataTable table1, DataTable table2, string joinColumn, string[] columnsToSelect)
        {
            try
            {
                // Create a new DataTable to hold the results
                DataTable resultTable = new DataTable();

                // Add the selected columns to the result table
                foreach (string column in columnsToSelect)
                {
                    resultTable.Columns.Add(column, table1.Columns.Contains(column) ? table1.Columns[column].DataType : table2.Columns[column].DataType);
                }

                // Perform the join
                var query = from t1 in table1.AsEnumerable()
                            join t2 in table2.AsEnumerable()
                            on t1.Field<int>(joinColumn) equals t2.Field<int>(joinColumn)
                            select new
                            {
                                t1,
                                t2
                            };

                // Populate the result table with the joined data
                foreach (var row in query)
                {
                    DataRow newRow = resultTable.NewRow();
                    foreach (string column in columnsToSelect)
                    {
                        if (resultTable.Columns.Contains(column))
                        {
                            newRow[column] = row.GetType().GetProperty(column).GetValue(row, null);
                        }
                    }
                    resultTable.Rows.Add(newRow);
                }

                return resultTable;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static DataTable JoinTables(this DataTable table1, DataTable table2, JoinCondition joinCondition, IEnumerable<string> columnsToSelect)
        {
            try
            {

                // Create a new DataTable to hold the results
                DataTable resultTable = new DataTable();

                // Add the selected columns to the result table
                foreach (string column in columnsToSelect)
                {
                    resultTable.Columns.Add(column, table1.Columns.Contains(column) ? table1.Columns[column].DataType : table2.Columns[column].DataType);
                }

                // Perform the join
                var query = (from t1 in table1.AsEnumerable()
                             join t2 in table2.AsEnumerable()
                             on t1[joinCondition.LeftColumn] equals t2[joinCondition.RightColumn]
                             select new
                             {
                                 t1,
                                 t2
                             });

                // Populate the result table with the joined data
                foreach (var row in query)
                {
                    DataRow newRow = resultTable.NewRow();
                    foreach (string column in columnsToSelect)
                    {
                        if (resultTable.Columns.Contains(column))
                        {
                            if (table1.Columns.Contains(column))
                            {
                                newRow[column] = row.t1[column];
                            }
                            else if (table2.Columns.Contains(column))
                            {
                                newRow[column] = row.t2[column];
                            }
                        }
                    }
                    resultTable.Rows.Add(newRow);
                }

                return resultTable;
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        public static DataTable FilterDatatable(this DataTable dt, IEnumerable<string> SelectedColumns)
        {
            try
            {
                var filterdTable = dt.AsEnumerable()
                    .Select(row => SelectedColumns.ToDictionary(
                        column => column,
                        column => row[column]
                    )).ToList();
                var resultTable = new DataTable();
                var filetedColumns = dt.Columns.Cast<DataColumn>().Where(dc => SelectedColumns.Contains(dc.ColumnName));
                foreach (var column in filetedColumns)
                {
                    resultTable.Columns.Add(column.Clone());
                }
                foreach (var rowDict in filterdTable)
                {
                    DataRow newRow = resultTable.NewRow();
                    foreach (var kvp in rowDict)
                    {
                        newRow[kvp.Key] = kvp.Value;
                    }
                    resultTable.Rows.Add(newRow);
                }
                return resultTable;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public static DataTable ConvertToDataTable1(this IEnumerable<DataRow> dataRows)
        {
            try
            {
                if
            (dataRows == null || !dataRows.Any())
                    throw
                    new
                    ArgumentException(
                    "No rows provided"
                    );
                // Create a new DataTable with the same schema as the DataRows
                DataTable table = dataRows.First().Table.Clone();
                // Import each DataRow into the new DataTable
                foreach
                (DataRow row
                in
                dataRows) { table.ImportRow(row); }
                return
                table;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public static DataTable ConvertToDataTable<T>(this IEnumerable<T> dataRows)
        {
            try
            {


                var dataTable = new DataTable();

                // Create columns based on the properties of T
                var properties = typeof(T).GetProperties();
                foreach (var prop in properties)
                {
                    dataTable.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
                }

                // Add rows to the DataTable
                foreach (var item in dataRows)
                {
                    var values = properties.Select(p => p.GetValue(item, null)).ToArray();
                    dataTable.Rows.Add(values);
                }

                return dataTable;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static List<string> GetColumnHeaders(this DataTable dataTable)
        {
            try
            {


                List<string> columnHeaders = new List<string>();

                foreach (DataColumn column in dataTable.Columns)
                {
                    columnHeaders.Add(column.ColumnName);
                }

                return columnHeaders;
            }
            catch (Exception ex)
            {
                throw;
            }
        }



        public static List<ColumnDetails> SourceListWithNameAndType(string jsonData)
        {
            try
            {
                List<ColumnDetails> sourceListWithNameAndType = new List<ColumnDetails>();
                JArray jsonArray = JArray.Parse(jsonData);
                Dictionary<string, string> properties = new Dictionary<string, string>();

                foreach (var item in jsonArray)
                {
                    foreach (var property in item.Children<JProperty>())
                    {
                        string propertyName = property.Name;
                        string propertyType;

                        // Attempt to determine type dynamically
                        if (property.Value.Type == JTokenType.String && DateTime.TryParse(property.Value.ToString(), out _))
                        {
                            propertyType = "DateTime";
                        }
                        else if (property.Value.Type == JTokenType.String)
                        {
                            propertyType = "string";
                        }
                        else if (property.Value.Type == JTokenType.Integer)
                        {
                            propertyType = "int";
                        }
                        else if (property.Value.Type == JTokenType.Boolean)
                        {
                            propertyType = "bool";
                        }
                        else
                        {
                            propertyType = "object"; // Fallback type
                        }

                        if (!properties.ContainsKey(propertyName))
                        {
                            properties[propertyName] = propertyType;
                        }
                    }
                }

                foreach (var prop in properties)
                {
                    sourceListWithNameAndType.Add(new ColumnDetails()
                    {
                        Column_Name = prop.Key,
                        Column_Type = prop.Value
                    });

                    // Optionally log to console
                    Console.WriteLine($"Property Name: {prop.Key}, Type: {prop.Value}");
                }

                return sourceListWithNameAndType;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

    }

}
