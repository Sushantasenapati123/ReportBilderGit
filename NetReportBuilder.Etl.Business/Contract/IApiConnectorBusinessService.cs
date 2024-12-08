using NetReportBuilder.Etl.Model;
using NetReportBuilder.Etl.Model.Data_Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Business
{
    public interface IApiConnectorBusinessService
    {
        Task<ApiBusinessModel> InvokeApi(RestMethodParameterModel restMethodParameterModel);
        Task<string> SaveApiConfiguration(ApiDetails request);
    }
}
