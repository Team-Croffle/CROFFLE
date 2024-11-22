using CroffleLogManager;
using Plugin_Waffle.DB_Scheme;

namespace Plugin_Waffle.xamls;

[QueryProperty(nameof(QueryString), "query")]
public partial class WaffleEditor : ContentPage
{
    private string contentID = "";
    private VWaffle? _waffle;
    
    public string QueryString
    {
        set
        {
            //Log.LogInfo($@"[TaskEditor] QueryString: {value}");
            var query = Uri.UnescapeDataString(value);
            var type = query.Split('=')[0];
            var data = query.Split('=')[1];
            if (type == "contentID") contentID = data;
        }
    }

    public WaffleEditor()
	{
		InitializeComponent();
	}

    private async void OnLoaded(object sender, EventArgs e)
    {
        Log.LogInfo("[WaffleEditor] OnLoaded");
        if (contentID == "" || contentID == string.Empty)
        {
            Log.LogError("[WaffleEditor] contentID is empty");
            await DisplayAlert("Error", "컨텐츠를 찾을 수 없습니다.", "OK");
            await Shell.Current.GoToAsync("//MainPage/WafflePage");
            return;
        }

        _waffle = new WaffleView().LoadComponent(contentID);
        if (_waffle is null)
        {
            Log.LogError("[WaffleEditor] _waffle is null");
            await DisplayAlert("Error", "컨텐츠를 찾을 수 없습니다.", "OK");
            await Shell.Current.GoToAsync("//MainPage/WafflePage");
            return;
        }

        lb_lctr_mn.Text = _waffle.WLctrName;
        lb_waffle_type.Text = _waffle.WType;
        lb_title.Text = _waffle.WTitle;
        lb_date.Text = $@"~ {_waffle.StartTime: yyyy-MM-dd HH:mm}";

        if (_waffle.Done)
        {
            btn_done.BackgroundColor = Colors.Green;
            btn_done.Text = "완료됨";
        }
        else
        {
            if (_waffle.StartTime < DateTime.Now)
            {
                btn_done.BackgroundColor = Colors.IndianRed;
                btn_done.Text = "미완료";
            }
            else
            {
                btn_done.BackgroundColor = Colors.RoyalBlue;
                btn_done.Text = "진행중";
            }
        }

    }

    private async void NavPreviousEditor(object sender, EventArgs e)
    {
		Log.LogInfo("[WaffleEditor] NavPreviousEditor");
		await Shell.Current.GoToAsync("//MainPage/WafflePage");
    }
    void OnPointerEntered(object? sender, PointerEventArgs e)
    {
        if (sender is null) return;
        var obj = (Button)sender;
        obj.BackgroundColor = new Color(0x7F, 0x7F, 0x7F, 0x7F);
    }

    void OnPointerExited(object? sender, PointerEventArgs e)
    {
        if (sender is null) return;
        var obj = (Button)sender;
        obj.BackgroundColor = Colors.Transparent;
    }
}