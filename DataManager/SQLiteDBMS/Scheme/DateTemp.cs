using SQLite;

namespace DataManager.SQLiteDBMS.Scheme;

[Table("DateTemp")]
public class DateTemp
{
    [Column("value")]
    public DateTime Value { get; set; }
}
