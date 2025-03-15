namespace Plugin_Waffle.WaffleData;

internal class WafflePage
{
    private static readonly List<string> pages =
    [
        "https://waffle.wku.ac.kr/",
        "https://waffle.wku.ac.kr/lms/myclass/index.jsp",
        "https://waffle.wku.ac.kr/lms/myclass/classes.jsp",
        "https://waffle.wku.ac.kr/lms/myclass/attend/attend.jsp",
        "https://waffle.wku.ac.kr/lms/myclass/addition/replay.jsp",
        "https://waffle.wku.ac.kr/lms/myclass/addition/attach.jsp",
        "https://waffle.wku.ac.kr/lms/myclass/lecture/lecture_movie",
        "https://waffle.wku.ac.kr/lms/myclass/lecture/lecture_hwork_act",
        "https://waffle.wku.ac.kr/lms/return.jsp",
        "auth.wku.ac.kr",
        "https://auth.wku.ac.kr/Cert/cert_index.jsp",
        "https://auth.wku.ac.kr/Cert/User/Login/login.jsp",
        "https://waffle.wku.ac.kr/lms/FSPServlet"
    ];

    private static readonly List<string> post_page =
    [
        "unaf/lms/lctr:lctr_S11",
        "unaf/lms/lctrbrdpost:lctrBrdPost_S03",
        "unaf/lcms/brdpost:brdPost_S01"
    ];

    internal static string GetPage(EPage ePage) => pages[(int)ePage];
    internal static string GetPage(EPost ePost) => post_page[(int)ePost];
}
