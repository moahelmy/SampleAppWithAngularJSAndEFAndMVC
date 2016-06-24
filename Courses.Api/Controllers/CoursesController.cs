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
    [RoutePrefix("api/courses")]
    public class CoursesController : BaseApiController
    {
        private readonly ICoursesService _coursesService;
        private readonly IStudentsService _studentsService;
        private readonly IMapper _mapper;

        public CoursesController(ICoursesService coursesSvc, IStudentsService studentsSvc, IMapper mapper)
        {
            _coursesService = coursesSvc;
            _studentsService = studentsSvc;
            _mapper = mapper;
        }

        [Route("")]
        public IEnumerable<CourseViewModel> Get()
        {
            return _coursesService.ListAll().Select(x => _mapper.Map<CourseDetails, CourseViewModel>(x)).ToList();
        }

        [Route("{id:Guid}")]
        [HttpGet]
        public CourseViewModel Get(Guid id)
        {
            var course = _coursesService.Get(id);
            return course == null ? null : _mapper.Map<CourseDetails, CourseViewModel>(course);
        }

        [Route("{id:Guid}/students")]
        [HttpGet]
        public IHttpActionResult Students(Guid id)
        {
            var result = _studentsService.GetCourseStudents(id);
            if (result.Succeed)
            {
                return Ok(result.Return.Select(x => _mapper.Map<StudentDetails, StudentViewModel>(x)).ToList());
            }
            return ResultToHttpActionResult(result);
        }

        [Route("")]
        public IHttpActionResult Post([FromBody]CourseModel course)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = _coursesService.Create(_mapper.Map<CourseModel, CourseDetails>(course));
            return ResultToHttpActionResult(result, x => _mapper.Map<CourseDetails, CourseViewModel>(x));
        }

        [Route("{id:Guid}")]
        [HttpPut]
        public IHttpActionResult Put(Guid id, [FromBody]CourseModel course)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var courseDetails = _mapper.Map<CourseModel, CourseDetails>(course);
            courseDetails.Id = id;
            var result = _coursesService.Update(courseDetails);
            return ResultToHttpActionResult(result, x => _mapper.Map<CourseDetails, CourseViewModel>(x));
        }

        [Route("{id:Guid}")]
        public IHttpActionResult Delete(Guid id)
        {
            var result = _coursesService.Delete(id);
            return ResultToHttpActionResult(result, x => _mapper.Map<CourseDetails, CourseViewModel>(x));
        }
    }
}
