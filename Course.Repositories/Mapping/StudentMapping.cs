using Courses.Domain.Entities;
using System.Data.Entity.ModelConfiguration;

namespace Courses.Repositories.Mapping
{
    public class StudentMapping : EntityTypeConfiguration<Student>
    {
        public StudentMapping()
        {            
            Property(s => s.GivenNames).IsRequired();
            Property(s => s.SurName).IsRequired();
            Property(s => s.BirthDate).IsRequired();
            Property(s => s.GPA).IsRequired();
            Ignore(s => s.FullName);
        }
    }
}
