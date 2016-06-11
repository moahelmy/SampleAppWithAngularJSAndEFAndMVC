using Courses.Domain.Entities;
using System;

namespace UnitTests.Domain
{
    internal class Factory
    {
        #region Course
        internal static Course CreateTestCourse()
        {
            return new Course
            {
                Name = "Biology",
                Location = new Location { BuildingNumber = "4", RoomNumber = "10" },
                Teacher = new Teacher { FullName = "Steve Jobs" },
            };
        }

        #endregion

        #region Student
        internal static Student CreateTestStudent()
        {
            return new Student
            {
                BirthDate = new DateTime(1983, 01, 16),
                GPA = 3.5,
                GivenNames = "Charles",
                SurName = "Dickens"
            };
        }
        #endregion

        #region Person
        internal static Person CreateTestPerson()
        {
            return new Person
            {
                GivenNames = "Bjarne",
                SurName = "Stroustrup",
            };
        }
        #endregion
    }
}
