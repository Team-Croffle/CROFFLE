using DataManager.Json;
using System.Reflection;

namespace CROFFLE_Core.Plugins
{
    public interface IPlugin
    {
        public string Name { get; }
        public string Description { get; }
        public string Version { get; }
        public string Author { get; }
        public string[] Dependencies { get; }
        public string Path { get; }
        public bool IsEnabled { get; }
        public ContentPage? ContentPage { get; internal set; }
        public void Initialize();
    }

    public class PluginManager
    {
        JsonManager _jsonManager;
        public List<IPlugin> _plugins;

        public PluginManager()
        {
            _jsonManager = new("plugins.json");
            _plugins = new();
            LoadPlugins();
        } // PluginManager

        void LoadPlugins()
        {
            GetPlugins();
            foreach (var plugin in _plugins)
            {
                plugin.Initialize();
            }
        }
        void GetPlugins()
        {
            var result = _jsonManager.LoadJObject();
            if (result is false) { return; }
            _jsonManager.GetKeys(out var keys);
            if (keys is null) { return; }

            JsonManager jm = new();

            foreach (var key in keys)
            {
                jm.LoadJObject(key);
                jm.FindItem("Path", out var path);

                var assembly = Assembly.LoadFile(path);
                if (assembly is null) { continue; }

                var types = assembly.GetTypes();
                foreach (var type in types)
                {
                    if (type.GetInterface("IPlugin") is null) { continue; }
                    var obj = Activator.CreateInstance(type);
                    if (obj is null) { continue; }
                    _plugins.Add((IPlugin)obj);
                }
            } // foreach
        } // GetPlugins
    } // PluginManager
} // namespace CROFFLE_Core.Plugins