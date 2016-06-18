using Courses.Domain.Entities;

namespace Courses.DataTransferObjects
{
    public class CourseDetails : EntityDto
    {
        public string Name { get; set; }

        public string BuildingNumber;

        public string RoomNumber;        

        public IdNamePair Teacher { set; get; }

        public CourseDetails()
        {

        }

        public CourseDetails(Course course)
        {
            if (course == null)
                return;        
            Id = course.Id;            
            Name = course.Name;
            if(course.Location != null)
            {
                BuildingNumber = course.Location.BuildingNumber;
                RoomNumber = course.Location.RoomNumber;
            }            
            Teacher = course.Teacher == null ? null : new IdNamePair
            {
                Id = course.Teacher.Id,
                Name = course.Teacher.FullName,
            };
        }

        public Course ToCourse()
        {
            return new Course
            {
                Id = this.Id,
                Name = this.Name,
                Location = new Location { BuildingNumber = this.BuildingNumber, RoomNumber = this.RoomNumber },                
            };
        }
    }
}
