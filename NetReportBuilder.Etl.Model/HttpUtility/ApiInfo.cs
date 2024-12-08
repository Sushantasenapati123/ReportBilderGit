using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{

    public class ApiInfo
    {
        public byte SaveModeType { get; set; }//Visualization{1}/Code{0}
        public string DynamicAPICode { get; set; }//Visualization{1}/Code{0}
        public string MethodType { get; set; }
        public string EndPoint { get; set; }
        public string ParameterType { get; set; }
        public List<Parameters> Parameters { get; set; }
        public string Response { get; set; }
        public string ResponseType { get; set; }

       public string RawBody { get; set; }

    }
    public class ApiModel
    {
        public string EntityName { get; set; }
        public string MethodType { get; set; }
        public string EndPoint { get; set; }
        public string ParameterType { get; set; }
        public Dictionary<string,string> Parameters { get; set; }
        public string RawBody { get; set; }

    }

}
