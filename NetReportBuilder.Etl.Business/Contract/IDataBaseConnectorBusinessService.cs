using DatabaseConfiguration.Models.DatabaseConfiguration;
using NetReportBuilder.Etl.Model;
using NetReportBuilder.Etl.Model.Data_Mapping;
using NetReportBuilder.Etl.Model.ViewModel;
using NetReportBuilder.ReportSource.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Business
{
    public interface IDataBaseConnectorBusinessService
    {
        Task<DataSources> GetTableResultFromDataBase(AddDatabaseConfigurationsPipeline_Model serverInputsModel);
        Task<string> SaveDataBaseConfiguration(AddDatabaseConfigurationsPipeline_Model serverInputsModel);
    }
}
