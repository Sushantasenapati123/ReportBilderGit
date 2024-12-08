using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model.Data_Mapping
{
    public static class ApplicationConstants
    {
        public static readonly string[] Clauses = new string[] {"Where","Group By","Order By" };
        public static readonly string[] Conditions = new string[] { ">", @"<", @"=", @">=", @"<=", @"StartsWith", @"EndsWith", @"Contains", @"asc", @"dsc" };
        public static readonly string[] AggregateMethods = new string[] { "Max","Min","Sum","Average" };
        
    }
}
