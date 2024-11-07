using CROFFLE.xamls.Views;
using System.Collections.ObjectModel;


namespace CROFFLE
{
    public partial class MainPage : ContentPage
    {
        private DateTime date = DateTime.Today;

        public MainPage()
        {
            InitializeComponent();

            //Cal_view.LoadCalendar(date);
        }

        private void OnNavigateClicked(object sender, EventArgs e)
        {
            Shell.Current.FlyoutIsPresented = true;
        }
    }

}
