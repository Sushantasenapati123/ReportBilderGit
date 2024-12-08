using NetReportBuilder.Etl.Core;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class ApiDetails
    {
        
        public string DataPipeLineName { get; set; }
        public string EntityName { get; set; }
        public string DataSourceType { get; set; }
        public ApiInfo Configuration { get; set; }
        public ApiModel GenerateApiModel()
        {
            Dictionary<string, string> tabledata = null;
            if (Configuration.ParameterType.Trim().ToLower() != ParameterType.Raw.ToString().Trim().ToLower())
            {
                tabledata = Configuration.Parameters != null ? Configuration.Parameters.ToDictionary(ck => ck.Pkey, cv => cv.Pvalue) : null;
            }


            return new ApiModel
            {
                EndPoint = this.Configuration.EndPoint,
                MethodType = Configuration.MethodType,
                Parameters = tabledata,
                ParameterType = Configuration.ParameterType,
                RawBody = Configuration.RawBody
            };
        }
    }
    public class ApiResponse
    {
        public bool sucess { get; set; }
        public string responseMessage { get; set; }
        public string responseText { get; set; }
        public string data { get; set; }
    }
}
