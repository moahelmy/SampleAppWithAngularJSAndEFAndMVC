using Courses.Domain.Entities;
using Courses.Domain.Repositories;
using Swart.Repositories.EntityFramework;
using System;

namespace Courses.Repositories
{
    public class TeachersRepository : Repository<Teacher, Guid>, ITeachersRepository
    {
        public TeachersRepository(ICoursesUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}
