namespace CROFFLE.xamls.Views.SettingPages;

public partial class GeneralSettings : ContentPage
{
	public GeneralSettings()
	{
		InitializeComponent();
	}

	private void OnThemeChanged(object sender, EventArgs e)
    {
        Button button = (Button)sender;
        //Light mode
        var current = App.Current;
        if (current != null)
        {
            if (current.RequestedTheme == AppTheme.Light)
            {
                button.Text = "Dark";
                current.UserAppTheme = AppTheme.Dark;
            }
            else
            {
                button.Text = "Light";
                current.UserAppTheme = AppTheme.Light;
            }
        }
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
    void Btn_SaveClicked(object sender, EventArgs e)
    {
        AppSetting.AutoStart = cb_AutoStart.IsChecked;
        AppSetting.SystemTray = cb_SysTray.IsChecked;
        AppSetting.ShowDone = cb_ShowDone.IsChecked;
        AppSetting.AlarmOn = cb_AlertOn.IsChecked;

        AppSetting.SaveSettings();
    }
}