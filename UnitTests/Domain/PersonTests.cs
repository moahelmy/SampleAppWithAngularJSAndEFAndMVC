using Courses.Domain.Entities;
using Courses.Domain.Exceptions;
using NUnit.Framework;

namespace UnitTests.Domain
{
    [TestFixture]
    public class PersonTests : UnitTestBase
    {
        [Test]
        public void FullName_SetSingleName_ThrowsAnException()
        {
            // Arrange
            const string fullName = "Bjarne";

            // Act && Assert
            Assert.Throws< FullNameIsEmptyOrSingleException>(() => new Person { FullName = fullName });
        }

        [Test]
        public void FullName_SetSingleNameEndsWithSpace_ThrowsAnException()
        {
            // Arrange
            const string fullName = "Bjarne";

            // Act
            Assert.Throws<FullNameIsEmptyOrSingleException>(() => new Person { FullName = fullName });
        }

        [Test]
        public void FullName_SetEmptyName_ThrowsAnException()
        {
            // Arrange
            const string fullName = "";

            // Act
            Assert.Throws<FullNameIsEmptyOrSingleException>(() => new Person { FullName = fullName });
        }

        [Test]
        public void FullName_SetMultipleGivenNames_LastNameIsSurnName()
        {
            // Arrange
            const string fullName = "Bjarne  Edward Stroustrup";
            const string expectedSurnName = "Stroustrup";

            // Act
            var person = new Person { FullName = fullName };

            // Assert
            Assert.That(person.SurName, Is.EqualTo(expectedSurnName));
        }

        [Test]
        public void FullName_SetMultipleGivenNames_AllExceptLastAreGivenNames()
        {
            // Arrange
            const string fullName = "Bjarne Edward Stroustrup";
            const string expectedGivenNames = "Bjarne Edward";

            // Act
            var person = new Person { FullName = fullName };

            // Assert
            Assert.That(person.GivenNames, Is.EqualTo(expectedGivenNames));
        }

        #region Validation
        [Test]
        public void Validation_GivenNamesMissing_Error()
        {
            // Arrange
            var person = Factory.CreateTestPerson();
            person.GivenNames = string.Empty;

            // Act
            var errorMessage = person.ValidateObjectWithGivenPropertyInValid(s => s.GivenNames, "required");

            // Assert
            Assert.True(string.IsNullOrEmpty(errorMessage), errorMessage);
        }

        [Test]
        public void Validation_SurnameMissing_Error()
        {
            // Arrange
            var person = Factory.CreateTestPerson();
            person.SurName = string.Empty;

            // Act
            var errorMessage = person.ValidateObjectWithGivenPropertyInValid(s => s.SurName);

            // Assert
            Assert.True(string.IsNullOrEmpty(errorMessage), errorMessage);
        }
        #endregion
    }
}
