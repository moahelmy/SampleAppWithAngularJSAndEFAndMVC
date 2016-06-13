using System.Web.Mvc;

namespace Courses.Api.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            //ViewBag.Title = "Home Page";

            //return View();

            return RedirectToAction("Index", "Help", new { Area = "" });
        }
    }
}
