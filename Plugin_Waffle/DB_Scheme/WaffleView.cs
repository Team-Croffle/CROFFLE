using CroffleLogManager;
using DataManager.SQLiteDBMS;
using DataManager.SQLiteDBMS.Scheme;
using DataManager.View;
using SQLite;

namespace Plugin_Waffle.DB_Scheme;

public class VWaffle : ComponentAll
{
    internal Waffle _waffle = new();

    public string? ContentID
    {
        get => _waffle.ContentID;
        set
        {
            _waffle.ContentID = value;
            _contents.ContentsID = value;
            _event.ContentsID = value;
            _memo.ContentsID = value;
        }
    }

    public int? WCount
    {
        get => _waffle.WeekCount;
        set => _waffle.WeekCount = value ?? 0;
    }

    public string? WLctrName
    {
        get => _waffle.WLctrName;
        set => _waffle.WLctrName = value;
    }

    public string? WType
    {
        get => _waffle.WType;
        set => _waffle.WType = value;
    }

    public string? WTitle
    {
        get => _waffle.WTitle;
        set => _waffle.WTitle = value;
    }
}
public class WaffleView
{
    private SQLiteConnection? _db;
    protected static string DB_PATH = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DB");

    public IEnumerable<VWaffle>? ListAll => waffleTable;
    private IEnumerable<VWaffle>? waffleTable;

    public WaffleView()
    {
        Init();
    }

    private void Init()
    {
        if (_db is not null) return;

        _db = new(Path.Combine(DB_PATH, Constants.DB_NAME), Constants.FLAGS);
    }

    public void LoadWaffles()
    {
        var result = LoadWContent(t => t.EndTime >= DateTime.Now);
        waffleTable = result;
    } // LoadWaffles

    public VWaffle? LoadComponent(string contentsID)
    {
        var result = LoadWContent(t => t.ContentID == contentsID);
        if (result is null) return null;
        return result.FirstOrDefault();
    }

    public static void SaveComponent(VWaffle vWaffle)
    {
        //Log.LogInfo("[WaffleView] SaveComponent");
        SQLiteDB db = new();
        db.DB_Init();

        //Log.LogInfo("[WaffleView] SaveComponent: SaveItem - Contents");
        var res = db.SaveItem(vWaffle._contents);
        if (res is not 1) return;

        //Log.LogInfo("[WaffleView] SaveComponent: SaveItem - Event");
        res = db.SaveItem(vWaffle._event);
        if (res is not 1) return;

        //Log.LogInfo("[WaffleView] SaveComponent: SaveItem - Memo");
        res = db.SaveItem(vWaffle._memo);
        if (res is not 1) return;

        //Log.LogInfo("[WaffleView] SaveComponent: SaveItem - Waffle");
        res = db.SaveItem(vWaffle._waffle);
        if (res is not 1) return;
    } // SaveComponent

    public static void DeleteComponent(string ContentID)
    {
        //Log.LogInfo("[ComponentAllView] DeleteComponent");
        SQLiteConnection? _db = new(Path.Combine(DB_PATH, Constants.DB_NAME), Constants.FLAGS);

        _db.Delete<Contents>(ContentID);
    } // DeleteComponent

    public int? Count()
    {
        if(waffleTable is null) return null;
        return waffleTable.Count();
    }

    private IOrderedEnumerable<VWaffle>? LoadWContent(Func<VWaffle, bool> wherePred)
    {
        if (_db is null) return null;
        new DB_CTRL().DB_Init();

        try
        {
            var result = _db.Table<Waffle>()
                .Join(_db.Table<Memo>(), (w) => w.ContentID, (m) => m.ContentsID, (w, m) => new { w, m })
                .Join(_db.Table<Event>(), (wm) => wm.w.ContentID, (e) => e.ContentsID, (wm, e) => new { wm, e })
                .Join(_db.Table<Contents>(), (wme) => wme.wm.w.ContentID, (c) => c.ContentsID, (wme, c) => new { wme, c })
                .Select((wmec) => new VWaffle
                {
                    ContentID = wmec.wme.wm.w.ContentID,
                    WCount = wmec.wme.wm.w.WeekCount,
                    WLctrName = wmec.wme.wm.w.WLctrName,
                    WType = wmec.wme.wm.w.WType,
                    WTitle = wmec.wme.wm.w.WTitle,

                    Type = wmec.c.Type,
                    ContentDate = wmec.c.ContentDate,
                    Color = wmec.c.Color,
                    AddedTime = wmec.c.AddedTime,

                    StartTime = wmec.wme.e.StartTime,
                    EndTime = wmec.wme.e.EndTime,
                    Alarm = wmec.wme.e.Alarm,
                    Done = wmec.wme.e.Done,
                    Repeat = wmec.wme.e.Repeat,
                    Canceled = wmec.wme.e.Canceled,

                    Title = wmec.wme.wm.m.Title,
                    Details = wmec.wme.wm.m.Details,
                })
                .Where(wherePred)
                .OrderBy(t => t.EndTime);
            return result;
        }
        catch (SQLiteException e)
        {
            Log.LogError($"[WaffleView] LoadWContent - Failed: {e.Message}");
            return null;
        }
    } // LoadWContent
} // WaffleView
