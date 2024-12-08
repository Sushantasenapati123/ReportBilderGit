using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Core
{
    public class ParameterBasedRequest : BaseRequest
    {

        public Dictionary<string, string> Parameters { get; set; }

    }
}
