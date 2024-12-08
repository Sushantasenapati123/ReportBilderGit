using NetReportBuilder.Etl.Model;
using NetReportBuilder.Etl.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Business
{
    public interface IDataMapperBusinessService
    {
        Task<List<Tables>> FetchTableList(DatabaseObjectSearchModel databaseObjectSearchModel);
        Task<List<TableColumn>> FetchColumnsLit(DatabaseObjectSearchModel databaseObjectSearchModel);

      //  Task<DataMapperInitParams> LoadConfigurations();
        Task<string> SaveDataMappingConfiguration(MappingRequest mappingRequest);
        Task<string> GetDataMappingConfigurationSourceCode(MappingRequest mappingRequest);
        Task<string> ApiResponse();

        Task<DataMappingConfiguration> GetMappingConfiguration();

    }
}
