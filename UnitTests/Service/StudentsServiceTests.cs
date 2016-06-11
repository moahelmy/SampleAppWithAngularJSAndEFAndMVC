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

        #region GetStudents
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

        #region AddStudentToCourse
        [Test]
        public void AddStudentToCourse_CourseIdIsEmpty_Fail()
        {
            // Arrange
            var courseId = Guid.Empty;
            var student = StudentsRepository.FoundEntity();

            // Act
            var result = _service.AddStudentToCourse(student.Id, courseId);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void AddStudentToCourse_StudentIdIsEmpty_Fail()
        {
            // Arrange
            var course = CoursesRepository.FoundEntity();
            var studentId = Guid.Empty;

            // Act
            var result = _service.AddStudentToCourse(studentId, course.Id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void AddStudentToCourse_CourseNotFound_Fail()
        {
            // Arrange
            var courseId = CoursesRepository.NotFoundEntity();
            var student = StudentsRepository.FoundEntity();

            // Act
            var result = _service.AddStudentToCourse(student.Id, courseId);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void AddStudentToCourse_StudentNotFound_Fail()
        {
            // Arrange
            var course = CoursesRepository.FoundEntity();
            var studentId = StudentsRepository.NotFoundEntity();

            // Act
            var result = _service.AddStudentToCourse(studentId, course.Id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        private dynamic AddStudentToCourse_BothFound()
        {
            // Arrange            
            var course = CoursesRepository.FoundEntity();
            var student = StudentsRepository.FoundEntity();

            // Act
            var result = _service.AddStudentToCourse(student.Id, course.Id);

            return new
            {
                Result = result,
                Course = course,
                Student = student
            };
        }

        [Test]
        public void AddStudentToCourse_BothFound_Succeed()
        {
            // Arrange                        
            // Act
            var result = AddStudentToCourse_BothFound().Result;

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.True);
        }

        [Test]
        public void AddStudentToCourse_BothFound_StudentAdded()
        {
            // Arrange            
            // Act
            var value = AddStudentToCourse_BothFound();
            var course = value.Course;
            var student = value.Student;

            // Assert
            Assert.That(course.Students, Is.Not.Null.And.Not.Empty.And.Contains(student));            
        }

        [Test]
        public void AddStudentToCourse_BothFound_Saved()
        {
            // Arrange
            // Act
            AddStudentToCourse_BothFound();

            // Assert
            UnitOfWork.Received().SaveChanges();
        }
        #endregion

        #region DeleteStudent        
        [Test]
        public void DeleteStudent_StudentIdIsEmpty_Fail()
        {
            // Arrange
            var id = Guid.Empty;

            // Act
            var result = _service.DeleteStudent(id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void DeleteStudent_StudentNotFound_Fail()
        {
            // Arrange
            var id = StudentsRepository.NotFoundEntity();

            // Act
            var result = _service.DeleteStudent(id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void DeleteStudent_StudentDeleted()
        {
            // Arrange
            var id = Guid.NewGuid();

            // Act
            var result = _service.DeleteStudent(id);

            // Assert
            StudentsRepository.Received().Delete(id);
        }

        [Test]
        public void DeleteStudent_CanDelete_Succeed()
        {
            // Arrange
            var student = StudentsRepository.CanDelete();

            // Act
            var result = _service.DeleteStudent(student.Id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.True);
        }        

        [Test]
        public void DeleteStudent_StudentDeleted_Saved()
        {
            // Arrange
            var student = StudentsRepository.CanDelete();

            // Act
            var result = _service.DeleteStudent(student.Id);

            // Assert
            UnitOfWork.Received().SaveChanges();
        }
        #endregion

        #region RemoveStudentFromCourse
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

        #region UpdateStudentDetails
        [Test]
        public void UpdateStudentDetails_StudentIsIsempty_Fail()
        {
            // Arrange
            var id = Guid.Empty;

            // Act
            var result = _service.UpdateStudentDetails(new StudentDetails
            {
                Id = id,
            });

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void UpdateStudentDetails_StudentNotFound_Fail()
        {
            // Arrange
            var id = StudentsRepository.NotFoundEntity();

            // Act
            var result = _service.UpdateStudentDetails(new StudentDetails
            {
                Id = id,
            });

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        private IResult<Student> UpdateStudentDetails_StudentFound(StudentDetails studentDetails)
        {
            // Arrange
            var student = StudentsRepository.FoundEntity();
            studentDetails.Id = student.Id;

            //Act
            var result = _service.UpdateStudentDetails(studentDetails);

            return result;
        }

        [Test]
        public void UpdateStudentDetails_StudentFound_Success()
        {
            // Arrange
            var studentDetails = new StudentDetails
            {
                BirthDate = new DateTime(2000, 1, 1),
                FullName = "Mohammad Helmy",
                GPA = 3.8,
            };

            // Act
            var result = UpdateStudentDetails_StudentFound(studentDetails);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.True);
        }

        [Test]
        public void UpdateStudentDetails_StudentFound_Updated()
        {
            // Arrange
            var studentDetails = new StudentDetails
            {
                BirthDate = new DateTime(2000, 1, 1),
                FullName = "Mohammad Helmy",
                GPA = 3.8,
            };

            // Act
            var result = UpdateStudentDetails_StudentFound(studentDetails);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Return, Is.Not.Null);
            Assert.That(result.Return.BirthDate, Is.EqualTo(studentDetails.BirthDate));
            Assert.That(result.Return.FullName, Is.EqualTo(studentDetails.FullName));
            Assert.That(result.Return.GPA, Is.EqualTo(studentDetails.GPA));
        }

        [Test]
        public void UpdateStudentDetails_StudentFound_Saved()
        {
            // Arrange
            var studentDetails = new StudentDetails
            {
                BirthDate = new DateTime(2000, 1, 1),
                FullName = "Mohammad Helmy",
                GPA = 3.8,
            };

            // Act
            var result = UpdateStudentDetails_StudentFound(studentDetails);

            // Assert
            UnitOfWork.Received().SaveChanges();
        }
        #endregion
    }
}
