using NetReportBuilder.Etl.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Business
{
    public interface IDataSyncBusiness
    {
        Task<string> SyncData(DataTable source, DataMappingConfiguration dataMapping);
       
    }
}
