using DataManager.SQLiteDBMS;
using Plugin_Waffle.DB_Scheme;

namespace Plugin_Waffle;

public class DB_CTRL : SQLiteDB
{
    public DB_CTRL() {  }

    public new void DB_Init()
    {
        ConnInit();
        Init();
    }

    protected new void Init()
    {
        CreateTable<Account>();
        CreateTable<Waffle>();
    }
}
