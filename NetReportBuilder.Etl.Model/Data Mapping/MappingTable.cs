namespace NetReportBuilder.Etl.Web.Models
{//Use for to Sent data from DataMapping View to controller
    public class Mapping
    {

        public Source Source { get; set; }

        public Destination Destination { get; set; }

    }
    public class DatabaseObjectSearchModel
    {
        public string[]? Tables { get; set; }
    }
    public class MappingRequest
    {

        public List<Mapping> Mapping { get; set; }

        public string InputValue { get; set; }

        public string DataBaseType { get; set; }

        public string TableName { get; set; }

        public string SourceCode { get; set; }

        public List<Source> List_NewColumnNameWithType { get; set; }//for New Table
    }

    public class Source
    {
        public string Original_FieldName { get; set; }
        public string FieldName { get; set; }//Modified Field Name

        public string DataType { get; set; }

        public string constraints { get; set; }

    }

    public class Destination
    {

        public string Type { get; set; }

        public string TableName { get; set; }

        public string ColumnName { get; set; }
        public string constraints { get; set; }

    }

}
