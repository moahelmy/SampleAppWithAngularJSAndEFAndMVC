using System.Data.Entity.ModelConfiguration;
using Courses.Domain.Entities;

namespace Courses.Repositories.Mapping
{
    public class CourseMapping : EntityTypeConfiguration<Course>
    {
        public CourseMapping()
        {            
            Property(c => c.Name).IsRequired();
            Property(c => c.Location.BuildingNumber).HasColumnName("BuildingNumber");
            Property(c => c.Location.RoomNumber).HasColumnName("RoomNumber");
            HasMany(c => c.Students).WithMany(s => s.Courses);
        }
    }
}
