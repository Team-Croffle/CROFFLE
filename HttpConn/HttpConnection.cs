using CroffleLogManager;
using System.Net;
using System.Net.Http.Headers;
using System.Text;

namespace HttpConn;

public class HttpConnection
{
    private static readonly HttpClient client = new();

    /// <summary>
    /// Read data from response for POST request
    /// </summary>
    /// <param name="url">url</param>
    /// <param name="post_data">post data</param>
    /// <param name="host">host. null</param>
    /// <param name="referer">referer. null</param>
    /// <param name="content_type">content type</param>
    /// <param name="data">output data</param>
    /// <returns>1 is success, -1 is no response or 404 Not Found, 0 is other error</returns>
    public static int GetDataPOST(string url, string? post_data, string? host, string? referer, MediaTypeHeaderValue content_type, out string data)
    {
        int result = POSTPOSTPOST(url, post_data, host, referer, content_type, out HttpResponseMessage? resp);
        data = string.Empty;

        if (result is not 1) return result;
        if (resp is null) return -1;

        // Read data from response
        using StreamReader sr = new(resp.Content.ReadAsStream(), Encoding.UTF8, true);
        data = sr.ReadToEnd();

        return 1;
    }

    /// <summary>
    /// Read data from response for POST request
    /// </summary>
    /// <param name="url">url</param>
    /// <param name="post_data">post data</param>
    /// <param name="data">output data</param>
    /// <returns>1 is success, -1 is no response or 404 Not Found, 0 is other error</returns>
    public static int GetDataPOST(string url, string? post_data, out string? data)
    {
        int result = POSTPOSTPOST(url, post_data, null, null, new(""), out HttpResponseMessage? resp);

        data = string.Empty;

        if (result is not 1) return result;
        if (resp is null) return -1;

        // Read data from response
        using StreamReader sr = new(resp.Content.ReadAsStream(), Encoding.UTF8, true);
        data = sr.ReadToEnd();

        return 1;
    }

    /// <summary>
    /// Read data from response for GET request
    /// </summary>
    /// <param name="url">url</param>
    /// <param name="query">url query data. can null</param>
    /// <param name="host">host. null</param>
    /// <param name="referer">referer. null</param>
    /// <param name="data">output data</param>
    /// <returns></returns>
    public static int GetDataGET(string url, string? query, string? host, string? referer, out string? data)
    {
        if (query is not null && query != string.Empty) url += $@"?{query}";
        int result = GETGETGET(url, host, referer, out HttpResponseMessage? resp);

        data = string.Empty;

        if (result is not 1) return result;
        if (resp is null) return -1;

        // Read data from response
        using StreamReader sr = new(resp.Content.ReadAsStream(), Encoding.UTF8, true);
        data = sr.ReadToEnd();

        return 1;
    }

    /// <summary>
    /// Read data from response for GET request without query
    /// </summary>
    /// <param name="url">url</param>
    /// <param name="data">output data</param>
    /// <returns></returns>
    public static int GetDataGET(string url, out string? data)
    {
        int result = GETGETGET(url, "", null, out HttpResponseMessage? resp);

        data = string.Empty;

        if (result is not 1) return result;
        if (resp is null) return -1;

        // Read data from response
        using StreamReader sr = new(resp.Content.ReadAsStream(), Encoding.UTF8, true);
        data = sr.ReadToEnd();

        return 1;
    }

    /// <summary>
    /// Http POST Method
    /// </summary>
    /// <param name="url">URL - Not Null</param>
    /// <param name="post_data">Postdata. Can null. </param>
    /// <param name="host">host. null</param>
    /// <param name="referer">referer. null/param>
    /// <param name="content_type">MediaType HeaderValue</param>
    /// <param name="resp">response of post request</param>
    /// <returns>1 is success for request. 0 is 404 or no response. -1 is other errors</returns>
    private static int POSTPOSTPOST(string url, string? post_data, string? host, string? referer, MediaTypeHeaderValue? content_type,  out HttpResponseMessage? resp)
    {
        // Make a POST request
        HttpRequestMessage request = new(HttpMethod.Post, url);

        // Set post data when not null
        if (post_data is not null) request.Content = new StringContent(post_data, Encoding.UTF8);
        else request.Content = new StringContent("");

        if (request.Content is null)
        {
            resp = null;
            return -1;
        }

        // Set headers when not null
        if (content_type is not null) request.Content.Headers.ContentType = content_type;
        if (host is not null) request.Headers.Host = host;
        if (referer is not null) request.Headers.Referrer = new(referer);


        HttpResponseMessage? response;

        // Send request
        try { response = client.SendAsync(request).Result; }
        catch (HttpRequestException) { response = null; }
        catch (AggregateException)
        {
            Log.LogError("[HttpConnection] POSTPOSTPOST error: no host");
            resp = null;
            return -2;
        }
        catch (Exception e)
        {
            Log.LogError($"HttpConnection POSTPOSTPOST error: {e.Message}");
            response = null;
        }

        // Check response. If null, return -1
        if (response is null) { resp = null; return -1; }

        resp = response;

        HttpStatusCode status = response.StatusCode;

        if (status is HttpStatusCode.OK) return 1;
        else if (status is HttpStatusCode.NotFound) return 0;
        else return -1;
    }

    /// <summary>
    /// Http GET Method
    /// </summary>
    /// <param name="url">URL - Not Null</param>
    /// <param name="host">host. null</param>
    /// <param name="referer">referer. null/param>
    /// <param name="resp">response of post request</param>
    /// <returns>1 is success for request. 0 is 404 or no response. -1 is other errors</returns>
    private static int GETGETGET(string url, string? host, string? referer, out HttpResponseMessage? resp)
    {
        // Make a GET request
        HttpRequestMessage request = new(HttpMethod.Get, url)
        {
            Content = new StringContent("")
        };

        // Set headers when not null
        if (host is not null) request.Headers.Host = host;
        if (referer is not null) request.Headers.Referrer = new(referer);

        request.Headers.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0");
        request.Headers.Accept.ParseAdd("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");

        HttpResponseMessage? response;

        // Send request
        try { response = client.SendAsync(request).Result; }
        catch (HttpRequestException e)
        {
            Log.LogError($@"[HttpConnection] GETGETGET error: {e.Message}");
            response = null;
        }
        catch (AggregateException e)
        {
            Log.LogError($@"[HttpConnection] GETGETGET error: {e.Message}");
            resp = null;
            return -2;
        }
        catch (Exception e)
        {
            Log.LogError($@"[HttpConnection] GETGETGET error: {e.Message}");
            response = null;
        }

        if (response is null) { resp = null; return -1; }

        resp = response;

        HttpStatusCode state = response.StatusCode;

        if (state is HttpStatusCode.OK) return 1;
        else if (state is HttpStatusCode.NotFound) return 0;
        else return -1;
    }
}
