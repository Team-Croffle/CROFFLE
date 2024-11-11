using DataManager.Json;
using System.Reflection;

namespace CROFFLE_Core.Plugins
{
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
            InitializePlugins();
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
                _jsonManager.FindItem(key, out var value);
                if (value is null) { continue; }
                jm.LoadJObject(value);
                jm.FindItem("FileName", out var file);
                if (file is null) { continue; }

                var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, file);
                
                var assembly = Assembly.LoadFile(path);
                if (assembly is null) { continue; }

                var types = assembly.GetTypes();
                foreach (var type in types)
                {
                    if (type.GetInterface(nameof(IPlugin)) is null) { continue; }
                    var obj = Activator.CreateInstance(type);
                    if (obj is null) { continue; }
                    _plugins.Add((IPlugin)obj);
                }
            } // foreach
        } // GetPlugins

        void InitializePlugins()
        {
            foreach (var plugin in _plugins)
            {
                plugin.Initialize();
            }
        } // InitializePlugins

        public IEnumerable<string> GetPluginNames()
        {
            List<string> names = new();
            foreach (var plugin in _plugins)
            {
                names.Add(plugin.Name);
            }
            return names;
        } // GetPluginNames
    } // PluginManager
} // namespace CROFFLE_Core.Plugins