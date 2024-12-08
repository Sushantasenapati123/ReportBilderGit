using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class JoinCondition
    {
        public string LeftColumn { get; set; }
        public string RightColumn { get; set; }
    }
}
