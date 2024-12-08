namespace DatabaseConfiguration.Models.DatabaseConfiguration
{
    public class DatabaseModel
    {
        public int? DatabaseId { get; set; }
        public string? DatabaseName { get; set; }
        public List<TableModel>? Tables { get; set; }
        public List<ViewModel>? Views { get; set; }
        public List<ServerInputsModel>? ServerInputs { get; set; }
    }
}