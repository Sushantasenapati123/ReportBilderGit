using NetReportBuilder.Etl.Core;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class RestMethodParameterModel
    {
        public string EntityName { get; set; }
        public string ApiUrl { get; set; }
        public string SelectedMethod { get; set; }
        public string ApiType { get; set; }
        public string TableData { get; set; }
        public string RawParam { get; set; }

        public ApiModel ConvertApiInfo()
        {
            Dictionary<string, string> tabledata = null;
            if (ApiType.Trim().ToLower() != ParameterType.Raw.ToString().Trim().ToLower())
            {
                var paramData = JsonConvert.DeserializeObject<List<KeyValuePair<string, string>>>(TableData);
                tabledata = paramData != null ? paramData.ToDictionary(kvp => kvp.Key, kvp => kvp.Value) : null;
            }


            return new ApiModel
            {
                EndPoint = this.ApiUrl,
                MethodType = SelectedMethod,
                Parameters = tabledata,
                ParameterType = ApiType,
                RawBody = RawParam,
                EntityName = this.EntityName
            };
        }
    }


}
