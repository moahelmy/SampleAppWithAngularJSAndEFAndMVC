using System.Web.Http.Filters;

namespace Courses.Api.Filters
{
    public class ErrorFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext context)
        {
            base.OnException(context);
            // we can log errors here or transform http response            
        }
    }
}
