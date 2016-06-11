using Swart.DomainDrivenDesign;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Courses.Api.Controllers
{
    public class BaseApiController : ApiController
    {
        protected void HandleResult(IVoidResult result)
        {
            if(!result.Succeed)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, string.Join("\r\n", result.Messages)));
            }
        }        
    }
}
