using System;
using Courses.Domain.Entities;
using Swart.DomainDrivenDesign;
using Courses.Domain.Repositories;
using Courses.DataTransferObjects;

namespace Courses.Services
{
    public class StudentsService : BaseService<StudentDetails, Student, IStudentsRepository>, IStudentsService
    {
        private readonly ICoursesRepository _coursesRepository;        

        public StudentsService(ICoursesRepository coursesRepo, IStudentsRepository studentsRepo): base(studentsRepo)
        {
            _coursesRepository = coursesRepo;            
        }

        public IResult<Student> AddStudentToCourse(StudentDetails student, Guid courseId)
        {
            if(student.Id == Guid.Empty)
            {
                var addedStudent = Add(student);
                if (addedStudent.Succeed)
                    return AddStudentToCourse(Add(student).Return.Id, courseId);
                else
                    return addedStudent;
            }

            return AddStudentToCourse(student.Id, courseId);
        }
        public IResult<Student> AddStudentToCourse(Guid studentId, Guid courseId)
        {
            if(courseId == Guid.Empty)
                return new Result<Student>().AddErrorMessage("Course id is empty");
            if(studentId == Guid.Empty)
                return new Result<Student>().AddErrorMessage("Student id is empty");
            var courseResult = _coursesRepository.Get(courseId);
            if (!courseResult.Succeed)
                return new Result<Student> ().AddErrorMessage("Course not found");
            var studentResult = _repository.Get(studentId);
            if (!studentResult.Succeed)
                return new Result<Student>().AddErrorMessage("Student not found");
            courseResult.Return.AddStudent(studentResult.Return);
            _coursesRepository.UnitOfWork.SaveChanges();

            return new Result<Student> { Return = studentResult.Return };
        }

        //public override IResult<Student> Delete(Guid id)
        //{
        //    if (id == Guid.Empty)
        //        return new Result<Student>().AddErrorMessage("Id is empty");
        //    var result = _repository.Delete(id);
        //    if (result.Succeed)
        //        _repository.UnitOfWork.SaveChanges();
        //    return result;
        //}

        public IListResult<Student> GetCourseStudents(Guid courseId)
        {
            if (courseId == Guid.Empty)
                return new ListResult<Student>().AddErrorMessage("Course id is empty");
            return _coursesRepository.GetStudents(courseId);
        }

        public IResult<Student> RemoveStudentFromCourse(Guid studentId, Guid courseId)
        {
            if (courseId == Guid.Empty)
                return new Result<Student>().AddErrorMessage("Course id is empty");
            if (studentId == Guid.Empty)
                return new Result<Student>().AddErrorMessage("Student id is empty");
            var courseResult = _coursesRepository.Get(courseId);
            if (!courseResult.Succeed)
                return new Result<Student>().AddErrorMessage("Course not found");
            var studentResult = _repository.Get(studentId);
            if (!studentResult.Succeed)
                return new Result<Student>().AddErrorMessage("Student not found");
            var result = courseResult.Return.RemoveStudent(studentResult.Return);
            if (!result.Succeed)
                return new Result<Student>() { Messages = result.Messages };
            _coursesRepository.UnitOfWork.SaveChanges();

            return new Result<Student> { Return = studentResult.Return };
        }

        //public override IResult<Student> Update(StudentDetails student)
        //{
        //    if (student.Id == Guid.Empty)
        //        return new Result<Student>().AddErrorMessage("Student id is empty");
        //    var studentResult = _repository.Get(student.Id);
        //    if (!studentResult.Succeed)
        //        return new Result<Student>().AddErrorMessage("Student not found");

        //    var studentEntity = studentResult.Return;
        //    studentEntity.BirthDate = student.BirthDate;
        //    studentEntity.FullName = student.FullName;
        //    studentEntity.GPA = student.GPA;

        //    _repository.UnitOfWork.SaveChanges();

        //    return new Result<Student>() { Return = studentEntity };
        //}

        protected override StudentDetails UpdateDtoFromEntity(StudentDetails dto, Student entity)
        {
            dto.Id = entity.Id;
            dto.FullName = entity.FullName;
            dto.BirthDate = entity.BirthDate;
            dto.Age = entity.Age;
            dto.GPA = entity.GPA;

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
