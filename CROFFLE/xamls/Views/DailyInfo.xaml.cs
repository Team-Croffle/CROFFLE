using AnniversaryAPI;
using AnniversaryAPI.Scheme;
using CroffleLogManager;
using DataManager.View;

namespace CROFFLE.xamls.Views;

[QueryProperty(nameof(CalendarDate), "date")]
public partial class DailyInfo : ContentPage
{
    bool isSchedule = true;
    bool isTask = true;
    bool isMemo = true;

    DateTime calendarDate;

    public string CalendarDate
    {
        get => calendarDate.ToString();
        set
        {
            calendarDate = DateTime.Parse(Uri.UnescapeDataString(value));
            lb_date.Text = calendarDate.ToString("yyyy년 MM월 dd");
        }
    }

    public DailyInfo()
    {
        InitializeComponent();
    }

    private void LoadedDaily(object sender, EventArgs e)
    {
        Log.LogInfo($@"[DailyInfo] LoadedDaily: {calendarDate:yyyy-MM-dd}");
        if (sender is null) return;
        
        SQLiteDBAnnv annv = new();
        annv.DB_Init();
        var annvList = annv.GetItems<Anniversary>(x => x.locdate == calendarDate);
        if (annvList is null) return;
        foreach (var item in annvList)
        {
            DataTemplate template = (DataTemplate)Resources["DailyLabel"];
        
            Label lb = (Label)template.CreateContent();
            lb.Text = item.dateName;
        
            if (item.isHoliday)
            {
                lb.TextColor = Colors.Red;
                lb_date.TextColor = Colors.Red;
            }
        
            vsl_daily.Children.Add(lb);
        }
        //Log.LogInfo($@"[DailyInfo] LoadedDaily: Done");
    }

    public void LoadComplete_VSL()
    {
        if (vsl_complete is null) return;
        if (vsl_complete.Children is not null) vsl_complete.Children.Clear();
        //Log.LogInfo("[DailyInfo] LoadComplete_VSL: Children Cleared");
        Load_VSL_Memo(vsl_complete);
        Load_VSL(vsl_complete, true);
    }
    public void LoadIncomplete_VSL()
    {
        if (vsl_incomplete is null) return;
        if (vsl_incomplete.Children is not null) vsl_incomplete.Children.Clear();
        //Log.LogInfo("[DailyInfo] LoadIncomplete_VSL: Children Cleared");
        Load_VSL(vsl_incomplete, false);
    }

    private void LoadComplete_VSL(object sender, EventArgs e)
    {
        Log.LogInfo("[DailyInfo] LoadComplete_VSL");
        LoadComplete_VSL();
    }

    private void LoadIncomplete_VSL(object sender, EventArgs e)
    {
        Log.LogInfo("[DailyInfo] LoadIncomplete_VSL");
        LoadIncomplete_VSL();
    }

    private void Load_VSL_Memo(VerticalStackLayout sender)
    {
        //Log.LogInfo("[DailyInfo] Load_VSL_Memo");
        MemoView memoView = new();
        memoView.LoadMemo(calendarDate, calendarDate.AddDays(1));
        var count = memoView.Count();
        //Log.LogInfo($@"[DailyInfo] Load_VSL_Memo: {count}");

        if (count is null) return;
        if (count == 0) return;
        if (memoView.ListAll is null) return;
        foreach (var memo in memoView.ListAll)
        {
            if (memo is null) continue;

            VerticalStackLayout vsl = new()
            {
                BackgroundColor = Color.FromInt(memo.Color),
                Spacing = 0,
            };
            vsl.Children.Add(new Label()
            {
                Text = memo.Title,
                FontFamily = "KCC-Ganpan",
                FontSize = DeviceInfo.Platform == DevicePlatform.iOS ? 20 :
                            DeviceInfo.Platform == DevicePlatform.Android ? 22 : 24,
                TextColor = Colors.White,
                HorizontalTextAlignment = TextAlignment.Start,
                VerticalTextAlignment = TextAlignment.Start,
                Margin = new Thickness(10, 10, 10, 0),
            });
            vsl.Children.Add(new Label()
            {
                Text = memo.ContentDate.ToString("yyyy-MM-dd"),
                FontFamily = "KCC-Ganpan",
                FontSize = DeviceInfo.Platform == DevicePlatform.iOS ? 16 :
                            DeviceInfo.Platform == DevicePlatform.Android ? 18 : 20,
                TextColor = Colors.LightGray,
                HorizontalTextAlignment = TextAlignment.Start,
                VerticalTextAlignment = TextAlignment.Start,
                Margin = new Thickness(10, 0, 10, 10),
            });

            Grid grid = new();
            grid.Children.Add(vsl);
            Button btn = new()
            {
                Text = memo.ContentsID,
                CommandParameter = "Memo",
                TextColor = Colors.Transparent,
                BackgroundColor = Colors.Transparent,
                Margin = new Thickness(0, 0, 0, 0),
                Padding = new Thickness(0, 0, 0, 0),
                BorderWidth = 0,
            };
            btn.Clicked += OnEditClicked;
            grid.Children.Add(btn);
            sender.Children.Add(grid);
        }
    }

    private void Load_VSL(VerticalStackLayout sender, bool complete)
    {
        //Log.LogInfo($@"[DailyInfo] Load_VSL: {complete}");
        ComponentAllView componentAllView = new();
        componentAllView.LoadComponent(calendarDate, complete);

        if (componentAllView.ListAll is null) return;
        var count = componentAllView.ListAll.Count();
        Log.LogInfo($@"[DailyInfo] Load_VSL: {count}");

        //var hasValue = Resources.TryGetValue("Medium", out var style);
        if (count == 0) return;
        foreach (ComponentAll component in componentAllView.ListAll)
        {
            if (component is null) continue;
            if (!isSchedule && component.Type == "Schedule") continue;
            if (!isTask && component.Type == "Task") continue;

            VerticalStackLayout vsl = new()
            {
                BackgroundColor = Color.FromInt(component.Color),
                Spacing = 0,
            };
            vsl.Children.Add(new Label()
            {
                Text = component.Title,
                FontFamily = "KCC-Ganpan",
                FontSize = DeviceInfo.Platform == DevicePlatform.iOS ? 20 :
                            DeviceInfo.Platform == DevicePlatform.Android ? 22 : 24,
                TextColor = Colors.White,
                HorizontalTextAlignment = TextAlignment.Start,
                VerticalTextAlignment = TextAlignment.Start,
                Margin = new Thickness(10, 10, 10, 0),
            });
            vsl.Children.Add(new Label()
            {
                Text = component.StartTime.ToString("yyyy-MM-dd HH:mm") + " ~ " + component.EndTime.ToString("yyyy-MM-dd HH:mm"),
                FontFamily = "KCC-Ganpan",
                FontSize = DeviceInfo.Platform == DevicePlatform.iOS ? 16 :
                            DeviceInfo.Platform == DevicePlatform.Android ? 18 : 20,
                TextColor = Colors.LightGray,
                HorizontalTextAlignment = TextAlignment.Start,
                VerticalTextAlignment = TextAlignment.Start,
                Margin = new Thickness(10, 0, 10, 10),
            });

            Grid grid = new();
            grid.Children.Add(vsl);
            Button btn = new()
            {
                Text = component.ContentsID,
                CommandParameter = component.Type,
                TextColor = Colors.Transparent,
                BackgroundColor = Colors.Transparent,
                Margin = new Thickness(0, 0, 0, 0),
                Padding = new Thickness(0, 0, 0, 0),
                BorderWidth = 0,
            };

            btn.Clicked += OnEditClicked;
            grid.Children.Add(btn);
            sender.Children.Add(grid);
        }
    }

    private void Btn_Shedule_SW(object sender, EventArgs e)
    {
        if (sender is null) return;
        var btn = (Button)sender;
        if (btn == btn_schedule)
        {
            //Log.LogInfo("[DailyInfo] Btn_Shedule_SW Clicked");
            if (isSchedule)
            {
                btn_schedule.BackgroundColor = Colors.LightGray;
                isSchedule = false;
            }
            else
            {
                btn_schedule.BackgroundColor = Color.FromArgb("FF5757");
                isSchedule = true;
            }
            //Log.LogInfo($@"[DailyInfo] Btn_Shedule_SW: {isSchedule}");
        }
        if (btn == btn_task)
        {
            //Log.LogInfo("[DailyInfo] Btn_Shedule_SW Clicked");
            if (isTask)
            {
                btn_task.BackgroundColor = Colors.LightGray;
                isTask = false;
            }
            else
            {
                btn_task.BackgroundColor = Color.FromArgb("0CC0DF");
                isTask = true;
            }
            //Log.LogInfo($@"[DailyInfo] Btn_Shedule_SW: {isTask}");
        }
        if (btn == btn_memo)
        {
            //Log.LogInfo("[DailyInfo] Btn_Shedule_SW Clicked");
            if (isMemo)
            {
                btn_memo.BackgroundColor = Colors.LightGray;
                isMemo = false;
            }
            else
            {
                btn_memo.BackgroundColor = Color.FromArgb("7ED957");
                isMemo = true;
            }
            //Log.LogInfo($@"[DailyInfo] Btn_Shedule_SW: {isMemo}");
        }
        LoadComplete_VSL();
        LoadIncomplete_VSL();
    } // Btn_Shedule_SW

    private async void Btn_AddClicked(object sender, EventArgs e)
    {
        //Log.LogInfo("[DailyInfo] NavAdd");
        string action = await DisplayActionSheet("추가할 항목을 선택하세요", "Cancel", null, "Schedule", "Task", "Memo");

        ShellNavigationQueryParameters navigationParameter = new()
        {
            { "query", $@"startTime={calendarDate}" }
        };

        if (action == "Cancel") return;
        if (action is null) return;
        Log.LogInfo($@"[DailyInfo] NavAdd: {action}");
        await Shell.Current.GoToAsync($@"{action}Editor", navigationParameter);
    } // Btn_AddClicked

    private void Test_AddComponent(VerticalStackLayout obj)
    {
        Grid grid = new()
        {
            BackgroundColor = Colors.RoyalBlue,
            RowDefinitions = new RowDefinitionCollection
            {
                new RowDefinition { Height = GridLength.Auto },
                new RowDefinition { Height = GridLength.Auto },
            },
        };
        Label lb = new ()
        {
            Text = "Test title",
            FontFamily = "KCC-Ganpan",
            FontSize = DeviceInfo.Platform == DevicePlatform.iOS ? 20 :
                        DeviceInfo.Platform == DevicePlatform.Android ? 22 : 24,
            TextColor = Colors.White,
            HorizontalTextAlignment = TextAlignment.Start,
            VerticalTextAlignment = TextAlignment.Start,
            Margin = new Thickness(10, 10, 10, 0),
        };
        Grid.SetRow(lb, 0);
        grid.Children.Add(lb);
        Label lb2 = new ()
        {
            Text = "Test-Date",
            FontFamily = "KCC-Ganpan",
            FontSize = DeviceInfo.Platform == DevicePlatform.iOS ? 16 :
                        DeviceInfo.Platform == DevicePlatform.Android ? 18 : 20,
            TextColor = Colors.LightGray,
            HorizontalTextAlignment = TextAlignment.Start,
            VerticalTextAlignment = TextAlignment.Start,
            Margin = new Thickness(10, 0, 10, 10),
        };
        Grid.SetRow(lb2, 1);
        grid.Children.Add(lb2);

        Button btn = new()
        {
            Text = "",
            BackgroundColor = Colors.Transparent,
            Margin = new Thickness(0, 0, 0, 0),
            Padding = new Thickness(0, 0, 0, 0),
            Command = new Command(() =>
            {
                //Log.LogInfo($@"[DailyInfo] Button Clicked");
                Shell.Current.GoToAsync($@"ScheduleEditor?contentsID=testid");
            }),
            BorderWidth = 1,
            CornerRadius = 0,
            BorderColor = Colors.Gray,
        };
        Grid.SetRow(btn, 0);
        Grid.SetRowSpan(btn, 2);
        grid.Children.Add(btn);
        obj.Children.Add(grid);
    }


    void OnPointerEntered(object sender, PointerEventArgs e)
    {
        if (sender is null) return;
        var obj = (Button)sender;
        obj.BackgroundColor = new Color(0x7F, 0x7F, 0x7F, 0x7F);
    }
    void OnPointerExited(object sender, PointerEventArgs e)
    {
        if (sender is null) return;
        var obj = (Button)sender;
        obj.BackgroundColor = Colors.Transparent;
    }

    async void OnEditClicked(object? sender, EventArgs e)
    {
        if (sender is null) return;
        Button btn = (Button)sender;
        //Log.LogInfo($@"[DailyInfo] Button Clicked: {btn.Text}");
        //Log.LogInfo($@"[DailyInfo] Button Clicked: {btn.CommandParameter}");
        var type = btn.CommandParameter;
        ShellNavigationQueryParameters shellNavQueryParams = new() { { "query", $@"contentID={btn.Text}" } };
        await Shell.Current.GoToAsync($@"{type}Editor", shellNavQueryParams);
    }
} // CROFFLE.xamls.Views.DailyInfo