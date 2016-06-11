using System;
using Courses.Domain.Entities;
using Swart.DomainDrivenDesign;
using Courses.Domain.Repositories;
using Courses.DataTransferObjects;

namespace Courses.Services
{
    public class StudentsService : IStudentsService
    {
        private readonly ICoursesRepository _coursesRepository;
        private readonly IStudentsRepository _studentsRepository;

        public StudentsService(ICoursesRepository coursesRepo, IStudentsRepository studentsRepo)
        {
            _coursesRepository = coursesRepo;
            _studentsRepository = studentsRepo;
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
            var studentResult = _studentsRepository.Get(studentId);
            if (!studentResult.Succeed)
                return new Result<Student>().AddErrorMessage("Student not found");
            courseResult.Return.AddStudent(studentResult.Return);
            _coursesRepository.UnitOfWork.SaveChanges();

            return new Result<Student> { Return = studentResult.Return };
        }

        public IResult<Student> DeleteStudent(Guid id)
        {
            if (id == Guid.Empty)
                return new Result<Student>().AddErrorMessage("Id is empty");
            var result = _studentsRepository.Delete(id);
            if (result.Succeed)
                _studentsRepository.UnitOfWork.SaveChanges();
            return result;
        }

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
            var studentResult = _studentsRepository.Get(studentId);
            if (!studentResult.Succeed)
                return new Result<Student>().AddErrorMessage("Student not found");
            var result = courseResult.Return.RemoveStudent(studentResult.Return);
            if (!result.Succeed)
                return new Result<Student>() { Messages = result.Messages };
            _coursesRepository.UnitOfWork.SaveChanges();

            return new Result<Student> { Return = studentResult.Return };
        }

        public IResult<Student> UpdateStudentDetails(StudentDetails student)
        {
            if (student.Id == Guid.Empty)
                return new Result<Student>().AddErrorMessage("Student id is empty");
            var studentResult = _studentsRepository.Get(student.Id);
            if (!studentResult.Succeed)
                return new Result<Student>().AddErrorMessage("Student not found");

            var studentEntity = studentResult.Return;
            studentEntity.BirthDate = student.BirthDate;
            studentEntity.FullName = student.FullName;
            studentEntity.GPA = student.GPA;

            _studentsRepository.UnitOfWork.SaveChanges();

            return new Result<Student>() { Return = studentEntity };
        }
    }
}
