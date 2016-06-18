using Courses.DataTransferObjects;
using Swart.DomainDrivenDesign;
using System;
using System.Collections.Generic;

namespace Courses.Services
{
    public interface ICoursesService
    {
        IReadOnlyCollection<CourseDetails> ListAll();
        CourseDetails Get(Guid id);
        IResult<CourseDetails> Create(CourseDetails course);
        IResult<CourseDetails> Update(CourseDetails courseDetails);
        IResult<CourseDetails> Delete(Guid id);
    }
}
