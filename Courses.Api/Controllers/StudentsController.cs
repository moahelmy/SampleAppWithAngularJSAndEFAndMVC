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
    public class StudentsController : BaseApiController
    {
        private readonly IStudentsService _studentsService;

        public StudentsController(IStudentsService studentsService)
        {
            _studentsService = studentsService;
        }

        public IEnumerable<StudentViewModel> Get()
        {
            return _studentsService.All().Select(x => Mapper.Map<StudentDetails, StudentViewModel>(x)).ToList();
        }

        public StudentViewModel Get(Guid id)
        {
            var student = _studentsService.Get(id);
            return student == null ? null : Mapper.Map<StudentDetails, StudentViewModel>(student);
        }

        [Route("api/students/{studentId}/courses")]
        public StudentViewModel Courses(Guid id)
        {
            throw new NotImplementedException();
        }

        public IHttpActionResult Post([FromBody]StudentModel student)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = _studentsService.Create(Mapper.Map<StudentModel, StudentDetails>(student), student.CourseId.Value);
            return ResultToHttpActionResult(result);
        }
        
        public IHttpActionResult Put(Guid studentId, Guid courseId)
        {
            var result = _studentsService.Enrol(studentId, courseId);
            return ResultToHttpActionResult(result);
        }

        public IHttpActionResult Put(Guid id, [FromBody]StudentModel student)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var studentDetails = Mapper.Map<StudentModel, StudentDetails>(student);
            studentDetails.Id = id;
            var result = _studentsService.Update(studentDetails);
            return ResultToHttpActionResult(result);
        }

        [HttpPut]
        public IHttpActionResult RemoveStudentFromCourse(Guid studentId, Guid courseId)
        {
            var result = _studentsService.RemoveStudentFromCourse(studentId, courseId);
            return ResultToHttpActionResult(result);
        }

        public IHttpActionResult Delete(Guid id)
        {
            var result = _studentsService.Delete(id);
            return ResultToHttpActionResult(result);
        }
    }
}
