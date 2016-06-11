using System;
using System.Collections.Generic;
using System.Linq;
using Courses.Domain.Entities;
using Courses.Domain.Repositories;
using Swart.DomainDrivenDesign;
using Courses.DataTransferObjects;

namespace Courses.Services
{
    public class TeachersService : BaseService<IdNamePair, Teacher, ITeachersRepository>, ITeachersService
    {
        public TeachersService(ITeachersRepository teachersRepository) : base(teachersRepository)
        {
        }

        public IResult<Teacher> Add(string fullName)
        {
            var teacher = new Teacher { FullName = fullName };
            var result = _repository.Add(teacher);
            _repository.UnitOfWork.SaveChanges();
            return new Result<Teacher> { Return = teacher, Messages = result.Messages };
        }

        public IResult<Teacher> Update(Guid id, string fullName)
        {
            if (id == Guid.Empty)
                return new Result<Teacher>().AddErrorMessage("Id is empty");

            var result = _repository.Get(id);
            if (!result.Succeed)
                return result;
            result.Return.FullName = fullName;
            _repository.UnitOfWork.SaveChanges();

            return result;
        }

        protected override IdNamePair UpdateDtoFromEntity(IdNamePair dto, Teacher entity)
        {
            dto.Id = entity.Id;
            dto.Name = entity.FullName;

            return dto;
        }

        protected override Teacher UpdateEntityFromDto(Teacher entity, IdNamePair dto)
        {
            entity.FullName = dto.Name;
            return entity;
        }
    }
}
