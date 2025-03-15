using SQLite;

namespace DataManager.SQLiteDBMS;
public class Constants
{
    public const string DB_NAME = "croffle.db";
    public const SQLiteOpenFlags FLAGS =
        SQLiteOpenFlags.ReadWrite |
        SQLiteOpenFlags.Create |
        SQLiteOpenFlags.SharedCache |
        SQLiteOpenFlags.ProtectionCompleteUntilFirstUserAuthentication;
}
