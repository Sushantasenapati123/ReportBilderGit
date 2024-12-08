using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class Query
    {
        public int Slno { get; set; }
        public string QueryText { get; set; }
        public string QueryTitle { get; set; }
        public DateTime DateTime { get; set; }
        public  string Databasename { get; set; }
    }
}
