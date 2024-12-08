using NetReportBuilder.Etl.Model;

namespace NetReportBuilder.Etl.Web
{
    public interface IPipelineManagementService
    {
        Task ScheduleJob(SavePipelineConfigurationViewModel createPipelineModel);
    }
}
