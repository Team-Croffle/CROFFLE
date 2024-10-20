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
    public class DBManager
    {
        readonly FileManager fileManager;

        public DBManager(string dbname)
        {
            //filemanager의 생성자 호출. path를 {%appdata%}\Croffle\DB로 설정하고, DB파일명은 sqlitedb로 설정.
            var path = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + $@"\Croffle\DB";
            fileManager = new FileManager(path, dbname);
        } // DBManager()

        public string GetDirPath()
        {
            return fileManager.FilePath;
        } // GetDirPath()

        public string GetFullPath()
        {
            return fileManager.GetFullPath();
        } // GetFullPath()

        /// <summary>
        /// DB의 유효성을 확인합니다.
        /// </summary>
        /// <param name="tables">존재해야할 table 목록</param>
        /// <returns>Normal: 1, Need Init: 0, No DB File: -1</returns>
        public int CheckValidation(List<string> tables)
        {
            Console.WriteLine("[DBManager] CheckValidation: Check Validation....");
            if (fileManager.CheckFile())
            {
                Console.WriteLine("> [CheckValidation] DB File Exists.");
                foreach (var table in tables)
                {
                    SelectFrom("COUNT(*)", "sqlite_master", $"(type='table' OR type='view') AND name='{table}'", null, out DataSet dataSet);
                    var  count = dataSet.Tables[0].Rows[0][dataSet.Tables[0].Columns[0]].ToString();
                    if (count == "0")
                        return 0;
                    Console.WriteLine($"> [CheckValidation] Table(View) {table} Exists.");
                }
                return 1;
            }
            return -1;
        } // CheckValidation()

        /// <summary>
        /// 조건에 맞는 대상 table, column에 대해 SELECT 연산을 수행 후 DataSet을 반환합니다.
        /// </summary>
        /// <param name="column">대상 column 명</param>
        /// <param name="table">대상 table 명</param>
        /// <param name="condition">condition. can NULL</param>
        /// <param name="others">other conditions like ORDER BY or something. can NULL</param>
        /// <param name="dataSet">result data sets</param>
        public void SelectFrom(string column, string table, string? condition, string? others, out DataSet dataSet)
        {
            string query = $"SELECT {column} FROM {table}";
            if (condition != null)
                query += $" WHERE {condition}";
            if (others != null)
                query += $" {others}";

            Console.WriteLine($"> [SelectFrom] Data Selection ");

            using (SQLiteConnection connection = new SQLiteConnection($"Data Source={fileManager.GetFullPath()}"))
            {
                connection.Open();
                using (SQLiteCommand command = new SQLiteCommand(query, connection))
                {
                    using (SQLiteDataAdapter adapter = new SQLiteDataAdapter(command))
                    {
                        dataSet = new DataSet();
                        try { adapter.Fill(dataSet); }
                        catch (SQLiteException e) {
                            Console.WriteLine($@"> [SelectFrom] Error: {e.Message}");
                            return;
                        }
                    } // adapter.Dispose()
                } // command.Dispose()
            } // connection.Dispose()
        } // SelectFrom()

        /// <summary>
        /// 대상 table에 대해 REPLACE 연산을 수행합니다.
        /// </summary>
        /// <param name="table">대상 table 명</param>
        /// <param name="value">insert 할 value</param>
        public void ReplaceInto(string table, string value)
        {
            string query = $"REPLACE INTO {table} SELECT {value} ";
            Console.WriteLine($"> [ReplaceInto] Replace into {table}.");

            try { ExecuteNonQuery(query); }
            catch (SQLiteException e)
            {
                Console.WriteLine($@"> [ReplaceInto] Error: {e.Message}");
                return;
            }
        } // InsertInto()

        public void Update(string table, string set, string? condition)
        {
            string query = $@"UPDATE {table} SET {set}";
            if (condition != null)
                query += $" WHERE {condition}";

            try { ExecuteNonQuery(query); }
            catch (SQLiteException e)
            {
                Console.WriteLine($@"> [Update] Error: {e.Message}");
                return;
            }
        }

        /// <summary>
        /// 조건에 맞는 대상 table의 row를 삭제합니다.
        /// </summary>
        /// <param name="table">대상 table 명</param>
        /// <param name="condition">condition. can NULL.</param>
        public void DeleteFrom(string table, string? condition)
        {
            string query = $"DELETE FROM {table}";
            if (condition != null)
                query += $" WHERE {condition}";

            Console.WriteLine($"> [DeleteFrom] Delete from {table}.");

            try { ExecuteNonQuery(query); }
            catch (SQLiteException e) {
                Console.WriteLine($@"> [DeleteFrom] Error: {e.Message}");
                return;
            }
            
        } // DeleteFrom()

        /// <summary>
        /// QUERY를 실행합니다.
        /// </summary>
        /// <param name="query"> query </param>
        private void ExecuteNonQuery(string query)
        {
            using (SQLiteConnection connection = new SQLiteConnection($"Data Source={fileManager.GetFullPath()}"))
            {
                connection.Open();
                using (SQLiteCommand command = new SQLiteCommand(query, connection))
                {
                    command.ExecuteNonQuery();
                } // command.Dispose()
            } // connection.Dispose()
        } // ExecuteNonQuery()

    } // class DBManager
} // namespace CroffleDataManager.SQLiteDB
