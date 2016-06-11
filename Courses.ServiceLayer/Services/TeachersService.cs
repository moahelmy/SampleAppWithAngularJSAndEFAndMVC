using System;
using System.Collections.Generic;
using System.Linq;
using Courses.Domain.Entities;
using Courses.Domain.Repositories;
using Swart.DomainDrivenDesign;

namespace Courses.Services
{
    public class TeachersService : ITeachersService
    {
        private readonly ITeachersRepository _teachersRepository;

        public TeachersService(ITeachersRepository teachersRepository)
        {
            _teachersRepository = teachersRepository;
        }

        public IReadOnlyCollection<Teacher> ListAll()
        {
            return _teachersRepository.List().ToList();
        }

        public IResult<Teacher> AddTeacher(string fullName)
        {
            var teacher = new Teacher { FullName = fullName };
            var result = _teachersRepository.Add(teacher);
            _teachersRepository.UnitOfWork.SaveChanges();
            return new Result<Teacher> { Return = teacher, Messages = result.Messages };
        }

        public IResult<Teacher> UpdateTeacherDetails(Guid id, string fullName)
        {
            if (id == Guid.Empty)
                return new Result<Teacher>().AddErrorMessage("Id is empty");

            var result = _teachersRepository.Get(id);
            if (!result.Succeed)
                return result;
            result.Return.FullName = fullName;
            _teachersRepository.UnitOfWork.SaveChanges();

            return result;
        }
    }
}
