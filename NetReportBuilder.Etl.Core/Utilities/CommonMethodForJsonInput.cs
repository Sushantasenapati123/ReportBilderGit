using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Text;
using NetReportBuilder.Etl.Web.Models;

namespace NetReportBuilder.Etl.Core
{
    public class JsonUtility
    {
        public static List<string> ProcessJsonData(string jsonFilePath, string Clsname)
        {
            List<string> MODEL = new List<string>();

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
                List<Source> SourceList = new List<Source>();

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
                                ClassName = Clsname + "_BindTableAdd";
                            }
                            else
                            {
                                ClassName = pair.Item1;
                            }

                            foreach (var propitem in pair.Item2)
                            {
                                string Name = propitem.Item1;
                                string Type = propitem.Item2;
                                nsb.Append(GetPropertyString(Type, Name));
                            }

                            string entity = ConvertStringBuilderToEntity(nsb, ClassName);
                            MODEL.Add(entity);


                        }
                    }
                }

            }
            catch (Exception ex)
            {
                throw ex;
                // Console.WriteLine(ex.Message);
            }
            return MODEL;
        }
        static List<List<Tuple<string, List<Tuple<string, string>>>>> ProcessRecords(List<Tuple<string, string, dynamic>> records, int level = 1, string keyname = "")
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
        static dynamic ProcessNestedArray(dynamic array, int depth = 1)
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
        static dynamic ProcessNestedObject(JToken obj)
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

        public static string GetPropertyString(string type, string propertyName)
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

        public static string ConvertStringBuilderToEntity(StringBuilder sb, string name)
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
        static List<List<Tuple<string, List<Tuple<string, string>>>>> MergeAndRemoveDuplicates(List<List<Tuple<string, List<Tuple<string, string>>>>> originalList)
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
    }
}
