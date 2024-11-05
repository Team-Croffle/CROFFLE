using AnniversaryAPI;
using CROFFLE.Classes;
using CROFFLE.xamls.Controls;
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
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace CROFFLE.xamls.Pages
{
    /// <summary>
    /// C_Back_Page.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class C_Back_Page : Page
    {

        // 전역변수
        private int year;
        private int month;
        private int day;
        public C_Back_Page()
        {
            InitializeComponent();
            year = DateTime.Now.Year;
            month = DateTime.Now.Month;
            day = DateTime.Now.Day;

            StartCalendarLoading();
        }

        internal async void StartCalendarLoading()
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

        // 달력의 한 부분을 렌더링하는 메서드
        void RenderChunk(int startIndex, int chunkSize, ref DateTime datePointer)
        {

            Brush borderBrush = Brushes.Gray;

            for (int i = startIndex; i < startIndex + chunkSize && i < 42; i++)
            {
                int row = i / 7;
                int col = i % 7;

                StackPanel dateStack = new StackPanel
                {
                    Orientation = Orientation.Vertical,
                    VerticalAlignment = VerticalAlignment.Top,
                };


                // 현재 달인지 확인
                bool isCurrentMonth = (datePointer.Month == month && datePointer.Year == year);

                // 전체 셀 Border
                Border cellBorder = new Border
                {
                    Background = isCurrentMonth ? Brushes.Transparent : Brushes.LightGray, // 현재 달이 아니면 회색 배경
                    BorderBrush = borderBrush,
                    BorderThickness = new Thickness(0.5),
                    Padding = new Thickness(0),
                    Child = dateStack
                };

                // 날짜를 감싸는 Border (최상단 경계선)
                Border dateBorder = new Border
                {
                    BorderBrush = borderBrush,
                    BorderThickness = new Thickness(0),
                    Child = new TextBlock
                    {
                        Text = datePointer.Day.ToString(),
                        FontSize = 10,
                        HorizontalAlignment = HorizontalAlignment.Center,
                        FontWeight = FontWeights.Bold,
                    }
                };

                // 특별한 날을 감싸는 Border (중간 경계선)
                Border specialDayBorder = new Border
                {
                    BorderBrush = Brushes.Gray,
                    BorderThickness = new Thickness(0, 0, 0, 1),
                    Child = new TextBlock
                    {
                        Text = "",  // 실제 데이터로 변경 가능
                        FontSize = 8,
                        HorizontalAlignment = HorizontalAlignment.Center,
                    }
                };

                if (i - 1 == DateTime.Now.Day && month == DateTime.Now.Month)
                {
                    specialDayBorder.Child = addAnniversary();
                    
                }
                
                // 현재날짜 표시
                if (i - 1 == DateTime.Now.Day && month == DateTime.Now.Month)
                {
                    cellBorder.BorderBrush = Brushes.Red;
                    cellBorder.BorderThickness = new Thickness(1.5);
                    cellBorder.CornerRadius = new CornerRadius(1);
                }

                // 날짜, 특별한 날을 StackPanel에 추가
                dateStack.Children.Add(dateBorder);
                dateStack.Children.Add(specialDayBorder);

                // Grid에 셀 추가
                daily_area.Children.Add(cellBorder);
                Grid.SetRow(cellBorder, row);
                Grid.SetColumn(cellBorder, col);

                // 다음 날짜로 이동
                datePointer = datePointer.AddDays(1);
            }
        }

        private TextBlock addAnniversary()
        {
            TextBlock anni = new TextBlock
            {
                Text = "국군의 날",  // 실제 데이터로 변경 가능
                FontSize = 8,
                Foreground = Brushes.Red,
                HorizontalAlignment = HorizontalAlignment.Center,
            };
            return anni;
        }

        public void todaymonth()
        {
            year = DateTime.Now.Year;
            month = DateTime.Now.Month;
            day = DateTime.Now.Day;
        }

        public void addmonth()
        {
            month++;
            if (month > 12)
            {
                month = 1;
                year++;
            }
        }

        public void submonth()
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
