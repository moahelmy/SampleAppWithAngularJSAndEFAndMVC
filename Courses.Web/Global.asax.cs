using System;
using System.Web;
using System.Web.Routing;

namespace Courses.Web
{
    public class Global : HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }        
    }
}