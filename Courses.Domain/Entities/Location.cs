using System.ComponentModel.DataAnnotations;

namespace Courses.Domain.Entities
{
    public class Location:BaseValueObject
    {
        [Required(AllowEmptyStrings = false)]
        public string RoomNumber { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string BuildingNumber { get; set; }
    }
}
