using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class DashBoardViewModel
    {
        public List<PipelineModel> PipeLines { get; set; }
        public PipelineModel CurrentPipeline { get; set; }
    }
}
