using AnniversaryAPI;
using CROFFLE.Classes;
using CROFFLE.xamls.Controls;
using CROFFLE.xamls.Dialog;
using CROFFLE.xamls.Pages;
using CROFFLE.xamls.Windows;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace CROFFLE.xamls.Pages
{
    /// <summary>
    /// CalendarPage.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class MainCalendarPage : Page
    {
        // 전역변수
        /*private string apikey;*/
        private DateTime date_value;
        internal DateTime Day { get { return date_value; } }

        private int year = DateTime.Now.Year;
        private int month = DateTime.Now.Month;
        private int day = DateTime.Now.Day;

        private int done;

        C_Page c_cur;
        C_Page c_next;
        /*C_Page c_prev;
        C_Page c_next;*/

        Settings settings;
        WaffleTask waffleTask;

        public MainCalendarPage()
        {
            InitializeComponent();
            c_cur = new C_Page(year, month);
            c_next = new C_Page(year, month + 1);
            /*c_prev = new C_Page(year, month -1);
            c_next = new C_Page(year, month +1);*/

            //frame_control
            frame_calendar.Content = c_cur;
            Load_Calendar();
        }

        // 중복 호출 방지 플래그
        private bool isCalendarLoading = false;

        internal async Task Load_Calendar()
        {
            try
            {
                isCalendarLoading = true; // 로딩 시작 상태로 설정
                Console.WriteLine($"Loading calendar for {year}년 {month}월");

                btn_today.ButtonText = "" + day;
                lb_week.Content = GetWeekOfMonth() + "주차";
                btn_dateNav.ButtonText = year + "년 " + month + "월";

                c_cur = new C_Page(year, month);
                frame_calendar.Content = c_cur;

                await c_cur.StartCalendarLoading();
                Console.WriteLine("Calendar loaded successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading calendar: {ex.Message}");
            }
            finally
            {
                isCalendarLoading = false; // 로딩 상태 종료
            }
        }

        //주차 구하기
        internal static int GetWeekOfMonth()
        {
            DateTime now = DateTime.Today;
            int basisWeekOfDay = (now.Day - 1) % 7;
            int thisWeek = (int)now.DayOfWeek;
            double val = Math.Ceiling((double)now.Day / 7);

            if (basisWeekOfDay > thisWeek)
                val++;

            return Convert.ToInt32(val);
        }

        private void Date_Click(object sender, RoutedEventArgs e)
        {
            EditorCalendar editorCalendar = new EditorCalendar(DateTime.Now);
            // editorCalendar를 현 마우스 위치에 띄운다.
            editorCalendar.WindowStartupLocation = WindowStartupLocation.Manual;
            Point mousePosition = Mouse.GetPosition(Application.Current.MainWindow);
            editorCalendar.Left = mousePosition.X + Application.Current.MainWindow.Left;
            editorCalendar.Top = mousePosition.Y + Application.Current.MainWindow.Top;

            if (editorCalendar.ShowDialog() == true)
            {
                year = editorCalendar.getDate.Year;
                month = editorCalendar.getDate.Month;
            }
            Load_Calendar();
        }

        // 다음 달 이동
        private async void btn_next_Click(object sender, RoutedEventArgs e)
        {
            if (isCalendarLoading) return;
            try
            {
                isCalendarLoading = true; // 로딩 시작 상태로 설정
                Console.WriteLine("NEXT : click!!");

                addMonth(); // 월 변경
                await Load_Calendar(); // 비동기 캘린더 로드
            }
            finally
            {
                isCalendarLoading = false; // 로딩 완료 후 상태 리셋
            }
        }

        // 이전 달 이동
        private async void btn_prev_Click(object sender, RoutedEventArgs e)
        {
            if (isCalendarLoading) return;
            try
            {
                isCalendarLoading = true;
                Console.WriteLine("PREV : click!!");

                subMonth();
                await Load_Calendar();
            }
            finally
            {
                isCalendarLoading = false;
            }
        }

        // 현재로 이동
        private async void todayBtn_Click(object sender, RoutedEventArgs e)
        //오늘날로 돌아오기 버튼
        {
            if (isCalendarLoading) return;
            try
            {
                isCalendarLoading = true;
                Console.WriteLine("TODAY : click!!");

                todayMonth();
                await Load_Calendar();
            }
            finally
            {
                isCalendarLoading = false;
            }
        }

        private void todayMonth()
        {
            year = DateTime.Now.Year;
            month = DateTime.Now.Month;
            day = DateTime.Now.Day;
        }

        private void addMonth()
        {
            month++;
            if (month > 12)
            {
                month = 1;
                year++;
            }
        }

        private void subMonth()
        {
            month--;
            if (month < 1)
            {
                month = 12;
                year--;
            }
        }
    }
}

