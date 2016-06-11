using Swart.DomainDrivenDesign.Domain;
using System;
using System.Collections.Generic;

namespace Courses.Domain.Entities
{
    public class Student : Person
    {
        public DateTime BirthDate { get; set; }

        public int Age
        {
            get
            {
                var now = DateTime.Now;
                var age = now.Year - BirthDate.Year;
                var dayOftheYear = now.DayOfYear - ((now.Year % 4) == 0 ? 1 : 0);
                var birthDayOfTheYear = BirthDate.DayOfYear -  ((BirthDate.Year % 4) == 0 ? 1 : 0);
                age = (dayOftheYear < birthDayOfTheYear) ? (age - 1) : age;
                return age;
            }
        }
        
        public double GPA { get; set; }
        public bool IsExcellent { get { return GPA > 3.2; } }

        public virtual ICollection<Course> Courses { get; set; }

        public override IEnumerable<ValidationResult> Validate()
        {
            var validationResults = new List<ValidationResult>();
            validationResults.AddRange(base.Validate());

            if (BirthDate == DateTime.MinValue)
                validationResults.Add(new ValidationResult("The BirthDate field is required", new[] { "BirthDate" }));

            if (BirthDate >= DateTime.Now)
                validationResults.Add(new ValidationResult("The BirthDate field can't be in the present or the future", new[] { "BirthDate" }));

            if (GPA < 0)
                validationResults.Add(new ValidationResult("The GPA field must be positive", new[] { "GPA" }));

            return validationResults;
        }
    }
}
