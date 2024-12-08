using System.Data.Common;

namespace DatabaseConfiguration.Models.DatabaseConfiguration
{
    public class ViewModel
    {
        public string? Name { get; set; }
        public object? Comment { get; set; }
        public object? IdentitySeed { get; set; }
        public object? IdentityIncrement { get; set; }        
        public object? Definition { get; set; }
        public string? Schema { get; set; }
        public int? Order { get; set; }
        public List<ColumnModel>? Columns { get; set; }
    }
}
