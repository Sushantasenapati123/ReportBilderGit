using System.ComponentModel;
using System.Data;

namespace NetReportBuilder.Etl.Model
{
    public class Response
    {
        public string SchemaInfo { get; set; }

        public List<string> Message { get; set; } = new List<string>();
        public string Result { get; set; }
        public List<ColumnDetails> ListOfProperties { get; set; }

        public bool IsSuccessfullyCompile { get; set; } = false;
        public bool IsSuccessfullyExecute { get; set; } = false;
        public string RuntimeExceptionMsg { get; set; }
    }



    public class QueryRequest
    {

        public string ConnectionString { get; set; }


        public string Query { get; set; }

    }
    public class QueryResponce
    {
        public List<string> Message { get; set; } = new List<string>();
        public DataTable Result { get; set; }
        public string SchemaInfo { get; set; }

        public List<ColumnDetails> ListOfProperties { get; set; }

        public bool IsSuccessfullyCompile { get; set; } = false;
    }
    public class ColumnDetails
    {

        public string Column_Name { get; set; }

        public string Column_Type { get; set; }


    }
    public class CompilationModel
    {

        public string Input { get; set; }


        public string Output { get; set; }

        public static CompilationModel Instance => new CompilationModel { Input = string.Empty, Output = string.Empty };
    }
    public class DataMapperInitParams
    {
        public string PipelineName { get; set; }
        public string DisplaySection { get; set; }
        public string Response { get; set; }
        public string APIResponseTYpe { get; set; }
        public string DataSourceType { get; set; }
    }
    public class CreatePipelineModel
    {
        [DisplayName("Pipeline Name")]
        public string FileName { get; set; }
        [DisplayName("Description")]

        public string DrowFlowJson { get; set; }

        public string Description { get; set; }

        [DisplayName("Status")]
        public int Status { get; set; }

        [DisplayName("DataSyncModes Mode")]
        public int DataSyncModes { get; set; }

        [DisplayName("Execution Mode")]

        public int ExecutionMode { get; set; }
        [DisplayName("Datasource Type")]

        public int DataSourceType { get; set; }
        [DisplayName("Day")]

        public int WeekDay { get; set; }
        [DisplayName("Day")]

        public int Day { get; set; }
        [DisplayName("Hour")]

        public int Hour { get; set; }
        [DisplayName("Minute")]

        public int Minute { get; set; }
        [DisplayName("FileContent")]

        public byte[] FileContent { get; set; }


    }

    public enum PipelineStatus
  {
     NotStarted,
     Started,
     InProgress,
     Failed,
     Successful,
     Completed,
  }
   public enum ExecutionMode
   {
        Daily,
        Weekly,
        Hourly,
        Monthly,
        Minutely,
   }
    public class PipelineModel
    {
        public string DrowFlowJson { get; set; }
        [DisplayName("Id")]
        public int Id { get; set; }

        [DisplayName("FileContent")]
        public byte[] FileContent { get; set; }


        [DisplayName("Pipeline Name")]
        public string FileName { get; set; }
        [DisplayName("Description")]

        public string Description { get; set; }
        
        [DisplayName("Status")]
        public int Status { get; set; }
        [DisplayName("Last Executed On")]

        public string LastExecutedOn { get; set; }
        [DisplayName("Comments")]
        public string Comments { get; set; }
        [DisplayName("Error")]
        public string ErrorDetails { get; set; }
        [DisplayName("Execution Mode")]

        public int ExecutionMode { get; set; }
        [DisplayName("Data Source Type")]
        public int DataSourceType { get; set; }
        [DisplayName("StatusMessage")]
        public string StatusMessage { get; set; }
        public string ExecutionModeLabel
        {
            get
            {
               return ((ExecutionMode)ExecutionMode).ToString();
            }
        }
        public string StatusLabel
        {
            get
            {
                return ((PipelineStatus)Status).ToString();
            }
        }
        public string DataSourceTypeLabel
        {
            get
            {
                return ((DataSourceType)DataSourceType).ToString();
            }
        }

    }
   
   

}
