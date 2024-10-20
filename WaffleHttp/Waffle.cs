using CroffleDataManager.Json;
using CroffleDataManager.SQLiteDB;
using HtmlAgilityPack;
using HttpManager;
using System.Net;

namespace WaffleHttp
{
    public class Waffle
    {
        private CookieContainer _Cookie;
        private WafflePage _Page;
        private HttpConn _http;
        private SQLiteDB db;

        private string? sNo = null;
        private string? sql_key = null;
        private string? username = null;

        private int done_color;
        private int not_done_color;
        private int expired_color;

        public string? SNO { get { return sNo; } }
        public string? USERNAME { get { return username; } }

        internal string content_type;

        public Waffle(string content_type, int done, int not_done, int expired)
        {
            _http = new();
            _Page = new();
            db = new();
            _Cookie = new();

            this.content_type = content_type;

            done_color = done;
            not_done_color = not_done;
            expired_color = expired;
        } // Waffle()

        public int SetWaffleCookie(string id, string passwd)
        {
            Console.WriteLine("[WaffleHttp] Waffle: Set Waffle Cookie");

            string url = _Page[EPage.eLoginJSP];
            string post_data = $@"userid={id}&passwd={passwd}";
            string host = _Page[EPage.eAuth];
            string referer = _Page[EPage.eWKU];
            int result = _http.GetCookiesPOST(url, post_data, host, referer, content_type, out _Cookie);

            if (result != 1) { Console.WriteLine(" >[SetWaffleCookie] failed"); return result; }

            url = _Page[EPage.eCertIndex];
            host = _Page[EPage.eAuth];
            referer = _Page[EPage.eWKU];
            result = _http.GetDataGET(url, "", host, referer, ref _Cookie, out var data);

            if (result != 0) { Console.WriteLine(" >[SetWaffleCookie] failed"); return result; }
            Console.WriteLine(" >[SetWaffleCookie] Success");

            return 1;
        } // SetWaffleCookie

        public int SetWaffle(string id, string passwd)
        {
            Console.WriteLine("[WaffleHttp] Waffle: Set Info from waffle");
            var url = _Page[EPage.eLoginJSP];
            var post_data = $@"nextURL={_Page[EPage.eReturnJSP]}&errURL={_Page[EPage.eReturnJSP]}&site=waffle&userid={id}&passwd={passwd}";
            var host = _Page[EPage.eAuth];
            var referer = _Page[EPage.eCertIndex];
            var result = _http.GetDataPOST(url, post_data, host, referer, content_type, ref _Cookie, out var data);

            data = string.Empty;
            url = _Page[EPage.eReturnJSP];
            host = _Page[EPage.eWKU];
            referer = _Page[EPage.eAuth];
            result = _http.GetDataGET(url, "", host, referer, ref _Cookie, out data);

            if (result != 1) return result;
            Console.WriteLine(" >[SetWaffle] Authorized");

            data = string.Empty;
            url = _Page[EPage.eMain];
            host = _Page[EPage.eWKU];
            referer = _Page[EPage.eReturnJSP];
            result = _http.GetDataGET(url, "", host, referer, ref _Cookie, out data);

            HtmlDocument htmlDoc = new HtmlDocument();
            htmlDoc.LoadHtml(data);

            try
            {
                sNo = htmlDoc.DocumentNode.SelectSingleNode("//*[@id=\"g_verifyno\"]").Attributes["value"].Value;
                sql_key = htmlDoc.DocumentNode.SelectSingleNode("//*[@id=\"g_secure\"]").Attributes["value"].Value;
                username = htmlDoc.DocumentNode.SelectSingleNode("//*[@id=\"g_verifynm\"]").Attributes["value"].Value;
            }
            catch (NullReferenceException)
            {
                return -2;
            }
            Console.WriteLine($@" >[SetWaffle] Success. | SNO: {sNo} | USERNAME: {username} |");

            return 1;
        }


        public void UpdateWaffleData()
        {
            Console.WriteLine("[WaffleHttp] Waffle: Update Waffle Data...");
            var temp_cookie = _Cookie;
            (var lctr_mngno, var lctr_nm) = GetLectureList();
            var url = _Page[EPage.eAttend];
            var host = _Page[EPage.eWKU];
            var referer = _Page[EPage.eClasses];
            db.ResetTable("waffle");

            for (var i = 0; i < lctr_mngno.Count; i++)
            {
                var result = _http.GetDataGET(url, $@"lctr_mngno={lctr_mngno[i]}", host, referer, ref temp_cookie, out var data);
                if (data == null) { Console.WriteLine($@" >[UpdateWaffleData] failed at {lctr_mngno[i]}: no data"); return; }
                if (result != 1) { Console.WriteLine($@" >[UpdateWaffleData] failed at {lctr_mngno[i]}: result {result}"); return; }
                UpdateLecture(data, lctr_nm[i]);
            }
        } // UpdateWaffleData()


        private void UpdateLecture(string data, string lctr_nm)
        {
            Console.WriteLine($@"[WaffleHttp] Waffle: Get information on {lctr_nm}...");
            HtmlDocument htmlDoc = new HtmlDocument();
            Console.WriteLine(data);
            htmlDoc.LoadHtml(data);
            var nodes = htmlDoc.DocumentNode.SelectNodes("//tr[contains(@class, 'items')]");
            var weekcount = "";

            if (nodes == null) { Console.WriteLine(" >[UpdateLecture] No nodes"); return;}
            foreach (var node in nodes)
            {
                var nodeDoc = new HtmlDocument();
                nodeDoc.LoadHtml(node.InnerHtml);
                var select = nodeDoc.DocumentNode;
                if (node.Attributes["class"].Value.Contains("chptr")) weekcount = select.SelectSingleNode("td[contains(@class,'subject')]").InnerText;
                else
                {
                    var type = select.SelectSingleNode("td[contains(@class, 'regdate')]").InnerText;
                    DateTime.TryParse(select.SelectSingleNode("td[8]").InnerText, out var deadline);
                    var title = select.SelectSingleNode("td[contains(@class,'subject')]").InnerText;
                    bool done = false;
                    if (select.SelectSingleNode("td[contains(@class, 'typeico')]/i").Attributes["class"].Value.Contains("check")) done = true;
                    var color =  done ? done_color : deadline < DateTime.Today ? expired_color : not_done_color;
                    var _title = $@"[{type}] {lctr_nm} - {weekcount} {title}";
                    db.SaveOnDB("waffle", $@"'{GenerateID()}', date('{deadline:yyyy-MM-dd}'), datetime('{deadline:yyyy-MM-dd HH:mm:ss}'),
datetime('{DateTime.Now: yyyy-MM-dd}'), '{_title}', {color}, 'waffle', ' ', '{type}', true, {done}");
                }
            }
        } // Method_Name_IDK()

        private string GetNode(HtmlDocument htmlDoc, string node)
        {
            return htmlDoc.DocumentNode.SelectSingleNode(node).InnerText;
        } // GetNode()

        private string GenerateID()
        {
            int count = db.Get_ID_Count("waffle");
            return $"W{count:D8}";
        } // GenerateID()

        private (List<string>, List<string>) GetLectureList()
        {
            string url = _Page[EPage.eFSPServlet];
            string host = _Page[EPage.eWKU];
            string referer = _Page[EPage.eMain];
            string post_data = $@"_SQL_ID={_Page[EPost.eMain]}&verifyno={sNo}&teach=0&cmplt_yn=0&close_yn=0&_SECURE_KEY={sql_key}";
            int result = _http.GetDataPOST(url, post_data, host, referer, content_type, ref _Cookie, out string json);

            JsonManager jsm = new JsonManager();
            jsm.LoadJObject(json);
            jsm.FindItems("ds_oparam", out List<string> values);
            var lctr_mngno = new List<string>();
            var lctr_nm = new List<string>();

            foreach (string value in values)
            {
                jsm.LoadJObject(value);
                jsm.FindItem("lctr_mngno", out string item);
                lctr_mngno.Add(item);
                jsm.FindItem("lctr_nm", out item);
                lctr_nm.Add(item);
            }

            return (lctr_mngno, lctr_nm);
        } // GetLectureList()
    } // Waffle
} // WaffleHttp
