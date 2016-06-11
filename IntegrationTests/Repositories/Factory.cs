using Courses.Domain.Entities;
using Courses.Repositories;
using System;
using System.Collections.Generic;

namespace IntegrationTests.Repositories
{
    internal static class Factory
    {
        internal static ICoursesUnitOfWork CreateCoursesUnitOfWork()
        {
            return new CoursesUnitOfWork();
        }

        internal static TRepository CreateReporsitory<TRepository>(ICoursesUnitOfWork unitOfWork)
        {
            var repoType = typeof(TRepository);
            var constructor = repoType.GetConstructor(new[] { typeof(ICoursesUnitOfWork) });
            if (constructor == null)
                throw new ArgumentException(
                    "Could not find target constructor.");

            return (TRepository)constructor.Invoke(new object[] { unitOfWork });
        }

        internal static Student CreateValidStudent()
        {
            var biology = new Course
            {
                Name = "Biology",
                Teacher = new Teacher { FullName = "Richard Nickson" },
                Location = CreateValidLocation()
            };
            var student = new Student
            {
                BirthDate = new DateTime(1983, 1, 16),
                FullName = "Yaya Toure",
                GPA = 3.0,
            };

            biology.AddStudent(student);
            return student;
        }

        internal static Teacher CreateValidTeacher()
        {
            return new Teacher
            {
                FullName = "Lionel Messi",
            };
        }

        internal static Course CreateValidCourse()
        {
            return new Course
            {
                Name = "Biology",
                Teacher = new Teacher { FullName = "Richard Nickson" },
                Location = CreateValidLocation(),
                Students = new List<Student>{new Student
                                                {
                                                    BirthDate = new DateTime(1983,1,16),
                                                    FullName = "Yaya Toure",
                                                    GPA = 3.0,
                                                }}
            };
        }

        internal static Location CreateValidLocation()
        {
            return new Location { BuildingNumber = "5", RoomNumber = "10" };
        }
    }
}
