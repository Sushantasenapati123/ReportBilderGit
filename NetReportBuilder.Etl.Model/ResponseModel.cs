using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Core
{
    public class ResponseModel<T>
    {
        public bool HasIssue { get; set; }
        public string Message { get; set; }
        public T Output { get; set; }

    }
}
