using Courses.Domain.Entities;
using Courses.Repositories;
using System;

namespace IntegrationTests.Repositories
{    
    public class CoursesRepositoryTests : RepositoryTests<CoursesRepository, Course, Guid>
    {
        protected override Course CreateValidEntity()
        {
            return Factory.CreateValidCourse();
        }
    }
}
