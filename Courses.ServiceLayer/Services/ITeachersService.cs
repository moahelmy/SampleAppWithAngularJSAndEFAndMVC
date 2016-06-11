using Courses.DataTransferObjects;
using Courses.Domain.Entities;
using Swart.DomainDrivenDesign;
using System;
using System.Collections.Generic;

namespace Courses.Services
{
    public interface ITeachersService
    {
        IReadOnlyCollection<IdNamePair> All();        
        IResult<Teacher> Add(string fullName);
        IResult<Teacher> Update(Guid id, string fullName);
        IResult<Teacher> Delete(Guid id);
        IdNamePair GetIfExists(Guid id);
    }
}
