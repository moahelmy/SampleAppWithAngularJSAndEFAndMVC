using System.Web.Mvc;

namespace Courses.Web.Controllers
{
    public class SettingsController : Controller
    {
        // GET: Settings
        public ActionResult Index()
        {
            ViewBag.apiURL = Properties.Settings.Default.ApiUrl;
            return View();
        }
    }
}