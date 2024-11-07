/***
  Copyright 2024 Croffle Development Team (WKU - CSE)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
***/

using SQLite;

namespace DataManager.SQLiteDBMS.Scheme
{
    [Table("Contents")]
    public class Contents
    {
        [PrimaryKey, Column("CID"), NotNull, Unique]
        public string ContentsID { get; set; }

        [Column("type"), NotNull]
        public string Type { get; set; }

        [Column("content_date"), NotNull]
        public DateTime ContentDate { get; set; }

        [Column("color")]
        public int Color { get; set; }

        [Column("added_time"), NotNull]
        public DateTime AddedTime { get; set; }
    }
}
