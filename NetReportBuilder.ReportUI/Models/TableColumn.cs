namespace NetReportBuilder.ReportUI.Models
{
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
        public string value { get; set; }
    }
}
