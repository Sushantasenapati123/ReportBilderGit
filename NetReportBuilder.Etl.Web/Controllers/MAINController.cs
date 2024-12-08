using Microsoft.AspNetCore.Mvc;

namespace NetReportBuilder.Etl.Web.Controllers
{
    public class MAINController : Controller
    {
        public IActionResult Main()
        {
            return View();
        }
        public IActionResult login()
        {
            return View();
        }
    }
}
