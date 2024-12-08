using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class ExecutionInterval
    {
        [DisplayName("Week Day")]
        public string WeekDay { get; set; }
        [DisplayName("Day")]
        public int Day { get; set; }
        [DisplayName("Hour")]
        public int Hour { get; set; }
        [DisplayName("Minute")]
        public int Minute { get; set; }
        [DisplayName("Interval in Hours")]
        public int HoursInterval { get; set; }
        [DisplayName("Interval in Minutes")]
        public int MinutesInterval { get; set; }

    }

}
