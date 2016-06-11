using Courses.Repositories;
using NUnit.Framework;
using Swart.DomainDrivenDesign.Domain;
using Swart.DomainDrivenDesign.Repositories;
using System;

namespace IntegrationTests.Repositories
{
    [TestFixture]
    public abstract class RepositoryTests<TRepository, TEntity, TKey> : IntegrationTestBase where TRepository : IListRepository<TEntity, TKey>
        where TEntity : Entity<TKey>
        where TKey : IComparable, IEquatable<TKey>
    {
        protected TRepository _repository;
        protected ITransaction _transaction;
        protected ICoursesUnitOfWork _unitOfWork;

        [SetUp]
        public void Setup()
        {
            _unitOfWork = Factory.CreateCoursesUnitOfWork();
            _transaction = _unitOfWork.BeginTransaction();
            _repository = Factory.CreateReporsitory<TRepository>(_unitOfWork);
        }

        [Test]
        // Testing add is more than enough .. I'm not testing EF, I'm testing my mapping
        public void Add_NewValidEntity_IdIsUpdated()
        {
            // Arrange
            var entity = CreateValidEntity();

            // Act
            _repository.Add(entity);
            _repository.UnitOfWork.SaveChanges();

            // Assert
            Assert.AreNotEqual(Guid.Empty, entity.Id);
        }

        [TearDown]
        public void TearDown()
        {
            _transaction.Rollback();
            _transaction.Dispose();
            _repository.Dispose();
        }

        protected abstract TEntity CreateValidEntity();
    }
}
