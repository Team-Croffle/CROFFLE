using SQLite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace AnniversaryAPI.Scheme
{
    [Table("anniversary")]
    public class Anniversary
    {
        [Column("locdate"), PrimaryKey, NotNull]
        public DateTime locdate { get; set; }

        [Column("isHoliday"), PrimaryKey, NotNull]
        public bool isHoliday { get; set; }

        [Column("dateName"), PrimaryKey, NotNull]
        public string dateName { get; set; }
    }
}
