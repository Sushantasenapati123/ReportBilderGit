using NetReportBuilder.Etl.Model;
using System.Xml.Schema;

namespace NetReportBuilder.Etl.Model
{  
    public class DbConfiguration: BaseConfiguration
    {
        public  DbConfiguration()
        {
            DatabaseType = DataBase = Authentication = Host = UserId = Password = string.Empty;
            Port = 0;
        }
        public string DatabaseType { get; set; } 
        public string DataBase { get; set; }
        public string Authentication { get; set; } 
        public string Host { get; set; } 
        public string UserId { get; set; }
        public string Password { get; set; }
        public int Port { get; set; }
    }
   

   

}
