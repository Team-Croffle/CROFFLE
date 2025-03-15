using AnniversaryAPI.Scheme;
using DataManager.SQLiteDBMS;

namespace AnniversaryAPI;

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
// AnniversaryAPI
