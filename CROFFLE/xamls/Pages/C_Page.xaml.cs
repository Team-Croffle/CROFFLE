using AnniversaryAPI;
using CROFFLE.Classes;
using CROFFLE.xamls.Windows;
using CroffleDataManager.SQLiteDB;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Policy;
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
    /// C_Page.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class C_Page : Page
    {
        private int day = DateTime.Now.Day;
        private int done;

        private int _year;
        private int _month;

        Settings settings = new Settings();

        public C_Page(int year, int month)
        {
            _year = year;
            _month = month;
            InitializeComponent();
        }

        /// <summary>
        /// 캘린더 로딩을 시작합니다.
        /// </summary>
        internal async Task StartCalendarLoading()
        {
            int chunkSize = 42;
            await LoadCalendarAsync(chunkSize);
        }

        /// <summary>
        /// 비동기적으로 캘린더를 로드합니다.
        /// </summary>
        /// <param name="chunkSize">한 번에 로드할 날짜 수</param>
        async Task LoadCalendarAsync(int chunkSize)
        {
            await Dispatcher.InvokeAsync(() => daily_area.Children.Clear());

            DateTime days = new DateTime(_year, _month, 1);
            int preMonNum = (int)days.DayOfWeek;
            DateTime datePointer = days.AddDays(preMonNum == 0 ? -7 : -preMonNum);

            int index = 0;
            while (index < 42)
            {
                await Dispatcher.InvokeAsync(() => RenderChunk(index, chunkSize, ref datePointer));
                index += chunkSize;
                await Task.Delay(50); // 응답성을 높이기 위해 지연 시간 감소
            }
        }

        /// <summary>
        /// 날짜 청크를 렌더링합니다.
        /// </summary>
        /// <param name="startIndex">시작 인덱스</param>
        /// <param name="chunkSize">청크 크기</param>
        /// <param name="datePointer">날짜 포인터</param>
        void RenderChunk(int startIndex, int chunkSize, ref DateTime datePointer)
        {
            Brush borderBrush = Brushes.Gray;
            var dateCells = new List<UIElement>();

            for (int i = startIndex; i < startIndex + chunkSize && i < 42; i++)
            {
                int row = i / 7;
                int col = i % 7;

                bool isCurrentMonth = (datePointer.Month == _month && datePointer.Year == _year);

                Border dateGridBorder = new Border
                {
                    Background = isCurrentMonth ? Brushes.Transparent : Brushes.LightGray,
                    BorderBrush = borderBrush,
                    BorderThickness = new Thickness(0.5),
                    Tag = datePointer,
                    Margin = new Thickness(0) // Margin 제거
                };

                Grid dateGrid = new Grid();
                dateGrid.RowDefinitions.Add(new RowDefinition { Height = new GridLength(1, GridUnitType.Auto) });
                dateGrid.RowDefinitions.Add(new RowDefinition { Height = new GridLength(1, GridUnitType.Auto) });
                dateGrid.RowDefinitions.Add(new RowDefinition { Height = new GridLength(3, GridUnitType.Star) });

                // 날짜와 특일 정보를 같은 경계선 안에 포함
                StackPanel dateAndAnnvPanel = new StackPanel
                {
                    Orientation = Orientation.Vertical,
                    HorizontalAlignment = HorizontalAlignment.Stretch,
                    VerticalAlignment = VerticalAlignment.Top
                };

                Border dateCellBorder = new Border
                {
                    Background = Brushes.Transparent,
                    BorderBrush = borderBrush,
                    BorderThickness = new Thickness(0),
                    Child = Set_day(datePointer)
                };

                Border annvBorder = Set_Annv(datePointer);

                dateAndAnnvPanel.Children.Add(dateCellBorder);
                dateAndAnnvPanel.Children.Add(annvBorder);

                StackPanel scStack = SetSchedulePanel(datePointer);

                Grid.SetRow(dateAndAnnvPanel, 0);
                Grid.SetRow(scStack, 1);

                dateGrid.Children.Add(dateAndAnnvPanel);
                dateGrid.Children.Add(scStack);

                dateGridBorder.Child = dateGrid;
                dateGridBorder.ContextMenu = CreateDynamicContextMenu(datePointer);

                // 오늘 날짜인 경우 테두리 색을 빨간색으로 설정
                if (datePointer.Date == DateTime.Now.Date)
                {
                    dateGridBorder.BorderBrush = Brushes.Red;
                    dateGridBorder.BorderThickness = new Thickness(1.5);
                }

                dateCells.Add(dateGridBorder);
                Grid.SetRow(dateGridBorder, row);
                Grid.SetColumn(dateGridBorder, col);

                dateGridBorder.MouseLeftButtonDown += DateBorder_MouseLeftButtonDown;
                datePointer = datePointer.AddDays(1);
            }

            foreach (var cell in dateCells)
            {
                daily_area.Children.Add(cell);
            }
        }

        /// <summary>
        /// 날짜를 설정합니다.
        /// </summary>
        /// <param name="_day">날짜</param>
        /// <returns>날짜를 포함하는 Border</returns>
        private Border Set_day(DateTime _day)
        {
            SQLiteDB db = new SQLiteDB();
            db.GetDailyProperty(_day, done, -1, out var contents);

            Image dayImage = new Image
            {
                Source = new BitmapImage(new Uri("pack://application:,,,/Icon/pen-to-square-solid.png")),
                Width = 13,
                Height = 13,
                Margin = new Thickness(0, 2, 5, 0),
                HorizontalAlignment = HorizontalAlignment.Right,
                Visibility = contents[0].Rows.Count > 0 ? Visibility.Visible : Visibility.Collapsed
            };

            TextBlock dayText = new TextBlock
            {
                Text = _day.Day.ToString(),
                FontSize = 12,
                FontFamily = new FontFamily(new Uri("pack://application:,,,/"), "./Font/#KCC-Ganpan"), // FontFamily 설정 수정,
                HorizontalAlignment = HorizontalAlignment.Center,
            };

            // 일요일과 토요일의 글씨 색 설정
            if (_day.DayOfWeek == DayOfWeek.Sunday)
            {
                dayText.Foreground = Brushes.Red;
            }
            else if (_day.DayOfWeek == DayOfWeek.Saturday)
            {
                dayText.Foreground = Brushes.Blue;
            }

            Grid dayGrid = new Grid();
            dayGrid.Children.Add(dayText);
            dayGrid.Children.Add(dayImage);

            return new Border
            {
                BorderBrush = Brushes.Transparent,
                BorderThickness = new Thickness(0),
                Background = Brushes.Transparent,
                Child = dayGrid
            };
        }

        /// <summary>
        /// 기념일을 설정합니다.
        /// </summary>
        /// <param name="_day">날짜</param>
        /// <returns>기념일을 포함하는 Border</returns>
        private Border Set_Annv(DateTime _day)
        {
            AnnvAPI annvAPI = new AnnvAPI();
            try
            {
                if (_day.Day == 1) annvAPI.CheckAnniversaryMonth(_day.Year, _day.Month);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"> [Set_Annv] Error: {ex.Message}");
                return new Border();
            }

            annvAPI.GetDailyInfo(_day, out var table);
            string anniversaryText = "";
            Border specialDayBorder = new Border
            {
                BorderBrush = Brushes.Gray,
                BorderThickness = new Thickness(0),
                Child = new Label
                {
                    Content = "",
                    FontSize = 9,
                    FontWeight = FontWeights.Bold,
                    HorizontalContentAlignment = HorizontalAlignment.Center,
                    BorderBrush = Brushes.Transparent,
                    BorderThickness = new Thickness(0),
                    Width = 100,
                    Height = 12,
                    Padding = new Thickness(0)
                }
            };
            if (table != null)
            {
                foreach (DataRow row in table.Rows)
                {
                    anniversaryText += row["dateName"].ToString() + "\n";

                    bool.TryParse(row["isHoliday"].ToString(), out var holiday);
                    if (holiday)
                    {
                        if (specialDayBorder.Child is Label label)
                        {
                            label.Foreground = Brushes.Red;
                        }
                    }
                }
                if (specialDayBorder.Child is Label labelContent)
                {
                    labelContent.Content = anniversaryText;
                }
            }

            // 일요일과 토요일의 글씨 색 설정
            if (_day.DayOfWeek == DayOfWeek.Sunday)
            {
                if (specialDayBorder.Child is Label label)
                {
                    label.Foreground = Brushes.Red;
                }
            }
            else if (_day.DayOfWeek == DayOfWeek.Saturday)
            {
                if (specialDayBorder.Child is Label label)
                {
                    label.Foreground = Brushes.Blue;
                }
            }

            return specialDayBorder;
        }

        /// <summary>
        /// 일정 패널을 설정합니다.
        /// </summary>
        /// <returns>일정 패널을 포함하는 StackPanel</returns>
        private StackPanel SetSchedulePanel(DateTime _day)
        {
            SQLiteDB db = new SQLiteDB();
            db.GetDailyProperty(_day, done, -1, out var contents);
            StackPanel taskStack = new StackPanel
            {
                Orientation = Orientation.Vertical,
                HorizontalAlignment = HorizontalAlignment.Stretch,
                VerticalAlignment = VerticalAlignment.Top,
            };
            var count = contents[1].Rows.Count;
            Label[] labels = new Label[3];
            for (int i = 0; i < labels.Length; i++)
            {
                labels[i] = SetTask();
                taskStack.Children.Add(labels[i]);
            }
            for (var i = 0; i < 3; i++)
            {
                if (i < count)
                {
                    var title = contents[1].Rows[i]["title"].ToString();
                    int.TryParse(contents[1].Rows[i]["color"].ToString(), out var color_argb);
                    labels[i].Visibility = Visibility.Visible;
                    if (i == 2 && count > 3)
                    {
                        labels[i].Content = $"~외 {count - 2}개의 일정 있음";
                        labels[i].Background = Brushes.LightGray;
                    }
                    else
                    {
                        labels[i].Content = title?.Length > 15 ? title.Substring(0, 15) + "..." : title;
                        labels[i].Background = new SolidColorBrush(Color.FromArgb((byte)(color_argb >> 24), (byte)(color_argb >> 16), (byte)(color_argb >> 8), (byte)color_argb));
                    }
                }
            }

            return taskStack;
        }

        /// <summary>
        /// 작업을 설정합니다.
        /// </summary>
        /// <returns>작업을 포함하는 Label</returns>
        private Label SetTask()
        {
            return new Label
            {
                BorderBrush = Brushes.Transparent,
                BorderThickness = new Thickness(0),
                Background = Brushes.GreenYellow,
                Content = "",
                FontSize = 9,
                FontFamily = new FontFamily(new Uri("pack://application:,,,/"), "./Font/#KCC-Ganpan"), // FontFamily 설정 수정,
                Height = 21,
                VerticalContentAlignment = VerticalAlignment.Center,
                HorizontalContentAlignment = HorizontalAlignment.Center,
                Margin = new Thickness(2, 2, 2, 0),
                Visibility = Visibility.Collapsed,
            };
        }

        /// <summary>
        /// 날짜 셀 클릭 시 호출되는 이벤트 핸들러입니다.
        /// </summary>
        private void DateBorder_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (sender is Border clickedBorder && clickedBorder.Tag is DateTime clickedDate)
            {
                OpenInfo(clickedDate);
            }
        }

        /// <summary>
        /// 오늘 날짜인지 확인하고 스타일을 설정합니다.
        /// </summary>
        /// <param name="datePointer">날짜 포인터</param>
        /// <param name="dateCellBorder">날짜 셀 Border</param>
        /// <returns>스타일이 설정된 Border</returns>
        private Border isToday(DateTime datePointer, Border dateCellBorder)
        {
            if (datePointer.Date == DateTime.Now.Date)
            {
                dateCellBorder.BorderBrush = Brushes.Red;
                dateCellBorder.BorderThickness = new Thickness(1.5);
                dateCellBorder.CornerRadius = new CornerRadius(1);
            }
            return dateCellBorder;
        }

        /// <summary>
        /// 날짜 정보를 표시하는 창을 엽니다.
        /// </summary>
        /// <param name="date">날짜</param>
        private void OpenInfo(DateTime date)
        {
            DailyInfo dailyInfo = new DailyInfo(date)
            {
                Owner = Application.Current.MainWindow
            };
            dailyInfo.Show();
        }

        /// <summary>
        /// 동적 컨텍스트 메뉴를 생성합니다.
        /// </summary>
        /// <returns>생성된 ContextMenu</returns>
        private ContextMenu CreateDynamicContextMenu(DateTime datePointer)
        {
            ContextMenu contextMenu = new ContextMenu();

            MenuItem addMemoItem = new MenuItem { Header = "메모 추가", Tag = "AddMemo" };
            addMemoItem.Click += AddContents_Btn;
            contextMenu.Items.Add(addMemoItem);

            MenuItem addTaskItem = new MenuItem { Header = "과업 추가", Tag = "AddTask" };
            addTaskItem.Click += AddContents_Btn;
            contextMenu.Items.Add(addTaskItem);

            MenuItem addScheduleItem = new MenuItem { Header = "일정 추가", Tag = "AddSchedule" };
            addScheduleItem.Click += AddContents_Btn;
            contextMenu.Items.Add(addScheduleItem);

            contextMenu.Tag = datePointer;

            return contextMenu;
        }

        /// <summary>
        /// 컨텍스트 메뉴 항목 클릭 시 호출되는 이벤트 핸들러입니다.
        /// </summary>
        private void AddContents_Btn(object sender, RoutedEventArgs e)
        {
            if (sender is MenuItem btn && btn.Tag is string action)
            {
                if (btn.Parent is ContextMenu contextMenu && contextMenu.PlacementTarget is Border border && border.Tag is DateTime datePointer)
                {
                    switch (action)
                    {
                        case "AddMemo":
                            MemoEditor m_editor = new MemoEditor(datePointer);
                            m_editor.Show();
                            break;
                        case "AddTask":
                            TaskEditor t_editor = new TaskEditor(datePointer);
                            t_editor.Show();
                            break;
                        case "AddSchedule":
                            ScheduleEditor s_editor = new ScheduleEditor();
                            s_editor.Show();
                            break;
                    }
                }
            }
        }
    }
}
