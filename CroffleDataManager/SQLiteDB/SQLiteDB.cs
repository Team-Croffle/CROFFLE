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

using System.Data;
using System.Data.SQLite;

namespace CroffleDataManager.SQLiteDB
{
    public class SQLiteDB
    {
        readonly DBManager _DBManager;

        /// <summary>
        /// Initialize SQLiteDB.
        /// </summary>
        /// <param name="tables">존재해야 할 table 목록</param>
        /// <exception cref="TaskCanceledException">모든 table의 existence가 False</exception>
        /// <exception cref="DirectoryNotFoundException">DB Filedml existence가 False임.</exception>
        public SQLiteDB()
        {
            _DBManager = new DBManager("croffle.sql");
        } // SQLiteDB()

        public void CheckDatabase(List<string> tables)
        {
            Console.WriteLine("[SQLiteDB] CheckDatabase: Check SQLiteDB");
            var res = _DBManager.CheckValidation(tables);
            if (res == 0)
            {
                Console.WriteLine("> [CheckDatabase] SQLiteDB is invalid");
                throw new TaskCanceledException("[CheckDatabase] SQLiteDB is invalid");
            }
            else if (res == -1)
            {
                Console.WriteLine("> [CheckDatabase] SQLiteDB is not exist");
                throw new DirectoryNotFoundException("[CheckDatabase] SQLiteDB is not exist");
            }
            Console.WriteLine("> [CheckDatabase] SQLiteDB is valid");
        } // CheckValidation()

        public string GetFullPath()
        {
            return _DBManager.GetFullPath();
        } // GetFullPath()

        public string GetDirPath()
        {
            return _DBManager.GetDirPath();
        } // GetDirPath()

        public string GetDB_Version()
        {
            _DBManager.SelectFrom("version", "db_version", "name='current'", null, out DataSet dataSet);
            return dataSet.Tables[0].Rows[0][0].ToString() ?? "";
        }

        /// <summary>
        /// Get daily property from SQLite DB.
        /// </summary>
        /// <param name="date">target date</param>
        /// <param name="done">check done</param>
        /// <param name="alarm">check alarm</param>
        /// <param name="contents">first table is memo_components, second table include Tasks, Schedules and WaffleTasks.</param>
        /// <exception cref="NullReferenceException">No tables from dataset</exception>
        /// <exception cref="ConstraintException">Too many table from dataset</exception>
        public void GetDailyProperty(DateTime date, int done,  int alarm,  out List<DataTable> contents)
        {
            Console.WriteLine($"[SQLiteDB] GetDailyProperty: Get contents from date: {date:yyyy-MM-dd} done:{done} alarm:{alarm}");
            contents = new List<DataTable>();
            _DBManager.SelectFrom("*", "memo_components", $"mtime=date('{date:yyyy-MM-dd}')", null, out DataSet dataSet1);

            ValidateTableCount(dataSet1, "memo_components");

            contents.Add(dataSet1.Tables[0]);

            var condition = $@"date(ctime)=date('{date:yyyy-MM-dd}')";
            if(done == 0 || done == 1) condition += $" AND done={done}";
            if(alarm == 0 || alarm == 1) condition += $" AND alarm={alarm}";
            _DBManager.SelectFrom("*", "components", condition, null, out DataSet dataSet2);
            ValidateTableCount(dataSet2, "components");

            contents.Add(dataSet2.Tables[0]);
        } // GetDailyProperty()

        public void GetAlarmProperty(DateTime sTime, DateTime eTime, int done, bool only_waffle, out DataTable alarm)
        {
            Console.WriteLine($"[SQLiteDB] GetAlarmProperty: Get alarm table");
            alarm = new DataTable();

            string condition = $"ctime BETWEEN datetime('{sTime:yyyy-MM-dd HH:mm}') AND datetime('{eTime:yyyy-MM-dd HH:mm}')";
            condition += $" AND alarm=true";
            if (done == 0 || done == 1) condition += $" AND done={done}";
            if (only_waffle) condition += " AND contentID LIKE 'W%'";

            _DBManager.SelectFrom("*", "components", condition, $@"ORDER BY ctime ASC", out DataSet dataSet);
            ValidateTableCount(dataSet, "alarm");

            alarm = dataSet.Tables[0];

        }

        /// <summary>
        /// Get ID count number from last ID in SQLite DB.
        /// </summary>
        /// <param name="content">content name</param>
        /// <returns></returns>
        /// <exception cref="NullReferenceException">No tables from dataset</exception>
        /// <exception cref="ConstraintException">Too many table from dataset</exception>
        public int Get_ID_Count(string content, DateTime targetDate)
        {
            Console.WriteLine($"[SQLiteDB] Get_ID_Count: Get ID Count from {content}");
            _DBManager.SelectFrom("contentsID", content, $"date(added_time)=date('{targetDate:yyyy-MM-dd}')",
                "ORDER BY contentsID DESC", out DataSet dataSet);

            ValidateTableCount(dataSet, "Get_ID_Count");

            // default count (if no data) is 0
            int count = 0;
            var table = dataSet.Tables[0];

            Console.WriteLine($"> [Get_ID_Count] Current Count: {table.Rows.Count}");

            // if there is data, count is the last ID number + 1
            var lastID = table.Rows[0][0].ToString() ?? throw new NullReferenceException(" > [Get_ID_Count] No ID in table");
            if (table.Rows.Count != 0) count = Convert.ToInt32(lastID.Substring(7)) + 1;

            return count;
        } // Get_ID_Count()

        public int Get_ID_Count(string content)
        {
            Console.WriteLine($"[SQLiteDB] Get_ID_Count: Get ID Count from {content}");
            _DBManager.SelectFrom("contentsID", content, null, "ORDER BY contentsID DESC", out var dataSet);

            ValidateTableCount(dataSet, "Get_ID_Count");

            // default count (if no data) is 0
            int count = 0;
            var table = dataSet.Tables[0];

            Console.WriteLine($"> [Get_ID_Count] Current Count: {table.Rows.Count}");

            // if there is data, count is the last ID number + 1
            var lastID = table.Rows[0][0].ToString() ?? throw new NullReferenceException(" > [Get_ID_Count] No ID in table");
            if (table.Rows.Count != 0) { int.TryParse(lastID.Substring(7), out count); count++; }

            return count;
        }

        /// <summary>
        /// Load data from table(content) in SQLite DB. 
        /// </summary>
        /// <param name="content"></param>
        /// <param name="contentID"></param>
        /// <param name="table"></param>
        public void LoadOnDB(string content, string contentID, out DataTable table)
        {
            Console.WriteLine($"[SQLiteDB] LoadOnDB: Load content with ID {contentID} from {content}");
            table = new DataTable();
            try{
                _DBManager.SelectFrom("*", content, $"contentsID='{contentID}'", null, out DataSet dataSet);
                ValidateTableCount(dataSet, "LoadOnDB");
                table = dataSet.Tables[0];
            }
            catch(SQLiteException sqlE) { Console.WriteLine($"> [LoadOnDB] SQLiteException: {sqlE.Message}"); }
        } // LoadOnDB()

        /// <summary>
        /// Load all data from table(content) in SQLite DB.
        /// </summary>
        /// <param name="content"></param>
        /// <param name="table"></param>
        public void LoadOnDB(string content, out DataTable table)
        {
            Console.WriteLine($"[SQLiteDB] LoadOnDB: Load all contents from {content}");
            table = new DataTable();
            try
            {
                _DBManager.SelectFrom("*", content, null, null, out DataSet dataSet);
                ValidateTableCount(dataSet, "LoadOnDB");
                table = dataSet.Tables[0];
            }
            catch (SQLiteException sqlE) { Console.WriteLine($"> [LoadOnDB] SQLiteException: {sqlE.Message}"); }
        } // LoadOnDB()

        /// <summary>
        /// Save data onto table(content) in SQLite DB.
        /// </summary>
        /// <param name="content">table name</param>
        /// <param name="values"> values</param>
        public void SaveOnDB(string content, string values)
        {
            Console.WriteLine($"[SQLiteDB] SaveOnDB: Save data on {content}");
            try { _DBManager.ReplaceInto(content, values); }
            catch (SQLiteException sqlE) { Console.WriteLine($"> [SaveOnDB] SQLiteException: {sqlE.Message}"); }
        } // SaveOnDB()

        /// <summary>
        /// Delete data on table(content) in SQLite DB.
        /// </summary>
        /// <param name="content"></param>
        /// <param name="contentID"></param>
        public void DeleteOnDB(string content, string contentID)
        {
            Console.WriteLine($@"[SQLiteDB] DeleteOnDB: Delete data with ID {contentID} from {content}");
            try { _DBManager.DeleteFrom(content, $@"contentsID='{contentID}'"); }
            catch (SQLiteException sqlE) { Console.WriteLine($"> [DeleteOnDB] SQLiteException: {sqlE.Message}"); }
        } // DeleteOnDB()

        public void UpdateOnDB(string content, string contentID, string values)
        {
            Console.WriteLine($"[SQLiteDB] UpdateOnDB: Update data with ID {contentID} on {content}");
            try { _DBManager.Update(content, values, $"contentsID='{contentID}'"); }
            catch (SQLiteException sqlE) { Console.WriteLine($"> [UpdateOnDB] SQLiteException: {sqlE.Message}"); }
        } // UpdateOnDB()

        /// <summary>
        /// Reset table(content) in SQLite DB.
        /// </summary>
        /// <param name="content"></param>
        public void ResetTable(string content)
        {
            Console.WriteLine($"[SQLiteDB] ResetTable: Reset {content}");
            try { _DBManager.DeleteFrom(content, null); }
            catch (SQLiteException sqlE) { Console.WriteLine($"> [ResetTable] SQLiteException: {sqlE.Message}"); }
        } // ResetTable()

        /// <summary>
        /// 반환된 DataSet의 Table의 validation을 확인합니다.
        /// </summary>
        /// <param name="dataSet">dataset</param>
        /// <param name="context">table 명</param>
        /// <exception cref="NullReferenceException">table 없음</exception>
        /// <exception cref="ConstraintException">table이 많음</exception>
        private void ValidateTableCount(DataSet dataSet, string context)
        {
            if (dataSet.Tables.Count == 0)
            {
                Console.WriteLine($"> [{context}] No tables in DataSet");
                throw new NullReferenceException($"No tables in DataSet");
            }
            else if (dataSet.Tables.Count > 1)
            {
                Console.WriteLine($"> [{context}] Too many tables in DataSet");
                throw new ConstraintException($"Too many tables in DataSet");
            }
            Console.WriteLine($"> [{context}] Table is valid");
        }

    } // class SQLiteDB
}// namespace CroffleDataManager.SQLiteDB
