using SQLite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plugin_Waffle.DB_Scheme;

[Table("Waffle")]
public class Waffle
{
    [PrimaryKey, Column("CID"), NotNull, Unique]
    public string? ContentID { get; set; }

    [Column("wlctr_nm"), NotNull]
    public string? WLctrName { get; set; }

    [Column("wtitle"), NotNull]
    public string? WTitle { get; set; }

    [Column("wtype"), NotNull]
    public string? WType { get; set; }

    [Column("weekcount"), NotNull]
    public int WeekCount { get; set; }
}
