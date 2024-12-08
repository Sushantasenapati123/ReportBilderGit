using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Core
{
  
    public class HttpUtility : IHttpUtility
    {
        public async Task<string> SendRequest(string apiUrl, string selectedMethod, string apiType, List<KeyValuePair<string, string>> tableData, string rawparam)
        {
            try
            {
                string jsonResult = "";
                Dictionary<string, string> tabledata = tableData!=null ? tableData.ToDictionary(kvp => kvp.Key, kvp => kvp.Value) : null;
                using (HttpClient client = new HttpClient())
                {
                    HttpRequestMessage request = new HttpRequestMessage();
                    if (selectedMethod.ToUpper() == "GET")
                    {
                        request = CreateGetRequestMesage(apiUrl,apiType, tabledata);
                    }
                    if (selectedMethod.ToUpper() == "POST")
                    {
                        request = CreatePostRequestMessage(apiUrl, apiType, tabledata, rawparam);
                    }
                    switch (selectedMethod.ToUpper())
                    {
                        case "GET":
                            request.Method = HttpMethod.Get;
                            break;
                        case "POST":
                            request.Method = HttpMethod.Post;
                            break;
                        case "PUT":
                            request.Method = HttpMethod.Put;
                            break;
                        case "DELETE":
                            request.Method = HttpMethod.Delete;
                            break;
                        default:
                            throw new ArgumentException("Invalid HTTP method", nameof(selectedMethod));
                    }

                    var response = await client.SendAsync(request);
                    if (response.IsSuccessStatusCode)
                    {
                        jsonResult = await response.Content.ReadAsStringAsync();
                    }
                }

                return jsonResult;
            }
            catch (Exception ex)
            {
               
                throw new ApplicationException("Error while sending request", ex);
            }
        }

        public async Task<string> SendRequestnew(string apiUrl, string selectedMethod, string apiType, Dictionary<string,string> tableData, string rawparam)
        {
            try
            {
                string jsonResult = "";
                using (HttpClient client = new HttpClient())
                {
                    HttpRequestMessage request = new HttpRequestMessage();
                    if (selectedMethod.ToUpper() == "GET")
                    {
                        request = CreateGetRequestMesage(apiUrl, apiType, tableData);
                    }
                    if (selectedMethod.ToUpper() == "POST")
                    {
                        request = CreatePostRequestMessage(apiUrl, apiType, tableData, rawparam);
                    }
                    switch (selectedMethod.ToUpper())
                    {
                        case "GET":
                            request.Method = HttpMethod.Get;
                            break;
                        case "POST":
                            request.Method = HttpMethod.Post;
                            break;
                        case "PUT":
                            request.Method = HttpMethod.Put;
                            break;
                        case "DELETE":
                            request.Method = HttpMethod.Delete;
                            break;
                        default:
                            throw new ArgumentException("Invalid HTTP method", nameof(selectedMethod));
                    }

                    var response = await client.SendAsync(request);
                    if (response.IsSuccessStatusCode)
                    {
                        jsonResult = await response.Content.ReadAsStringAsync();
                    }
                }

                return jsonResult;
            }
            catch (Exception ex)
            {

                throw new ApplicationException("Error while sending request", ex);
            }
        }

        HttpRequestMessage CreateGetRequestMesage(string endpoint,string apitype, Dictionary<string, string> formData)
        {
            HttpRequestMessage request = new HttpRequestMessage();
            string baseUrl = endpoint;
            request.Method = HttpMethod.Get;
            if (apitype == "QueryParams")
            {
                string queryParams = formData.GenerateQueryParameters();
                string apiUrlWithParams = $"{baseUrl}{queryParams}";
                request.RequestUri = new Uri(apiUrlWithParams);
                request.Headers.Add("accept", "*/*");
            }
            else if (apitype == "UrlParams")
            {
                string urlParams = formData.GenerateUrlParameters();
                string apiUrlWithParams = $"{baseUrl}{urlParams}";
                request.RequestUri = new Uri(apiUrlWithParams);
                request.Headers.Add("accept", "*/*");
            }
            else if (apitype == "NoParameters")
            {
                request.RequestUri = new Uri(baseUrl);
                request.Headers.Add("accept", "*/*");
            }

            return request;
        }
        HttpRequestMessage CreatePostRequestMessage(string endpoint, string apitype, Dictionary<string, string> formData, string rawparam)
        {
            HttpRequestMessage request = new HttpRequestMessage();
            string baseUrl = endpoint;
            request.Method = HttpMethod.Post;
            if (apitype == "QueryParams")
            {
                string queryParams = formData.GenerateQueryParameters();
                string apiUrlWithParams = $"{baseUrl}{queryParams}";
                request.RequestUri = new Uri(apiUrlWithParams);
                request.Headers.Add("accept", "*/*");
            }
            else if (apitype == "x_www_form_urlencoded")
            {
                request.RequestUri = new Uri(baseUrl);
                request.Content = new FormUrlEncodedContent(formData);
                request.Headers.Add("accept", "*/*");


            }
            else if (apitype == "form-data")
            {
                request.RequestUri = new Uri(baseUrl);
                var content = new MultipartFormDataContent();
                foreach (var kvp in formData)
                {
                    content.Add(new StringContent(kvp.Value), kvp.Key);
                }
                request.Content = content;
                request.Headers.Add("accept", "*/*");
            }
            else if (apitype == "Raw")
            {
                request.RequestUri = new Uri(baseUrl);
                // string rawjsonData = JsonConvert.SerializeObject(formData, Formatting.Indented);
                string rawjsonData = rawparam;
                var content = new StringContent(rawjsonData, null, "application/json");
                if (content != null)
                {
                    request.Content = content;
                }
                request.Headers.Add("accept", "*/*");
            }



            return request;
        }
    }
}
