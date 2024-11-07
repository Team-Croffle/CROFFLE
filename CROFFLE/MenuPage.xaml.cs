namespace CROFFLE;

public partial class MenuPage : ContentPage
{
	public MenuPage()
	{
		InitializeComponent();
    }

    private void OnNavigateClicked(object sender, EventArgs e)
    {
        Shell.Current.FlyoutIsPresented = true;
    }
    private void OnNavigateClicked2(object sender, EventArgs e)
    {
        //Light mode
        var current = App.Current;
        if (current != null)
        {
            if (current.RequestedTheme == AppTheme.Light)
            {
                current.UserAppTheme = AppTheme.Dark;
            }
            else
            {
                current.UserAppTheme = AppTheme.Light;
            }
        }
    }
}