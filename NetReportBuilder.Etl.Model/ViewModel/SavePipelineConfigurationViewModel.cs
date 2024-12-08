using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class SavePipelineConfigurationViewModel
    {
        public string SaveType { get; set; }//Insert or Update Base on QueryString
        [DisplayName("Pipe line")]
        public string PipelineName { get; set; }

        public string DrowFlowJson { get; set; }

        [DisplayName("Data Source")]
        public string DataSourceType { get; set; }
        [DisplayName("Execution Mode")]
        public string ExecutionMode { get; set; }

        [DisplayName("DataSyncModes Mode")]
        public string DataSyncModes { get; set; }

        [DisplayName("Interval")]
        public ExecutionInterval ExecutionInterval { get; set; }

        [DisplayName("Description")]
        public string Description { get; set; }
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }

    }

}
