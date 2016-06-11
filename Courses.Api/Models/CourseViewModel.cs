namespace Courses.Api.Models
{
    public class CourseViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string BuildingNumber;
        public string RoomNumber;
        public string Location { get { return string.Format("Building {0} Room {1}", BuildingNumber, RoomNumber); } }
        public string TeacherId { set; get; }
        public string TeacherName { set; get; }
    }
}
