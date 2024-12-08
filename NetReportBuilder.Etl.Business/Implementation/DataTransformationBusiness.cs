using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Ocsp;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;



namespace NetReportBuilder.Etl.Business
{
    public class DataTransformationBusiness : EtlBusinessService, IDataTransformationBusiness
    {

        public DataTransformationBusiness(IHttpUtility httpUtility, ILogger<DataTransformationBusiness> logger, IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor, ICodeGenerator codeGenerator, IConfiguration configuration) : base(httpUtility, logger, webHostEnvironment, httpContextAccessor, configuration, codeGenerator)
        {
        }

        public async Task<List<DataSourceModel>> FetchDataSources()
        {
            var pipelineConfiguration = await ReadPipelineData();
            List<DataSourceModel> datasources = new List<DataSourceModel>();
            foreach (DataSources datasource in pipelineConfiguration.ListOfSource)
            {

                //var apiConfiguration = JsonConvert.DeserializeObject<string>(datasource.Output);
                var dt = datasource.Output.JsonToDataTable();
                var columns = dt.Columns.ConvertColumnsToSelectList();
                datasources.Add(new DataSourceModel { Columns = columns, DataSource = dt, EntityName = datasource.EntityName });

            }


            return datasources;
        }

        public async Task<DataSources> FetchConfigurationByTable(string DataTableName, string SaveType)
        {
            var pipelineConfiguration = await ReadPipelineData();
            var Configuration = new DataSources();

            foreach (DataSources datasource in pipelineConfiguration.ListOfSource)
            {
                if (datasource.EntityName == DataTableName)
                    Configuration = datasource;
            }

            var lastEntityName = pipelineConfiguration.ListOfSource
                                 .Select(dc => dc.EntityName)
                                 .LastOrDefault();


            StringBuilder sb = new StringBuilder();
            //foreach (var config in pipelineModel.DataConfigurations)
            foreach (var config in pipelineConfiguration.ListOfSource)
            {
                
                sb.AppendLine(config.SourceCode);

            }

            //if (SaveType == "Update" && lastEntityName == DataTableName)
            //{
            //    sb.AppendLine($"return source;");
            //}
            //else
            //{
            sb.AppendLine($"return {DataTableName};");
            //}

            /// sb.AppendLine($"return {DataTableName};");

            Configuration.AccumulateCode = sb.ToString();
            return Configuration;
        }


        public async Task<PipelineConfigurationModel> ReadConfiguration()
        {
            return await ReadPipelineData();

        }

        public async Task<DataSourceModel> FetchDataSourceByName(string datasourceName)
        {
            var dataSources = await FetchDataSources();
            return dataSources.FirstOrDefault(ds => ds.EntityName.Trim().ToLower() == datasourceName.Trim().ToLower());

        }

        public async Task<DataTransformationResult> TransformData(JoinTransformModel transformModel)
        {
            string PartsourceCode = string.Empty;
            string AccumulateSourceCode = string.Empty;
            string EntityName = string.Empty;
            try
            {
                var pipelineModel = await ReadConfiguration();
                var dataSources = await FetchDataSources();

                if (pipelineModel is null)
                    throw new ArgumentException("Please select the Pipeline");
                if (transformModel is null)
                    throw new ArgumentException("Required parameters are missing.");

                if (transformModel.SelectedColumns is null || transformModel.SelectedColumns.Count <= 0)
                    throw new ArgumentException("Fields of the required resultset is missing.");

                if (transformModel.ListOfJoinConditions == null || transformModel.ListOfJoinConditions.Count <= 0)//For One Table
                {

                    var entityName = transformModel.SelectedColumns.FirstOrDefault().EntityName;
                    var entity = dataSources.SingleOrDefault(df => df.EntityName.Trim().ToLower() == entityName.Trim().ToLower());
                    var resultTable = entity.DataSource.FilterDatatable(transformModel.SelectedColumns.Select(sc => sc.ColumnName).AsEnumerable());


                    var Res = await _codeGenerator.GenerateDataTransformJoinCode(transformModel);
                    //code = code.Code.Replace("EntityName", entityName);
                    return new DataTransformationResult { Source = resultTable, SourceCode = Res.Code.Replace("EntityName", entityName), EntityName = Res.EntityName };

                }
                else if (transformModel.ListOfJoinConditions.Count >= 1)//for multiple table
                {

                    var genratedCode = await _codeGenerator.GenerateDataTransformJoinCode(transformModel);
                    PartsourceCode = genratedCode.Code;
                    EntityName = genratedCode.EntityName;
                    StringBuilder sb = new StringBuilder();
                    //foreach(var config in pipelineModel.DataConfigurations)
                    //{
                    //    sb.AppendLine(config.SourceCode);
                    //}

                    foreach (var config in pipelineModel.ListOfSource)
                    {
                        if (config.EntityName != transformModel.EntityName)//skip old source code and use update code
                            sb.AppendLine(config.SourceCode);
                        else
                        {
                            sb.AppendLine(genratedCode.Code);//here is updated code
                        }
                    }
                    bool exists = pipelineModel.ListOfSource.Any(config => config.EntityName == transformModel.EntityName);

                    // if (transformModel.EntityName== "Source")//while Newly Create this will Execute
                    if (!exists)//while Newly Create this will Execute
                    {
                        sb.AppendLine(genratedCode.Code);//here is updated code
                    }

                    sb.AppendLine($"return {genratedCode.EntityName};");
                    AccumulateSourceCode = sb.ToString();
                }
                return new DataTransformationResult { SourceCode = PartsourceCode, AccumulateSourceCode = AccumulateSourceCode, EntityName = EntityName };
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }

        #region ConditionFilter


        public async Task<DataTransformationResult> FilterTransformData(DataFilterModel transformModel)
        {
            bool isNewSourceCodeAppend = false;
            string PartsourceCode = string.Empty;
            string AccumulateSourceCode = string.Empty;
            string EntityName = string.Empty;
            DataTable filteredTable = new DataTable();
            try
            {
                var pipelineModel = await ReadConfiguration();
                List<DataSourceModel> datasources = new List<DataSourceModel>();

                var existingDatasourceOutput = pipelineModel.ListOfSource
                .FirstOrDefault(dc => dc.EntityName == transformModel.SourceEntityName);





                //DataTable dt = OtherExtensions.JsonToDataTable(apiConfiguration.Response);

                if (pipelineModel is null)
                    throw new ArgumentException("Please select the Pipeline");
                if (transformModel is null)
                    throw new ArgumentException("Required parameters are missing.");



                if (transformModel != null)
                {

                    var genratedCode = await _codeGenerator.GenerateFilterDataTransformCode(transformModel);
                    PartsourceCode = genratedCode.Code;
                    EntityName = genratedCode.EntityName;
                    StringBuilder sb = new StringBuilder();

                    var lastElement = pipelineModel.ListOfSource.Last(); // Get the last element
                    //foreach (var config in pipelineModel.DataConfigurations)
                    foreach (var config in pipelineModel.ListOfSource)
                    {

                        if (transformModel.EntityName == config.EntityName && transformModel.SaveType == "Update")
                        {
                            sb.AppendLine(genratedCode.Code);
                            isNewSourceCodeAppend = true;
                        }


                        if (config.EntityName != genratedCode.EntityName)
                            sb.AppendLine(config.SourceCode);
                    }
                    if (isNewSourceCodeAppend == false)
                    {
                        sb.AppendLine(genratedCode.Code);
                    }
                    
                    sb.AppendLine($"return {genratedCode.EntityName};");
                    AccumulateSourceCode = sb.ToString();
                }
                return new DataTransformationResult { /*Source = filteredTable, */SourceCode = PartsourceCode, AccumulateSourceCode = AccumulateSourceCode, EntityName = EntityName };
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }

        public async Task<string> SaveFilterTransformation(DataFilterModel request)
        {
            try
            {
                var pipeLineInfo = await ReadPipelineData();


                var sourceCodeListObjNew = pipeLineInfo.ListOfSource
               .FirstOrDefault(dc => dc.EntityName == request.EntityName);


                var sourceCodeListObjSource = pipeLineInfo.ListOfSource
               .FirstOrDefault(dc => dc.EntityName == request.SourceEntityName);

                var msg = "";

                if (sourceCodeListObjNew is null)//for insert
                {


                    int counter_ListOfDataSource = 0;
                    if (pipeLineInfo.ListOfSource.Count > 0)
                        counter_ListOfDataSource = pipeLineInfo.ListOfSource.Count + 1;
                    else
                        counter_ListOfDataSource = 1;

                    pipeLineInfo.ListOfSource.Add(new DataSources
                    {
                        Index = counter_ListOfDataSource,
                        SourceCode = request.SourceCode,
                        EntityName = request.EntityName,
                        Output = request.Output,
                        Filter = new DataFilterModel
                        {
                            EntityName = request.EntityName,
                            Filters = request.Filters,

                            SourceEntityName = request.SourceEntityName,

                        }
                    });


                    msg = "Data submitted and saved successfully.";



                }
                else//Update
                {



                    sourceCodeListObjNew.SourceCode = request.SourceCode;
                    sourceCodeListObjNew.Output = request.Output;
                    sourceCodeListObjNew.Filter = new DataFilterModel
                    {
                        EntityName = request.EntityName,
                        Filters = request.Filters,
                        SourceEntityName = request.SourceEntityName,

                    };
                    sourceCodeListObjNew.Output = request.Output;


                    msg = "Data Updated and saved successfully.";
                }
                System.IO.File.WriteAllText(PipelinePath, JsonConvert.SerializeObject(pipeLineInfo));
                return msg;
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }

        public string BuildFilterExpression(DataFilterModel transformModel)
        {
            if (transformModel == null || transformModel.Filters == null || !transformModel.Filters.Any())
            {
                return string.Empty;
            }

            List<string> conditions = new List<string>();

            foreach (var filter in transformModel.Filters)
            {
                string condition = string.Empty;

                // Handling different conditions (you can expand this as needed)
                switch (filter.Condition.ToLower())
                {
                    case "equals":
                        condition = $"{filter.FieldName} = '{filter.ConditionValue}'";
                        break;
                    case "contains":
                        condition = $"{filter.FieldName} LIKE '%{filter.ConditionValue}%'";
                        break;
                    case "startswith":
                        condition = $"{filter.FieldName} LIKE '{filter.ConditionValue}%'";
                        break;
                    case "endswith":
                        condition = $"{filter.FieldName} LIKE '%{filter.ConditionValue}'";
                        break;
                    case "greaterthan":
                        condition = $"{filter.FieldName} > {filter.ConditionValue}";
                        break;
                    case "lessthan":
                        condition = $"{filter.FieldName} < {filter.ConditionValue}";
                        break;
                        // Add more conditions as needed
                }

                if (!string.IsNullOrEmpty(condition))
                {
                    conditions.Add(condition);
                }
            }

            return string.Join(" AND ", conditions);
        }

        #endregion


        #region GroupBy Filter

        public async Task<DataTransformationResult> ApplyGroupBy(GroupByConditionModel transformModel)
        {
            string PartsourceCode = string.Empty;
            string AccumulateSourceCode = string.Empty;
            string EntityName = string.Empty;
            DataTable filteredTable = new DataTable();
            try
            {
                var pipelineModel = await ReadConfiguration();
                List<DataSourceModel> datasources = new List<DataSourceModel>();

                var existingDatasourceOutput = pipelineModel.ListOfSource
                .FirstOrDefault(dc => dc.EntityName == transformModel.SourceEntityName);







                if (pipelineModel is null)
                    throw new ArgumentException("Please select the Pipeline");
                if (transformModel is null)
                    throw new ArgumentException("Required parameters are missing.");



                if (transformModel != null)
                {

                    var genratedCode = await _codeGenerator.GenerateGroupByDataTransformCode(transformModel);
                    PartsourceCode = genratedCode.Code;
                    EntityName = genratedCode.EntityName;
                    StringBuilder sb = new StringBuilder();
                    //foreach (var config in pipelineModel.DataConfigurations)
                    foreach (var config in pipelineModel.ListOfSource)
                    {

                        if (config.EntityName == transformModel.CurrentEntityName)
                        {
                            sb.AppendLine(genratedCode.Code);//Append the Modified code when Update
                        }
                        else
                        {
                            sb.AppendLine(config.SourceCode);
                        }

                    }
                    if (transformModel.CurrentEntityName == "NoEntity")//While Newly Create
                    {
                        sb.AppendLine(genratedCode.Code);
                    }
                    sb.AppendLine($"return {genratedCode.EntityName};");
                    AccumulateSourceCode = sb.ToString();
                }
                return new DataTransformationResult { Source = filteredTable, SourceCode = PartsourceCode, AccumulateSourceCode = AccumulateSourceCode, EntityName = EntityName };
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }

        public async Task<string> SaveGroupByCondition(GroupByConditionModel request)
        {
            try
            {
                var pipeLineInfo = await ReadPipelineData();


                var sourceCodeListObjNew = pipeLineInfo.ListOfSource
               .FirstOrDefault(dc => dc.EntityName == request.CurrentEntityName);


                var sourceCodeListObjSource = pipeLineInfo.ListOfSource
               .FirstOrDefault(dc => dc.EntityName == request.SourceEntityName);

                var msg = "";

                if (sourceCodeListObjNew is null)//for insert
                {


                    int counter_ListOfDataSource = 0;
                    if (pipeLineInfo.ListOfSource.Count > 0)
                        counter_ListOfDataSource = pipeLineInfo.ListOfSource.Count + 1;
                    else
                        counter_ListOfDataSource = 1;

                    pipeLineInfo.ListOfSource.Add(new DataSources
                    {
                        Index = counter_ListOfDataSource,
                        SourceCode = request.SourceCode,
                        EntityName = request.CurrentEntityName,
                        Output = request.Output,
                        GroupByFilter = new GroupByConditionModel
                        {
                            CurrentEntityName = request.CurrentEntityName,
                            GroupByConditionList = request.GroupByConditionList,

                            SourceEntityName = request.SourceEntityName,

                        }
                    });


                    msg = "Data submitted and saved successfully.";



                }
                else//Update
                {


                    sourceCodeListObjNew.EntityName = request.CurrentEntityName;
                    sourceCodeListObjNew.SourceCode = request.SourceCode;
                    sourceCodeListObjNew.Output = request.Output;
                    sourceCodeListObjNew.GroupByFilter = new GroupByConditionModel
                    {
                        CurrentEntityName = request.CurrentEntityName,
                        GroupByConditionList = request.GroupByConditionList,
                        SourceEntityName = request.SourceEntityName,

                    };



                    msg = "Data Updated and saved successfully.";
                }
                System.IO.File.WriteAllText(PipelinePath, JsonConvert.SerializeObject(pipeLineInfo));
                return msg;
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }

        #endregion




        #region JoinFilter



        public async Task<string> SaveJoinTransformation(DataTransformationModel request)
        {
            try
            {
                string msg = "";

                string ENtityNameFromSourceCode = request.EntityName;
                var pipeLineInfo = await ReadPipelineData();



                var sourceCodeListObj = pipeLineInfo.ListOfSource
               .FirstOrDefault(dc => dc.EntityName == ENtityNameFromSourceCode);

                if (sourceCodeListObj is null)//for insert
                {

                    int counter_ListOfDataSource = 0;
                    if (pipeLineInfo.ListOfSource.Count > 0)
                        counter_ListOfDataSource = pipeLineInfo.ListOfSource.Count + 1;
                    else
                        counter_ListOfDataSource = 1;



                    pipeLineInfo.ListOfSource.Add(new DataSources
                    {
                        Index = counter_ListOfDataSource,
                        SourceCode = request.SourceCode,
                        EntityName = ENtityNameFromSourceCode,
                        Output = request.Output,
                        SelectedColumns = request.SelectedColumns,
                        JoinCondition = request.JoinCondition
                    });

                    msg = "Inserted successfully!";


                }
                else//Update
                {


                    sourceCodeListObj.SourceCode = request.SourceCode;
                    sourceCodeListObj.SelectedColumns = request.SelectedColumns;
                    sourceCodeListObj.JoinCondition = request.JoinCondition;
                    sourceCodeListObj.Output = request.Output;

                    msg = "Updated Successfully!";
                }
                System.IO.File.WriteAllText(PipelinePath, JsonConvert.SerializeObject(pipeLineInfo));
                return msg;
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }




        public async Task<List<SelectedColumnDetails>> API_SourceDataForFilter(string entityName)
        {
            var pipeLineInfo = await ReadPipelineData();

            // Find the matching DataConfigurationDetails based on the EntityName
            var matchingConfig = pipeLineInfo.ListOfSource
                .FirstOrDefault(config => config.EntityName == entityName);

            if (matchingConfig == null)
                return null;
            var apiConfiguration = JsonConvert.DeserializeObject<ApiConfiguration>(matchingConfig.Configuration);
            DataTable dt = OtherExtensions.JsonToDataTable(apiConfiguration.Response);
            List<SelectedColumnDetails> selectedColumns = new List<SelectedColumnDetails>();
            foreach (DataColumn column in dt.Columns)
            {
                SelectedColumnDetails columnDetails = new SelectedColumnDetails
                {
                    EntityName = matchingConfig.EntityName,          // Fixed entity name as "Demo"
                    ColumnName = column.ColumnName // Column name from the DataTable header
                };

                selectedColumns.Add(columnDetails);
            }

            return selectedColumns;


        }

        public async Task<ParentModelData> GetOutputColumnWithCode_ForFilter(string entityName, string currentModel, string SaveType)
        {
            try
            {
                var pipeLineInfo = await ReadPipelineData();
                var SOurceCode = "";
                var Output_Of_SOurceCode = "";
                var sourceCodeListObj = pipeLineInfo.ListOfSource.FirstOrDefault(dc => dc.EntityName == entityName);
                DataTable DT = sourceCodeListObj.Output.ConvertJsonToDataTable();

                var CurrentModel = pipeLineInfo.ListOfSource.FirstOrDefault(dc => dc.EntityName == currentModel);
                var lastEntityName = pipeLineInfo.ListOfSource
                                    .Select(dc => dc.EntityName)
                                    .LastOrDefault();
                #region Get AccumulateCode

                StringBuilder sb = new StringBuilder();
                //foreach (var config in pipelineModel.DataConfigurations)
                foreach (var config in pipeLineInfo.ListOfSource)
                {
                    //if (SaveType == "Update")
                    //{
                    //    if (config.SourceCode.Contains("DataTable source"))
                    //    {
                    //        config.SourceCode = config.SourceCode.Replace("source", $"{config.EntityName}");
                    //    }

                    //}
                    sb.AppendLine(config.SourceCode);
                }
                //if (SaveType == "Update" && lastEntityName == currentModel)
                //{
                //    sb.AppendLine($"return source;");
                //}
                //else
                //{
                sb.AppendLine($"return {currentModel};");
                //}


                #endregion


                if (CurrentModel == null)
                    SOurceCode = "";
                else
                {
                    SOurceCode = CurrentModel.SourceCode;
                    Output_Of_SOurceCode = CurrentModel.Output;
                }

                //DataTable DT = sourceCodeListObj.Output.ConvertJsonToDataTable();

                ParentModelData PM = new ParentModelData
                {
                    ListOfOutputColumn = sourceCodeListObj.Output.ConvertJsonToDataTable().GetColumnHeaders(),
                    Output = Output_Of_SOurceCode,
                    SourceCode = SOurceCode,
                    AccumulateCode = sb.ToString()

                };

                return PM;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public async Task<ParentModelData> GetOutputColumnWithCode_ForJoin(string currentModel, string SaveType)
        {
            try
            {
                var pipeLineInfo = await ReadPipelineData();
                var SOurceCode = "";
                var Output_Of_SOurceCode = "";
                var sourceCodeListObj = pipeLineInfo.ListOfSource.FirstOrDefault(dc => dc.EntityName == currentModel);

                var CurrentModel = pipeLineInfo.ListOfSource.FirstOrDefault(dc => dc.EntityName == currentModel);
                var lastEntityName = pipeLineInfo.ListOfSource
                                  .Select(dc => dc.EntityName)
                                  .LastOrDefault();


                if (CurrentModel == null)
                    SOurceCode = "";
                else
                {
                    SOurceCode = CurrentModel.SourceCode;
                    Output_Of_SOurceCode = CurrentModel.Output;
                }

                #region Get AccumulateCode

                StringBuilder sb = new StringBuilder();
                //foreach (var config in pipelineModel.DataConfigurations)
                foreach (var config in pipeLineInfo.ListOfSource)
                {

                    //if (SaveType == "Update")
                    //{
                    //    if (config.SourceCode.Contains("DataTable source"))
                    //    {
                    //        config.SourceCode = config.SourceCode.Replace("source", $"{config.EntityName}");
                    //    }

                    //}

                    sb.AppendLine(config.SourceCode);
                }

                //if (SaveType == "Update" && lastEntityName == currentModel)
                //{
                //    if (sourceCodeListObj.SourceCode.Contains("source"))
                //    {
                //        sb.AppendLine($"return source;");
                //    }
                //    else//execute in update while update last Entity
                //    {
                //        sb.AppendLine($"return {currentModel};");
                //    }

                //}
                //else
                //{
                sb.AppendLine($"return {currentModel};");
                //}

                #endregion




                ParentModelData PM = new ParentModelData
                {
                    // ListOfOutputColumn = sourceCodeListObj.Output.ConvertJsonToDataTable().GetColumnHeaders(),
                    Output = Output_Of_SOurceCode,
                    SourceCode = SOurceCode,
                    AccumulateCode = sb.ToString()

                };

                return PM;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion


        #region ExcelData
        public async Task<DataTable> ConvertExcelToDataTable(IFormFile file)
        {
            try
            {
                return CommonMethodForExecuteQuery.ConvertExcelToDataTable(file);
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<DataTable> GetDataTableFromExcel(string filePath)
        {
            try
            {
                return CommonMethodForExecuteQuery.GetDataTableFromExcel(filePath);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<string> SaveExcelConfiguration(ExcelModal request)
        {
            try
            {
                var pipeLineInfo = await ReadPipelineData();


                var sourceCodeListObjNew = pipeLineInfo.ListOfSource
               .FirstOrDefault(dc => dc.EntityName == request.EntityName);



                var msg = "";

                if (sourceCodeListObjNew is null)//for insert
                {


                    int counter_ListOfDataSource = 0;
                    if (pipeLineInfo.ListOfSource.Count > 0)
                        counter_ListOfDataSource = pipeLineInfo.ListOfSource.Count + 1;
                    else
                        counter_ListOfDataSource = 1;

                    pipeLineInfo.ListOfSource.Add(new DataSources
                    {
                        Index = counter_ListOfDataSource,
                        SourceCode = request.SourceCode,
                        EntityName = request.EntityName,

                        Output = request.Output,
                        ExcelConfiguration = new ExcelModal
                        {
                            FilePath = request.FilePath

                        }
                    });


                    msg = "Data submitted and saved successfully.";
                }
                else//Update
                {
                    sourceCodeListObjNew.SourceCode = request.SourceCode;
                    sourceCodeListObjNew.EntityName = request.EntityName;
                    sourceCodeListObjNew.Output = request.Output;
                    sourceCodeListObjNew.ExcelConfiguration = new ExcelModal
                    {
                        FilePath = request.FilePath

                    };
                    msg = "Data Updated and saved successfully.";
                }
                System.IO.File.WriteAllText(PipelinePath, JsonConvert.SerializeObject(pipeLineInfo));
                return msg;
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
                throw;
            }
        }

        public async Task<string> RemoveEntityFromJsonSourceList(string ENtity)
        {
            try
            {


                var pipeLineInfo = await ReadPipelineData();
                if (ENtity == "datamapper")
                {
                    pipeLineInfo.DataMappingConfigurationDetails = new DataMappingConfiguration();
                    System.IO.File.WriteAllText(PipelinePath, JsonConvert.SerializeObject(pipeLineInfo));
                    return "Success";
                }
                else if (ENtity == "saveconfiguration")
                {
                    pipeLineInfo.SyncConfiguration = new DataSyncConfiguration();
                    System.IO.File.WriteAllText(PipelinePath, JsonConvert.SerializeObject(pipeLineInfo));
                    return "Success";
                }
                else
                {
                    var sourceCodeListObjNew = pipeLineInfo.ListOfSource
               .FirstOrDefault(dc => dc.EntityName == ENtity);
                    if (sourceCodeListObjNew != null)
                    {
                        pipeLineInfo.ListOfSource.Remove(sourceCodeListObjNew);
                        System.IO.File.WriteAllText(PipelinePath, JsonConvert.SerializeObject(pipeLineInfo));
                        return "Success";
                    }
                    else
                    {
                        return "Entity Name Does Not Exist";
                    }
                }

            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        public async Task<string> ReOrderingListOfSource(string NewleyCreatedNode, string TargetNode)
        {
            // Read the pipeline data
            var pipeLineInfo = await ReadPipelineData();

            // Find the index of both NewleyCreatedNode and TargetNode in the ListOfSource
            var newlyCreatedNodeIndex = pipeLineInfo.ListOfSource
                .FindIndex(dc => dc.EntityName == NewleyCreatedNode);
            var targetIndex = pipeLineInfo.ListOfSource
                .FindIndex(dc => dc.EntityName == TargetNode);

            if (newlyCreatedNodeIndex != -1 && targetIndex != -1)
            {
                // Check if reordering is necessary (only if the new node is after the target node)
                if (newlyCreatedNodeIndex > targetIndex)
                {
                    // Remove NewleyCreatedNode from its current position
                    var newEntity = pipeLineInfo.ListOfSource[newlyCreatedNodeIndex];
                    pipeLineInfo.ListOfSource.RemoveAt(newlyCreatedNodeIndex);

                    // Recalculate targetIndex because the list size changed
                    targetIndex = pipeLineInfo.ListOfSource
                        .FindIndex(dc => dc.EntityName == TargetNode);

                    // Insert NewleyCreatedNode before the TargetNode
                    pipeLineInfo.ListOfSource.Insert(targetIndex, newEntity);

                    // Reassign the Index for all items after reordering
                    for (int i = 0; i < pipeLineInfo.ListOfSource.Count; i++)
                    {
                        pipeLineInfo.ListOfSource[i].Index = i + 1;  // Assuming there's an Index property
                    }

                    // Save the updated pipeline data back to the file
                    System.IO.File.WriteAllText(PipelinePath, JsonConvert.SerializeObject(pipeLineInfo));

                    return "Success";
                }
                else
                {
                    return "Reordering not necessary: NewleyCreatedNode is already before TargetNode.";
                }
            }
            else
            {
                // Return error if either node is not found
                return "Entity Name Does Not Exist";
            }
        }
        #endregion
    }
}
