using CROFFLE.xamls.Views;
using CROFFLE.xamls.Views.SettingPages;
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
            Log.LogInfo("[AppShell] Loading plugins...");

            PluginManager pluginManager = new();
            pluginManager.InitializePlugins();

            FlyoutItem setting = new() { Title = "Settings" };
            setting.Items.Add(
                new Tab
                {
                    Title = "General",
                    Items =
                    {
                        new ShellContent
                        {
                            Title = "General",
                            ContentTemplate = new DataTemplate(typeof(GeneralSettings)),
                            Route = "GeneralSettings"
                        },
                    }
                }
            );

            foreach (var p in pluginManager.Plugins)
            {
                Log.LogInfo($@"[AppShell] Loading plugin: {p.Name}");
                var flyoutitem = p.GetFlyoutItem();
                if (flyoutitem is not null)
                {
                    foreach (var item in flyoutitem)
                    {
                        Items.Add(item);
                    }
                }

                try
                {
                    var setting_item = p.GetSettingContent();
                    if (setting_item is not null)
                    {
                        foreach (var item in setting_item)
                        {
                            setting.Items.Add(item);
                        }
                    }
                }
                catch (Exception e)
                {
                    Log.LogError($@"[AppShell] {p.Name} failed to load setting content: {e.Message}");
                    continue;
                }
            }
            Items.Add(setting);

        } // LoadPlugins

        private void AddMenuItem()
        {
            Log.LogInfo("[AppShell] Adding menu items...");

            ShellContent about = new()
            {
                Title = "About",
                ContentTemplate = new DataTemplate(typeof(About)),
                Route = "About"
            };
            Items.Add(about);
            Log.LogInfo("[AppShell] Added About menu item.");
        }
    }
}
