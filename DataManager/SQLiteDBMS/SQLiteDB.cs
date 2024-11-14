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

using CroffleLogManager;
using DataManager.SQLiteDBMS.Scheme;
using SQLite;
using System.Linq.Expressions;

namespace DataManager.SQLiteDBMS
{
    public class SQLiteDB
    {
        protected SQLiteConnection? _db;


        public SQLiteDB( ) { Init(); }

        protected void Init() 
        {
            if (_db is not null) return;

            _db = new(Path.Combine(Constants.DB_PATH, Constants.DB_NAME), Constants.FLAGS);

            CreateTable<Account>();
            CreateTable<Alarm>();
            CreateTable<Contents>();
            CreateTable<DateTemp>();
            CreateTable<Event>();
            CreateTable<Memo>();
            CreateTable<Settings>();
        }

        void CreateTable<T>() where T : new()
        {
            if (_db is null) return;
            var result = _db.CreateTable<T>();
            if (result is not CreateTableResult.Migrated)
                Log.LogInfo($@"[SQLiteDB] CreateTable: Table {typeof(T).Name} Created.");
         //fi
        }

        public List<T>? GetItems<T>() where T : new()
        {
            Log.LogInfo($@"[SQLiteDB] GetItems: {typeof(T).Name}");
            Init();
            if (_db is null) return default;
            return _db.Table<T>().ToList();
        }

        public List<T>? GetItems<T>(Expression<Func<T, bool>> predExpr) where T : new()
        {
            Log.LogInfo($@"[SQLiteDB] GetItems: {predExpr}");
            Init();
            if (_db is null) return default;
            return _db.Table<T>().Where(predExpr).ToList();
        }

        public List<T>? GetItems<T>(
            Expression<Func<T, bool>> predExpr, Expression<Func<T, object>> orderExpr) where T : new()
        {
            Log.LogInfo($@"[SQLiteDB] GetItems: {predExpr}");
            Init();
            if (_db is null) return default;
            return _db.Table<T>().Where(predExpr).OrderBy(orderExpr).ToList();
        }

        public T? GetItem<T>(Expression<Func<T, bool>> predExpr) where T : new()
        {
            Log.LogInfo($@"[SQLiteDB] GetItem: {predExpr}");
            Init();
            if (_db is null) return default;
            return _db.Table<T>().Where(predExpr).FirstOrDefault();
        }

        public T? GetItem<T>(
            Expression<Func<T, bool>> predExpr, Expression<Func<T, bool>> orderExpr) where T : new()
        {
            Log.LogInfo($@"[SQLiteDB] GetItem: {predExpr}");
            Init();
            if (_db is null) return default;
            return _db.Table<T>().Where(predExpr).OrderBy(orderExpr).FirstOrDefault();
        }

        public int SaveItem<T>(T item) where T : new()
        {
            Log.LogInfo($@"[SQLiteDB] SaveItem: {item}");
            Init();
            if (_db is null) return 0;
            try
            {
                var result = _db.InsertOrReplace(item);
                return result;
            }
            catch (SQLiteException e)
            {
                Log.LogError($@"[SQLiteDB] SaveItem: Failed - {e.Message}");
                return 0;
            }
        }

        public int DeleteItem<T>(T item) where T : new()
        {
            Log.LogInfo($@"[SQLiteDB] DeleteItem: {item}");
            Init();
            if (_db is null) return 0;
            return _db.Delete(item);
        }
    }
}
