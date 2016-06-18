using Courses.DataTransferObjects;
using Swart.DomainDrivenDesign;
using System;
using System.Collections.Generic;

namespace Courses.Services
{
    public interface ITeachersService
    {
        IReadOnlyCollection<IdNamePair> All();        
        IResult<IdNamePair> Add(string fullName);
        IResult<IdNamePair> Update(Guid id, string fullName);
        IResult<IdNamePair> Delete(Guid id);
        IdNamePair Get(Guid id);
    }
}
