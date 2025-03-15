using CroffleLogManager;
using DataManager.View;

namespace CROFFLE.xamls.Views;

[QueryProperty(nameof(QueryString), "query")]
public partial class MemoEditor : ContentPage
{
    private string contentID = "";
    private DateTime startTime;
    MemoComponents? component;
    Button colorSelected;

    public string QueryString
    {
        set
        {
            //Log.LogInfo($@"[MemoEditor] QueryString: {value}");
            var query = Uri.UnescapeDataString(value);
            var type = query.Split('=')[0];
            var data = query.Split('=')[1];
            if (type == "contentID") contentID = data;
            else if (type == "startTime") startTime = DateTime.Parse(data);
        }
    }
    public MemoEditor()
	{
		InitializeComponent();
        colorSelected = SColor1Btn;
    }
    private async void OnDelete(object sender, EventArgs e)
    {
        var action = await DisplayAlert("취소", "일정을 삭제하시겠습니까?", "예", "아니오");
        if (action is false) return;

        if (contentID is not "" || contentID != string.Empty) MemoView.DeleteMemo(contentID);
        await Shell.Current.GoToAsync("//MainPage/DailyInfo");
    }

    private void OnLoaded(object sender, EventArgs e)
    {
        //Log.LogInfo($@"[MemoEditor] MemoEditor: {contentID}");
        if (contentID != "" || contentID != string.Empty) component = new MemoView().LoadMemo(contentID);

        if (component is null)
        {
            contentID = $@"M{DateTime.Now:yyyyMMddHHmmss}";
            Log.LogInfo($"[MemoEditor] New Memo: {contentID}");
            return;
        }
        else Log.LogInfo($"[MemoEditor] Edit Memo: {component.ContentsID}");

        entry_Subject.Text = component.Title;
        entry_Memo.Text = component.Details;

        if (component.Color == SColor1Btn.BackgroundColor.ToInt()) colorSelected = SColor1Btn;
        else if (component.Color == SColor2Btn.BackgroundColor.ToInt()) colorSelected = SColor2Btn;
        else if (component.Color == SColor3Btn.BackgroundColor.ToInt()) colorSelected = SColor3Btn;
        else if (component.Color == SColor4Btn.BackgroundColor.ToInt()) colorSelected = SColor4Btn;
        else if (component.Color == SColor5Btn.BackgroundColor.ToInt()) colorSelected = SColor5Btn;
        else if (component.Color == SColor6Btn.BackgroundColor.ToInt()) colorSelected = SColor6Btn;
        colorSelected.BorderWidth = 2;
    }

    private async void Btn_CancelClicked(object sender, EventArgs e)
    {
        var action = await DisplayAlert("취소", "편집을 취소하시겠습니까?", "예", "아니오");
        if (action is false) return;

        await Shell.Current.GoToAsync("DailyInfo");
    }

    private async void Btn_SaveClicked(object sender, EventArgs e)
    {
        //Log.LogInfo("[MemoEditor] Btn_SaveClicked");

        if (component is null)
        {
            Log.LogInfo("[MemoEditor] Component is created");
            component = new();
            component.ContentsID = contentID;
        }
        component.Title = entry_Subject.Text;
        component.Details = entry_Memo.Text;
        component.Color = colorSelected.BackgroundColor.ToInt();
        component.Type = "Memo";
        component.AddedTime = DateTime.Now;
        component.ContentDate = startTime;

        MemoView.SaveMemo(component);

        await Shell.Current.GoToAsync("//MainPage/DailyInfo");
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

    void ColorBtnClick(object sender, EventArgs e)
    {
        if (sender is null) return;
        Button btn = (Button)sender;

        colorSelected.BorderWidth = 0;
        btn.BorderWidth = 2;

        colorSelected = btn;
    }
}