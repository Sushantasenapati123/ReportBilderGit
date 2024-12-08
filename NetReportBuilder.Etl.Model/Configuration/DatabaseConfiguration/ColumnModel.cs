namespace DatabaseConfiguration.Models.DatabaseConfiguration
{
    public class ColumnModel
    {
        //For Tables
        public string? DataType { get; set; }
        public bool IsRequired { get; set; }
        public bool IsNullable { get; set; }
        public bool IsIdentity { get; set; }
        public long? MaxLength { get; set; }
        public int? Precision { get; set; }
        public int? Scale { get; set; }
        public string? Name { get; set; }
        public int Order { get; set; }
        //For Views
        public string? ColumnName { get; set; }
        public string? ObjectCatalog { get; set; }
        public string? ObjectSchema { get; set; }
        public string? ObjectName { get; set; }
        public string? RefObjectCatalog { get; set; }
        public object? RefObjectSchema { get; set; }
        public string? RefObjectName { get; set; }
    }
}
