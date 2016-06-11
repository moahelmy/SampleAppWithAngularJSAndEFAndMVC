using Courses.Services;
using NUnit.Framework;
using System;
using NSubstitute;
using UnitTests.Helpers;
using Swart.DomainDrivenDesign;
using Courses.Domain.Entities;
using Courses.DataTransferObjects;

namespace UnitTests.Service
{
    public class CoursesServiceTestsBase : ServiceTestsBase
    {
        protected ICoursesService Service;

        public override void SetUp()
        {
            base.SetUp();

            Service = new CoursesService(CoursesRepository, TeachersRepository);
        }
    }

    public class CoursesServiceTests : CoursesServiceTestsBase
    {
        [Test]
        public void ListAll_ListIsCalled()
        {
            // Arrange
            // Act
            var result = Service.ListAll();

            // Assert
            CoursesRepository.Received().List();
        }

        #region Delete
        [Test]
        public void Delete_CourseIdIsEmpty_Fail()
        {
            // Arrange
            var id = Guid.Empty;

            // Act
            var result = Service.Delete(id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void Delete_CourseNotFound_Fail()
        {
            // Arrange
            var id = CoursesRepository.NotFoundEntity();

            // Act
            var result = Service.Delete(id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void Delete_CourseDeleted()
        {
            // Arrange
            var id = Guid.NewGuid();

            // Act
            var result = Service.Delete(id);

            // Assert
            CoursesRepository.Received().Delete(id);
        }

        [Test]
        public void Delete_CanDelete_Succeed()
        {
            // Arrange
            var course = CoursesRepository.CanDelete();

            // Act
            var result = Service.Delete(course.Id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.True);
        }

        [Test]
        public void Delete_CourseDeleted_Saved()
        {
            // Arrange
            var course = CoursesRepository.CanDelete();

            // Act
            var result = Service.Delete(course.Id);

            // Assert
            UnitOfWork.Received().SaveChanges();
        }
        #endregion
    }

    public class CoursesServiceModificationsTestsBase : CoursesServiceTestsBase
    {
        protected CourseDetails CourseDetails = new CourseDetails
        {
            Id = Guid.Empty,
            Name = "Math",
            BuildingNumber = "20",
            RoomNumber = "210",
            Teacher = new IdNamePair { Id = Guid.Empty, Name = "John Smith" },
        };

        public override void SetUp()
        {
            base.SetUp();

            TeachersRepository.Add(Arg.Any<Teacher>()).Returns(new VoidResult());
            CoursesRepository.Add(Arg.Any<Course>()).Returns(new VoidResult());
        }

        #region Teacher            
        protected void _TeacherNotFound_Fail(Func<Guid, IVoidResult> act)
        {
            // Arrange
            var id = TeachersRepository.NotFoundEntity();

            // Act
            var result = act(id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }
        
        protected void _TeacherFound_TeacherNameUpdated(Func<Guid, string> act)
        {
            // Arrange
            var teacher = TeachersRepository.FoundEntity();

            // Act
            var newName = act(teacher.Id);

            // Assert
            Assert.That(teacher.FullName, Is.EqualTo(newName));            
        }
        
        protected void _TeacherIdIsEmpty_CreateTeacher(Func<IdNamePair, Course> act)
        {
            // Arrange            
            var name = "Test teacher";

            // Act
            var course = act(new IdNamePair { Id = Guid.Empty, Name = name});

            // Assert
            Assert.That(course.Teacher, Is.Not.Null);
            Assert.That(course.Teacher.FullName, Is.EqualTo(name));
        }
        #endregion
    }

    public class CoursesServiceAddTests : CoursesServiceModificationsTestsBase
    {        
        #region Add    
        [Test]
        public void Add_TeacherNotFound_Fail()
        {
            _TeacherNotFound_Fail(id =>
            {
                CourseDetails.Teacher.Id = id;
                return Service.Create(CourseDetails);
            });
        }

        [Test]
        public void Add_TeacherFound_TeacherNameUpdated()
        {
            _TeacherFound_TeacherNameUpdated(id =>
            {
                CourseDetails.Teacher.Id = id;
                Service.Create(CourseDetails);
                return CourseDetails.Teacher.Name;
            });
        }

        [Test]
        public void Add_TeacherIdIsEmpty_CreateTeacher()
        {
            _TeacherIdIsEmpty_CreateTeacher(teacher =>
            {
                CourseDetails.Teacher = teacher;
                var res = Service.Create(CourseDetails);
                return res.Return;
            });
        }

        [Test]
        public void Add_Valid_Success()
        {
            // Arrange
            var teacher = TeachersRepository.FoundEntity();
            CourseDetails.Teacher.Id = teacher.Id;

            // Act
            var result = Service.Create(CourseDetails);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.True);
        }

        [Test]
        public void Add_Valid_CourseAdded()
        {
            // Arrange
            var teacher = TeachersRepository.FoundEntity();
            CourseDetails.Teacher.Id = teacher.Id;

            // Act
            Service.Create(CourseDetails);

            // Assert
            CoursesRepository.Received().Add(Arg.Any<Course>());
        }

        [Test]
        public void Add_Valid_Saved()
        {
            // Arrange
            var teacher = TeachersRepository.FoundEntity();
            CourseDetails.Teacher.Id = teacher.Id;

            // Act
            Service.Create(CourseDetails);

            // Assert
            UnitOfWork.Received().SaveChanges();
        }
        #endregion        
    }

    public class CoursesServiceUpdateTests : CoursesServiceModificationsTestsBase
    {
        private Course _course;

        public override void SetUp()
        {
            base.SetUp();

            _course = CoursesRepository.FoundEntity();
            CourseDetails.Id = _course.Id;
            CourseDetails.Teacher.Id = Guid.Empty;
        }

        #region Update    
        [Test]
        public void Update_CourseIdISEmpty_Fail()
        {
            // Arrange
            var id = Guid.Empty;
            CourseDetails.Id = id;

            // Act
            var result = Service.Update(CourseDetails);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void Update_CourseNotFound_Fail()
        {
            // Arrange
            var id = CoursesRepository.NotFoundEntity();
            CourseDetails.Id = id;

            // Act
            var result = Service.Update(CourseDetails);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.False);
        }

        [Test]
        public void Update_TeacherNotFound_Fail()
        {
            _TeacherNotFound_Fail(id =>
            {
                CourseDetails.Teacher.Id = id;
                return Service.Update(CourseDetails);
            });
        }

        [Test]
        public void Update_TeacherFound_TeacherNameUpdated()
        {
            _TeacherFound_TeacherNameUpdated(id =>
            {
                CourseDetails.Teacher.Id = id;
                Service.Update(CourseDetails);
                return CourseDetails.Teacher.Name;
            });
        }

        [Test]
        public void Update_TeacherIdIsEmpty_CreateTeacher()
        {
            _TeacherIdIsEmpty_CreateTeacher(teacher =>
            {
                CourseDetails.Teacher = teacher;
                var res = Service.Update(CourseDetails);
                return res.Return;
            });
        }

        [Test]
        public void Update_Valid_Succeed()
        {
            // Arrange
            // Act
            var result = Service.Update(CourseDetails);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Succeed, Is.True);
        }

        [Test]
        public void Update_Valid_CourseUpdated()
        {
            // Arrange
            // Act
            var result = Service.Update(CourseDetails);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Return, Is.Not.Null);
            Assert.That(result.Return.Name, Is.EqualTo(CourseDetails.Name));
            Assert.That(result.Return.Location.BuildingNumber, Is.EqualTo(CourseDetails.BuildingNumber));
            Assert.That(result.Return.Location.RoomNumber, Is.EqualTo(CourseDetails.RoomNumber));
        }

        [Test]
        public void Update_Valid_Saved()
        {
            // Arrange
            // Act
            var result = Service.Update(CourseDetails);

            // Assert
            UnitOfWork.Received().SaveChanges();
        }
        #endregion        
    }
}
