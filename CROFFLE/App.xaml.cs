using CroffleLogManager;

namespace CROFFLE
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();

            Log.LogInfo("[App] App has been initialized.");
            MainPage = new AppShell();
        }
    }
}
