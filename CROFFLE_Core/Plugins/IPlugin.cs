namespace CROFFLE_Core.Plugins;

public interface IPlugin
{
    public string Name { get; }
    public string Description { get; }
    public string Version { get; }
    public string Author { get; }
    public string[] Dependencies { get; }
    public void Initialize();
    public void BackgroundTask();
    public FlyoutItem[]? GetFlyoutItem();
    public Tab[]? GetSettingContent();
} // IPlugin
