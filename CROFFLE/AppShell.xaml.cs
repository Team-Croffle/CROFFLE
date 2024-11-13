using CROFFLE.xamls.Views;
using CROFFLE_Core.Plugins;
using CroffleLogManager;

namespace CROFFLE
{
    public partial class AppShell : Shell
    {
        public AppShell()
        {
            InitializeComponent();
            LoadPlugins();
            AddMenuItem();
        }

        private void LoadPlugins()
        {
            PluginManager pluginManager = new();
            pluginManager.InitializePlugins();
            foreach (var p in pluginManager.Plugins)
            {
                var flyoutitem = p.GetFlyoutItem();
                if (flyoutitem is not null) Items.Add(flyoutitem);
                else continue;
            }
        }

        private void AddMenuItem()
        {
            MenuItem setting = new MenuItem()
            {
                Text = "Setting",
                Command = new Command(async () =>
                {
                    await Current.GoToAsync("Setting");
                })
            };
            Items.Add(setting);

            MenuItem about = new MenuItem()
            {
                Text = "About",
                Command = new Command(async () =>
                {
                    await Current.GoToAsync("About");
                })
            };
            Items.Add(about);

        }
    }
}
