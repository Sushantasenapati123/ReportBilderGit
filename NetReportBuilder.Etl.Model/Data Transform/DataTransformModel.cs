using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class DataTableModel
    {
        public DataTable Dt { get; set; }
        public int Index { get; set; }
    }
    public class DataTransformModel
    {
        public List<DataTableModel> DataTablePool { get; set; }
    }
}
