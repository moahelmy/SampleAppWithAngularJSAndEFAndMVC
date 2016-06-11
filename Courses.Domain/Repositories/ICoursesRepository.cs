using Courses.Domain.Entities;
using Swart.DomainDrivenDesign;
using System;

namespace Courses.Domain.Repositories
{
    public interface ICoursesRepository:IBaseRepository<Course>
    {
        IListResult<Student> GetStudents(Guid courseId);
    }
}
