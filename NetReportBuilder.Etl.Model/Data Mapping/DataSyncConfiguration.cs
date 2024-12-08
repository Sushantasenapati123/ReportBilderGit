using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class DataSyncConfiguration
    {
        public DataSyncConfiguration()
        {
            DataSyncMode = DataSyncModes.New;
            SourceCode = string.Empty;
        }


        public DataSyncModes DataSyncMode { get; set; }
        public string SourceCode { get; set; }


        public ExecutionMode ExecutionMode { get; set; }
        public ExecutionInterval ExecutionInterval { get; set; }
        public string Description { get; set; }
    }
}
