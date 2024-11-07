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
        public int Color { get => _contents.Color; set => _contents.Color = value; }
        public DateTime ContentDate { get => _contents.ContentDate; set => _contents.ContentDate = value; }
    }
    public class MemoView
    {
        private SQLiteConnection? _db;
        IEnumerable<MemoComponents>? _memoComponents;

        MemoComponents? this[int index] { get => _memoComponents?.ElementAt(index); }

        public MemoView()
        {
            Init();
        }

        void Init()
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
                    })
                    .Where(t => t.ContentDate >= from && t.ContentDate < to)
                    .OrderBy(t => t.ContentDate);
            _memoComponents = result;
        } // LoadMemo

        public async Task SaveMemo(MemoComponents memoComponents)
        {
            Log.LogInfo("[MemoView] SaveMemo");
            SQLiteDB db = new();
            var result = await db.SaveItemASync(memoComponents._contents);
            if (Check(result, "Contents") == 0) return;
            result = await db.SaveItemASync(memoComponents._memo);
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
