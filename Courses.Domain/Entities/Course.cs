using Swart.DomainDrivenDesign;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using ValidationResult = Swart.DomainDrivenDesign.Domain.ValidationResult;

namespace Courses.Domain.Entities
{
    public class Course : BaseEntity
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public Teacher Teacher { get; set; }

        [Required]
        public Location Location { get; set; }

        public virtual ICollection<Student> Students { get; set; }

        public Course()
        {
            Students = new Collection<Student>();
        }

        public IVoidResult AddStudent(Student student)
        {
            var result = new VoidResult();
            
            if (Students.Any(s => s.SurName.Equals(student.SurName, StringComparison.InvariantCultureIgnoreCase)))
                return result.AddErrorMessage("Another student with this surname already exists in this course");

            Students.Add(student);
            if (student.Courses == null)
                student.Courses = new Collection<Course>();
            student.Courses.Add(this);

            return result;
        }

        public IVoidResult RemoveStudent(Student student)
        {
            var result = new VoidResult();
            if (!Students.Contains(student))
                return result.AddErrorMessage(string.Format("{0}'s students collection does not contain this student ({1})", Name, student.FullName));

            if (student.Courses == null || !student.Courses.Contains(this))
                return result.AddErrorMessage(string.Format("{0}'s courses collection does not contain this course ({1})", student.FullName, Name));

            Students.Remove(student);
            student.Courses.Remove(this);

            return result;
        }        

        public override IEnumerable<ValidationResult> Validate()
        {
            var validationResults = new List<ValidationResult>();
            validationResults.AddRange(base.Validate());
            validationResults.AddRange(Location.Validate());

            var duplicatedNames = _GetDuplicatedSurnames();
            if (duplicatedNames.Any())
                validationResults.Add(new ValidationResult(String.Format("These surnames are duplicated: {0}", String.Join(", ", duplicatedNames))));
            return validationResults;
        }

        private IList<string> _GetDuplicatedSurnames()
        {
            var duplicatedNames = new List<string>();
            if (Students == null || !Students.Any())
                return duplicatedNames;
            var sortedStudents = Students.OrderBy(s => s.SurName).ToArray();
            for (int i = 0; i < sortedStudents.Length - 1; i++)
            {
                if (sortedStudents[i].SurName.Equals(sortedStudents[i + 1].SurName,
                                                     StringComparison.InvariantCultureIgnoreCase))
                {
                    if (!duplicatedNames.Contains(sortedStudents[i].SurName))
                        duplicatedNames.Add(sortedStudents[i].SurName);                    
                }
            }
            return duplicatedNames;
        }
    }
}
