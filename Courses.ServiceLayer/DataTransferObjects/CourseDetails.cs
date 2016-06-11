using System;

namespace Courses.DataTransferObjects
{
    public class CourseDetails : EntityDto
    {
        public string Name { get; set; }

        public string BuildingNumber;

        public string RoomNumber;        

        public IdNamePair Teacher { set; get; }
    }
}
