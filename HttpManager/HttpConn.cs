using System.Net;
using System.Text;

namespace HttpManager;

public class HttpConn
{

    public async Task GetCookiesPOST(string url, HttpClient httpClient, StringContent postdata)
    {
        using HttpResponseMessage resp = await httpClient.PostAsync(url, postdata);

        resp.EnsureSuccessStatusCode();
    }
} // class HttpCon
