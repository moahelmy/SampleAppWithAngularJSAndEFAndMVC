using Courses.Api.Models;
using Courses.Domain.Exceptions;
using Courses.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Courses.Api.Controllers
{
    // At the moment I'm ignoreing security
    //[Authorize]
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
            var teacher = _teachersService.Get(id);
            return teacher == null ? null : new TeacherModel
            {
                Id = teacher.Id,
                Name = teacher.Name
            };
        }

        public IHttpActionResult Post([FromBody]string name)
        {
            try {
                var result = _teachersService.Add(name);
                return ResultToHttpActionResult(result);
            }
            catch (FullNameIsEmptyOrSingleException)
            {
                return BadRequest("Invalid name");
            }
        }

        public IHttpActionResult Put(Guid id, [FromBody]string name)
        {
            try
            {
                var result = _teachersService.Update(id, name);
                return ResultToHttpActionResult(result);                
            }
            catch (FullNameIsEmptyOrSingleException)
            {
                return BadRequest("Invalid name");
            }
        }

        public IHttpActionResult Delete(Guid id)
        {
            var result = _teachersService.Delete(id);
            return ResultToHttpActionResult(result);
        }
    }
}
