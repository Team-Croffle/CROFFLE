using CroffleLogManager;
using DataManager.SQLiteDBMS;
using DataManager.SQLiteDBMS.Scheme;
using SQLite;

namespace DataManager.View
{
    public class ComponentAll
    {
        internal Contents _contents = new();
        internal Event _event = new();
        internal Memo _memo = new();

        public string ContentsID
        {
            get => _contents?.ContentsID ?? "";
            set
            {
                _contents.ContentsID = value;
                _event.ContentsID = value;
                _memo.ContentsID = value;
            }
        }

        public string Type { get => _contents.Type; set => _contents.Type = value; }
        public DateTime ContentDate { get => _contents.ContentDate; set => _contents.ContentDate = value; }
        public int Color { get => _contents.Color; set => _contents.Color = value; }
        public DateTime AddedTime { get => _contents.AddedTime; set => _contents.AddedTime = value; }
        public DateTime StartTime { get => _event.StartTime; set => _event.StartTime = value; }
        public DateTime EndTime { get => _event.EndTime; set => _event.EndTime = value; }
        public bool Alarm { get => _event.Alarm; set => _event.Alarm = value; }
        public bool Done { get => _event.Done; set => _event.Done = value; }
        public bool Repeat { get => _event.Repeat; set => _event.Repeat = value; }
        public bool Canceled { get => _event.Canceled; set => _event.Canceled = value; }
        public string Title { get => _memo.Title; set => _memo.Title = value; }
        public string Details { get => _memo.Details; set => _memo.Details = value; }
    }
    public class ComponentAllView
    {
        private SQLiteConnection? _db;

        IEnumerable<ComponentAll>? ComponentAlls;

        public ComponentAll? this[int index] { get => ComponentAlls?.ElementAt(index); }

        public ComponentAllView()
        {
            SQLiteDB db = new();
            Init();
        }
        public void Init() {
            if (_db is not null) return;

            _db = new(Path.Combine(Constants.DB_PATH, Constants.DB_NAME), Constants.FLAGS);
        }

        public void LoadComponent(DateTime target)
        {
            Log.LogInfo("[ComponentAllView] LoadComponent");
            if (_db is null) return;
            var result = _db.Table<Memo>()
                    .Join(_db.Table<Event>(), (m) => m.ContentsID, (e) => e.ContentsID, (m, e) => new { m, e })
                    .Join(_db.Table<Contents>(), (me) => me.m.ContentsID, (c) => c.ContentsID, (me, c) => new { me, c })
                    .Select((mec) => new ComponentAll
                    {
                        ContentsID = mec.me.m.ContentsID,
                        Type = mec.c.Type,
                        ContentDate = mec.c.ContentDate,
                        Color = mec.c.Color,
                        AddedTime = mec.c.AddedTime,
                        StartTime = mec.me.e.StartTime,
                        EndTime = mec.me.e.EndTime,
                        Alarm = mec.me.e.Alarm,
                        Done = mec.me.e.Done,
                        Repeat = mec.me.e.Repeat,
                        Canceled = mec.me.e.Canceled,
                        Title = mec.me.m.Title,
                        Details = mec.me.m.Details,
                    })
                    .Where(t => t.StartTime <= target && t.EndTime > target)
                    .OrderBy(t => t.StartTime);
            ComponentAlls = result;
        } // LoadComponent

        public void LoadComponent(DateTime target, bool done)
        {
            Log.LogInfo("[ComponentAllView] LoadComponent");
            if (_db is null) return;
            var result = _db.Table<Memo>()
                    .Join(_db.Table<Event>(), (m) => m.ContentsID, (e) => e.ContentsID, (m, e) => new { m, e })
                    .Join(_db.Table<Contents>(), (me) => me.m.ContentsID, (c) => c.ContentsID, (me, c) => new { me, c })
                    .Select((mec) => new ComponentAll
                    {
                        ContentsID = mec.me.m.ContentsID,
                        Type = mec.c.Type,
                        ContentDate = mec.c.ContentDate,
                        Color = mec.c.Color,
                        AddedTime = mec.c.AddedTime,
                        StartTime = mec.me.e.StartTime,
                        EndTime = mec.me.e.EndTime,
                        Alarm = mec.me.e.Alarm,
                        Done = mec.me.e.Done,
                        Repeat = mec.me.e.Repeat,
                        Canceled = mec.me.e.Canceled,
                        Title = mec.me.m.Title,
                        Details = mec.me.m.Details,
                    })
                    .Where(t => t.StartTime <= target && t.EndTime > target)
                    .Where(t => t.Done == done)
                    .OrderBy(t => t.StartTime);
            ComponentAlls = result;
        } // LoadComponent

        public ComponentAll? LoadComponent(string contentsID)
        {
            Log.LogInfo($@"[ComponentAllView] LoadComponent: ContentsID: {contentsID}");
            if (_db is null) return null;
            var result = _db.Table<Memo>()
                    .Join(_db.Table<Event>(), (m) => m.ContentsID, (e) => e.ContentsID, (m, e) => new { m, e })
                    .Join(_db.Table<Contents>(), (me) => me.m.ContentsID, (c) => c.ContentsID, (me, c) => new { me, c })
                    .Select((mec) => new ComponentAll
                    {
                        ContentsID = mec.me.m.ContentsID,
                        Type = mec.c.Type,
                        ContentDate = mec.c.ContentDate,
                        Color = mec.c.Color,
                        AddedTime = mec.c.AddedTime,
                        StartTime = mec.me.e.StartTime,
                        EndTime = mec.me.e.EndTime,
                        Alarm = mec.me.e.Alarm,
                        Done = mec.me.e.Done,
                        Repeat = mec.me.e.Repeat,
                        Canceled = mec.me.e.Canceled,
                        Title = mec.me.m.Title,
                        Details = mec.me.m.Details,
                    })
                    .Where(t => t.ContentsID == contentsID)
                    .FirstOrDefault();
            return result;
        } // LoadComponent

        public void SaveComponent(ComponentAll cpa)
        {
            Log.LogInfo("[ComponentAllView] SaveComponent");
            if (_db is null) return;
            SQLiteDB db = new();
            var result = db.SaveItem(cpa._contents);
            if (CheckResult(result, "Contents") is not 1) return;
            result = db.SaveItem(cpa._event);
            if (CheckResult(result, "Event") is not 1) return;
            result = db.SaveItem(cpa._memo);
            if (CheckResult(result, "Memo") is not 1) return;
        } // SaveComponent

        public void DeleteComponent(ComponentAll cpa)
        {
            Log.LogInfo("[ComponentAllView] DeleteComponent");
            if (_db is null) return;
            SQLiteDB db = new();
            var result = db.DeleteItem(cpa._contents);
            if (CheckResult(result, "Contents") is not 1) return;
            result = db.DeleteItem(cpa._event);
            if (CheckResult(result, "Event") is not 1) return;
            result = db.DeleteItem(cpa._memo);
            if (CheckResult(result, "Memo") is not 1) return;
        } // DeleteComponent

        private int CheckResult(int result, string tableName)
        {
            if (result is not 1)
                Log.LogError($"[ComponentAllView] SaveComponent: {tableName} Save Failed.");
            else
                Log.LogInfo($"[ComponentAllView] SaveComponent: {tableName} Save Succeed.");

            return 1;
        } // CheckResult

        public int? Count()
        {
            if (ComponentAlls is null) return null;
            return ComponentAlls.Count();
        }

    } // ComponentAllView
} // DataManager.SQLiteDB.View
