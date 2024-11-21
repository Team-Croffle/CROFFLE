using CroffleLogManager;
using Plugin_Waffle.DB_Scheme;
using Plugin_Waffle.WaffleConn;

namespace Plugin_Waffle.xamls;

public partial class WafflePage : ContentPage
{

    public WafflePage()
	{
		InitializeComponent();
    }

    private void OnLoaded(object sender, EventArgs e)
    {
        Log.LogInfo("[WafflePage] OnLoaded");

        WaffleProfile wp = new();
        wp.TryLogin();
        if (WaffleLoginInfo.IsLogin is true)
        {
            lb_un.Text = $@"사용자: {WaffleLoginInfo.SNO?.Substring(0, 5)}*** | {WaffleLoginInfo.USERNAME} 님";
            WaffleLoginInfo.IsLogin = true;
        }
        else
        {
            lb_un.Text = "WAFFLE에 로그인되어있지 않습니다.";
            return;
        }
    }

    void OnRefreshClicked(object sender, EventArgs e)
    {
        Log.LogInfo("[WafflePage] OnRefreshClicked");
        WaffleProfile wp = new();
        wp.TryLogin();
        wp.UpdateWaffle();
        Load_VSL();
    }

    void LoadWaffle_VSL(object sender, EventArgs e)
    {
        Load_VSL();
    }

    void Load_VSL()
    {
        Log.LogInfo("[WafflePage] LoadWaffle_VSL");

        WaffleView waffle = new();
        waffle.LoadWaffles();
        
        var count = waffle.Count();
        Log.LogInfo($"[WafflePage] LoadWaffle_VSL: count={count}");
        
        if (count is null) return;
        if (count is 0) return;
        if (waffle.ListAll is null) return;

        vsl_waffle.Children.Clear();

        //if(true)
        foreach (var wcontent in waffle.ListAll)
        {
            VerticalStackLayout vsl = new()
            {
                BackgroundColor = Color.FromInt(wcontent.Color),
                //BackgroundColor = Colors.RoyalBlue,
                Spacing = 0,
                HorizontalOptions = LayoutOptions.Fill,
            };
            vsl.Children.Add(new Label()
            {
                Text = wcontent.Title,
                //Text = "Test Title",
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
                Text = wcontent.ContentDate.ToString("yyyy-MM-dd"),
                //Text = $@"Test Date - {DateTime.Now: yyyy-MM-dd}",
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
                Text = wcontent.ContentID,
                //Text = "Test ContentID",
                TextColor = Colors.Transparent,
                BackgroundColor = Colors.Transparent,
                Margin = new Thickness(0, 0, 0, 0),
                Padding = new Thickness(0, 0, 0, 0),
                BorderWidth = 2,
                BorderColor = Colors.Black,
                CornerRadius = 0,
            };
            btn.Clicked += NavWaffle;
            grid.Children.Add(btn);
            vsl_waffle.Children.Add(grid);
        }
    }

    void NavWaffle(object? sender, EventArgs e)
    {
        if (sender is null) return;
        Button btn = (Button)sender;
        Log.LogInfo("[WafflePage] NavWaffle");
        ShellNavigationQueryParameters shellNavQueryParams = new() { { "query", $@"contentID={btn.Text}" } };
        Shell.Current.GoToAsync("WaffleEditor", shellNavQueryParams);
    }

    void NavPreviousMain(object? sender, EventArgs e)
    {
        Log.LogInfo("[WafflePage] NavPreviousMain");
        Shell.Current.GoToAsync("//MainPage");
    }
    void OnPointerEntered(object? sender, PointerEventArgs e)
    {
        if (sender is null) return;
        var obj = (Button)sender;
        obj.BackgroundColor = new Color(0x7F, 0x7F, 0x7F, 0x7F);
    }

    void OnPointerExited(object ?sender, PointerEventArgs e)
    {
        if (sender is null) return;
        var obj = (Button)sender;
        obj.BackgroundColor = Colors.Transparent;
    }
}