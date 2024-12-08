using etReportBuilder.Etl.Web;
using NetReportBuilder.Etl.Business;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using NLog.Web;


namespace NetReportBuilder.Etl.Web
{
    public static class ServiceExtensions
    {
        public static void RegisterDependencies(this IServiceCollection services)
        {
            services.AddHttpContextAccessor();
            services.AddDistributedMemoryCache().
            AddSingleton<IHttpContextAccessor, HttpContextAccessor>().
            AddTransient<ApiRecurringJobService>().
            AddTransient<ApiCustomecodeRecurringJobService>().
            AddTransient<FileRecurringJobService>().
            AddTransient<DatabaseRecurringJobService>().
            AddTransient<CustomCodeRecurringJobService>().
            AddTransient<CustomApiCodeExecuter>().
            AddTransient<CustomFileCodeExecuter>().
            AddTransient<CustomDatabaseCodeExecuter>().
            AddTransient<IHttpUtility, HttpUtility>().
            AddTransient<IApiConnectorBusinessService, ApiConnectorBusinessService>().
            AddTransient<IDataMapperBusinessService, DataMapperBusinessService>().
             AddTransient<IDataBaseConnectorBusinessService, DataBaseConnectorBusinessService>().
            AddTransient<IPipelineManagementService, PipelineManagementService>().
            AddTransient<IDataSyncBusiness, DataSyncBusiness>().
            AddTransient<IPipelineConfigurationBusiness, PipelineConfigurationBusiness>().
            AddTransient<ApiCodeExecuter>().
            AddTransient<GenericDatabaseQueryExecutor>().
            AddTransient<ICodeGenerator, CodeGenerator>().
            AddTransient<IDataTransformationBusiness, DataTransformationBusiness>();
            

            services.AddTransient<CustomCSharpCodeExecuterResolver>(serviceProvider => key =>
            {
                switch (key)
                {
                    case "API":
                        return serviceProvider.GetService<ApiCodeExecuter>();
                    case "FILE":
                        throw new KeyNotFoundException();
                    case "RDBMS":
                        return serviceProvider.GetService<GenericDatabaseQueryExecutor>();
                    default:
                        throw new KeyNotFoundException();
                }
            });

            services.AddTransient<CustomCodeExecuterResolver>(serviceProvider => key =>
            {
                switch (key)
                {
                    case "API":
                        return serviceProvider.GetService<CustomApiCodeExecuter>();
                    case "FILE":
                        return serviceProvider.GetService<CustomFileCodeExecuter>();
                    case "RDBMS":
                        return serviceProvider.GetService<CustomDatabaseCodeExecuter>();
                    default:
                        throw new KeyNotFoundException();
                }
            });

            services.AddTransient<RecurringJobServiceResolver>(serviceProvider => key =>
            {
                switch (key)
                {
                    case DataSourceType.API:
                        return serviceProvider.GetService<ApiRecurringJobService>();
                    case DataSourceType.FILE:
                        throw new KeyNotFoundException();
                    case DataSourceType.RDBMS:
                        throw new KeyNotFoundException();
                    case DataSourceType.CUSTOMCODE:
                        return serviceProvider.GetService<CustomCodeRecurringJobService>();
                    default:
                        return serviceProvider.GetService<ApiCustomecodeRecurringJobService>();//this only use for all to execute code
                }
            });
        }

        public static void InitializeLogger(this WebApplicationBuilder builder)
        {
            // NLog: Setup NLog for Dependency injection
            builder.Logging.ClearProviders();
            builder.Logging.SetMinimumLevel(Microsoft.Extensions.Logging.LogLevel.Trace);
            builder.Host.UseNLog();
        }
    }
}
