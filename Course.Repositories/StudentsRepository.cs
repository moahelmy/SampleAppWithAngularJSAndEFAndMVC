using Courses.Domain.Entities;
using Courses.Domain.Repositories;
using Swart.Repositories.EntityFramework;
using System;

namespace Courses.Repositories
{
    public class StudentsRepository : Repository<Student, Guid>, IStudentsRepository
    {
        public StudentsRepository(ICoursesUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}
