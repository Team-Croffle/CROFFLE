using SQLite;

namespace AnniversaryAPI.Scheme
{
    [Table("anniversary")]
    public class Anniversary
    {
        [Column("locdate"), PrimaryKey, NotNull]
        public DateTime locdate { get; set; }

        [Column("isHoliday"), NotNull]
        public bool isHoliday { get; set; }

        [Column("dateName"), NotNull]
        public string? dateName { get; set; }
    }
}
