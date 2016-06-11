using System.ComponentModel.DataAnnotations;

namespace Courses.Domain.Entities
{
    public class Location:BaseValueObject
    {
        [Required]
        public string RoomNumber { get; set; }

        [Required]
        public string BuildingNumber { get; set; }
    }
}
