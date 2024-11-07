using SQLite;
namespace DataManager.SQLiteDBMS
{
    public class Constants
    {
        public const string DB_NAME = "croffle.db";
        public const SQLiteOpenFlags FLAGS =
            SQLiteOpenFlags.ReadWrite |
            SQLiteOpenFlags.Create |
            SQLiteOpenFlags.SharedCache |
            SQLiteOpenFlags.ProtectionCompleteUntilFirstUserAuthentication;

        public static string DB_PATH = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DB");
    }
}
