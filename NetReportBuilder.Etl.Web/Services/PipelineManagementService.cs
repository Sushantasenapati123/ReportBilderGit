using Hangfire;
using NetReportBuilder.Etl.Model;

namespace NetReportBuilder.Etl.Web
{
    public delegate RecurringJobService RecurringJobServiceResolver(DataSourceType dataSource);
    public delegate ICustomCodeExecuter CustomCodeExecuterResolver(string codeType);
    public delegate ICSharpCodeExecuter CustomCSharpCodeExecuterResolver(string codeType);
    public class PipelineManagementService : IPipelineManagementService
    {
        private readonly IRecurringJobManager _recurringJobManager;
        private readonly RecurringJobServiceResolver _jobServiceResolver;
        private readonly ILogger<PipelineManagementService> _logger;
        private readonly Dictionary<ExecutionMode, Func<RecurringJobService, SavePipelineConfigurationViewModel, Task>> JobDictionary = new Dictionary<ExecutionMode, Func<RecurringJobService, SavePipelineConfigurationViewModel, Task>>();
        public PipelineManagementService(IRecurringJobManager recurringJobManager, RecurringJobServiceResolver jobServiceResolver, ILogger<PipelineManagementService> logger)
        {
            _recurringJobManager = recurringJobManager;
            _jobServiceResolver = jobServiceResolver;
            _logger = logger;
            JobDictionary.Add(ExecutionMode.Hourly, CreateHourlyJob);
            JobDictionary.Add(ExecutionMode.Minutely, CreateMinutelyJob);
            JobDictionary.Add(ExecutionMode.Weekly, CreateWeeklyJob);
            JobDictionary.Add(ExecutionMode.Daily, CreateDailyJob);
            JobDictionary.Add(ExecutionMode.Monthly, CreateMonthlyJob);


        }
        #region Jobs
        private async Task CreateHourlyJob(RecurringJobService recurringJobService, SavePipelineConfigurationViewModel createPipelineModel)
        {
            _recurringJobManager.AddOrUpdate($"{createPipelineModel.PipelineName}", () => recurringJobService.Execute(createPipelineModel.PipelineName), Cron.HourInterval(createPipelineModel.ExecutionInterval.HoursInterval));
        }
        private async Task CreateWeeklyJob(RecurringJobService recurringJobService, SavePipelineConfigurationViewModel createPipelineModel)
        {
            _recurringJobManager.AddOrUpdate($"{createPipelineModel.PipelineName}", () => recurringJobService.Execute(createPipelineModel.PipelineName), Cron.Weekly((DayOfWeek)Enum.Parse(typeof(DayOfWeek), createPipelineModel.ExecutionInterval.WeekDay), createPipelineModel.ExecutionInterval.Hour, createPipelineModel.ExecutionInterval.Minute));
        }
        private async Task CreateMonthlyJob(RecurringJobService recurringJobService, SavePipelineConfigurationViewModel createPipelineModel)
        {
            _recurringJobManager.AddOrUpdate($"{createPipelineModel.PipelineName}", () => recurringJobService.Execute(createPipelineModel.PipelineName), Cron.Monthly(createPipelineModel.ExecutionInterval.Day
                           , createPipelineModel.ExecutionInterval.Hour, createPipelineModel.ExecutionInterval.Minute));
        }
        private async Task CreateDailyJob(RecurringJobService recurringJobService, SavePipelineConfigurationViewModel createPipelineModel)
        {
            _recurringJobManager.AddOrUpdate($"{createPipelineModel.PipelineName}", () => recurringJobService.Execute(createPipelineModel.PipelineName), Cron.Daily(createPipelineModel.ExecutionInterval.Hour, createPipelineModel.ExecutionInterval.Minute));
        }
        private async Task CreateMinutelyJob(RecurringJobService recurringJobService, SavePipelineConfigurationViewModel createPipelineModel)
        {
            _recurringJobManager.AddOrUpdate($"{createPipelineModel.PipelineName}", () => recurringJobService.Execute(createPipelineModel.PipelineName), Cron.MinuteInterval(createPipelineModel.ExecutionInterval.MinutesInterval));

        }
        #endregion

        private async Task ScheduleJob(RecurringJobService recurringJobService, SavePipelineConfigurationViewModel createPipelineModel)
        {
            try
            {
                ExecutionMode executionMode = (ExecutionMode)(Enum.Parse(typeof(ExecutionMode), createPipelineModel.ExecutionMode));
                var currentJob = JobDictionary[executionMode];

                if (currentJob is null)
                    throw new NotImplementedException();

                currentJob.Invoke(recurringJobService, createPipelineModel);
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
            }
        }


        //call on SavePipeline Configuration
        public async Task ScheduleJob(SavePipelineConfigurationViewModel createPipelineModel)
        {
            try
            {
                if (createPipelineModel is null)
                    throw new ArgumentNullException("Required parameters are missing");
                //var dataSource = (DataSourceType)Enum.Parse(typeof(DataSourceType), createPipelineModel.DataSourceType);
                RecurringJobService jobService = _jobServiceResolver(DataSourceType.APICUSTOMCODE);
                await ScheduleJob(jobService, createPipelineModel);
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex}");
            }
        }
    }
}
