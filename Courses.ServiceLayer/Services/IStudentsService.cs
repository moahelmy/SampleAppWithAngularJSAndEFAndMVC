using Courses.DataTransferObjects;
using Swart.DomainDrivenDesign;
using System;
using System.Collections.Generic;

namespace Courses.Services
{
    public interface IStudentsService
    {
        IReadOnlyCollection<StudentDetails> All();
        StudentDetails Get(Guid id);
        IListResult<StudentDetails> GetCourseStudents(Guid courseId);
        IResult<StudentDetails> Create(StudentDetails student, Guid courseId);
        IResult<StudentDetails> Enrol(Guid studentId, Guid courseId);
        IResult<StudentDetails> Update(StudentDetails student);
        IResult<StudentDetails> RemoveStudentFromCourse(Guid studentId, Guid courseId);
        IResult<StudentDetails> Delete(Guid id);
    }
}
