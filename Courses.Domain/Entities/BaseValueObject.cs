using Swart.DomainDrivenDesign.Domain;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Courses.Domain.Entities
{
    public class BaseValueObject : ValueObject
    {
        public override IEnumerable<Swart.DomainDrivenDesign.Domain.ValidationResult> Validate()
        {
            var validationResults = base.Validate().ToList();
            var valRes = new Collection<System.ComponentModel.DataAnnotations.ValidationResult>();
            var isValid = Validator.TryValidateObject(this, new ValidationContext(this), valRes);
            if (!isValid)
                validationResults.AddRange(valRes.Select(x => new Swart.DomainDrivenDesign.Domain.ValidationResult(x.ErrorMessage, x.MemberNames)));

            return validationResults;
        }
    }
}
