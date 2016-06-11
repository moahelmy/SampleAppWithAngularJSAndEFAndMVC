using Courses.DataTransferObjects;
using Courses.Domain.Entities;
using Courses.Services;
using NSubstitute;
using NUnit.Framework;
using Swart.DomainDrivenDesign;
using System;
using System.Collections.Generic;
using UnitTests.Helpers;

namespace UnitTests.Service
{
    public class StudentsServiceTests : ServiceTestsBase
    {
        private StudentsService _service;

        [SetUp]
        public override void SetUp()
        {
            base.SetUp();

            _service = new StudentsService(CoursesRepository, StudentsRepository);            
        }

        #region GetS tudents
        [Test]
        public void GetCourseStudents_CourseFound_ListStudents()
        {
            // Arrange
            var id = Guid.NewGuid();
            var students = new List<Student>()
            {
                new Student { Id = Guid.NewGuid() }
            };
            CoursesRepository.GetStudents(id).Returns(new ListResult<Student> { Return = students });

            // Act
            var result = _service.GetCourseStudents(id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.True);
            Assert.That(result.Return, Is.Not.Null.And.Not.Empty);
        }

        [Test]
        public void GetCourseStudents_CourseNotFound_Failed()
        {
            // Arrange
            var id = Guid.NewGuid();            
            CoursesRepository.GetStudents(id).Returns(new ListResult<Student>().AddErrorMessage("Not found"));

            // Act
            var result = _service.GetCourseStudents(id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);            
        }
        #endregion

        #region Create Student
        [Test]
        public void Create_StudentIdNotEmpty_Fail()
        {
            // Arrange
            var course = CoursesRepository.FoundEntity();

            // Act
            var result = _service.Create(new StudentDetails { Id = Guid.NewGuid() }, course.Id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }
        #endregion

        #region Entrol Student in Course
        [Test]
        public void Enrol_CourseIdIsEmpty_Fail()
        {
            // Arrange
            var courseId = Guid.Empty;
            var student = StudentsRepository.FoundEntity();

            // Act
            var result = _service.Enrol(student.Id, courseId);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void Enrol_StudentIdIsEmpty_Fail()
        {
            // Arrange
            var course = CoursesRepository.FoundEntity();
            var studentId = Guid.Empty;

            // Act
            var result = _service.Enrol(studentId, course.Id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void Enrol_CourseNotFound_Fail()
        {
            // Arrange
            var courseId = CoursesRepository.NotFoundEntity();
            var student = StudentsRepository.FoundEntity();

            // Act
            var result = _service.Enrol(student.Id, courseId);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void Enrol_StudentNotFound_Fail()
        {
            // Arrange
            var course = CoursesRepository.FoundEntity();
            var studentId = StudentsRepository.NotFoundEntity();

            // Act
            var result = _service.Enrol(studentId, course.Id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        private dynamic Enrol_BothFound()
        {
            // Arrange            
            var course = CoursesRepository.FoundEntity();
            var student = StudentsRepository.FoundEntity();

            // Act
            var result = _service.Enrol(student.Id, course.Id);

            return new
            {
                Result = result,
                Course = course,
                Student = student
            };
        }

        [Test]
        public void Enrol_BothFound_Succeed()
        {
            // Arrange                        
            // Act
            var result = Enrol_BothFound().Result;

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.True);
        }

        [Test]
        public void Enrol_BothFound_StudentAdded()
        {
            // Arrange            
            // Act
            var value = Enrol_BothFound();
            var course = value.Course;
            var student = value.Student;

            // Assert
            Assert.That(course.Students, Is.Not.Null.And.Not.Empty.And.Contains(student));            
        }

        [Test]
        public void Enrol_BothFound_Saved()
        {
            // Arrange
            // Act
            Enrol_BothFound();

            // Assert
            UnitOfWork.Received().SaveChanges();
        }
        #endregion

        #region Delete Student        
        [Test]
        public void Delete_StudentIdIsEmpty_Fail()
        {
            // Arrange
            var id = Guid.Empty;

            // Act
            var result = _service.Delete(id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void Delete_StudentNotFound_Fail()
        {
            // Arrange
            var id = StudentsRepository.NotFoundEntity();

            // Act
            var result = _service.Delete(id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void Delete_StudentDeleted()
        {
            // Arrange
            var id = Guid.NewGuid();

            // Act
            var result = _service.Delete(id);

            // Assert
            StudentsRepository.Received().Delete(id);
        }

        [Test]
        public void Delete_CanDelete_Succeed()
        {
            // Arrange
            var student = StudentsRepository.CanDelete();

            // Act
            var result = _service.Delete(student.Id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.True);
        }        

        [Test]
        public void Delete_StudentDeleted_Saved()
        {
            // Arrange
            var student = StudentsRepository.CanDelete();

            // Act
            var result = _service.Delete(student.Id);

            // Assert
            UnitOfWork.Received().SaveChanges();
        }
        #endregion

        #region Remove Student From Course
        [Test]
        public void RemoveStudentFromCourse_CourseIdIsEmpty_Fail()
        {
            // Arrange
            var courseId = Guid.Empty;
            var student = StudentsRepository.FoundEntity();

            // Act
            var result = _service.RemoveStudentFromCourse(student.Id, courseId);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void RemoveStudentFromCourse_StudentIdIsEmpty_Fail()
        {
            // Arrange
            var course = CoursesRepository.FoundEntity();
            var studentId = Guid.Empty;

            // Act
            var result = _service.RemoveStudentFromCourse(studentId, course.Id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void RemoveStudentFromCourse_CourseNotFound_Fail()
        {
            // Arrange
            var courseId = CoursesRepository.NotFoundEntity();
            var student = StudentsRepository.FoundEntity();

            // Act
            var result = _service.RemoveStudentFromCourse(student.Id, courseId);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void RemoveStudentFromCourse_StudentNotFound_Fail()
        {
            // Arrange
            var course = CoursesRepository.FoundEntity();
            var studentId = StudentsRepository.NotFoundEntity();

            // Act
            var result = _service.RemoveStudentFromCourse(studentId, course.Id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void RemoveStudentFromCourse_StudentNotInCourse_Fail()
        {
            // Arrange
            var course = CoursesRepository.FoundEntity();
            var student = StudentsRepository.FoundEntity();

            // Act
            var result = _service.RemoveStudentFromCourse(student.Id, course.Id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        private dynamic RemoveStudentFromCourse_CourseFoundAndStudentInCourse()
        {
            // Arrange            
            var course = CoursesRepository.FoundEntity();
            var student = StudentsRepository.FoundEntity();
            course.AddStudent(student);

            // Act
            var result = _service.RemoveStudentFromCourse(student.Id, course.Id);

            return new
            {
                Result = result,
                Course = course,
                Student = student
            };
        }

        [Test]
        public void RemoveStudentFromCourse_CourseFoundAndStudentInCourse_Succeed()
        {
            // Arrange                        
            // Act
            var result = RemoveStudentFromCourse_CourseFoundAndStudentInCourse().Result;

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.True);
        }

        [Test]
        public void RemoveStudentFromCourse_CourseFoundAndStudentInCourse_StudentRemoved()
        {
            // Arrange            
            // Act
            var value = RemoveStudentFromCourse_CourseFoundAndStudentInCourse();
            var course = value.Course;
            var student = value.Student;

            // Assert
            Assert.That(course.Students, Is.Not.Null.And.Not.Contains(student));            
        }

        [Test]
        public void RemoveStudentFromCourse_CourseFoundAndStudentInCourse_Saved()
        {
            // Arrange
            // Act
            RemoveStudentFromCourse_CourseFoundAndStudentInCourse();

            // Assert
            UnitOfWork.Received().SaveChanges();
        }
        #endregion

        #region Update Student Details
        [Test]
        public void Update_StudentIsIsempty_Fail()
        {
            // Arrange
            var id = Guid.Empty;

            // Act
            var result = _service.Update(new StudentDetails
            {
                Id = id,
            });

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void Update_StudentNotFound_Fail()
        {
            // Arrange
            var id = StudentsRepository.NotFoundEntity();

            // Act
            var result = _service.Update(new StudentDetails
            {
                Id = id,
            });

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        private IResult<Student> Update_StudentFound(StudentDetails studentDetails)
        {
            // Arrange
            var student = StudentsRepository.FoundEntity();
            studentDetails.Id = student.Id;

            //Act
            var result = _service.Update(studentDetails);

            return result;
        }

        [Test]
        public void Update_StudentFound_Success()
        {
            // Arrange
            var studentDetails = new StudentDetails
            {
                BirthDate = new DateTime(2000, 1, 1),
                FullName = "Mohammad Helmy",
                GPA = 3.8,
            };

            // Act
            var result = Update_StudentFound(studentDetails);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.True);
        }

        [Test]
        public void Update_StudentFound_Updated()
        {
            // Arrange
            var studentDetails = new StudentDetails
            {
                BirthDate = new DateTime(2000, 1, 1),
                FullName = "Mohammad Helmy",
                GPA = 3.8,
            };

            // Act
            var result = Update_StudentFound(studentDetails);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Return, Is.Not.Null);
            Assert.That(result.Return.BirthDate, Is.EqualTo(studentDetails.BirthDate));
            Assert.That(result.Return.FullName, Is.EqualTo(studentDetails.FullName));
            Assert.That(result.Return.GPA, Is.EqualTo(studentDetails.GPA));
        }

        [Test]
        public void Update_StudentFound_Saved()
        {
            // Arrange
            var studentDetails = new StudentDetails
            {
                BirthDate = new DateTime(2000, 1, 1),
                FullName = "Mohammad Helmy",
                GPA = 3.8,
            };

            // Act
            var result = Update_StudentFound(studentDetails);

            // Assert
            UnitOfWork.Received().SaveChanges();
        }
        #endregion
    }
}
