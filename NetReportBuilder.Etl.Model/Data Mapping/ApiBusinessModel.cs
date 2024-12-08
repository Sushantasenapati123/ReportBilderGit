using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class ApiBusinessModel
    {
        public string ApiResponse { get; set; }
        public string GeneratedCode { get; set; }
        public string ErrorMessage { get; set; }
        public string EntityName  { get; set; }
    }
}
