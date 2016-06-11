using Courses.Domain.Entities;
using Courses.Services;
using NSubstitute;
using NUnit.Framework;
using System;
using UnitTests.Helpers;

namespace UnitTests.Service
{
    public class TeacherServiceTests : ServiceTestsBase
    {        
        private TeachersService _service;

        [SetUp]
        public override void SetUp()
        {
            base.SetUp();

            _service = new TeachersService(TeachersRepository);                        
        }

        [Test]
        public void All_ListIsCalled()
        {
            // Arrange

            // Act
            _service.All();

            // Assert
            TeachersRepository.Received().List();
        }

        [Test]
        public void GetIfExists_Found_ReturnIt()
        {
            // Arrange
            var teacher = TeachersRepository.FoundEntity();

            // Act
            var result = _service.GetIfExists(teacher.Id);

            // Assert
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void GetIfExists_NotFound_ReturnNull()
        {
            // Arrange
            var id = TeachersRepository.NotFoundEntity();

            // Act
            var result = _service.GetIfExists(id);

            // Assert
            Assert.That(result, Is.Null);
        }

        [Test]
        public void AddTeacher_ValidName_TeacherIsAdded()
        {
            // Arrange

            // Act
            _service.Add("Mohammad Helmy");

            // Assert
            TeachersRepository.Received().Add(Arg.Any<Teacher>());
        }

        [Test]
        public void Add_ValidName_TeacherIsSaved()
        {
            // Arrange

            // Act
            _service.Add("Mohammad Helmy");

            // Assert
            UnitOfWork.Received().SaveChanges();
        }

        [Test]
        public void Add_ValidName_Succeed()
        {
            // Arrange

            // Act
            var result = _service.Add("Mohammad Helmy");

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.True);
        }

        [Test]
        public void Update_TeacherIsFound_TeacherIsUpdated()
        {
            // Arrange
            var fullName = "Mohammad Helmy";
            var teacher = _SetupFoundTeacher();

            // Act
            _service.Update(teacher.Id,fullName);

            // Assert
            Assert.That(teacher.FullName, Is.EqualTo(fullName));
        }

        [Test]
        public void Update_TeacherIsFound_TeacherIsSaved()
        {
            // Arrange
            var fullName = "Mohammad Helmy";
            var teacher = _SetupFoundTeacher();

            // Act
            _service.Update(teacher.Id, fullName);

            // Assert
            UnitOfWork.Received().SaveChanges();
        }

        [Test]
        public void Update_TeacherIsFound_Succeed()
        {
            // Arrange
            var fullName = "Mohammad Helmy";
            var teacher = _SetupFoundTeacher();

            // Act
            var result = _service.Update(teacher.Id, fullName);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.True);
        }

        [Test]
        public void Update_TeacherNotFound_Failed()
        {
            // Arrange            
            var fullName = "Mohammad Helmy";                        
            var id = TeachersRepository.NotFoundEntity();

            // Act
            var result = _service.Update(id, fullName);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void Update_IdIsempty_Failed()
        {
            // Arrange            
            var fullName = "Mohammad Helmy";
            var id = Guid.Empty;

            // Act
            var result = _service.Update(id, fullName);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        private Teacher _SetupFoundTeacher()
        {
            return TeachersRepository.FoundEntity();
        }
    }
}
