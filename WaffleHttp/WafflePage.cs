namespace WaffleHttp
{
    internal class WafflePage
    {
        private static readonly List<string> pages = new List<string>
        {
            "waffle.wku.ac.kr",
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
        };

        private static readonly List<string> page_post = new List<string> {
            "unaf/lms/lctr:lctr_S11",
            "unaf/lms/lctrbrdpost:lctrBrdPost_S03",
            "unaf/lcms/brdpost:brdPost_S01"
        };

        /// <summary>
        ///waffle page를 List로 정리
        /// </summary>
        internal WafflePage() { }

        /// <summary>
        /// object[EPage]로 url을 불러 올 수 있음.
        /// </summary>
        internal string this[EPage ePage] => pages[(int)ePage];

        internal string this[EPost ePost] => page_post[(int)ePost];
    }

    /// <summary>
    /// POST DATA의 인덱스를 열거
    /// </summary>
    internal enum EPage
    {
        eWKU = 0,
        eMyClass = 1,
        eMain = 1,
        eClasses = 2,
        eAttend = 3,
        eAdditionMovie = 4,
        eAdditionFile = 5,
        eLectureMovie = 6,
        eLectureHwork = 7,
        eReturnJSP = 8,
        eAuth = 9,
        eCertIndex = 10,
        eLoginJSP = 11,
        eFSPServlet = 12,
    }
    internal enum EPost
    {
        eMain = 0,
        eWaffleMsg = 1,
        eFSPServlet = 2,
    }
}
