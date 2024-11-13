using CroffleLogManager;
using DataManager.SQLiteDBMS;
using DataManager.SQLiteDBMS.Scheme;
using SQLite;

namespace DataManager.View
{
    public class MemoComponents
    {
        internal Contents _contents = new();
        internal Memo _memo = new();

        public string ContentsID { get => _contents.ContentsID; set => _contents.ContentsID = value; }
        public string Title { get => _memo.Title; set => _memo.Title = value; }
        public string Details { get => _memo.Details; set => _memo.Details = value; }
        public int Color { get => _contents.Color; set => _contents.Color = value; }
        public string Type { get => _contents.Type; set => _contents.Type = value; }
        public DateTime ContentDate { get => _contents.ContentDate; set => _contents.ContentDate = value; }
        public DateTime AddedTime { get => _contents.AddedTime; set => _contents.AddedTime = value; }
    }
    public class MemoView
    {
        private SQLiteConnection? _db;
        IEnumerable<MemoComponents>? _memoComponents;

        public MemoComponents? this[int index] { get => _memoComponents?.ElementAt(index); }
        public IEnumerable<MemoComponents>? ListAll => _memoComponents;

        public MemoView()
        {
            SQLiteDB db = new();
            Init();
        }

        void  Init()
        {
            if (_db is not null) return;

            _db = new(Path.Combine(Constants.DB_PATH, Constants.DB_NAME), Constants.FLAGS);
        }

        public void LoadMemo(DateTime from, DateTime to)
        {
            Log.LogInfo("[MemoView] LoadMemo");
            if (_db is null) return;
            var result = _db.Table<Memo>()
                    .Join(_db.Table<Contents>().Where(t => t.Type == "Memo"),
                            (m) => m.ContentsID, (c) => c.ContentsID, (m, c) => new { m, c })
                    .Select((mc) => new MemoComponents
                    {
                        ContentsID = mc.m.ContentsID,
                        Title = mc.m.Title,
                        Color = mc.c.Color,
                        ContentDate = mc.c.ContentDate,
                        AddedTime = mc.c.AddedTime,
                        Type = mc.c.Type,
                    })
                    .Where(t => t.ContentDate >= from && t.ContentDate < to)
                    .OrderBy(t => t.ContentDate);
            _memoComponents = result;
        } // LoadMemo

        public MemoComponents? LoadMemo(string contentID)
        {
            Log.LogInfo("[MemoView] LoadMemo");
            if (_db is null) return null;
            var result = _db.Table<Memo>()
                    .Join(_db.Table<Contents>().Where(t => t.Type == "Memo"),
                            (m) => m.ContentsID, (c) => c.ContentsID, (m, c) => new { m, c })
                    .Select((mc) => new MemoComponents
                    {
                        ContentsID = mc.m.ContentsID,
                        Title = mc.m.Title,
                        Color = mc.c.Color,
                        ContentDate = mc.c.ContentDate,
                        AddedTime = mc.c.AddedTime,
                        Type = mc.c.Type,
                    })
                    .Where(t => t.ContentsID == contentID);
            return result.FirstOrDefault();
        } // LoadMemo(string contentID)

        public void SaveMemo(MemoComponents memoComponents)
        {
            Log.LogInfo("[MemoView] SaveMemo");
            SQLiteDB db = new();
            var result = db.SaveItem(memoComponents._contents);
            if (Check(result, "Contents") == 0) return;
            result = db.SaveItem(memoComponents._memo);
            if (Check(result, "Memo") == 0) return;
        }

        public void DeleteMemo(MemoComponents memoComponents)
        {
            Log.LogInfo("[MemoView] DeleteMemo");
            SQLiteDB db = new();
            var result = db.DeleteItem(memoComponents._contents);
            if (Check(result, "Contents") == 0) return;
            result = db.DeleteItem(memoComponents._memo);
            if (Check(result, "Memo") == 0) return;
        }

        private int Check(int result, string tableName)
        {
            if (result == 1)
            {
                Log.LogInfo($"[MemoView] {tableName} Inserted.");
                return 1;
            }
            else
            {
                Log.LogError($"[MemoView] {tableName} Insert Failed.");
                return 0;
            }
        }

        public int? Count()
        {
            if(_memoComponents is null) return null;
            return _memoComponents.Count();
        }
    } // MemoView
} // DataManager.SQLiteDB.View
