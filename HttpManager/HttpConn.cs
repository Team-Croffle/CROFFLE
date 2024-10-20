using System.Net;
using System.Text;

namespace HttpManager
{
    public class HttpConn
    {
        /// <summary>
        /// Get Cookies
        /// </summary>
        /// <param name="url">url</param>
        /// <param name="post_data">post data</param>
        /// <param name="host">host</param>
        /// <param name="referer">referer</param>
        /// <param name="content_type">content type</param>
        /// <param name="cookies">CookieContainer</param>
        /// <returns>result of POST Method. 1 == OK</returns>
        public int GetCookiesPOST(string url, string post_data, string host, string referer, string content_type, out CookieContainer cookies)
        {
            cookies = new CookieContainer();

            int result = POSTPOSTPOST(url, post_data, host, referer, content_type, true, ref cookies, out HttpWebResponse? resp);

            if (result != 1) return result;
            if (resp == null) return -1;

            cookies.Add(resp.Cookies);
            return result;
        }

        /// <summary>
        /// Get Data(Json, Xml etc.) from POST method with cookies.
        /// </summary>
        /// <param name="url">URL</param>
        /// <param name="post_data">POST data</param>
        /// <param name="host">host</param>
        /// <param name="referer">referer</param>
        /// <param name="content_type">Content type</param>
        /// <param name="cookies">Cookies</param>
        /// <param name="data">result data (string)</param>
        /// <returns>Result of POST Method. 1 == OK</returns>
        public int GetDataPOST(string url, string post_data, string host, string referer, string content_type, ref CookieContainer cookies, out string data)
        {
            int result = POSTPOSTPOST(url, post_data, host, referer, content_type, true, ref cookies, out HttpWebResponse? resp);
            data = string.Empty;

            if (result != 1) return result;
            if (resp == null) return -1;

            using (StreamReader sr = new StreamReader(resp.GetResponseStream(), Encoding.UTF8, true))
            {
                data = sr.ReadToEnd();
            }

            return 1;
        }

        /// <summary>
        /// Get Data from POST method without cookies.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="post_data"></param>
        /// <param name="data"></param>
        /// <returns>Result of POST Method. 1 == OK</returns>
        public int GetDataPOST(string url, string post_data,  out string data)
        {
            CookieContainer cookies = new CookieContainer();
            int result = POSTPOSTPOST(url, post_data, "", null, null, false, ref cookies, out HttpWebResponse? resp);

            data = string.Empty;

            if (result != 1) return result;
            if (resp == null) return -1;

            using (StreamReader sr = new StreamReader(resp.GetResponseStream(), Encoding.UTF8, true))
            {
                data = sr.ReadToEnd();
            }

            return 1;
        }

        /// <summary>
        /// Get Data from GET method with cookies.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="query"></param>
        /// <param name="host"></param>
        /// <param name="referer"></param>
        /// <param name="cookies"></param>
        /// <param name="data"></param>
        /// <returns>Result of GET Method. 1 == OK</returns>
        public int GetDataGET(string url, string query, string host, string referer, ref CookieContainer cookies, out string data)
        {

            if (query != null && query != string.Empty) url += $@"?{query}";
            int result = GETGETGET(url, host, referer, true, ref cookies, out HttpWebResponse? resp);

            data = string.Empty;

            if (result != 1) return result;
            if (resp == null) return -1;

            using (StreamReader sr = new StreamReader(resp.GetResponseStream(), Encoding.UTF8, true))
            {
                data = sr.ReadToEnd();
            }

            return 1;
        }

        /// <summary>
        /// Get data from GET method without cookies.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="data"></param>
        /// <returns>Result of GET Method. 1 == OK</returns>
        public int GetDataGET(string url, out string data)
        {
            CookieContainer cookies = new CookieContainer();
            int result = GETGETGET(url, "", null, false, ref cookies, out HttpWebResponse? resp);

            data = string.Empty;

            if (result != 1) return result;
            if (resp == null) return -1;

            using (StreamReader sr = new StreamReader(resp.GetResponseStream(), Encoding.UTF8, true))
            {
                data = sr.ReadToEnd();
            }

            return 1;
        }


        /// <summary>
        /// POST
        /// </summary>
        /// <param name="url">url</param>
        /// <param name="post_data">post data</param>
        /// <param name="host">host</param>
        /// <param name="referer">referer</param>
        /// <param name="content_type">content type</param>
        /// <param name="resp">HttpWebResponse</param>
        /// <param name="_cookies">CookieContainer</param>
        /// <returns>Error code. 1 == OK</returns>
        private int POSTPOSTPOST(string url, string post_data, string host, string? referer, string? content_type, bool? setInfo, ref CookieContainer _cookies, out HttpWebResponse? resp)
        {
            //request 설정
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "POST";
            if (setInfo == true)
            {
                request.Host = host;
                request.Referer = referer;
                request.ContentType = content_type;
                request.KeepAlive = true;
                request.CookieContainer = _cookies;
            }

            //post data가 null이 아니면 byte로 encoding 후 write
            if (post_data != null)
            {
                byte[] sendData = Encoding.UTF8.GetBytes(post_data);
                using (Stream dataStream = request.GetRequestStream())
                    dataStream.Write(sendData, 0, sendData.Length);
            }

            HttpWebResponse? response;

            //response를 받아옴
            try { response = (HttpWebResponse)request.GetResponse(); }
            catch (WebException e) { response = (HttpWebResponse)(e.Response ?? throw new NullReferenceException("No Respone Error Code")); }
            catch (Exception) { response = null; }

            //response를 받은 뒤 상태 확인
            if (response == null) { resp = null; return -1; }

            HttpStatusCode status = response.StatusCode;

            resp = response;

            //정상이면 1, 리소스가 없으면 0, 그 외 오류는 -1
            if (status == HttpStatusCode.OK) return 1;
            else if (status == HttpStatusCode.NotFound) return 0;
            else return -1;
        } // int FuckinPOST()

        /// <summary>
        /// GET
        /// </summary>
        /// <param name="url">url</param>
        /// <param name="host">host</param>
        /// <param name="referer">referer</param>
        /// <param name="resp">HttpWebResponse</param>
        /// <param name="_cookies">CookieContainer</param>
        /// <returns>Error code. 1 == OK</returns>
        private int GETGETGET(string url, string host, string? referer, bool? setInfo, ref CookieContainer _cookies, out HttpWebResponse? resp)
        {
            //request 설정. GET은 POSTData가 없다.(Query는 url의 뒤에 붙는다)
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            if (setInfo == true)
            {
                request.Host = host;
                request.KeepAlive = true;
                request.Referer = referer;
                request.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";
                request.CookieContainer = _cookies;
            }

            HttpWebResponse? response;

            //response 받기
            try { response = (HttpWebResponse)request.GetResponse(); }
            catch (WebException e) { response = (HttpWebResponse)(e.Response ?? throw new NullReferenceException("No Respone Error Code")); }
            catch (Exception) { response = null; }

            if (response == null) { resp = null; return -1; }

            HttpStatusCode state = response.StatusCode;
            resp = response;

            //상태코드에 따라 결과 return
            if (state == HttpStatusCode.OK) return 1;
            else if (state == HttpStatusCode.NotFound) return 0;
            else return -1;
        } // int FuckinGET()
    } // class HttpCon
} // namespace HttpManager
