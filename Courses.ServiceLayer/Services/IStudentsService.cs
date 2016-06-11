using Courses.DataTransferObjects;
using Courses.Domain.Entities;
using Swart.DomainDrivenDesign;
using System;

namespace Courses.Services
{
    public interface IStudentsService
    {
        IListResult<Student> GetCourseStudents(Guid courseId);
        IResult<Student> AddStudentToCourse(Guid studentId, Guid courseId);
        IResult<Student> UpdateStudentDetails(StudentDetails student);
        IResult<Student> RemoveStudentFromCourse(Guid studentId, Guid courseId);
        IResult<Student> DeleteStudent(Guid id);
    }
}
