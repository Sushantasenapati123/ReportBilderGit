using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using NetReportBuilder.Etl.Model.ViewModel;
using NetReportBuilder.ReportSource.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Business
{
    public interface ICodeGenerator
    {
        Task<HttpCodeResponse> GenerateHttpCode(ApiModel apiDetails);

        Task<HttpCodeResponse> GenerateInlineQueryCode(AddDatabaseConfigurationsPipeline_Model apiDetails);

        Task<string> GenerateMappingCode(string mappingModel, string destinationColumns);
        Task<string> GenerateSyncingCode(SyncingModel syncingModel);
        Task<HttpCodeResponse> GenerateDataTransformJoinCode(JoinTransformModel joinTransformModel);
        Task<HttpCodeResponse> GenerateFilterDataTransformCode(DataFilterModel FilterModel);
        Task<HttpCodeResponse> GenerateGroupByDataTransformCode(GroupByConditionModel FilterModel);

        Task<HttpCodeResponse> GenerateExcelFileRetrivalCode(ExcelModal Model);

    }
}
