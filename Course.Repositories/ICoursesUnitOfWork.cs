using Courses.Domain.Entities;
using Swart.DomainDrivenDesign.Repositories;
using Swart.Repositories.EntityFramework;
using System.Data.Entity;

namespace Courses.Repositories
{
    public interface ICoursesUnitOfWork :  IQueryableUnitOfWork, ISqlCommand
    {
        IDbSet<Course> Courses { get; }
        IDbSet<Student> Students { get; }
        IDbSet<Teacher> Teachers { get; }
    }
}
