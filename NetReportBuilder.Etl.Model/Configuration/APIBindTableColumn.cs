namespace NetReportBuilder.Etl.Web.Models
{

    public class DatabaseInfoRequest
    {

        public string databaseType { get; set; }

        public string dataBase { get; set; }
        public string authentication { get; set; }
        public string host { get; set; }
        public string userId { get; set; }
        public string password { get; set; }
        public int port { get; set; }
    }
    public class BindTables
    {
        public List<Tables> tables { get; set; }
    }
    public class TableColumn
    {
        public string dataType { get; set; }
        public bool isRequired { get; set; }
        public bool isNullable { get; set; }
        public bool isIdentity { get; set; }
        public int maxLength { get; set; }
        public int precision { get; set; }
        public int scale { get; set; }
        public string name { get; set; }
        public int order { get; set; }
    }
    public class Tables
    {
        public string schema { get; set; }
        public string name { get; set; }
        public int order { get; set; }
        public List<TableColumn> columns { get; set; }
    }
}
