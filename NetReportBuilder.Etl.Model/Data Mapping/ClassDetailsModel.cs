using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model.Data_Mapping
{
    public class ClassDetail
    {
       public string Schema { get; set; }
        public List<ColumnDetails> Fields { get; set; }
    }
}
