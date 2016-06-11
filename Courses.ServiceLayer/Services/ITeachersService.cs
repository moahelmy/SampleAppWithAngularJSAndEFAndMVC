using Courses.Domain.Entities;
using Swart.DomainDrivenDesign;
using System;
using System.Collections.Generic;

namespace Courses.Services
{
    public interface ITeachersService
    {
        IReadOnlyCollection<Teacher> ListAll();
        IResult<Teacher> AddTeacher(string fullName);
        IResult<Teacher> UpdateTeacherDetails(Guid id, string fullName);
    }
}
