using Swart.DomainDrivenDesign;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Courses.Api.Controllers
{
    [EnableCors("*", "*", "*")]
    public class BaseApiController : ApiController
    {
        protected void HandleResult(IVoidResult result)
        {
            if(!result.Succeed)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ConstructErrorMessages(result)));
            }
        }

        protected IHttpActionResult ResultToHttpActionResult(IVoidResult result)
        {
            if (result.Succeed)
                return Ok();
            return BadRequest(ConstructErrorMessages(result));
        }

        protected IHttpActionResult ResultToHttpActionResult<T>(IResult<T> result)
        {
            if (result.Succeed)
                return Ok(result.Return);
            return BadRequest(ConstructErrorMessages(result));
        }

        protected IHttpActionResult ResultToHttpActionResult<T, TValue>(IResult<T> result, Func<T, TValue> transform)
        {
            if (result.Succeed)
                return Ok(transform(result.Return));
            return BadRequest(ConstructErrorMessages(result));
        }

        private string ConstructErrorMessages(IVoidResult result)
        {
            return string.Join("\r\n", result.Messages);
        }
    }
}
