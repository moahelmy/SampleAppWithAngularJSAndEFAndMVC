using System;
using System.Net;
using System.Net.Http;
using System.Web.Http.Filters;

namespace Courses.Api.Filters
{
    public class NotImplementedFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext context)
        {
            base.OnException(context);

            if(context.Exception is NotImplementedException)
            {
                context.Response = new HttpResponseMessage(HttpStatusCode.NotImplemented);
            }
        }
    }
}
