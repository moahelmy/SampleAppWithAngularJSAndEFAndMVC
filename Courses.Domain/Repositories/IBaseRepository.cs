using System;
using Swart.DomainDrivenDesign.Repositories;
using Courses.Domain.Entities;

namespace Courses.Domain.Repositories
{
    public interface IBaseRepository<TEntity> : IRepository<TEntity, Guid> where TEntity : BaseEntity
    {
    }
}
