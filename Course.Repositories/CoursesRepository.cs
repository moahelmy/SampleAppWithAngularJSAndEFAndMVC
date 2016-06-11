using Courses.Domain.Entities;
using Courses.Domain.Repositories;
using Swart.DomainDrivenDesign;
using Swart.Repositories.EntityFramework;
using System;
using System.Data.Entity;
using System.Linq;

namespace Courses.Repositories
{
    public class CoursesRepository:Repository<Course, Guid>, ICoursesRepository
    {
        public CoursesRepository(ICoursesUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IListResult<Student> GetStudents(Guid courseId)
        {
            var cls = List().Include(c => c.Students).FirstOrDefault(c => c.Id == courseId);
            if (cls != null)
                return new ListResult<Student> { Return = cls.Students.ToList() };
            return new ListResult<Student>().AddErrorMessage("Course not found");
        }
    }
}
