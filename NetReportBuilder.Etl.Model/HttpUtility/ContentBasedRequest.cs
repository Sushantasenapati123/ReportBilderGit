using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Core
{
    public class ContentBasedRequest<T> : BaseRequest where T : new()
    {
        public T Parameter { get; set; }


    }
}
