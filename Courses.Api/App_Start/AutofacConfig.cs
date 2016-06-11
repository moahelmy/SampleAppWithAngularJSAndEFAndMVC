using Autofac;
using Autofac.Core.Lifetime;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;
using AutoMapper;
using Courses.Domain.Entities;
using Courses.Repositories;
using Courses.Services;
using System.Reflection;
using System.Web.Http;
using System.Web.Mvc;

namespace Courses.Api
{
    public class AutofacConfig
    {
        public static void ConfigureContainer(HttpConfiguration config)
        {
            var builder = new ContainerBuilder();

            // Register dependencies in controllers
            builder.RegisterControllers(Assembly.GetExecutingAssembly());

            // Register dependencies in api controllers
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            // Register dependencies in filter attributes
            builder.RegisterFilterProvider();

            // Register dependencies in custom views
            builder.RegisterSource(new ViewRegistrationSource());

            RegisterLayers(builder);

            var container = builder.Build();

            // Set MVC DI resolver to use our Autofac container
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));

            // Set MVC API DI resolver to use our Autofac container
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }

        public static void RegisterLayers(ContainerBuilder builder)
        {
            // Register domain
            builder.RegisterTypes(typeof(Course)).AsImplementedInterfaces();            

            // Register repositories
            builder.RegisterAssemblyTypes(Assembly.GetAssembly(typeof(TeachersRepository)))
                .AsImplementedInterfaces()
                .InstancePerMatchingLifetimeScope(MatchingScopeLifetimeTags.RequestLifetimeScopeTag);

            // Register services
            builder.RegisterAssemblyTypes(Assembly.GetAssembly(typeof(TeachersService)))
                .AsImplementedInterfaces()
                .InstancePerRequest();            
        }
    }
}
