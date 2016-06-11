using Courses.DataTransferObjects;
using Courses.Domain.Entities;
using Swart.DomainDrivenDesign;
using System;
using System.Collections.Generic;

namespace Courses.Services
{
    public interface ICoursesService
    {
        IReadOnlyCollection<CourseDetails> ListAll();
        IResult<Course> Add(CourseDetails course);
        IResult<Course> Update(CourseDetails courseDetails);
        IResult<Course> Delete(Guid id);
    }
}
