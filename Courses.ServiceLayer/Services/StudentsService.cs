using Courses.DataTransferObjects;
using Courses.Domain.Entities;
using Courses.Domain.Repositories;
using Swart.DomainDrivenDesign;
using System;
using System.Linq;

namespace Courses.Services
{
    public class StudentsService : CrudService<StudentDetails, Student, IStudentsRepository>, IStudentsService
    {
        private readonly ICoursesRepository _coursesRepository;        

        public StudentsService(ICoursesRepository coursesRepo, IStudentsRepository studentsRepo): base(studentsRepo)
        {
            _coursesRepository = coursesRepo;            
        }

        public IResult<StudentDetails> Create(StudentDetails student, Guid courseId)
        {
            if(student.Id != Guid.Empty)
            {
                return new Result<StudentDetails>().AddErrorMessage("Id must be empty");
            }

            var addedStudent = Create(student);
            if (addedStudent.Succeed)
                return Enrol(Create(student).Return.Id, courseId);
            else
                return addedStudent;
        }
        public IResult<StudentDetails> Enrol(Guid studentId, Guid courseId)
        {
            if(courseId == Guid.Empty)
                return new Result<StudentDetails>().AddErrorMessage("Course id is empty");
            if(studentId == Guid.Empty)
                return new Result<StudentDetails>().AddErrorMessage("Student id is empty");
            var courseResult = _coursesRepository.Get(courseId);
            if (!courseResult.Succeed)
                return new Result<StudentDetails> ().AddErrorMessage("Course not found");
            var studentResult = _repository.Get(studentId);
            if (!studentResult.Succeed)
                return new Result<StudentDetails>().AddErrorMessage("Student not found");
            courseResult.Return.AddStudent(studentResult.Return);
            _coursesRepository.UnitOfWork.SaveChanges();

            return new Result<StudentDetails> { Return = ToDto(studentResult.Return) };
        }
        
        public IListResult<StudentDetails> GetCourseStudents(Guid courseId)
        {
            if (courseId == Guid.Empty)
                return new ListResult<StudentDetails>().AddErrorMessage("Course id is empty");
            var result = _coursesRepository.GetStudents(courseId);
            if (result.Succeed)
                return new ListResult<StudentDetails> { Return = result.Return.Select(s => ToDto(s)).ToList() };
            return new ListResult<StudentDetails> { Messages = result.Messages };
        }

        public IResult<StudentDetails> RemoveStudentFromCourse(Guid studentId, Guid courseId)
        {
            if (courseId == Guid.Empty)
                return new Result<StudentDetails>().AddErrorMessage("Course id is empty");
            if (studentId == Guid.Empty)
                return new Result<StudentDetails>().AddErrorMessage("Student id is empty");
            var courseResult = _coursesRepository.Get(courseId);
            if (!courseResult.Succeed)
                return new Result<StudentDetails>().AddErrorMessage("Course not found");
            var studentResult = _repository.Get(studentId);
            if (!studentResult.Succeed)
                return new Result<StudentDetails>().AddErrorMessage("Student not found");
            var result = courseResult.Return.RemoveStudent(studentResult.Return);
            if (!result.Succeed)
                return new Result<StudentDetails>() { Messages = result.Messages };
            _coursesRepository.UnitOfWork.SaveChanges();

            return new Result<StudentDetails> { Return = ToDto(studentResult.Return) };
        }

        protected override StudentDetails UpdateDtoFromEntity(StudentDetails dto, Student entity)
        {
            if (entity == null)
                return dto;
            dto.Id = entity.Id;
            dto.FullName = entity.FullName;
            dto.BirthDate = entity.BirthDate;
            dto.Age = entity.Age;
            dto.GPA = entity.GPA;
            dto.IsExcellent = entity.IsExcellent;

            return dto;
        }

        protected override Student UpdateEntityFromDto(Student entity, StudentDetails dto)
        {
            entity.FullName = dto.FullName;
            entity.BirthDate = dto.BirthDate;
            entity.GPA = dto.GPA;

            return entity;
        }
    }
}
