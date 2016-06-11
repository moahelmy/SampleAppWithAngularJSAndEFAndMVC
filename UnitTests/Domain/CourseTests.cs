using Courses.Domain.Entities;
using NUnit.Framework;
using System.Collections.Generic;

namespace UnitTests.Domain
{
    [TestFixture]
    [Category("Unit Test")]
    public class CourseTests
    {
        [Test]
        public void AddStudent_SurnameDuplicated_Fail()
        {
            // Arrange
            var student = Factory.CreateTestStudent();
            var course = new Course { Students = new List<Student> { student } };
            var duplciatedStudent = new Student { SurName = student.SurName };

            // Act
            var result = course.AddStudent(duplciatedStudent);

            // Assert
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void AddStudent_SurnameDuplicated_ThrowsException()
        {
            // Arrange
            var student = Factory.CreateTestStudent();
            var duplciatedStudent = new Student { SurName = student.SurName };
            var course = Factory.CreateTestCourse();
            course.Students = new List<Student> { student, duplciatedStudent };

            // Act
            var result = course.AddStudent(duplciatedStudent);

            // Assert
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void AddStudent_Valid_StudentUpdated()
        {
            // Arrange
            var student = Factory.CreateTestStudent();           
            var course = Factory.CreateTestCourse();            

            // Act
            var result = course.AddStudent(student);

            // Assert
            Assert.That(student.Courses, Is.Not.Null.And.Not.Empty.And.Contains(course));            
        }

        #region Validation
        [Test]
        public void Validation_CourseNameMissing_Error()
        {
            // Arrange
            var course = Factory.CreateTestCourse();
            course.Name = string.Empty;

            // Act
            var errorMessage = course.ValidateObjectWithGivenPropertyInValid(s => s.Name);

            // Assert
            Assert.True(string.IsNullOrEmpty(errorMessage), errorMessage);
        }

        [Test]
        public void Validation_BuildingNumberMissing_Error()
        {
            // Arrange
            var course = Factory.CreateTestCourse();
            course.Location.BuildingNumber = string.Empty;

            // Act
            var errorMessage = course.ValidateObjectWithGivenPropertyInValid(s => s.Location.BuildingNumber);

            // Assert
            Assert.True(string.IsNullOrEmpty(errorMessage), errorMessage);
        }

        [Test]
        public void Validation_RoomNumberMissing_Error()
        {
            // Arrange
            var course = Factory.CreateTestCourse();
            course.Location.RoomNumber = string.Empty;

            // Act
            var errorMessage = course.ValidateObjectWithGivenPropertyInValid(s => s.Location.RoomNumber);

            // Assert
            Assert.True(string.IsNullOrEmpty(errorMessage), errorMessage);
        }

        [Test]
        public void Validation_TeacherMissing_Error()
        {
            // Arrange
            var course = Factory.CreateTestCourse();
            course.Teacher = null;

            // Act
            var errorMessage = course.ValidateObjectWithGivenPropertyInValid(s => s.Teacher);

            // Assert
            Assert.True(string.IsNullOrEmpty(errorMessage), errorMessage);
        }
        #endregion
    }
}
