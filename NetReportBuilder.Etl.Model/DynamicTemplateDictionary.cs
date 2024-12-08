using NetReportBuilder.Etl.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class DynamicTemplateDictionary
    {


        public static string FetchHttpMethodTemplate(MethodType httpMethod)
        {
            if (httpMethod == MethodType.GET)
            {
                return GetMethodTemplate;
            }
            if (httpMethod == MethodType.POST)
            {
                return PostMethodTemplate;
            }
            return string.Empty;
        }


        static readonly string GetMethodTemplate = @"
var CLIENT_VARIABLE = new HttpClient();
var REQUEST_VARIABLE = new HttpRequestMessage(HttpMethod.Get, ""ENDPOINT"");
var RESPONSE_VARIABLE = await CLIENT_VARIABLE.SendAsync(REQUEST_VARIABLE);
RESPONSE_VARIABLE.EnsureSuccessStatusCode();
var RESPONSE_STRING_VARIABLE = await RESPONSE_VARIABLE.Content.ReadAsStringAsync();
if (string.IsNullOrWhiteSpace(RESPONSE_STRING_VARIABLE))
{
    throw new NullReferenceException();
}
var DATATABLE_VARIABLE = JsonConvert.DeserializeObject<DataTable>(RESPONSE_STRING_VARIABLE);
";

        static readonly string PostMethodTemplate = @"
var CLIENT_VARIABLE = new HttpClient();
HttpRequestMessage REQUEST_VARIABLE = new HttpRequestMessage();
REQUEST_VARIABLE.Method = HttpMethod.Post;
REQUEST_VARIABLE.RequestUri = new Uri(""ENDPOINT"");
REQUEST_VARIABLE.Headers.Add(""accept"", ""*/*"");
CONTENT
var RESPONSE_VARIABLE = await CLIENT_VARIABLE.SendAsync(REQUEST_VARIABLE);
RESPONSE_VARIABLE.EnsureSuccessStatusCode();
var RESPONSE_STRING_VARIABLE = await RESPONSE_VARIABLE.Content.ReadAsStringAsync();
if (string.IsNullOrWhiteSpace(RESPONSE_STRING_VARIABLE))
{
    throw new NullReferenceException();
}
var DATATABLE_VARIABLE = JsonConvert.DeserializeObject<DataTable>(RESPONSE_STRING_VARIABLE);
";
    }

}
