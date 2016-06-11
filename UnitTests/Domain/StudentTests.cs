using Courses.Domain.Entities;
using NUnit.Framework;
using System;

namespace UnitTests.Domain
{
    [TestFixture]
    public class StudentTests : UnitTestBase
    {
        [Test]
        public void Age_BeforeDayOfBirth_DiffInYearsMinusOne()
        {
            // Arrange
            const int expectedAge = 10;
            var birthDate = DateTime.Now.AddYears(-1 * expectedAge).AddDays(-1);
            var student = new Student { BirthDate = birthDate };

            // Act
            var age = student.Age;

            // Assert
            Assert.AreEqual(expectedAge, age);
        }

        [Test]
        public void Age_AfterDayOfBirth_DiffInYears()
        {
            // Arrange
            const int expectedAge = 10;
            var birthDate = DateTime.Now.AddYears(-1 * (expectedAge + 1)).AddDays(1);
            var student = new Student { BirthDate = birthDate };

            // Act
            var age = student.Age;

            // Assert
            Assert.AreEqual(expectedAge, age);
        }

        #region Validation
        [Test]
        public void Validation_GivenNamesMissing_Error()
        {
            // Arrange
            var student = Factory.CreateTestStudent();
            student.GivenNames = string.Empty;

            // Act
            var errorMessage = student.ValidateObjectWithGivenPropertyInValid(s => s.GivenNames, "required");

            // Assert
            Assert.True(string.IsNullOrEmpty(errorMessage), errorMessage);
        }

        [Test]
        public void Validation_SurNameMissing_Error()
        {
            // Arrange
            var student = Factory.CreateTestStudent();
            student.SurName = string.Empty;

            // Act
            var errorMessage = student.ValidateObjectWithGivenPropertyInValid(s => s.SurName);

            // Assert
            Assert.True(string.IsNullOrEmpty(errorMessage), errorMessage);
        }

        [Test]
        public void Validation_BirthDateMissing_Error()
        {
            // Arrange
            var student = Factory.CreateTestStudent();
            student.BirthDate = default(DateTime);

            // Act
            var errorMessage = student.ValidateObjectWithGivenPropertyInValid(s => s.BirthDate);

            // Assert
            Assert.True(string.IsNullOrEmpty(errorMessage), errorMessage);
        }

        [Test]
        public void Validation_BirthDateInTheFuture_Error()
        {
            // Arrange
            var student = Factory.CreateTestStudent();
            student.BirthDate = DateTime.Now.AddYears(1);

            // Act
            var errorMessage = student.ValidateObjectWithGivenPropertyInValid(s => s.BirthDate);

            // Assert
            Assert.True(string.IsNullOrEmpty(errorMessage), errorMessage);
        }

        [Test]
        public void Validation_GPAIsNegative_Error()
        {
            // Arrange
            var student = Factory.CreateTestStudent();
            student.GPA = -1;

            // Act
            var errorMessage = student.ValidateObjectWithGivenPropertyInValid(s => s.GPA);

            // Assert
            Assert.True(string.IsNullOrEmpty(errorMessage), errorMessage);
        }
        #endregion
    }
}
