namespace DatabaseConfiguration.Models.DatabaseConfiguration
{
    public class TableModel
    {
        public string? Schema { get; set; }
        public string? Name { get; set; }
        public int Order { get; set; }
        public List<ColumnModel>? Columns { get; set; }
    }
}
