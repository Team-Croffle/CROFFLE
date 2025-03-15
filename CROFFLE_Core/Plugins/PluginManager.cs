using CroffleLogManager;
using DataManager.Json;
using System.Reflection;

namespace CROFFLE_Core.Plugins
{
    public class PluginManager
    {
        JsonManager _jsonManager;
        private List<IPlugin> _plugins;

        public List<IPlugin> Plugins => _plugins;

        public PluginManager()
        {
            Log.LogInfo("[PluginManager] PluginManager initialized.");
            _jsonManager = new("plugins.json");
            _plugins = new();
            GetPlugins();
        } // PluginManager
        void GetPlugins()
        {
            Log.LogInfo("[PluginManager] GetPlugins: Loading plugins.");

            var result = _jsonManager.LoadJObject();
            if (result is false) { return; }
            _jsonManager.GetKeys(out var keys);

            if (keys is null)
            {
                Log.LogInfo("[PluginManager] GetPlugins: No plugins found.");
                return;
            }

            foreach (var key in keys)
            {
                _jsonManager.FindItem(key, "path", out var file);
                if (file is null)
                {
                    Log.LogError("[PluginManager] GetPlugins: No path found.");
                    continue;
                }

                var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, file);
                
                var assembly = Assembly.LoadFile(path);
                if (assembly is null)
                {
                    Log.LogError("[PluginManager] GetPlugins: Assembly is null.");
                    continue;
                }

                var types = assembly.GetTypes();
                foreach (var type in types)
                {
                    if (type.GetInterface(nameof(IPlugin)) is null) continue;
                    Log.LogInfo("[PluginManager] GetPlugins: IPlugin found.");

                    var obj = Activator.CreateInstance(type);
                    if (obj is null)
                    {
                        Log.LogError("[PluginManager] GetPlugins: Activator.CreateInstance failed.");
                        continue;
                    }
                    Log.LogInfo($"[PluginManager] GetPlugins: {((IPlugin)obj).Name} loaded.");
                    _plugins.Add((IPlugin)obj);
                }
            } // foreach
        } // GetPlugins

        public void InitializePlugins()
        {
            foreach (var plugin in _plugins)
            {
                plugin.Initialize();
            }
        } // InitializePlugins

        public IEnumerable<string> GetPluginNames()
        {
            List<string> names = new();
            foreach (var p in _plugins)
            {
                names.Add(p.Name);
            }
            return names;
        } // GetPluginNames
    } // PluginManager
} // namespace CROFFLE_Core.Plugins