using CroffleLogManager;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace DataManager.Json
{
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
            Log.LogInfo("[JsonManager] LoadJObject: JObject from file");
            var json = _fileManager.ReadAllText();
            _jobject = JsonConvert.DeserializeObject<JObject>(json);
            Log.LogInfo("[JsonManager] LoadJObject: JObject Loaded");
            var result = _jobject != null;
            _jobject ??= new();
            return result;
        } // LoadJObject

        public bool LoadJObject(string json)
        {
            Log.LogInfo("[JsonManager] LoadJObject: JObject from string");
            _jobject = JsonConvert.DeserializeObject<JObject>(json);
            Log.LogInfo("[JsonManager] LoadJObject: JObject Loaded");
            var result = _jobject != null;
            _jobject ??= new();
            return result;
        } // LoadJObject

        public bool LoadJObject(JObject jobject)
        {
            Log.LogInfo("[JsonManager] LoadJObject: JObject from JObject");
            _jobject = jobject;
            Log.LogInfo("[JsonManager] LoadJObject: JObject Loaded");
            var result = _jobject != null;
            _jobject ??= new();
            return result;
        } // LoadJObject

        public void SaveJObject()
        {
            Log.LogInfo("[JsonManager] SaveJObject: JObject to file");
            var json = JsonConvert.SerializeObject(_jobject, Formatting.Indented);
            _fileManager.WriteAllText(json);
            Log.LogInfo("[JsonManager] SaveJObject: JObject Saved");
        } // SaveJObject

        public void AddItem(string key, string key2, string value)
        {
            Log.LogInfo($"[JsonManager] AddItem: Add {key}.{key2} with {value}");
            if (_jobject == null)
            {
                Log.LogWarn($"[JsonManager] AddItem: No JObject Loaded");
                return;
            }
            if (_jobject.ContainsKey(key))
            {
                Log.LogWarn($"[JsonManager] AddItem: {key}.{key2} Already Exists");
                var token = _jobject[key];
                if (token is null) return;
                var obj = JObject.Parse(token.ToString());
                if (obj is null)
                {
                    Log.LogWarn($"[JsonManager] AddItem: {key} is null");
                    return;
                }
                if (obj.ContainsKey(key2))
                {
                    Log.LogWarn($"[JsonManager] AddItem: {key}.{key2} Already Exists");
                    obj[key2] = value;
                    return;
                }
                else obj.Add(key2, value);
                _jobject[key] = obj;
                return;
            }
            _jobject.Add(key, new JObject { { key2, value } });
            Log.LogInfo($"[JsonManager] AddItem: {key}.{key2} Added");
        }
        public void AddItem(string key, string value)
        {
            Log.LogInfo($"[JsonManager] AddItem: Add {key} with {value}");
            if (_jobject == null)
            {
                Log.LogWarn($"[JsonManager] AddItem: No JObject Loaded");
                return;
            }
            if (_jobject.ContainsKey(key))
            {
                Log.LogWarn($"[JsonManager] AddItem: {key} Already Exists");
                _jobject[key] = value;
                return;
            }
            _jobject.Add(key, value);
            Log.LogInfo($"[JsonManager] AddItem: {key} Added");
        } // AddItem

        public void AddItem(string key, object values)
        {
            Log.LogInfo($"[JsonManager] AddItem: Add {key} with {values}");
            if (_jobject == null)
            {
                Log.LogWarn($"[JsonManager] AddItem: No JObject Loaded");
                return;
            }
            if (_jobject.ContainsKey(key))
            {
                Log.LogWarn($"[JsonManager] AddItem: {key} Already Exists");
                _jobject[key] = JToken.FromObject(values);
                return;
            }
            _jobject.Add(key, JToken.FromObject(values));
            Log.LogInfo($"[JsonManager] AddItem: {key} Added");
        } // AddItem

        public void RemoveItem(string key)
        {
            Log.LogInfo($"[JsonManager] RemoveItem: Remove {key}");
            if (_jobject == null)
            {
                Log.LogWarn($"[JsonManager] AddItem: No JObject Loaded");
                return;
            }
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

        public void FindItem(string key, string key2, out string value)
        {
            Log.LogInfo($"[JsonManager] FindItem: Find {key}.{key2}");
            if (_jobject == null)
            {
                value = string.Empty;
                Log.LogWarn($"[JsonManager] FindItem: No JObject Loaded");
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
                    Log.LogInfo($"[JsonManager] FindItem: {key}.{key2} Found");
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
            Log.LogInfo($"[JsonManager] FindItem: Find {key}");
            if (_jobject == null)
            {
                value = string.Empty;
                Log.LogWarn($"[JsonManager] FindItem: No JObject Loaded");
                return;
            }
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

        public void FindItems(string key, out List<string>? values)
        {
            Log.LogInfo($"[JsonManager] FindItems: Find {key}");
            if (_jobject == null)
            {
                values = null;
                Log.LogWarn($"[JsonManager] FindItems: No JObject Loaded");
                return;
            }
            if (_jobject.ContainsKey(key))
            {
                var  temp = _jobject[key]?.ToArray();
                Log.LogInfo($@"[JsonManager] FindItems: temp: {temp}");
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

                Log.LogInfo($"[JsonManager] FindItems: {key} Found");
            }
            else
            {
                values = null;
                Log.LogWarn($"[JsonManager] FindItems: {key} Not Found");
            }
        } // FindItems

        public void GetKeys(out string[]? keys)
        {
            Log.LogInfo("[JsonManager] GetKeys: Get All Keys");
            if (_jobject == null)
            {
                keys = null;
                Log.LogWarn("[JsonManager] GetKeys: No JObject Loaded");
                return;
            }
            keys = _jobject.Properties().Select(p => p.Name).ToArray();
            Log.LogInfo("[JsonManager] GetKeys: Keys Found");
        } // GetKeys
    } // JsonManager
} // DataManager.Json
