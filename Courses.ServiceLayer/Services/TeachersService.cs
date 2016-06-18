using System;
using Courses.Domain.Entities;
using Courses.Domain.Repositories;
using Swart.DomainDrivenDesign;
using Courses.DataTransferObjects;

namespace Courses.Services
{
    public class TeachersService : CrudService<IdNamePair, Teacher, ITeachersRepository>, ITeachersService
    {
        public TeachersService(ITeachersRepository teachersRepository) : base(teachersRepository)
        {
        }

        public IResult<IdNamePair> Add(string fullName)
        {
            return Create(new IdNamePair { Name = fullName });
        }

        public IResult<IdNamePair> Update(Guid id, string fullName)
        {
            if (id == Guid.Empty)
                return new Result<IdNamePair>().AddErrorMessage("Id is empty");
            return Update(new IdNamePair {  Id = id, Name = fullName});
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
