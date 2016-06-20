using AutoMapper;
using Courses.Api.Models;
using Courses.DataTransferObjects;
using Courses.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Courses.Api.Controllers
{
    public class CoursesController : BaseApiController
    {
        private readonly ICoursesService _coursesService;
        private readonly IStudentsService _studentsService;

        public CoursesController(ICoursesService coursesSvc, IStudentsService studentsSvc)
        {
            _coursesService = coursesSvc;
            _studentsService = studentsSvc;
        }

        [Route("api/courses")]
        public IEnumerable<CourseViewModel> Get()
        {
            return _coursesService.ListAll().Select(x => Mapper.Map<CourseDetails, CourseViewModel>(x)).ToList();
        }

        [Route("api/courses")]
        public CourseViewModel Get(Guid id)
        {
            var course = _coursesService.Get(id);
            return course == null ? null : Mapper.Map<CourseDetails, CourseViewModel>(course);
        }

        [Route("api/courses/{courseId}/students")]
        public IHttpActionResult Students(Guid id)
        {
            var result = _studentsService.GetCourseStudents(id);
            if (result.Succeed)
            {
                return Ok(result.Return.Select(x => Mapper.Map<StudentDetails, StudentViewModel>(x)).ToList());
            }
            return ResultToHttpActionResult(result);            
        }

        [Route("api/courses")]
        public IHttpActionResult Post([FromBody]CourseModel course)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = _coursesService.Create(Mapper.Map<CourseModel, CourseDetails>(course));
            return ResultToHttpActionResult(result);
        }

        [Route("api/courses")]
        public IHttpActionResult Put(Guid id, [FromBody]CourseModel course)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var courseDetails = Mapper.Map<CourseModel, CourseDetails>(course);
            courseDetails.Id = id;
            var result = _coursesService.Update(courseDetails);
            return ResultToHttpActionResult(result);
        }

        [Route("api/courses")]
        public IHttpActionResult Delete(Guid id)
        {
            var result = _coursesService.Delete(id);
            return ResultToHttpActionResult(result);
        }
    }
}
