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
        protected SQLiteAsyncConnection? _db;


        public SQLiteDB( ) { var result = Init(); }

        protected async Task Init() 
        {
            if (_db is not null) return;

            _db = new(Path.Combine(Constants.DB_PATH, Constants.DB_NAME), Constants.FLAGS);

            await CreateTable<Account>();
            await CreateTable<Alarm>();
            await CreateTable<Contents>();
            await CreateTable<DateTemp>();
            await CreateTable<Event>();
            await CreateTable<Memo>();
            await CreateTable<Settings>();
        }

        async Task CreateTable<T>() where T : new()
        {
            if (_db is null) return;
            var result = await _db.CreateTableAsync<T>();
            if (result == CreateTableResult.Migrated)
         //then
                Log.LogError($@"[SQLiteDB] CreateTable: Table {typeof(T).Name} Migrated.");
            else
                Log.LogInfo($@"[SQLiteDB] CreateTable: Table {typeof(T).Name} Created.");
         //fi
        }

        public async Task<List<T>?> GetItemsAsync<T>() where T : new()
        {
            await Init();
            if (_db is null) return default;
            return await _db.Table<T>().ToListAsync();
        }

        public async Task<List<T>?> GetItemsAsync<T>(Expression<Func<T, bool>> predExpr) where T : new()
        {
            await Init();
            if (_db is null) return default;
            return await _db.Table<T>().Where(predExpr).ToListAsync();
        }

        public async Task<List<T>?> GetItemsAsync<T>(
            Expression<Func<T, bool>> predExpr, Expression<Func<T, object>> orderExpr) where T : new()
        {
            await Init();
            if (_db is null) return default;
            return await _db.Table<T>().Where(predExpr).OrderBy(orderExpr).ToListAsync();
        }

        public async Task<T?> GetItemAsync<T>(Expression<Func<T, bool>> predExpr) where T : new()
        {
            await Init();
            if (_db is null) return default;
            return await _db.Table<T>().Where(predExpr).FirstOrDefaultAsync();
        }

        public async Task<T?> GetItemAsync<T>(
            Expression<Func<T, bool>> predExpr, Expression<Func<T, bool>> orderExpr) where T : new()
        {
            await Init();
            if (_db is null) return default;
            return await _db.Table<T>().Where(predExpr).OrderBy(orderExpr).FirstOrDefaultAsync();
        }

        public async Task<int> SaveItemASync<T>(T item) where T : new()
        {
            await Init();
            if (_db is null) return 0;
            return await _db.InsertOrReplaceAsync(item);
        }

        public async Task<int> DeleteItemAsync<T>(T item) where T : new()
        {
            await Init();
            if (_db is null) return 0;
            return await _db.DeleteAsync(item);
        }
    }
}
