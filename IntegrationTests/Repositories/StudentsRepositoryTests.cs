using Courses.Domain.Entities;
using Courses.Repositories;
using System;

namespace IntegrationTests.Repositories
{
    public class StudentsRepositoryTests : RepositoryTests<StudentsRepository, Student, Guid>
    {
        protected override Student CreateValidEntity()
        {
            return Factory.CreateValidStudent();
        }
    }
}
