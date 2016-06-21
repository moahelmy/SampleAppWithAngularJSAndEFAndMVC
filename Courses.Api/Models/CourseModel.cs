using System;
using System.ComponentModel.DataAnnotations;

namespace Courses.Api.Models
{
    public class CourseModel
    {        
        [Required(AllowEmptyStrings = false)]        
        public string Name { get; set; }
        [Required(AllowEmptyStrings = false)]
        public string BuildingNumber;
        [Required(AllowEmptyStrings = false)]
        public string RoomNumber;        
        public Guid? TeacherId { set; get; }
        [Required(AllowEmptyStrings = false)]
        public string TeacherName { set; get; }
    }
}
