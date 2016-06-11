using System;
using System.ComponentModel.DataAnnotations;

namespace Courses.Api.Models
{
    public class StudentModel
    {
        [Required]
        public string FullName { get; set; }
        [Required]
        [DataType(DataType.Date)]
        public DateTime? BirthDate { get; set; }
        [Required]       
        [Range(0, double.MaxValue)] 
        public double GPA { get; set; }
        [Required]
        public Guid? CourseId { get; set; }
    }
}
