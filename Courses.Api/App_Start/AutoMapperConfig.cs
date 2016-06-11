using AutoMapper;
using Courses.Api.Models;
using Courses.DataTransferObjects;

namespace Courses.Api
{
    public class AutoMapperConfig
    {
        public static MapperConfiguration Configuration {get; private set;}

        public static MapperConfiguration Config()
        {
            Configuration = new MapperConfiguration(cfg => {
                // student
                cfg.CreateMap<StudentDetails, StudentViewModel>();
                cfg.CreateMap<StudentModel, StudentDetails>();

                // course
                cfg.CreateMap<CourseDetails, CourseViewModel>()
                    .ForMember(vm => vm.TeacherId, opt => opt.MapFrom(ct => ct.Teacher.Id))
                    .ForMember(vm => vm.TeacherName, opt => opt.MapFrom(ct => ct.Teacher.Name));
                cfg.CreateMap<CourseModel, CourseDetails>()
                    .ForMember(m => m.Teacher, opt => opt.MapFrom(ct => new IdNamePair { Id = ct.TeacherId.Value, Name = ct.TeacherName }));
            });
            
            return Configuration;
        }
    }
}
