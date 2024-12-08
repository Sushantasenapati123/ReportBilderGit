using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;



namespace NetReportBuilder.Etl.Core
{
 
   
   
    public class HttpHelper<TIn, TOut> where TIn : new() where TOut : new()
    {
        
        private static readonly Dictionary<MethodType, Func<BaseRequest, HttpRequestMessage>> MessageRequests = new Dictionary<MethodType, Func<BaseRequest, HttpRequestMessage>> { { MethodType.GET, GetMessageRequest }, { MethodType.DELETE, DeleteMessageRequest }, { MethodType.POST, PostMessageRequest }, { MethodType.PUT, PutMessageRequest } }; 
       
        private static HttpRequestMessage GetMessageRequest(BaseRequest request)
        {
            var getRequest = request as ParameterBasedRequest;
            if (getRequest is null)
                throw new ArgumentNullException();
            var getRequestUrl = getRequest.EndPoint;
            var parameters = getRequest.Parameters.GenerateParameters();
            getRequestUrl = getRequestUrl + parameters.ToString();
            return new HttpRequestMessage(HttpMethod.Get, getRequestUrl);
        }
        private static HttpRequestMessage DeleteMessageRequest(BaseRequest request)
        {
            var getRequest = request as ParameterBasedRequest;
            if (getRequest is null)
                throw new ArgumentNullException();
            var deleteRequestUrl = getRequest.EndPoint;
            var parameters = getRequest.Parameters.GenerateParameters();
            deleteRequestUrl = deleteRequestUrl + parameters.ToString();
            return new HttpRequestMessage(HttpMethod.Delete, deleteRequestUrl);
        }
        private static HttpRequestMessage PostMessageRequest(BaseRequest request)
        {
            var postRequest = request as ContentBasedRequest<TIn>;
            if (postRequest is null) throw new ArgumentNullException();
            var postRequestUrl = postRequest.EndPoint ;
            var postMessage = new HttpRequestMessage(HttpMethod.Post, postRequestUrl);
            postMessage.Content = new StringContent(JsonConvert.SerializeObject(postRequest.Parameter), null, "application/json");
            return postMessage;
        }
        private static HttpRequestMessage PutMessageRequest(BaseRequest request)
        {
            var postRequest = request as ContentBasedRequest<TIn>;
            if (postRequest is null) throw new ArgumentNullException();
            var postRequestUrl = postRequest.EndPoint ;
            var postMessage = new HttpRequestMessage(HttpMethod.Put, postRequestUrl);
            postMessage.Content = new StringContent(JsonConvert.SerializeObject(postRequest.Parameter), null, "application/json");
            return postMessage;
        }
        private class Factory
        {
            public static HttpRequestMessage CreateHttpRequestMessage(BaseRequest request)
            {
                var currentMethod = MessageRequests[request.CurrentMethod];
                return currentMethod.Invoke(request);              
              
            }
           
           


        }

        public static async Task<TOut> Invoke(BaseRequest request)
        {
            var client = new HttpClient();
            var messageRequest = Factory.CreateHttpRequestMessage(request);
            var response = await client.SendAsync(messageRequest);
            response.EnsureSuccessStatusCode();
            var messageContent = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<TOut>(messageContent);

        }
    }
}

