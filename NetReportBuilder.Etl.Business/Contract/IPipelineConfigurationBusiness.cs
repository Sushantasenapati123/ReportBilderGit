using NetReportBuilder.Etl.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Business
{
    public interface IPipelineConfigurationBusiness
    {
        Task<PipelineDetails> LoadConfiguration();
        Task<CreatePipelineModel> GenerateApiRequestFromModel(SavePipelineConfigurationViewModel model);
        Task<string> UpdatePipelineConfigurationFileForDataSyncMode(string DataSyncMode,string ExecutionMode, ExecutionInterval ev,string descrption);
        Task<string> SaveConfiguration(CreatePipelineModel createPipelineModel);
        Task<string> DeleteConfiguration(string PipeLineName);

       
        Task<PipelineModel> FetchPipelineConfigurationByName(string ID);
        Task<List<PipelineModel>> FetchPipelineExecutionHistoryById(int ID);
    }
}
