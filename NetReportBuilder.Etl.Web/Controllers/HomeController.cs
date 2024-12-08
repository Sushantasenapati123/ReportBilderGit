using Microsoft.AspNetCore.Mvc;
using NetReportBuilder.Etl.Web.Models;
using System.Diagnostics;

namespace NetReportBuilder.Etl.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IWebHostEnvironment _webHost;
        private readonly IConfiguration _configuration;
        public HomeController(IWebHostEnvironment webHost, IConfiguration configuration, ILogger<HomeController> logger)

        
        {
            _logger = logger;
            _webHost = webHost;
            _configuration = configuration;
        }

        public IActionResult IndexHom()
        {
            Class1 cl = new Class1();
            cl.Invoke();
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
