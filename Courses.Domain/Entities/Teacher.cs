using System.Collections.Generic;

namespace Courses.Domain.Entities
{
    public class Teacher : Person
    {
        public virtual ICollection<Course> Courses { get; set; }
    }
}
