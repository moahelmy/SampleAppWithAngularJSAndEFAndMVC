using Courses.Api.Models;
using Courses.Domain.Exceptions;
using Courses.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Courses.Api.Controllers
{
    [Authorize]
    public class TeachersController : BaseApiController
    {
        private readonly ITeachersService _teachersService;

        public TeachersController(ITeachersService teachersService)
        {
            _teachersService = teachersService;
        }

        public IEnumerable<TeacherModel> Get()
        {
            return  _teachersService.All().Select(x => new TeacherModel
            {
                Id = x.Id,
                Name = x.Name,
            });
        }

        public TeacherModel Get(Guid id)
        {
            var teacher = _teachersService.GetIfExists(id);
            return teacher == null ? null : new TeacherModel
            {
                Id = teacher.Id,
                Name = teacher.Name
            };
        }

        public void Post([FromBody]string name)
        {
            try {
                var result = _teachersService.Add(name);
                HandleResult(result);
            }
            catch (FullNameIsEmptyOrSingleException)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid name"));
            }
        }

        public void Put(Guid id, [FromBody]string name)
        {
            try
            {
                var result = _teachersService.Update(id, name);
                HandleResult(result);
            }
            catch (FullNameIsEmptyOrSingleException)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid name"));
            }
        }

        public void Delete(Guid id)
        {
            var result = _teachersService.Delete(id);
            HandleResult(result);
        }
    }
}
