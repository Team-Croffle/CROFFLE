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

using AnniversaryAPI.Scheme;
using DataManager.SQLiteDBMS;

namespace AnniversaryAPI
{
    public class SQLiteDBAnnv : SQLiteDB
    {
        public SQLiteDBAnnv() { }

        public new void DB_Init()
        {
            ConnInit();
            Init();
        }

        private new void ConnInit()
        {
            if (_db is not null) return;
            DirectoryInfo db_path = new(DB_PATH);
            if (!db_path.Exists) db_path.Create();

            _db = new(Path.Combine(DB_PATH, ConstantsAnnv.DB_NAME), ConstantsAnnv.FLAGS);
        } // ConnInit

        protected new void Init() 
        {
            CreateTable<Anniversary>();
        } // Init

        public bool IsHoliday(DateTime date)
        {
            if (_db is null) return false;
            var annvList = _db.Table<Anniversary>().Where(x => x.locdate == date).ToList();
            foreach (var item in annvList)
            {
                if (item.isHoliday) return true;
            }
            return false;
        } // IsHoliday
    } // SQLiteDBAnnv
} // AnniversaryAPI
