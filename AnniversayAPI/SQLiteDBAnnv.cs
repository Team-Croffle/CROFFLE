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
using CroffleLogManager;
using SQLite;
using System.Linq.Expressions;

namespace AnniversaryAPI
{
    public class SQLiteDBAnnv
    {
        protected SQLiteConnection? _db;


        public SQLiteDBAnnv( ) { }

        protected void Init() 
        {
            if (_db is not null) return;

            _db = new(Path.Combine(ConstantsAnnv.DB_PATH, ConstantsAnnv.DB_NAME), ConstantsAnnv.FLAGS);

            CreateTable<Anniversary>();
        } // Init

        void CreateTable<T>() where T : new()
        {
            if (_db is null) return;
            var result = _db.CreateTable<T>();
            if (result is not CreateTableResult.Migrated)
                Log.LogInfo($@"[SQLiteDB] CreateTable: Table {typeof(T).Name} Created.");
            //fi
        } // CreateTable

        public List<T>? GetItems<T>() where T : new()
        {
            Init();
            if (_db is null) return default;
            return _db.Table<T>().ToList();
        } // GetItems

        public List<T>? GetItems<T>(Expression<Func<T, bool>> predExpr) where T : new()
        {
            Init();
            if (_db is null) return default;
            return _db.Table<T>().Where(predExpr).ToList();
        } // GetItems

        public List<T>? GetItems<T>(
            Expression<Func<T, bool>> predExpr, Expression<Func<T, object>> orderExpr) where T : new()
        {
            Init();
            if (_db is null) return default;
            return _db.Table<T>().Where(predExpr).OrderBy(orderExpr).ToList();
        } // GetItems

        public T? GetItem<T>(Expression<Func<T, bool>> predExpr) where T : new()
        {
            Init();
            if (_db is null) return default;
            return _db.Table<T>().Where(predExpr).FirstOrDefault();
        } // GetItem

        public T? GetItem<T>(
            Expression<Func<T, bool>> predExpr, Expression<Func<T, bool>> orderExpr) where T : new()
        {
            Init();
            if (_db is null) return default;
            return _db.Table<T>().Where(predExpr).OrderBy(orderExpr).FirstOrDefault();
        } // GetItem

        public int SaveItem<T>(T item) where T : new()
        {
            Init();
            if (_db is null) return 0;
            return _db.InsertOrReplace(item);
        } // SaveItem

        public int DeleteItem<T>(T item) where T : new()
        {
            Init();
            if (_db is null) return 0;
            return _db.Delete(item);
        } // DeleteItem

        public bool IsHoliday(DateTime date)
        {
            Init();
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
