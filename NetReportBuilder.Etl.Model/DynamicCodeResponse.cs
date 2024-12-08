using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class DynamicCodeResponse<T> where T : new()
    {
        public T Output { get; set; }
        public List<string> MessageList { get; set; }
        public bool CompiledSuccessfully { get; set; }
        public bool IsSuccessfullyExecute { get; set; } = false;
        public string RuntimeExceptionMsg { get; set; }

    }
}
