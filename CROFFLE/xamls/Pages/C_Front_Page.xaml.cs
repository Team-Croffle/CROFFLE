using CROFFLE.xamls.Controls;
using System;
using System.Collections.Generic;
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
    /// C_Front_Page.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class C_Front_Page : Page
    {

        // 전역변수
        private int year;
        private int month;
        private int day;
        private DateTime date_value;

        public C_Front_Page()
        {
            InitializeComponent();
            year = DateTime.Now.Year;
            month = DateTime.Now.Month;
            day = DateTime.Now.Day;
            StartCalendarLoading();
        }

        private async void StartCalendarLoading()
        {
            daily_area.Children.Clear();
            int chunkSize = 7; // 한 번에 로딩할 셀 개수 (한 주 단위로 로딩)

            // 비동기적으로 달력을 로딩
            await LoadCalendarAsync(chunkSize);
        }

        // 비동기적으로 달력 셀을 로딩하는 메서드
        async Task LoadCalendarAsync(int chunkSize)
        {
            int index = 0;

            // 달력의 첫 날짜 계산 (이전 달 마지막 일요일부터 시작)
            DateTime days = new DateTime(year, month, 1);
            int preMonNum = (int)days.DayOfWeek;
            DateTime datePointer = days.AddDays(preMonNum == 0 ? -7 : -preMonNum);

            while (index < 42)
            {
                // 특정 크기만큼의 셀을 렌더링
                RenderChunk(index, chunkSize, ref datePointer);
                index += chunkSize;

                // 잠시 대기하여 UI 차단 방지
                await Task.Delay(100);
            }
        }

        // 달력을 렌더링하는 메서드
        void RenderChunk(int startIndex, int chunkSize, ref DateTime datePointer)
        {
            Brush borderBrush = Brushes.Black.Clone();
            for (int i = startIndex; i < startIndex + chunkSize && i < 42; i++)
            {
                int row = i / 7;
                int col = i % 7;

                StackPanel dateStack = new StackPanel
                {
                    Orientation = Orientation.Vertical,
                    HorizontalAlignment = HorizontalAlignment.Stretch,
                    VerticalAlignment = VerticalAlignment.Top,
                    Margin = new Thickness(0, 30, 0, 0)
                };

                RoundButton task;

                //일정 추가
                if (i-1 == DateTime.Now.Day)
                {
                    task = addTask();
                    dateStack.Children.Add(task);
                }

                // Grid에 셀 추가
                daily_area.Children.Add(dateStack);
                Grid.SetRow(dateStack, row);
                Grid.SetColumn(dateStack, col);

                // 다음 날짜로 이동
                datePointer = datePointer.AddDays(1);
            }
        }

        private RoundButton addTask()
        {
            RoundButton btn = new RoundButton
            {
                ButtonBorderBrush = Brushes.Transparent,
                ButtonColor = Brushes.LightBlue,
                ButtonText = "Schedule",
                ButtonFontSize = 10,
                ButtonCornerRadius = new(6),
                HorizontalAlignment = HorizontalAlignment.Center,
                Width = 120,

            };
            return btn;
        }


    }
}
