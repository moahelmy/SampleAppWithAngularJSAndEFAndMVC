using Courses.Domain.Entities;
using Courses.Repositories.Mapping;
using Swart.Repositories.EntityFramework;
using Swart.Repositories.EntityFramework.Conventions;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;

namespace Courses.Repositories
{
    public class CoursesUnitOfWork : SqlCommandAndQuerablyUnitOfWork, ICoursesUnitOfWork
    {
        #region Contructor(s)
        public CoursesUnitOfWork(){}

        public CoursesUnitOfWork(string connectionString)
            :base(connectionString)
        {}
        #endregion

        #region ICoursesUnitOfWork
                
        private IDbSet<Course> _courses;
        public IDbSet<Course> Courses { get { return _courses ?? (_courses = Set<Course>()); } }

        private IDbSet<Student> _students;
        public IDbSet<Student> Students { get { return _students ?? (_students = Set<Student>()); } }

        private IDbSet<Teacher> _teachers;
        public IDbSet<Teacher> Teachers { get { return _teachers ?? (_teachers = Set<Teacher>()); } }
        #endregion

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            // All Guid Id's columns are primary keys and identity
            modelBuilder.Properties<Guid>()
                .Where(p => p.Name == "Id")
                .Configure(p => p.IsKey().HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity));
            modelBuilder.Conventions.Add(new ForeignKeyNamingConvention());
            modelBuilder.Configurations.Add(new CourseMapping());
            modelBuilder.Configurations.Add(new StudentMapping());
            modelBuilder.Configurations.Add(new TeacherMapping());
            modelBuilder.ComplexType<Location>();
        }
    }
}
