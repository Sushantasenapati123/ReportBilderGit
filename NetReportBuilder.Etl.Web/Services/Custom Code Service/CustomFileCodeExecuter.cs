using Hangfire;
using NetReportBuilder.Etl.Model;

namespace NetReportBuilder.Etl.Web
{
   
    public class CustomFileCodeExecuter : ICustomCodeExecuter
    {
       
        private readonly ILogger<CustomFileCodeExecuter> _logger;
        public CustomFileCodeExecuter(ILogger<CustomFileCodeExecuter> logger)
        {
            
            _logger = logger;
        }

        public async Task<string> Execute(string cSharpCode)
        {
            try
            {
                return string.Empty;
            }
            catch(Exception ex)
            {
                throw;
            }
        }
    }
}
