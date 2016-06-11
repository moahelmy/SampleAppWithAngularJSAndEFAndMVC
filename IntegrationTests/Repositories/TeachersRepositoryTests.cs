using Courses.Domain.Entities;
using Courses.Repositories;
using System;

namespace IntegrationTests.Repositories
{
    public class TeachersRepositoryTests : RepositoryTests<TeachersRepository, Teacher, Guid>
    {
        protected override Teacher CreateValidEntity()
        {
            return Factory.CreateValidTeacher();
        }
    }
}
