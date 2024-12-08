using NetReportBuilder.Etl.Model;
using NLog;
using NLog.Web;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Controllers;
using System.Security.Claims;
using NetReportBuilder.Etl.Web;
using Microsoft.AspNetCore.Hosting;
using Hangfire;
using NetReportBuilder.ReportUI.DIContainer;
using System.Data;
var logger = NLog.LogManager.Setup().LoadConfigurationFromAppSettings().GetCurrentClassLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    // Add services to the container.
    builder.Services.AddControllersWithViews().AddRazorRuntimeCompilation();
    builder.InitializeLogger();
    builder.Services.AddCustomContainer(builder.Configuration);
    #region Hang fire configuration
    builder.Services.AddHangfire(x =>
    {
        x.UseSqlServerStorage(builder.Configuration.GetConnectionString("HangfireDbConnection"));
    });
    builder.Services.AddHangfireServer();
    #endregion
    builder.Services.RegisterDependencies();
    // Configure session options
    builder.Services.AddSession(options =>
    {
        options.IdleTimeout = TimeSpan.FromMinutes(60); // Set session timeout
    });


    var app = builder.Build();
    // Configure the HTTP request pipeline.
    if (!app.Environment.IsDevelopment())
    {
        app.UseExceptionHandler("/Home/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }
    app.UseHttpsRedirection();
    app.UseStaticFiles();
    app.UseRouting();
    app.UseSession();
    app.UseAuthentication();
    app.UseAuthorization();
    //app.UseEndpoints(endpoints =>
    //{
    //    endpoints.MapControllerRoute(
    //        name: "default",
    //        pattern: "{controller=pipelinedashboard}/{action=Index}/{id?}");
    //});
    //app.MapControllerRoute(
    //    name: "default",
    //    pattern: "{controller=pipelinedashboard}/{action=Index}/{id?}");


    //app.MapControllerRoute(
    //name: "default",
    //pattern: "{controller=ReportBuilderUI}/{action=ReportPotlate}/{id?}");
    app.MapControllerRoute(
    name: "default",
    pattern: "{controller=MAIN}/{action=login}/{id?}");

    app.UseHangfireDashboard();

   



    app.Run();
}
catch (Exception ex)
{
    logger.Error(ex, "Stopped program because of exception");
    throw;
}
finally
{
    NLog.LogManager.Shutdown();

}


