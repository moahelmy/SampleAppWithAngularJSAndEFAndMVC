using Courses.Repositories;
using NUnit.Framework;
using System;
using System.Data.Entity;
using System.IO;

namespace IntegrationTests
{
    [SetUpFixture]
    public class TestSetUp
    {
        [OneTimeSetUp]
        public void SetUp()
        {
            var projectDir = Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).Parent;
            if (projectDir != null)
            {
                AppDomain.CurrentDomain.SetData("DataDirectory", projectDir.FullName);
            }
            Database.SetInitializer(new DropCreateDatabaseAlways<CoursesUnitOfWork>());
        }
    }
}
