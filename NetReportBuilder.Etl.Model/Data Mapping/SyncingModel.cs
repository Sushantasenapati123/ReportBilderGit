using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class SyncingModel
    {
        public string TruncateEndPoint { get; set; }
        public string ConnectionString { get; set; }
        public string TargetTable { get; set; }
    }
}
