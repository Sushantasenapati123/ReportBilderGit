using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class Pipiline
    {
        public string Name { get; set; }
        public string DataSourceType { get; set; }
        public string DataConfiguration { get; set; }
        public string Status { get; set; }
    }
}
