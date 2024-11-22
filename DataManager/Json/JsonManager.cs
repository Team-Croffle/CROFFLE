using CroffleLogManager;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace DataManager.Json;

public class JsonManager
{
    FileManager _fileManager;
    JObject? _jobject;

    public JsonManager()
    {
        _jobject = [];
    }

    public JsonManager(string file_name)
    {
        var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "JSON");
        _fileManager = new(path, file_name);
        _jobject = [];
        LoadJObject();
    } // JsonManager

    public bool LoadJObject()
    {
        var json = _fileManager.ReadAllText();
        _jobject = JsonConvert.DeserializeObject<JObject>(json);
        var result = _jobject != null;
        _jobject ??= [];
        return result;
    } // LoadJObject

    public bool LoadJObject(string json)
    {
        _jobject = JsonConvert.DeserializeObject<JObject>(json);
        var result = _jobject != null;
        _jobject ??= [];
        return result;
    } // LoadJObject

    public bool LoadJObject(JObject jobject)
    {
        _jobject = jobject;
        var result = _jobject != null;
        _jobject ??= [];
        return result;
    } // LoadJObject

    public void SaveJObject()
    {
        var json = JsonConvert.SerializeObject(_jobject, Formatting.Indented);
        _fileManager.WriteAllText(json);
    } // SaveJObject

    public void AddItem(string key, string key2, string value)
    {
        if (_jobject == null)
        {
            Log.LogError($"[JsonManager] AddItem: No JObject Loaded");
            return;
        }
        if (_jobject.ContainsKey(key))
        {
            var token = _jobject[key];
            if (token is null) return;
            var obj = JObject.Parse(token.ToString());
            if (obj is null)
            {
                Log.LogError($"[JsonManager] AddItem: {key} is null");
                return;
            }
            if (obj.ContainsKey(key2))
            {
                obj[key2] = value;
                return;
            }
            else obj.Add(key2, value);
            _jobject[key] = obj;
            return;
        }
        _jobject.Add(key, new JObject { { key2, value } });
    }
    public void AddItem(string key, string value)
    {
        if (_jobject == null)
        {
            Log.LogError($"[JsonManager] AddItem: No JObject Loaded");
            return;
        }
        if (_jobject.ContainsKey(key))
        {
            _jobject[key] = value;
            return;
        }
        _jobject.Add(key, value);
    } // AddItem

    public void AddItem(string key, object values)
    {
        if (_jobject == null)
        {
            Log.LogError($"[JsonManager] AddItem: No JObject Loaded");
            return;
        }
        if (_jobject.ContainsKey(key))
        {
            _jobject[key] = JToken.FromObject(values);
            return;
        }
        _jobject.Add(key, JToken.FromObject(values));
    } // AddItem

    public void RemoveItem(string key)
    {
        if (_jobject == null)
        {
            Log.LogError($"[JsonManager] AddItem: No JObject Loaded");
            return;
        }
        if (_jobject.ContainsKey(key))
        {
            _jobject.Remove(key);
        }
        else
        {
            Log.LogWarn($"[JsonManager] RemoveItem: {key} Not Found");
        }
    } // RemoveItem

    public void FindItem(string key, string key2, out string value)
    {
        if (_jobject == null)
        {
            value = string.Empty;
            Log.LogError($"[JsonManager] FindItem: No JObject Loaded");
            return;
        }
        if (_jobject.ContainsKey(key))
        {
            var token = _jobject[key];
            if (token is null)
            {
                value = string.Empty;
                Log.LogWarn($"[JsonManager] FindItem: {key} is null");
                return;
            }
            var obj = JObject.Parse(token.ToString());
            if (obj is null)
            {
                value = string.Empty;
                Log.LogWarn($"[JsonManager] FindItem: {key} is null");
                return;
            }
            if (obj.ContainsKey(key2))
            {
                value = obj[key2]?.ToString() ?? "";
                return;
            }
            value = string.Empty;
            Log.LogWarn($"[JsonManager] FindItem: {key}.{key2} Not Found");
        }
        else
        {
            value = string.Empty;
            Log.LogWarn($"[JsonManager] FindItem: {key} Not Found");
        }
    } // FindItem

    public void FindItem(string key, out string value)
    {
        if (_jobject == null)
        {
            value = string.Empty;
            Log.LogError($"[JsonManager] FindItem: No JObject Loaded");
            return;
        }
        if (_jobject.ContainsKey(key))
        {
            value = _jobject[key]?.ToString() ?? "";
        }
        else
        {
            value = string.Empty;
            Log.LogWarn($"[JsonManager] FindItem: {key} Not Found");
        }
    } // FindItem

    public void FindItems(string key, out List<string>? values)
    {
        if (_jobject == null)
        {
            values = null;
            Log.LogError($"[JsonManager] FindItems: No JObject Loaded");
            return;
        }
        if (_jobject.ContainsKey(key))
        {
            var  temp = _jobject[key]?.ToArray();
            if (temp is null)
            {
                values = null;
                Log.LogWarn($"[JsonManager] FindItems: {key} is null");
                return;
            }

            values = [];
            foreach (var item in temp)
            {
                values.Add(item.ToString());
            }
        }
        else
        {
            values = null;
            Log.LogWarn($"[JsonManager] FindItems: {key} Not Found");
        }
    } // FindItems

    public void GetKeys(out string[]? keys)
    {
        if (_jobject == null)
        {
            keys = null;
            Log.LogError("[JsonManager] GetKeys: No JObject Loaded");
            return;
        }
        keys = _jobject.Properties().Select(p => p.Name).ToArray();
    } // GetKeys
} // JsonManager
// DataManager.Json
