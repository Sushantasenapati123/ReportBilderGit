using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Business
{
    public class DataSyncBusiness : IDataSyncBusiness
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<DataSyncBusiness> _logger;
        private readonly Dictionary<DataSyncModes, Func<DataTable, DataMappingConfiguration, Task>>
       SyncMethods = new Dictionary<DataSyncModes, Func<DataTable, DataMappingConfiguration, Task>>();
        public DataSyncBusiness(IConfiguration configuration, ILogger<DataSyncBusiness> logger)
        {
            _configuration = configuration;
            _logger = logger;
            SyncMethods.Add(DataSyncModes.New, SyncNewData);
            //SyncMethods.Add(DataSyncModes.Merge, MergeToTarget);
        }
        private async Task TruncateTable(string tableName)
        {
            try
            {

                using (var httpClient = new HttpClient())
                {
                    using (var request = new HttpRequestMessage(new HttpMethod("POST"), $@"{_configuration["BaseApiUrl"].ParseToText()}/{_configuration["TruncateTableEndpoint"].ParseToText()}?tableName={tableName}"))
                    {
                        request.Headers.TryAddWithoutValidation("accept", "*/*");

                        request.Content = new StringContent("");
                        request.Content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/x-www-form-urlencoded");

                        var response = await httpClient.SendAsync(request);
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<string> SyncData(DataTable source, DataMappingConfiguration dataMapping)
        {
            try
            {
                var syncMode = (DataSyncModes)Enum.Parse(typeof(DataSyncModes), dataMapping.DataSyncModes);
                var syncMethod = SyncMethods[syncMode];
                await syncMethod.Invoke(source, dataMapping);
                return "success";
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }


        async Task MergeToTarget(DataTable dt, DataMappingConfiguration dataMappingConfiguration)
        {
            throw new NotImplementedException();
        }
        async Task SyncNewData(DataTable dt, DataMappingConfiguration dataMappingConfiguration)
        {
            await TruncateTable(dataMappingConfiguration.TargetTable);
            using (var connection = new SqlConnection(_configuration.GetConnectionString("SqlConnetion")))
            {
                connection.Open();
                using (var bulkCopy = new SqlBulkCopy(connection))
                {
                    bulkCopy.DestinationTableName = dataMappingConfiguration.TargetTable;
                    try
                    {
                        // Export the data in batches of 4000 records
                        var chunks = dt.AsEnumerable().ToChunks(4000)
                                                   .Select(rows => rows.CopyToDataTable());

                        foreach (var tableChunk in chunks)
                        {
                            bulkCopy.WriteToServer(tableChunk);
                            _logger.LogInformation(tableChunk.Rows.Count + " records were exported successfully.");
                        }

                        _logger.LogInformation("Whole Table exported successfully With Name: " + dataMappingConfiguration.TargetTable + " in Target Server");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"Error exporting table: {ex}");
                    }
                }
            }
        }
    }
}
