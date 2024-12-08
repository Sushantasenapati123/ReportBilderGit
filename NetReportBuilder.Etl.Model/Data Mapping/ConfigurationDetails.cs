using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class DataConfigurationDetails
    {
        public DataSourceType DataSource { get; set; }
        public string Configuration { get; set; }
        public int Index { get; set; }
        public string SourceCode { get; set; }
        public string EntityName { get; set; }
        public DataFilterModel DataFilter { get; set; }
    }
}
