using NetReportBuilder.Etl.Core;
namespace NetReportBuilder.Etl.Model
{  
    public class ApiConfiguration: BaseConfiguration
    {
        public ApiConfiguration()
        {
            MethodType = EndPoint = ParameterType = Response = ResponseType =RawBody= string.Empty;
            Parameters = new List<Parameters>();
            HeaderDetails = new List<Parameters>();
        }
        public string MethodType { get; set; }
        public string EndPoint { get; set; }
        public string ParameterType { get; set; }
        public List<Parameters> Parameters { get; set; }
        public List<Parameters> HeaderDetails { get; set; }
        public string RawBody { get; set; }
        public string Response { get; set; }
        public string ResponseType { get; set; }

    }
}
