using AnniversaryAPI;
using AnniversaryAPI.Scheme;
using CroffleLogManager;
using DataManager.SQLiteDBMS;
using DataManager.View;

namespace CROFFLE.xamls.Views;

[QueryProperty(nameof(CalendarDate), "date")]
public partial class DailyInfo : ContentPage
{
    bool isShedule = true;
    bool isTask = true;
    bool isMemo = true;

    DateTime calendarDate;


    public string CalendarDate
    {
        get => calendarDate.ToString();
        set
        {
            calendarDate = DateTime.Parse(Uri.UnescapeDataString(value));
            lb_date.Text = calendarDate.ToString("yyyy³â MM¿ù dd");
        }
    }

    public DailyInfo()
    {
        InitializeComponent();
    }

    private void LoadedDaily(object sender, EventArgs e)
    {
        if (sender is null) return;

        SQLiteDBAnnv annv = new();
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
    }

    private void LoadComplete_VSL(object sender, EventArgs e)
    {
        if (sender is null) return;
        ComponentAllView componentAllView = new();
        componentAllView.LoadComponent(calendarDate, true);
        var count = componentAllView.Count();

        //var hasValue = Resources.TryGetValue("Medium", out var style);
        if (count is null) return;
        if (count == 0) return;
        for (int i = 0; i < count; i++)
        {
            var component = componentAllView[i];
            if (component is null) continue;

            VerticalStackLayout vsl = new()
            {
                BackgroundColor = Color.FromInt(component.Color),
                Spacing = 0,
            };
            vsl.AddLogicalChild(new Label()
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
            vsl.AddLogicalChild(new Label()
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
            grid.Children.Add( new Button()
            {
                Text = "",
                BackgroundColor = Colors.Transparent,
                Margin = new Thickness(0, 0, 0, 0),
                Padding = new Thickness(0, 0, 0, 0),
                Command = new Command(() =>
                    {
                        Log.LogInfo($@"[DailyInfo] Button Clicked: {component.ContentsID}");
                        Routing.RegisterRoute("Detail", typeof(Detail));
                        Shell.Current.GoToAsync($"Detail?contentsID={component.ContentsID}");
                    }),
                BorderWidth = 0,
            });
        }
    }

    private void LoadIncomplete_VSL(object sender, EventArgs e)
    {
        if (sender is null) return;
        ComponentAllView componentAllView = new();
        componentAllView.LoadComponent(calendarDate, false);
        var count = componentAllView.Count();

        //var hasValue = Resources.TryGetValue("Medium", out var style);
        if (count is null) return;
        if (count == 0) return;
        for (int i = 0; i < count; i++)
        {
            var component = componentAllView[i];
            if (component is null) continue;

            VerticalStackLayout vsl = new()
            {
                BackgroundColor = Color.FromInt(component.Color),
                Spacing = 0,
            };
            vsl.AddLogicalChild(new Label()
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
            vsl.AddLogicalChild(new Label()
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
            grid.Children.Add(new Button()
            {
                Text = "",
                BackgroundColor = Colors.Transparent,
                Margin = new Thickness(0, 0, 0, 0),
                Padding = new Thickness(0, 0, 0, 0),
                Command = new Command(() =>
                {
                    Log.LogInfo($@"[DailyInfo] Button Clicked: {component.ContentsID}");
                    Routing.RegisterRoute("Detail", typeof(Detail));
                    Shell.Current.GoToAsync($"Detail?contentsID={component.ContentsID}");
                }),
                BorderWidth = 0,
            });
        }
    }

    private void Btn_Shedule_SW(object sender, EventArgs e)
    {
        if (sender is null) return;
        var btn = (Button)sender;
        if (btn == btn_schedule)
        {
            if (isShedule)
            {
                btn_schedule.BackgroundColor = Colors.LightGray;
                isShedule = false;
            }
            else
            {
                btn_schedule.BackgroundColor = Color.FromArgb("ff5757");
                isShedule = true;
            }
        }
        if (btn == btn_task)
        {
            if (isTask)
            {
                btn_task.BackgroundColor = Colors.LightGray;
                isTask = false;
            }
            else
            {
                btn_task.BackgroundColor = Color.FromArgb("0cc0df");
                isTask = true;
            }
        }
        if (btn == btn_memo)
        {
            if (isMemo)
            {
                btn_memo.BackgroundColor = Colors.LightGray;
                isMemo = false;
            }
            else
            {
                btn_memo.BackgroundColor = Color.FromArgb("7ed957");
                isMemo = true;
            }
        }
        InvalidateMeasure();
    } // Btn_Shedule_SW
} // CROFFLE.xamls.Views.DailyInfo