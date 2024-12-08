using System;

namespace NetReportBuilder.ReportSource.Model
{
	public class AddDatabaseConfigurationsPipeline_Model 
	{
		public int Id { get; set; }
		
		public string DatabaseType { get; set; }
		public string DatabaseName { get; set; }
		public string HostName { get; set; }
		public string Authentication { get; set; }
		public string UserName { get; set; }
		public string Password { get; set; }
		public string Port { get; set; }

        public string? EntityName { get; set; }
        public string? SourceCode { get; set; }

        public string? Query { get; set; }
        public string? ConcatServerAndDatabase { get; set; }
        public string? Output { get; set; }
    }
}

