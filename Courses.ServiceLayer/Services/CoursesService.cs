using System;
using System.Collections.Generic;
using System.Linq;
using Courses.DataTransferObjects;
using Courses.Domain.Entities;
using Swart.DomainDrivenDesign;
using Courses.Domain.Repositories;

namespace Courses.Services
{
    public class CoursesService : ICoursesService
    {
        private ICoursesRepository _coursesRepository;
        private ITeachersRepository _teachersRepository;

        public CoursesService(ICoursesRepository repo, ITeachersRepository teachersRepository)
        {
            _coursesRepository = repo;
            _teachersRepository = teachersRepository;
        }

        public IReadOnlyCollection<CourseDetails> ListAll()
        {
            return _coursesRepository.List().ToList().Select(x => new CourseDetails(x)).ToList();
        }

        public CourseDetails Get(Guid id)
        {
            var result = _coursesRepository.Get(id);
            if (!result.Succeed)
                return null;
            var course = result.Return;
            return new CourseDetails(course);
        }

        public IResult<CourseDetails> Create(CourseDetails courseDetails)
        {
            var ret = new Result<CourseDetails>();
            var teacherRes = _UpdateTeacher(courseDetails);
            if (teacherRes.Succeed)
            {
                var course = courseDetails.ToCourse();
                course.Teacher = teacherRes.Return;                
                var addRes = _coursesRepository.Add(course);
                if (!addRes.Succeed)
                    ret.Messages = addRes.Messages;
                else
                    _coursesRepository.UnitOfWork.SaveChanges();
                courseDetails.Id = course.Id;
                ret.Return = courseDetails;
            }
            else
            {
                ret.Messages = teacherRes.Messages;
            }

            return ret;
        }

        public IResult<CourseDetails> Delete(Guid id)
        {
            if (id == Guid.Empty)
                return new Result<CourseDetails>().AddErrorMessage("Course id is empty");
            var result = _coursesRepository.Delete(id);
            if (result.Succeed)
                _coursesRepository.UnitOfWork.SaveChanges();
            return new Result<CourseDetails>
            {
                Return = new CourseDetails(result.Return),
                Messages = result.Messages,
            };
        }        

        public IResult<CourseDetails> Update(CourseDetails courseDetails)
        {
            if (courseDetails.Id == Guid.Empty)
                return new Result<CourseDetails>().AddErrorMessage("Course id is empty");
            var courseRes = _coursesRepository.Get(courseDetails.Id);
            if(!courseRes.Succeed)
                return new Result<CourseDetails>().AddErrorMessage("Course not found");

            var teacherRes = _UpdateTeacher(courseDetails);
            if (!teacherRes.Succeed)
                return new Result<CourseDetails> { Messages = teacherRes.Messages };

            var course = courseRes.Return;
            course.Name = courseDetails.Name;
            course.Teacher = teacherRes.Return;
            course.Location = new Location();
            course.Location.BuildingNumber = courseDetails.BuildingNumber;
            course.Location.RoomNumber = courseDetails.RoomNumber;

            _coursesRepository.UnitOfWork.SaveChanges();

            return new Result<CourseDetails> { Return = courseDetails };
        }

        private IResult<Teacher> _UpdateTeacher(CourseDetails course)
        {
            var ret = new Result<Teacher>();
            if (course.Teacher.Id == Guid.Empty)
            {
                var teacher = new Teacher { FullName = course.Teacher.Name };
                var res = _teachersRepository.Add(teacher);
                if (!res.Succeed)
                    ret.Messages = res.Messages;
                else
                    ret.Return = teacher;                
            }
            else
            {
                var teacherRes = _teachersRepository.Get(course.Teacher.Id);
                if (teacherRes.Succeed)
                    teacherRes.Return.FullName = course.Teacher.Name;
                return teacherRes;
            }
            return ret;
        }
    }
}
