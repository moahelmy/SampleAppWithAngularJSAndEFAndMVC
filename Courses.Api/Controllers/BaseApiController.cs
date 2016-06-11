﻿using Swart.DomainDrivenDesign;
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

        private string ConstructErrorMessages(IVoidResult result)
        {
            return string.Join("\r\n", result.Messages);
        }
    }
}
