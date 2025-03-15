using CroffleLogManager;

namespace CROFFLE;

public partial class MainPage : ContentPage
{
    public MainPage()
    {
        InitializeComponent();

        //Log.LogInfo("[MainPage] MainPage initialized.");
        //Cal_view.LoadCalendar(date);
    }

    private void OnNavigateClicked(object sender, EventArgs e)
    {
        Shell.Current.FlyoutIsPresented = true;
    }
}
