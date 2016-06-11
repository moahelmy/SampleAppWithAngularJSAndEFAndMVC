using Courses.Domain.Entities;
using System.Data.Entity.ModelConfiguration;

namespace Courses.Repositories.Mapping
{
    public class TeacherMapping : EntityTypeConfiguration<Teacher>
    {
        public TeacherMapping()
        {            
            Property(t => t.GivenNames).IsRequired();
            Property(t => t.SurName).IsRequired();
            Ignore(s => s.FullName);
        }
    }
}
