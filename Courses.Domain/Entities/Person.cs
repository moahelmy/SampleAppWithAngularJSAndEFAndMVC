using Courses.Domain.Exceptions;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Courses.Domain.Entities
{
    public class Person : BaseEntity
    {
        [Required]
        public string GivenNames { get; set; }

        [Required]
        public string SurName { get; set; }

        public string FullName
        {
            get { return string.Format("{0} {1}", GivenNames, SurName); }
            set
            {
                var names = value.Split(new[] { " " }, StringSplitOptions.RemoveEmptyEntries);

                if (names.Length <= 1)
                    throw new FullNameIsEmptyOrSingleException("Full name is invalid");

                SurName = names.Last();
                GivenNames = string.Join(" ", names.Take(names.Length - 1));
            }
        }
    }
}
