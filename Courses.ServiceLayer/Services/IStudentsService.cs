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
        IListResult<Student> GetCourseStudents(Guid courseId);
        IResult<Student> AddStudentToCourse(StudentDetails student, Guid courseId);
        IResult<Student> AddStudentToCourse(Guid studentId, Guid courseId);
        IResult<Student> Update(StudentDetails student);
        IResult<Student> RemoveStudentFromCourse(Guid studentId, Guid courseId);
        IResult<Student> Delete(Guid id);
    }
}
