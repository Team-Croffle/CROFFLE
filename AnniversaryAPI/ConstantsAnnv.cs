using SQLite;

namespace AnniversaryAPI
{
    // All the code in this file is included in all platforms.
    public class ConstantsAnnv
    {
        public const string DB_NAME = "annv.db";
        public const SQLiteOpenFlags FLAGS =
            SQLiteOpenFlags.ReadWrite |
            SQLiteOpenFlags.Create |
            SQLiteOpenFlags.SharedCache |
            SQLiteOpenFlags.ProtectionCompleteUntilFirstUserAuthentication;

        public static string DB_PATH = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DB");
    }
}
