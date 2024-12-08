using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model.ViewModel
{
    public class ServerInputViewModel
    {
        public string? DatabaseType { get; set; }
        public string? DataBase { get; set; }
        public string? Authentication { get; set; }
        public string? Host { get; set; }
        public string? Port { get; set; }
        public string? UserId { get; set; }
        public string? Password { get; set; }
        public string? TableName { get; set; }





        public string EntityName { get; set; }
        public string SourceCode { get; set; }

        public string Query { get; set; }
        public string ConcatServerAndDatabase { get; set; }
        public string Output { get; set; }
    }
}
