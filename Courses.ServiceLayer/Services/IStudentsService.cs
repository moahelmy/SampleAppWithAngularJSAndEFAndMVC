using Courses.DataTransferObjects;
using Courses.Domain.Entities;
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
        IResult<Student> Create(StudentDetails student, Guid courseId);
        IResult<Student> Enrol(Guid studentId, Guid courseId);
        IResult<Student> Update(StudentDetails student);
        IResult<Student> RemoveStudentFromCourse(Guid studentId, Guid courseId);
        IResult<Student> Delete(Guid id);
    }
}
