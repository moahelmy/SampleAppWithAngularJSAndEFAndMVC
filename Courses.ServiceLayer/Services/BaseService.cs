using Courses.DataTransferObjects;
using Courses.Domain.Entities;
using Courses.Domain.Repositories;
using Swart.DomainDrivenDesign;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Courses.Services
{
    public abstract class BaseService<T, TEntity, TRepository>
        where T : EntityDto
        where TEntity : BaseEntity
        where TRepository : ILookupRepository<TEntity>
    {
        protected readonly TRepository _repository;        

        public BaseService(TRepository repository)
        {
            _repository = repository;
        }

        public virtual IReadOnlyCollection<T> All()
        {
            return _repository.List().Select(ToDto).ToList();
        }

        public virtual T GetIfExists(Guid id)
        {
            var result = GetEntity(id);
            if (!result.Succeed)
                return null;
            return ToDto(result.Return);
        }

        public virtual IResult<TEntity> Add(T value)
        {
            var entity = ToEntity(value);
            var addRes = _repository.Add(entity);
            _repository.UnitOfWork.SaveChanges();

            return new Result<TEntity> { Return = entity, Messages = addRes.Messages };
        }

        public virtual IResult<TEntity> Update(T value)
        {
            if (value.Id == Guid.Empty)
                return new Result<TEntity>().AddErrorMessage(ErrorMessages.IdIsEmpty);
            var result = _repository.Get(value.Id);
            if (!result.Succeed)
                return new Result<TEntity>().AddErrorMessage(ErrorMessages.RecordNotFound);

            var entity = result.Return;
            UpdateEntityFromDto(entity, value);
            _repository.UnitOfWork.SaveChanges();

            return new Result<TEntity>() { Return = entity };
        }

        public virtual IResult<TEntity> Delete(Guid id)
        {
            if (id == Guid.Empty)
                return new Result<TEntity>().AddErrorMessage(ErrorMessages.IdIsEmpty);
            var result = _repository.Delete(id);
            if (result.Succeed)
                _repository.UnitOfWork.SaveChanges();
            return result;
        }     

        #region Abstract and virtual methods       
        protected abstract T UpdateDtoFromEntity(T dto, TEntity entity);
        protected abstract TEntity UpdateEntityFromDto(TEntity entity, T dto);

        private T ToDto(TEntity entity)
        {
            var dto = Activator.CreateInstance<T>();
            UpdateDtoFromEntity(dto, entity);
            return dto;
        }
        private TEntity ToEntity(T dto)
        {
            var entity = Activator.CreateInstance<TEntity>();
            UpdateEntityFromDto(entity, dto);
            return entity;
        }

        /// <summary>
        /// Override this method to include specific entities in ListAll to optimize List()
        /// </summary>
        /// <returns></returns>
        protected virtual IQueryable<TEntity> ListAll()
        {
            return _repository.List();
        }

        protected virtual IResult<TEntity> GetEntity(Guid id)
        {
            return _repository.Get(id);
        }
        #endregion
    }
}