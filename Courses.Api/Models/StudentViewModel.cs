using System;

namespace Courses.Api.Models
{
    public class StudentViewModel
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public DateTime BirthDate { get; set; }        
        public int Age { get; set; }
        public double GPA { get; set; }
        public bool IsExcellent { get; set; }        
    }
}
