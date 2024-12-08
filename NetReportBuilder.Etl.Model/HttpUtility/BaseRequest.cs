using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Core
{
    public class BaseRequest
    {
        public string EndPoint { get; set; }
        public MethodType CurrentMethod { get; set; }
        public ParameterType CurrentParameterType { get; set; }
    }
}
