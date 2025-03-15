using CROFFLE_Core.Plugins;
using CroffleLogManager;
using DataManager.Json;
using Plugin_Waffle.WaffleConn;
using Plugin_Waffle.xamls;

namespace Plugin_Waffle;

// All the code in this file is included in all platforms.
public class PluginWaffle : IPlugin
{
    public string Name => "PluginWaffle";
    public string Description => "A plugin that provides waffle-related functionality.";
    public string Version => "1.0.0";
    public string Author => "CROFFLE";

    public string[] Dependencies => [];

    public void AddPlugin()
    {
        JsonManager jm = new("plugins.json");
        var res = jm.LoadJObject();
        if (res is false) return;

        jm.AddItem("PluginWaffle", new
        {
            FileName = "Plugin_Waffle.dll",
            Name,
            Description,
            Version,
            Author,
            Dependencies,
        });

        jm.SaveJObject();
    }

    public void Initialize()
    {
        Log.LogInfo("[PluginWaffle] Initialize: Waffle plugin has been initialized.");
        Routing.RegisterRoute("WafflePage", typeof(WafflePage));
        Routing.RegisterRoute("WaffleEditor", typeof(WaffleEditor));
        Routing.RegisterRoute("WaffleNoticePage", typeof(WaffleNoticePage));
        Routing.RegisterRoute("WaffleLoginPage", typeof(WaffleLoginPage));
        BackgroundTask();
    }

    public void BackgroundTask()
    {
        WaffleProfile sp = new();
        if (sp.TryLogin() is not 1)
        {
            Log.LogError("[PluginWaffle] BackgroundTask: Waffle login failed.");
            return;
        }
        if (sp.UpdateWaffle() is 1)
        {
            return;
        }
        Log.LogError("[PluginWaffle] BackgroundTask: Waffle data update failed.");
    }

    public FlyoutItem[]? GetFlyoutItem()
    {
        FlyoutItem[] flyoutItems =
        {
            new()
            {
                Title = "Waffle Tasks",
                Items =
                {
                    new ShellContent()
                    {
                        Title = "Waffle Tasks",
                        ContentTemplate = new DataTemplate(() => new WafflePage()),
                        Route = "WafflePage",
                    }
                }
            }, // Waffle Tasks

            new()
            {
                Title = "Waffle Notice (개발 중)",
                Items =
                {
                    new ShellContent()
                    {
                        Title = "Waffle Notice",
                        ContentTemplate = new DataTemplate(() => new WaffleNoticePage()),
                        Route = "WaffleNoticePage",
                    }
                }
            }, // Waffle Notice

        };
        return flyoutItems;
    }

    public Tab[]? GetSettingContent()
    {
        Tab[] settingItems =
        {
            new()
            {
                Title = "Waffle",
                Items =
                {
                    new ShellContent()
                    {
                        Title = "Waffle Login",
                        ContentTemplate = new DataTemplate(() => new WaffleLoginPage()),
                        Route = "WaffleLoginPage",
                    },
                },
            }, // Waffle Editor
        };
        return settingItems;
        //return null;
    }
}
