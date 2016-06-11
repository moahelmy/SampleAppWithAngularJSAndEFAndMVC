using Courses.Domain.Repositories;
using NSubstitute;
using NUnit.Framework;
using Swart.DomainDrivenDesign.Repositories;

namespace UnitTests.Service
{
    public class ServiceTestsBase : UnitTestBase
    {
        protected IUnitOfWork UnitOfWork;
        protected ITeachersRepository TeachersRepository;
        protected IStudentsRepository StudentsRepository;
        protected ICoursesRepository CoursesRepository;

        [SetUp]
        public override void SetUp()
        {
            base.SetUp();

            UnitOfWork = Substitute.For<IUnitOfWork>();

            TeachersRepository = Substitute.For<ITeachersRepository>();
            TeachersRepository.UnitOfWork.Returns(UnitOfWork);

            StudentsRepository = Substitute.For<IStudentsRepository>();
            StudentsRepository.UnitOfWork.Returns(UnitOfWork);

            CoursesRepository = Substitute.For<ICoursesRepository>();
            CoursesRepository.UnitOfWork.Returns(UnitOfWork);
        }
    }
}
