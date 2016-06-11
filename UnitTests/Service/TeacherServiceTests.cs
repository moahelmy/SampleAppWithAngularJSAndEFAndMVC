using Courses.Domain.Entities;
using Courses.Domain.Repositories;
using Courses.Services;
using NSubstitute;
using NUnit.Framework;
using Swart.DomainDrivenDesign;
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
        public void ListAll_ListIsCalled()
        {
            // Arrange

            // Act
            _service.ListAll();

            // Assert
            TeachersRepository.Received().List();
        }

        [Test]
        public void AddTeacher_ValidName_TeacherIsAdded()
        {
            // Arrange

            // Act
            _service.AddTeacher("Mohammad Helmy");

            // Assert
            TeachersRepository.Received().Add(Arg.Any<Teacher>());
        }

        [Test]
        public void AddTeacher_ValidName_TeacherIsSaved()
        {
            // Arrange

            // Act
            _service.AddTeacher("Mohammad Helmy");

            // Assert
            UnitOfWork.Received().SaveChanges();
        }

        [Test]
        public void AddTeacher_ValidName_Succeed()
        {
            // Arrange

            // Act
            var result = _service.AddTeacher("Mohammad Helmy");

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.True);
        }

        [Test]
        public void UpdateTeacher_TeacherIsFound_TeacherIsUpdated()
        {
            // Arrange
            var fullName = "Mohammad Helmy";
            var teacher = _SetupFoundTeacher();

            // Act
            _service.UpdateTeacherDetails(teacher.Id,fullName);

            // Assert
            Assert.That(teacher.FullName, Is.EqualTo(fullName));
        }

        [Test]
        public void UpdateTeacher_TeacherIsFound_TeacherIsSaved()
        {
            // Arrange
            var fullName = "Mohammad Helmy";
            var teacher = _SetupFoundTeacher();

            // Act
            _service.UpdateTeacherDetails(teacher.Id, fullName);

            // Assert
            UnitOfWork.Received().SaveChanges();
        }

        [Test]
        public void UpdateTeacher_TeacherIsFound_Succeed()
        {
            // Arrange
            var fullName = "Mohammad Helmy";
            var teacher = _SetupFoundTeacher();

            // Act
            var result = _service.UpdateTeacherDetails(teacher.Id, fullName);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.True);
        }

        [Test]
        public void UpdateTeacher_TeacherNotFound_Failed()
        {
            // Arrange            
            var fullName = "Mohammad Helmy";                        
            var id = TeachersRepository.NotFoundEntity();

            // Act
            var result = _service.UpdateTeacherDetails(id, fullName);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void UpdateTeacher_IdIsempty_Failed()
        {
            // Arrange            
            var fullName = "Mohammad Helmy";
            var id = Guid.Empty;

            // Act
            var result = _service.UpdateTeacherDetails(id, fullName);

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
