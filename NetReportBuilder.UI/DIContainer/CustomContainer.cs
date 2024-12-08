using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NetReportBuilder.ReportUI.Factory;
using NetReportBuilder.ReportUI.Repositories;
using System.Collections.Generic;

namespace NetReportBuilder.ReportUI.DIContainer
{
    public static class CustomContainer
    {
        public static void AddCustomContainer(this IServiceCollection services, IConfiguration configuration)
        {
            IConnectionFactory connectionFactory = new ConnectionFactory(configuration.GetConnectionString("DefaultConnection"));
            services.AddSingleton(connectionFactory);
            services.AddScoped<IConfigurationDetails, ConfigurationDetails>();
            services.AddScoped<IDashBoardConfig, DashBoardConfig>();
            services.AddScoped<IMemCache, MemCache>();

        }

    }
}
