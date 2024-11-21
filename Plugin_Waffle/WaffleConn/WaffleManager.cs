using CroffleLogManager;
using DataManager.Json;
using DataManager.SQLiteDBMS.Scheme;
using DataManager.View;
using HtmlAgilityPack;
using HttpConn;
using Plugin_Waffle.DB_Scheme;
using Plugin_Waffle.WaffleData;
using System.Net.Http.Headers;

namespace Plugin_Waffle.WaffleConn;

public class WaffleManager
{
    private VWaffle vWaffle;

    private string? sNo;
    private string? sql_key;
    private string? username;

    private int done_color;
    private int not_done_color;
    private int expired_color;

    internal MediaTypeHeaderValue content_type;

    public WaffleManager(MediaTypeHeaderValue content_type, int done, int not_done, int expired)
    {
        vWaffle = new();

        done_color = done;
        not_done_color = not_done;
        expired_color = expired;

        this.content_type = content_type;
    } // Waffle

    public int SetWaffle(string id, string passwd)
    {
        Log.LogInfo("[WaffleManager] SetWaffle");

        var url = WafflePage.GetPage(EPage.eLoginJSP);
        var post_data = $"nextURL={WafflePage.GetPage(EPage.eReturnJSP)}" +
            $"&errURL={WafflePage.GetPage(EPage.eReturnJSP)}" +
            $"&site=waffle&userid={id}&passwd={passwd}";
        var host = WafflePage.GetPage(EPage.eAuth);
        var referer = WafflePage.GetPage(EPage.eWKU);

        var result = HttpConnection.GetDataPOST(url, post_data, host, referer, content_type, out var _);

        if (result is not 1)
        {
            Log.LogError("[WaffleManager] SetWaffle failed: Login failed");
            return result;
        }

        url = WafflePage.GetPage(EPage.eReturnJSP);
        //host = WafflePage.GetPage(EPage.eWKU);
        //referer = WafflePage.GetPage(EPage.eAuth);

        result = HttpConnection.GetDataGET(url, out var _);

        if (result is not 1)
        {
            Log.LogError("[WaWaffleManagerffle] SetWaffle failed: Get Page failed");
            return result;
        }

        url = WafflePage.GetPage(EPage.eMain);

        result = HttpConnection.GetDataGET(url, out var data);

        if (result is not 1)
        {
            Log.LogError("[WaffleManager] SetWaffle failed: Refresh failed");
            return result;
        }

        HtmlDocument htmlDoc = new();
        htmlDoc.LoadHtml(data);

        try
        {
            sNo = htmlDoc.DocumentNode.SelectSingleNode("//*[@id=\"g_verifyno\"]")?.Attributes["value"].Value;
            sql_key = htmlDoc.DocumentNode.SelectSingleNode("//*[@id=\"g_secure\"]")?.Attributes["value"].Value;
            username = htmlDoc.DocumentNode.SelectSingleNode("//*[@id=\"g_verifynm\"]")?.Attributes["value"].Value;
        }
        catch (NullReferenceException)
        {
            Log.LogError("[WaffleManager] SetWaffle failed: Parsing failed");
            return -2;
        }

        WaffleLoginInfo.SNO = sNo;
        WaffleLoginInfo.USERNAME = username;

        Log.LogInfo("[WaffleManager] SetWaffle success");
        return 1;
    } // SetWaffle

    public void UpdateWaffleData()
    {
        Log.LogInfo("[WaffleManager] UpdateWaffleData");

        var lctr = GetLectureList();
        if (lctr is null) return;

        var url = WafflePage.GetPage(EPage.eAttend);
        //var host = WafflePage.GetPage(EPage.eWKU);
        //var referer = WafflePage.GetPage(EPage.eClasses);

        foreach (var (lctr_mngno, lctr_nm) in lctr)
        {
            Log.LogInfo($"[WaffleManager] UpdateWaffleData: {lctr_mngno} {lctr_nm}");

            var result = HttpConnection.GetDataGET(url, $"lctr_mngno={lctr_mngno}", null, null, out var data);
            if (data is null) { Log.LogInfo($"[WaffleManager] UpdateWaffleData: No data found at {lctr_mngno}"); continue; }
            if (result is not 1) { Log.LogError($"[WaffleManager] UpdateWaffleData: Failed to get data at {lctr_mngno}"); continue; }

            UpdateLecture(data, lctr_nm);
        }
    } // UpdateWaffleData

    private List<Tuple<string, string>>? GetLectureList()
    {
        Log.LogInfo("[WaffleManager] GetLectureList");

        var url = WafflePage.GetPage(EPage.eFSPServlet);
        var post_data = $"_SQL_ID={WafflePage.GetPage(EPost.eMain)}"
            + $"&verifyno={sNo}&teach=0&cmplt_yn=0&close_yn=0&_SECURE_KEY={sql_key}";
        //var host = WafflePage.GetPage(EPage.eWKU);
        //var referer = WafflePage.GetPage(EPage.eMain);

        var result = HttpConnection.GetDataPOST(url, post_data, null, null, content_type, out string json);

        if (result is not 1)
        {
            Log.LogError("[WaffleManager] GetLectureList failed: Get data failed");
            return null;
        }

        JsonManager jsm = new();
        jsm.LoadJObject(json);

        jsm.FindItem("ErrorMsg", out var errorMsg);
        if (errorMsg is null)
        {
            Log.LogError("[WaffleManager] GetLectureList failed: Error Message found");
            return null;
        }
        if (errorMsg != "ok")
        {
            Log.LogError("[WaffleManager] GetLectureList failed: Error Message is not ok");
            return null;
        }

        jsm.FindItems("ds_oparam", out var values);

        if (values is null)
        {
            Log.LogWarn("[WaffleManager] GetLectureList: No data found");
            return null;
        }

        List<Tuple<string, string>> lctr = [];
        foreach (string value in values)
        {
            jsm.LoadJObject(value);
            jsm.FindItem("lctr_mngno", out var lctr_mngno_value);
            jsm.FindItem("lctr_nm", out var lctr_nm_value);
            lctr.Add(new(lctr_mngno_value, lctr_nm_value));
        }

        Log.LogInfo("[WaffleManager] GetLectureList success");

        return lctr;
    } // GetLectureList

    private void UpdateLecture(string data, string lctr_nm)
    {
        Log.LogInfo($"[WaffleManager] UpdateLecture: {lctr_nm}");
        HtmlDocument htmlDoc = new();
        htmlDoc.LoadHtml(data);

        var nodes = htmlDoc.DocumentNode.SelectNodes("//tr[contains(@class, 'items')]");

        var lctr_no_node = htmlDoc.DocumentNode.SelectSingleNode("//div[contains(@class, 'subtitle')]/span");
        string lctr_no = "";
        if (lctr_no_node is not null)
        {
            var len = lctr_no_node.InnerText.Split(" ").Length;
            if (len > 1) lctr_no = lctr_no_node.InnerText.Split(" ")[1];
        }

        if (nodes is null)
        {
            Log.LogError("[WaffleManager] UpdateLecture: No nodes");
            return;
        }

        int weekcount = 0;
        int count = 0;
        foreach(var node in nodes)
        {
            HtmlDocument nodeDoc = new();
            nodeDoc.LoadHtml(node.InnerHtml);
            var select = nodeDoc.DocumentNode;

            if (node.Attributes["class"].Value.Contains("chptr"))
            {
                weekcount++;
                count = 0;
            }
            else
            {
                SaveOnDB(lctr_nm, weekcount, lctr_no, count, select);
                count++;
            }
        }
    } // UpdateLecture

    private void SaveOnDB(string lctr_nm, int weekcount, string lctr_no, int count, HtmlNode select)
    {
        Log.LogInfo($"[WaffleManager] SaveOnDB: {lctr_nm} {weekcount} {lctr_no} {count}");
        vWaffle.ContentID = $"W{lctr_no}{weekcount}{count}";

        var recentWaffle = new WaffleView().LoadComponent(vWaffle.ContentID);
        if (recentWaffle is not null) vWaffle = recentWaffle;

        var type = select.SelectSingleNode("td[contains(@class, 'regdate')]").InnerText.Trim();
        DateTime.TryParse(select.SelectSingleNode("td[7]").InnerText.Trim(), out var startTime);
        DateTime.TryParse(select.SelectSingleNode("td[8]").InnerText.Trim(), out var deadline);
        var title = select.SelectSingleNode("td[contains(@class,'subject')]").InnerText.Trim();
        bool done = false;
        var doneNode = select.SelectSingleNode("td[contains(@class, 'typeico')]/i");
        if (doneNode is not null) done = doneNode.Attributes["class"].Value.Contains("check");

        if (type == "과제" || type == "퀴즈")
        {
            startTime = deadline;
        }

        vWaffle.WCount = weekcount;
        vWaffle.WLctrName = lctr_nm;
        vWaffle.WType = type;
        vWaffle.WTitle = title;
        vWaffle.Title = $@"[{type}] {lctr_nm} - {title}";
        vWaffle.Color = done ? done_color : deadline < DateTime.Today ? expired_color : not_done_color;
        vWaffle.Done = done;
        vWaffle.StartTime = startTime;
        vWaffle.EndTime = deadline;
        vWaffle.Type = "Waffle";
        vWaffle.AddedTime = DateTime.Now;
        vWaffle.Canceled = false;
        vWaffle.ContentDate = deadline;
        vWaffle.Repeat = false;
        vWaffle.Details = $"Waffle = {lctr_nm} - {weekcount} {title}";
        vWaffle.Alarm = true;


        Alarm alarm = new()
        {
            ContentsID = vWaffle.ContentsID,
            AlarmTime = deadline.AddHours(-1),
            Title = $@"[{type}] {lctr_nm} - {title}",
            Type = "Waffle",
        };

        WaffleView.SaveComponent(vWaffle);
        AlarmView.SaveAlarm(alarm);
    } // SaveOnDB
} // Waffle
