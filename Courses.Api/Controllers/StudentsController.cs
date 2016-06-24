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
    [RoutePrefix("api/students")]
    public class StudentsController : BaseApiController
    {
        private readonly IStudentsService _studentsService;
        private readonly IMapper _mapper;

        public StudentsController(IStudentsService studentsService, IMapper mapper)
        {
            _studentsService = studentsService;
            _mapper = mapper;
        }

        [Route("")]
        public IEnumerable<StudentViewModel> Get()
        {
            return _studentsService.All().Select(x => _mapper.Map<StudentDetails, StudentViewModel>(x)).ToList();
        }

        [Route("{id:Guid}")]
        public StudentViewModel Get(Guid id)
        {
            var student = _studentsService.Get(id);
            return student == null ? null : _mapper.Map<StudentDetails, StudentViewModel>(student);
        }

        [Route("{studentId:Guid}/courses")]
        [HttpGet]
        public StudentViewModel Courses(Guid id)
        {
            throw new NotImplementedException();
        }

        [Route("")]
        public IHttpActionResult Post([FromBody]StudentModel student)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = _studentsService.Create(_mapper.Map<StudentModel, StudentDetails>(student), student.CourseId.Value);
            return ResultToHttpActionResult(result, x => _mapper.Map<StudentDetails, StudentViewModel>(x));
        }

        [Route("enrol/{studentId:Guid}/{courseId:Guid}")]
        public IHttpActionResult Put(Guid studentId, Guid courseId)
        {
            var result = _studentsService.Enrol(studentId, courseId);
            return ResultToHttpActionResult(result, x => _mapper.Map<StudentDetails, StudentViewModel>(x));
        }

        [Route("{id:Guid}")]
        public IHttpActionResult Put(Guid id, [FromBody]StudentModel student)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var studentDetails = _mapper.Map<StudentModel, StudentDetails>(student);
            studentDetails.Id = id;
            var result = _studentsService.Update(studentDetails);
            return ResultToHttpActionResult(result, x => _mapper.Map<StudentDetails, StudentViewModel>(x));
        }

        [Route("remove/{studentId:Guid}/{courseId:Guid}")]
        [HttpPut]
        public IHttpActionResult RemoveStudentFromCourse(Guid studentId, Guid courseId)
        {
            var result = _studentsService.RemoveStudentFromCourse(studentId, courseId);
            return ResultToHttpActionResult(result, x => _mapper.Map<StudentDetails, StudentViewModel>(x));
        }

        [Route("{id:Guid}")]
        public IHttpActionResult Delete(Guid id)
        {
            var result = _studentsService.Delete(id);
            return ResultToHttpActionResult(result, x => _mapper.Map<StudentDetails, StudentViewModel>(x));
        }
    }
}
