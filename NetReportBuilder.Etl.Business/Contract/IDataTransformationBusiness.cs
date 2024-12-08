using Microsoft.AspNetCore.Http;
using NetReportBuilder.Etl.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Business
{
    public interface IDataTransformationBusiness
    {
        Task<List<DataSourceModel>> FetchDataSources();
        Task<DataSourceModel> FetchDataSourceByName(string datasourceName);
        Task<PipelineConfigurationModel> ReadConfiguration();

        Task<DataSources> FetchConfigurationByTable(string DataTableName, string SaveType);


        Task<DataTransformationResult> TransformData(JoinTransformModel transformModel);


        #region ModifyJson
        Task<string> RemoveEntityFromJsonSourceList(string ENtity);

        Task<string> ReOrderingListOfSource(string NewleyCreatedNode, string TargetNode);
        #endregion


        #region Filter
        Task<DataTransformationResult> FilterTransformData(DataFilterModel transformModel);

        Task<string> SaveFilterTransformation(DataFilterModel request);
        Task<ParentModelData> GetOutputColumnWithCode_ForFilter(string entityName, string CurrentModel,string SaveType);


        Task<List<SelectedColumnDetails>> API_SourceDataForFilter(string entityName);
        #endregion

        #region Join
        Task<string> SaveJoinTransformation(DataTransformationModel request);
        Task<ParentModelData> GetOutputColumnWithCode_ForJoin(string currentModel,string SaveType);
        #endregion

        #region GroupBy



        Task<DataTransformationResult> ApplyGroupBy(GroupByConditionModel transformModel);
        Task<string> SaveGroupByCondition(GroupByConditionModel request);
        #endregion

        #region Excel


        Task<DataTable> ConvertExcelToDataTable(IFormFile file);

        Task<DataTable> GetDataTableFromExcel(string filePath);
        Task<string> SaveExcelConfiguration(ExcelModal request);
        #endregion

    }
}
