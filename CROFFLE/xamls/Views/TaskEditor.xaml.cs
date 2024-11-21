using CroffleLogManager;
using DataManager.SQLiteDBMS.Scheme;
using DataManager.View;

namespace CROFFLE.xamls.Views;

[QueryProperty(nameof(QueryString), "query")]
public partial class TaskEditor : ContentPage
{
    private string contentID = "";
    ComponentAll? component;
    List<Alarm> alarmList;
    DateTime startTime;
    Button colorSelected;

    private bool alarm = true;
    private bool done = false;

    public string QueryString
    {
        set
        {
            Log.LogInfo($@"[TaskEditor] QueryString: {value}");
            var query = Uri.UnescapeDataString(value);
            var type = query.Split('=')[0];
            var data = query.Split('=')[1];
            if (type == "contentID") contentID = data;
            else if (type == "startTime") startTime = DateTime.Parse(data);
        }
    }
    public TaskEditor()
	{
		InitializeComponent();
        alarmList = [];
        colorSelected = SColor1Btn;
    }

    private async void OnDelete(object sender, EventArgs e)
    {
        var action = await DisplayAlert("취소", "일정을 삭제하시겠습니까?", "예", "아니오");
        if (action is false) return;

        if (contentID is not "" || contentID != string.Empty) ComponentAllView.DeleteComponent(contentID);
        await Shell.Current.GoToAsync("//MainPage/DailyInfo");
    }

    private void OnLoaded(object sender, EventArgs e)
    {
        Log.LogInfo($@"[TaskEditor] TaskEditor: {contentID}");
        if (contentID != "" || contentID != string.Empty) component = new ComponentAllView().LoadComponent(contentID);

        if (component is null)
        {
            contentID = $@"T{DateTime.Now:yyyyMMddHHmmss}";
            Log.LogInfo($"[TaskEditor] New Task: {contentID}");
            return;
        }
        Log.LogInfo($"[TaskEditor] Edit Task: {component.ContentsID}");

        alarm = component.Alarm;
        done = component.Done;
        if (alarm)
        {
            btn_alarm.Text = "알람 켜짐";
            btn_alarm.BackgroundColor = Colors.RoyalBlue;
        }
        else
        {
            btn_alarm.Text = "알람 꺼짐";
            btn_alarm.BackgroundColor = Colors.Gray;
        }

        datePicker_Start.Date = component.StartTime;
        timePicker_Start.Time = component.StartTime.TimeOfDay;
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

    private void Btn_Alarm_Click(object sender, EventArgs e)
    {
        alarm = !alarm;
        if (alarm)
        {
            btn_alarm.Text = "알람 켜짐";
            btn_alarm.BackgroundColor = Colors.RoyalBlue;
        }
        else
        {
            btn_alarm.Text = "알람 꺼짐";
            btn_alarm.BackgroundColor = Colors.Gray;
        }
    }
    private void Btn_Done_Click(object sender, EventArgs e)
    {
        done = !done;
        if (done)
        {
            btn_done.Text = "일정 완료됨";
            btn_done.BackgroundColor = Colors.Green;
        }
        else
        {
            btn_done.Text = "일정 완료하기";
            btn_done.BackgroundColor = Colors.Gray;
        }
    }

    private async void Btn_CancelClicked(object sender, EventArgs e)
    {
        var action = await DisplayAlert("취소", "편집을 취소하시겠습니까?", "예", "아니오");
        if (action is false) return;

        await Shell.Current.GoToAsync("//MainPage/DailyInfo");
    }

    private async void Btn_SaveClicked(object sender, EventArgs e)
    {
        Log.LogInfo("[TaskEditor] Btn_SaveClicked");

        if (component is null)
        {
            Log.LogInfo("[TaskEditor] Component is created");
            component = new();
            component.ContentsID = contentID;
        }

        if (alarm)
        {
            btn_alarm.Text = "알람 켜짐";
            btn_alarm.BackgroundColor = Colors.RoyalBlue;
        }
        else
        {
            btn_alarm.Text = "알람 꺼짐";
            btn_alarm.BackgroundColor = Colors.Gray;
        }

        component.StartTime = datePicker_Start.Date.Add(timePicker_Start.Time);
        component.EndTime = datePicker_Start.Date.Add(timePicker_Start.Time);
        component.Alarm = alarm;
        component.Title = entry_Subject.Text;
        component.Details = entry_Memo.Text;
        component.Color = colorSelected.BackgroundColor.ToInt();
        component.Type = "Task";
        component.Done = done;
        component.Repeat = false;
        component.Canceled = false;

        ComponentAllView.SaveComponent(component);

        if (alarm)
        {
            Log.LogInfo("[TaskEditor] Alarm is created");
            AlarmView.SaveAlarm(new()
            {
                ContentsID = contentID,
                Type = "Task",
                Title = entry_Subject.Text,
                AlarmTime = (startTime
                    .AddDays(alert_Day_Picker.SelectedIndex)
                    .AddHours(alarmtime_picker.Time.Hours)
                    .AddMinutes(alarmtime_picker.Time.Minutes))
            });
        }
        await Shell.Current.GoToAsync("../");
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