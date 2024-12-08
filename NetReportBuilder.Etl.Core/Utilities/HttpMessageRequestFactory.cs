using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Core.Utilities
{
    
    public interface IHttpMessageFactory<T>
    {
        HttpRequestMessage CreateHttpRequestMessage(BaseRequest request) where T : new();
    }
    public class ContentBasedHttpMessageFactory:
    public class HttpHelperFactory : IHttpHelperFactory
    {
        private readonly ILogger<HttpHelperFactory> _logger;

        private readonly Dictionary<MethodType, Func<BaseRequest, HttpRequestMessage>> MessageRequests = new Dictionary<MethodType, Func<BaseRequest, HttpRequestMessage>>();

       
        public HttpHelperFactory(ILogger<HttpHelperFactory> logger)
        {
            _logger = logger;
            MessageRequests.Add(MethodType.GET, GetMessageRequest);
            MessageRequests.Add(MethodType.POST, PostMessageRequest);
            MessageRequests.Add(MethodType.DELETE, DeleteMessageRequest);
            MessageRequests.Add(MethodType.PUT, PutMessageRequest);
        }

        HttpRequestMessage GetMessageRequest(BaseRequest request)
        {
            try
            {
                var getRequest = request as ParameterBasedRequest;
                if (getRequest is null)
                    throw new InvalidOperationException();
                string parameters = getRequest.GenerateDictionaryBasedParameters();
                var getRequestUrl = $"{getRequest.EndPoint}" + parameters.ToString();
                var messageRequest = new HttpRequestMessage(HttpMethod.Get, getRequestUrl);
                messageRequest.Headers.Add("accept", "*/*");
                return messageRequest;
            }
            catch (Exception ex)
            {
                //_logger.LogError($"{ex}");
                throw;
            }
        }
        HttpRequestMessage DeleteMessageRequest(BaseRequest request)
        {
            try
            {
                var getRequest = request as ParameterBasedRequest;
                if (getRequest is null)
                    throw new InvalidOperationException();
                string parameters = getRequest.GenerateDictionaryBasedParameters();
                var getRequestUrl = $"{getRequest.EndPoint}" + parameters.ToString();
                var messageRequest = new HttpRequestMessage(HttpMethod.Delete, getRequestUrl);
                messageRequest.Headers.Add("accept", "*/*");
                return messageRequest;
            }
            catch (Exception ex)
            {
                //_logger.LogError($"{ex}");
                throw;
            }
        }
        HttpRequestMessage PostMessageRequest<T>(BaseRequest request)
        {
            try
            {
                HttpRequestMessage messageRequest = new HttpRequestMessage();
                messageRequest.Method = HttpMethod.Post;
                messageRequest.Headers.Add("accept", "*/*");

                switch (request.CurrentParameterType)
                {
                    case ParameterType.QueryParams:
                        var queryParamRequest = request as ParameterBasedRequest;
                        messageRequest.RequestUri = new Uri($"{queryParamRequest.EndPoint}/{queryParamRequest.GenerateDictionaryBasedParameters()}");
                        break;
                    case ParameterType.x_www_form_urlencoded:
                        var urlEnCodedRequest = request as ParameterBasedRequest;

                        messageRequest.RequestUri = new Uri(urlEnCodedRequest.EndPoint);
                        messageRequest.Content = new FormUrlEncodedContent(urlEnCodedRequest.Parameters);
                        break;
                    case ParameterType.Raw:
                        var contentBasedRequest = request as ContentBasedRequest<T>;
                        messageRequest.RequestUri = new Uri(contentBasedRequest.EndPoint);
                        var jsonContent = new StringContent(JsonConvert.SerializeObject(contentBasedRequest.Parameter), null, "application/json");

                        messageRequest.Content = jsonContent;
                        break;
                    case ParameterType.FormData:
                        var formDataRequest = request as ParameterBasedRequest;

                        messageRequest.RequestUri = new Uri(formDataRequest.EndPoint);
                        var content = new MultipartFormDataContent();
                        foreach (var kvp in formDataRequest.Parameters)
                        {
                            content.Add(new StringContent(kvp.Value), kvp.Key);
                        }
                        messageRequest.Content = content;
                        break;
                }

                var getRequest = request as ParameterBasedRequest;
                if (getRequest is null)
                    throw new InvalidOperationException();
                string parameters = getRequest.GenerateDictionaryBasedParameters();
                var getRequestUrl = $"{getRequest.EndPoint}" + parameters.ToString();
                return new HttpRequestMessage(HttpMethod.Delete, getRequestUrl);
            }
            catch (Exception ex)
            {
                //_logger.LogError($"{ex}");
                throw;
            }
        }
        HttpRequestMessage PutMessageRequest(BaseRequest request)
        {
            try
            {
                HttpRequestMessage messageRequest = new HttpRequestMessage();
                messageRequest.Method = HttpMethod.Put;
                messageRequest.Headers.Add("accept", "*/*");

                switch (request.CurrentParameterType)
                {
                    case ParameterType.QueryParams:
                        var queryParamRequest = request as ParameterBasedRequest;
                        messageRequest.RequestUri = new Uri($"{queryParamRequest.EndPoint}/{queryParamRequest.GenerateDictionaryBasedParameters()}");
                        break;
                    case ParameterType.x_www_form_urlencoded:
                        var urlEnCodedRequest = request as ParameterBasedRequest;

                        messageRequest.RequestUri = new Uri(urlEnCodedRequest.EndPoint);
                        messageRequest.Content = new FormUrlEncodedContent(urlEnCodedRequest.Parameters);
                        break;
                    case ParameterType.Raw:
                        var contentBasedRequest = request as ContentBasedRequest<TIn>;
                        messageRequest.RequestUri = new Uri(contentBasedRequest.EndPoint);
                        var jsonContent = new StringContent(JsonConvert.SerializeObject(contentBasedRequest.Parameter), null, "application/json");

                        messageRequest.Content = jsonContent;
                        break;
                    case ParameterType.FormData:
                        var formDataRequest = request as ParameterBasedRequest;

                        messageRequest.RequestUri = new Uri(formDataRequest.EndPoint);
                        var content = new MultipartFormDataContent();
                        foreach (var kvp in formDataRequest.Parameters)
                        {
                            content.Add(new StringContent(kvp.Value), kvp.Key);
                        }
                        messageRequest.Content = content;
                        break;
                }

                var getRequest = request as ParameterBasedRequest;
                if (getRequest is null)
                    throw new InvalidOperationException();
                string parameters = getRequest.GenerateDictionaryBasedParameters();
                var getRequestUrl = $"{getRequest.EndPoint}" + parameters.ToString();
                return new HttpRequestMessage(HttpMethod.Delete, getRequestUrl);
            }
            catch (Exception ex)
            {
                //_logger.LogError($"{ex}");
                throw;
            }
        }


        

     

        public HttpRequestMessage CreateHttpRequestMessage<T>(BaseRequest request) where T : new()
        {
            throw new NotImplementedException();
        }
    }
}
