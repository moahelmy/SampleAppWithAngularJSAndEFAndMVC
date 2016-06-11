using System;

namespace Courses.DataTransferObjects
{
    public class CourseDetails
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string BuildingNumber;

        public string RoomNumber;        

        public IdNamePair Teacher { set; get; }
    }
}
