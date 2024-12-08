using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class ColumnConstraint
    {
        public ColumnConstraint()
        {
            IsNull = true;
            IsIdentity = false;
            IsPrimarkKey = false;
            IsUnique = false;
        }
        public bool IsNull { get; set; }
        public bool IsIdentity { get; set; }
        public bool IsPrimarkKey { get; set; }
        public bool IsUnique { get; set; }
    }
}
