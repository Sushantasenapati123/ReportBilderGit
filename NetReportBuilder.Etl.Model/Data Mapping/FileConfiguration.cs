namespace NetReportBuilder.Etl.Model
{   
    public class FileConfiguration: BaseConfiguration
    {
        public FileConfiguration()
        {
            FileExtension = FileName = string.Empty;
        }
        public string FileExtension { get; set; }
        public string FileName { get; set; }       

    }
}
