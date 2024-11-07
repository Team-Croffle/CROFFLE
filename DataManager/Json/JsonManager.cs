using CroffleLogManager;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace DataManager.Json
{
    public class JsonManager
    {
        FileManager _fileManager;
        JObject _jobject;

        public JsonManager(string file_name)
        {
            var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "JSON");
            _fileManager = new(path, file_name);
            _jobject = new();
            LoadJObject();
        } // JsonManager

        public void LoadJObject()
        {
            Log.LogInfo("[JsonManager] LoadJObject: JObject from file");
            var json = _fileManager.ReadAllText();
            _jobject = JsonConvert.DeserializeObject<JObject>(json) ?? new();
            Log.LogInfo("[JsonManager] LoadJObject: JObject Loaded");
        } // LoadJObject

        public void LoadJObject(string json)
        {
            Log.LogInfo("[JsonManager] LoadJObject: JObject from string");
            _jobject = JsonConvert.DeserializeObject<JObject>(json) ?? new();
            Log.LogInfo("[JsonManager] LoadJObject: JObject Loaded");
        } // LoadJObject

        public void LoadJObject(JObject jobject)
        {
            Log.LogInfo("[JsonManager] LoadJObject: JObject from JObject");
            _jobject = jobject;
            Log.LogInfo("[JsonManager] LoadJObject: JObject Loaded");
        } // LoadJObject

        public T? LoadJObject<T>()
        {
            Log.LogInfo("[JsonManager] LoadJObject: JObject to Object from file");
            var json = _fileManager.ReadAllText();
            var obj = JsonConvert.DeserializeObject<T>(json);
            Log.LogInfo("[JsonManager] LoadJObject: Object Loaded");
            return obj;
        } // LoadJObject

        public T? LoadJObject<T> (string json)
        {
            Log.LogInfo("[JsonManager] LoadJObject: JObject to Object from string");
            var obj = JsonConvert.DeserializeObject<T>(json);
            Log.LogInfo("[JsonManager] LoadJObject: Object Loaded");
            return obj;
        } // LoadJObject

        public void SaveJObject()
        {
            Log.LogInfo("[JsonManager] SaveJObject: JObject to file");
            var json = JsonConvert.SerializeObject(_jobject, Formatting.Indented);
            _fileManager.WriteAllText(json);
            Log.LogInfo("[JsonManager] SaveJObject: JObject Saved");
        } // SaveJObject

        public void AddItem(string key, object value)
        {
            Log.LogInfo($"[JsonManager] AddItem: Add {key} {value}");
            if (_jobject.ContainsKey(key))
            {
                Log.LogWarn($"[JsonManager] AddItem: {key} already exists. Overwriting...");
                _jobject[key] = JToken.FromObject(value);
                Log.LogInfo($"[JsonManager] AddItem: {key} Added");
            }
            else
            {
                _jobject.Add(key, JToken.FromObject(value));
                Log.LogInfo($"[JsonManager] AddItem: {key} Added");
            }
        } // AddItem

        public void RemoveItem(string key)
        {
            Log.LogInfo($"[JsonManager] RemoveItem: Remove {key}");
            if (_jobject.ContainsKey(key))
            {
                _jobject.Remove(key);
                Log.LogInfo($"[JsonManager] RemoveItem: {key} Removed");
            }
            else
            {
                Log.LogWarn($"[JsonManager] RemoveItem: {key} Not Found");
            }
        } // RemoveItem

        public void FindItem(string key, out string value)
        {
            Log.LogInfo($"[JsonManager] FindItem: Find {key}");
            if (_jobject.ContainsKey(key))
            {
                value = _jobject[key]?.ToString() ?? "";
                Log.LogInfo($"[JsonManager] FindItem: {key} Found");
            }
            else
            {
                value = string.Empty;
                Log.LogWarn($"[JsonManager] FindItem: {key} Not Found");
            }
        } // FindItem

        public void FindItems(string key, out string[]? values)
        {
            Log.LogInfo($"[JsonManager] FindItems: Find {key}");
            if (_jobject.ContainsKey(key))
            {
                values = _jobject[key]?.ToObject<string[]>();
                Log.LogInfo($"[JsonManager] FindItems: {key} Found");
            }
            else
            {
                values = null;
                Log.LogWarn($"[JsonManager] FindItems: {key} Not Found");
            }
        } // FindItems
    } // JsonManager
} // DataManager.Json
