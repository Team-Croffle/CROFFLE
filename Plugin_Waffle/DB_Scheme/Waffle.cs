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
