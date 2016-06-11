using System;

namespace Courses.DataTransferObjects
{
    public class StudentDetails : EntityDto
    {
        public string FullName { get; set; }

        public DateTime BirthDate { get; set; }

        public int Age { get; set; }

        public double GPA { get; set; }
    }
}
