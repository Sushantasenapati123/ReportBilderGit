using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class CustomCodeConfiguration : BaseConfiguration
    {
        public CustomCodeConfiguration()
        {
            InputCode = InputType = JsonData = string.Empty;
        }
        public string InputType { get; set; }
        public string InputCode { get; set; }
        public string JsonData { get; set; }
    }

}
