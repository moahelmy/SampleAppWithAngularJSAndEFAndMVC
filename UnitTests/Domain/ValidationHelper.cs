using Swart.DomainDrivenDesign.Domain;
using Swart.Linq;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace UnitTests.Domain
{
    public static class ValidationHelper
    {
        public static string ValidateObjectWithGivenPropertyInValid<TObject, TProperty>(this TObject obj,
                                                        Expression<Func<TObject, TProperty>> propertyLambda)
            where TObject : IValidatable
        {
            var validationResults = obj.Validate();

            if (!validationResults.Any())
                return "Object is valid";

            return
                validationResults.Any(
                    e => e.MemberNames.Contains(propertyLambda.GetMemberNameForPropertiesOrFieldsOnly()))
                    ? string.Empty
                    : "Property does not occur in validation results";
        }

        public static string ValidateObjectWithGivenPropertyInValid<TObject, TProperty>(this TObject obj,
                                                        Expression<Func<TObject, TProperty>> propertyLambda,
                                                        string partOfErrorMessage)
            where TObject : IValidatable
        {
            var validationResults = obj.Validate();

            if (!validationResults.Any())
                return "Object is valid";

            return
                validationResults.Any(
                    e =>
                    e.MemberNames.Contains(propertyLambda.GetMemberNameForPropertiesOrFieldsOnly()) &&
                    e.ErrorMessage.ToLower().Contains(partOfErrorMessage.ToLower()))
                    ? string.Empty
                    : "Property does not occur in validation results";
        }
    }
}
