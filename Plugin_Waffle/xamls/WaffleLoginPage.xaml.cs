using CroffleLogManager;
using Plugin_Waffle.WaffleConn;

namespace Plugin_Waffle.xamls;

public partial class WaffleLoginPage : ContentPage
{
    public WaffleLoginPage()
    {
        InitializeComponent();
    }

    void OnLoaded(object sender, EventArgs e)
    {
        Log.LogInfo("[WaffleLoginPage] OnLoaded");
        if (WaffleLoginInfo.IsLogin)
        {
            vsl_no_login.IsVisible = false;
            vsl_login.IsVisible = true;

            lb_login_hello.Text = $@"{WaffleLoginInfo.SNO} {WaffleLoginInfo.USERNAME}님 안녕하세요!";
        }
        else
        {
            vsl_no_login.IsVisible = true;
            vsl_login.IsVisible = false;
        }
    }

    private async void OnLoginClicked(object sender, EventArgs e)
    {
        Log.LogInfo("[WaffleLoginPage] OnLoginClicked");

        if (entry_userid.Text is "" or null)
        {
            await DisplayAlert("Error", "아이디를 입력해주세요.", "OK");
            return;
        }
        if (entry_passwd.Text is "" or null)
        {
            await DisplayAlert("Error", "비밀번호를 입력해주세요.", "OK");
            return;
        }

        WaffleProfile profile = new();
        profile.SetUser(entry_userid.Text, entry_passwd.Text);
        var res = profile.TryLogin();

        if (res is not 1)
        {
            Log.LogError("[WaffleLoginPage] OnLoginClicked: failed");
            await DisplayAlert("Error", "로그인에 실패했습니다.", "OK");
            return;
        }

        profile.UpdateWaffle();

        OnLoaded(sender, e);
    }

    private async void OnLogoutClicked(object sender, EventArgs e)
    {
        Log.LogInfo("[WaffleLoginPage] OnLogoutClicked");
        WaffleProfile profile = new();
        var res = profile.Logout();

        if (res is not 1)
        {
            Log.LogError("[WaffleLoginPage] OnLogoutClicked failed");
            await DisplayAlert("Error", "로그아웃 중 오류가 발생했습니다.", "OK");
            return;
        }

        OnLoaded(sender, e);
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

    void OnPwHideClicked(object? sender, EventArgs e)
    {
        if (sender is null) return;
        if (entry_passwd.IsPassword)
        {
            entry_passwd.IsPassword = false;
            ((Button)sender).Text = "\uEAE7";
        }
        else
        {
            entry_passwd.IsPassword = true;
            ((Button)sender).Text = "\uEA70";
        }
    }
}