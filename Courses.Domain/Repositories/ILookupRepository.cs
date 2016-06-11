using System;
using Swart.DomainDrivenDesign.Repositories;
using Courses.Domain.Entities;

namespace Courses.Domain.Repositories
{
    public interface ILookupRepository<TEntity>:IListRepository<TEntity, Guid> where TEntity : BaseEntity
    {
    }
}
