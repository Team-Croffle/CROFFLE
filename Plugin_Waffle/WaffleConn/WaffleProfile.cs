using CroffleLogManager;
using Plugin_Waffle.DB_Scheme;

namespace Plugin_Waffle.WaffleConn;

public class WaffleProfile
{
    private string? userid, passwd;

    private WaffleManager _waffleMng = new(
        new("application/x-www-form-urlencoded") { CharSet = "UTF-8" },
        Colors.LimeGreen.ToInt(),
        Colors.RoyalBlue.ToInt(),
        Colors.IndianRed.ToInt());

    public WaffleProfile() { }

    public int TryLogin()
    {
        //Log.LogInfo("[WaffleProfile] TryLogin");
        if (userid is null || passwd is null)
        {
            //Log.LogInfo("[WaffleProfile] TryLogin: Find account data from DB.");
            DB_CTRL _db = new();
            _db.DB_Init();

            var res = _db.GetItems<Account>();

            if (res is null) return 0;
            if (res.Count is 0) return 0;

            userid = res[0].UserID;
            passwd = res[0].Passwd;
        }

        if (userid is null || passwd is null)
        {
            Log.LogError("[WaffleProfile] TryLogin - failed: Account data not found.");
            return 0;
        }
        if (userid is null || passwd is null)
        {
            Log.LogInfo("[WaffleProfile] TryLogin: Find account data from DB.");
            DB_CTRL _db = new();
            _db.DB_Init();

            var res = _db.GetItems<Account>();

            if (res is null) return 0;
            if (res.Count is 0) return 0;

            userid = res[0].UserID;
            passwd = res[0].Passwd;
        }

        if (userid is null || passwd is null)
        {
            Log.LogError("[WaffleProfile] TryLogin - failed: Account data not found.");
            return 0;
        }

        var success = _waffleMng.SetWaffle(userid, passwd);
        if (success is not 1)
        {
            Log.LogError("[WaffleProfile] TryLogin - failed: Login Request failed");
            return success;
        }
        Log.LogInfo($"[WaffleProfile] TryLogin - success: {WaffleLoginInfo.USERNAME}");

        // Set WaffleLoginInfo
        WaffleLoginInfo.IsLogin = true;

        // Set WaffleLoginInfo
        DB_CTRL _acntdb = new();
        _acntdb.DB_Init();
        _acntdb.SaveItem(new Account { UserID = userid, Passwd = passwd });

        return success;
    }

    public int Logout()
    {
        //Log.LogInfo("[WaffleProfile] Logout");

        DB_CTRL _acntdb = new();
        _acntdb.DB_Init();

        TryLogin();

        if (userid is null)
        {
            Log.LogError("[WaffleProfile] Logout - failed: Not logged in.");
            return 0;
        }
        var res = _acntdb.DeleteItem<Account>(userid);

        if (res is 1)
        {
            userid = null;
            passwd = null;
            WaffleLoginInfo.SNO = null;
            WaffleLoginInfo.USERNAME = null;
            WaffleLoginInfo.IsLogin = false;
        }
        else Log.LogError("[WaffleProfile] Logout - failed: Account deletion failed.");
        return res;
    }

    public int UpdateWaffle()
    {
        //Log.LogInfo("[WaffleProfile] UpdateWaffle");
        if (WaffleLoginInfo.IsLogin is false)
        {
            Log.LogError("[WaffleProfile] UpdateWaffle - failed: Not logged in.");
            return 0;
        }

        _waffleMng.UpdateWaffleData();
        return 1;
    }

    public void SetUser(string id, string pw)
    {
        userid = id;
        passwd = pw;
    }
}
