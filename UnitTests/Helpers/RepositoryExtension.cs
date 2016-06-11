using Courses.Domain.Entities;
using System;
using NSubstitute;
using Swart.DomainDrivenDesign;
using Swart.DomainDrivenDesign.Repositories;

namespace UnitTests.Helpers
{
    internal static class RepositoryExtension
    {
        internal static Guid NotFoundEntity<TEntity>(this IBasicRepository<TEntity, Guid> repo) where TEntity :BaseEntity
        {
            var id = Guid.NewGuid();

            repo.Get(id).Returns(new Result<TEntity>().AddErrorMessage("Not found"));

            return id;
        }

        internal static TEntity FoundEntity<TEntity>(this IBasicRepository<TEntity, Guid> repo) where TEntity :BaseEntity
        {
            return repo.FoundEntity(Guid.NewGuid());
        }

        internal static TEntity FoundEntity<TEntity>(this IBasicRepository<TEntity, Guid> repo, Guid id) where TEntity : BaseEntity
        {
            var entity = Activator.CreateInstance<TEntity>();
            entity.Id = id;
            repo.Get(id).Returns(new Result<TEntity>() { Return = entity });

            return entity;
        }

        internal static TEntity CanDelete<TEntity>(this IListRepository<TEntity, Guid> repo) where TEntity : BaseEntity
        {
            var id = Guid.NewGuid();
            var entity = Activator.CreateInstance<TEntity>();
            entity.Id = id;
            repo.Delete(id).Returns(new Result<TEntity>() { Return = entity });

            return entity;
        }
    }
}
