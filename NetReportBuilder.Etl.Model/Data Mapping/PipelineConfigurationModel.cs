using DatabaseConfiguration.Models.DatabaseConfiguration;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class PipelineConfigurationModel
    {
        public PipelineConfigurationModel()
        {
            //DataConfigurations = new List<DataConfigurationDetails>();
            DataMappingConfigurationDetails = new DataMappingConfiguration();
            SyncConfiguration = new DataSyncConfiguration();
            //DataTransformation = new List<DataTransformationModel>();
            ListOfSource = new List<DataSources>();
        }
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }

       // public List<DataConfigurationDetails> DataConfigurations { get; set; }
        public DataMappingConfiguration DataMappingConfigurationDetails { get; set; }
        public DataSyncConfiguration SyncConfiguration { get; set; }
        //public List<DataTransformationModel> DataTransformation { get; set; }
        public List<DataSources> ListOfSource { get; set; }

    }
    public class DataSources//List of DataSource to Store All DIV in Pipeline
    {
        public int Index { get; set; }
        public string EntityName { get; set; }
        public string SourceCode { get; set; }
        public string Output { get; set; }

        public string AccumulateCode { get; set; }
        public string DataBaseInputsModel { get; set; }//For DataBase Configuration
        public DataFilterModel Filter { get; set; }  //To Store Filter Configuration    

        public GroupByConditionModel GroupByFilter { get; set; }  //To Store GroupBY Configuration    
        public string Configuration { get; set; }//For API Configuration

        public ExcelModal ExcelConfiguration { get; set; }//For Excel DataSource

        public List<SelectedColumnDetails> SelectedColumns { get; set; }//For Join Transformation
        public List<RelationModel> JoinCondition { get; set; }////For Join Transformation


    }
    public class DataTransformationModel
    {
        public DataTransformationModel()
        {
            DataSources = new List<DataSourceModel>();
            Output = string.Empty;
        }
        public string SourceCode { get; set; }
        public List<SelectedColumnDetails> SelectedColumns { get; set; }
        public List<RelationModel> JoinCondition { get; set; }
        public List<DataSourceModel> DataSources { get; set; }
        public string Output { get; set; }
        public string EntityName { get; set; }
        public DataFilterModel Filter { get; set; }
    }
    public class ParentModelData//Use For FilterMOdel to Bind for View For Edit
    {
        public List<string> ListOfOutputColumn { get; set; }
        public string SourceCode { get; set; }
        public string Output { get; set; }
        public string AccumulateCode { get; set; }
    }

    public class ExcelModal
    {
        public string FilePath { get; set; }
        public string SourceCode { get; set; }
        public string Output { get; set; }
        public string EntityName { get; set; }
    }


    public class DataFilterModel
    {
        public string SourceEntityName { get; set; }
        public string EntityName { get; set; }
        public List<FilterModel> Filters { get; set; }
        public string SourceCode { get; set; }
        public string Output { get; set; }
        public string SaveType { get; set; }
    }
    public class GroupByConditionModel
    {
        public string SourceEntityName { get; set; }
        public string CurrentEntityName { get; set; }
        public string SourceCode { get; set; }
        public string Output { get; set; }

        public List<GroupByCondition> GroupByConditionList { get; set; }
      
    }
    public class GroupByCondition
    {
       

        public string OutputColumn { get; set; }
        public string DataType { get; set; }
        public string ActualColumn { get; set; }
        public string Operator { get; set; }
        public string FilterValue { get; set; }
        public string Alias { get; set; }
    }
    public class FilterModel
    {
        public string FieldName { get; set; }
        public string Condition { get; set; }
        public string ConditionValue { get; set; }
        public override string ToString()
        {
            return base.ToString();
        }
    }
    public class DataSourceModel
    {
        public int Sequence { get; set; }
        public List<SelectListItem> Columns { get; set; }
        public DataTable DataSource { get; set; }
        public string EntityName { get; set; }
    }

    
}
