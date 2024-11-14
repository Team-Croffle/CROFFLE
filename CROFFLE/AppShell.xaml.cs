using CROFFLE.xamls.Views;
using CROFFLE.xamls.Views.SettingPages;
using CROFFLE_Core.Plugins;
using CroffleLogManager;
using DataManager.SQLiteDBMS.Scheme;

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
                if (flyoutitem is not null)
                {
                    foreach (var item in flyoutitem)
                    {
                        Items.Add(item);
                    }
                }

                var setting_item = p.GetSettingContent();
                if (setting_item is not null)
                {
                    foreach (var item in setting_item)
                    {
                        tab_Settings.Items.Add(item);
                    }
                }
            }

        } // LoadPlugins

        private void AddMenuItem()
        {
            ShellContent setting = new()
            {
                Title = "Settings",
                ContentTemplate = new DataTemplate(typeof(GeneralSettings)),
                Route = "SettingPages"
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
