using Swart.DomainDrivenDesign.Domain.Exceptions;

namespace Courses.Domain.Exceptions
{
    public class FullNameIsEmptyOrSingleException : DomainException
    {
        public FullNameIsEmptyOrSingleException(string message) : base(message)
        {
        }
    }
}
