/***
  Copyright 2024 Croffle Development Team (WKU - CSE)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
***/

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CroffleDataManager.Json
{
    public class JsonManager
    {
        readonly FileManager fileManager;
        JObject jobject;

        /// <summary>
        /// set file path and file name
        /// </summary>
        /// <param name="file_name">"~.json"</param>
        public JsonManager(string file_name)
        {
            var path = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + $@"\Croffle\JSON";
            fileManager = new FileManager(path, file_name);
            jobject = new();
            Initialize();
        }//JsonManager()

        public JsonManager()
        {
            jobject = new();
            fileManager = new(null, null);
        }

        public bool CompareJson(string json)
        {
            JObject newJson = JObject.Parse(json);
            bool areEqual = JToken.DeepEquals(jobject, newJson);
            return areEqual;
        }

        public void Initialize()
        {
            Console.WriteLine("[JsonManager] Initialize: Check Json");
            if (!fileManager.CheckFile())
            {
                fileManager.CreateFile();
                Console.WriteLine("> [Initialize] JSON: JSON File Created.");
            }
            else
            {
                LoadJObject();
            }
        }//Initialize()

        public void LoadJObject()
        {
            Console.WriteLine("[JsonManager] LoadJObject: Load JObject");
            var json = fileManager.ReadAllText();
            jobject = JsonConvert.DeserializeObject<JObject>(json) ?? new();
            Console.WriteLine("> [LoadJObject] JSON: JObject Loaded Successfully.");
        }//LoadJObject()

        public void LoadJObject(string json)
        {
            Console.WriteLine("[JsonManager] LoadJObject: Load JObject from external string");
            jobject = JsonConvert.DeserializeObject<JObject>(json) ?? new();
            Console.WriteLine("> [LoadJObject] JSON: JObject Loaded Successfully.");
        }

        public void LoadJObject(JObject jobject)
        {
            Console.WriteLine("[JsonManager] LoadJObject: Load JObject from external JObject");
            this.jobject = jobject;
            Console.WriteLine("> [LoadJObject] JSON: JObject Loaded Successfully.");
        }

        public void SaveJson()
        {
            Console.WriteLine("[JsonManager] SaveJson: Save JObject");
            fileManager.WriteText(JsonConvert.SerializeObject(jobject));
            Console.WriteLine("> [SaveJson] JSON: JObject Saved Successfully.");
        }//SaveJson()

        public void AddItem(string key, string value)
        {
            Console.WriteLine($"[JsonManager] AddItem: Add {key} : {value}");
            if(jobject.ContainsKey(key))
            {
                Console.WriteLine($"> [AddItem] JSON: {key} Already Exists");
                jobject[key] = value;
                Console.WriteLine($"> [AddItem] JSON: {key} Updated");
            }
            else
            {
                jobject.Add(key, value);
                Console.WriteLine($"> [AddItem] JSON: {key} Added");
            }
        }//AddItem()

        public void RemoveItem(string key)
        {
            Console.WriteLine($"[JsonManager] RemoveItem: Remove {key}");
            if (jobject.ContainsKey(key))
            {
                jobject.Remove(key);
                Console.WriteLine($"> [RemoveItem] JSON: {key} Removed");
            }
            else
            {
                Console.WriteLine($"> [RemoveItem] JSON: {key} Not Found");
            }
        }//RemoveItem()

        public void FindItem(string key, out string value)
        {
            Console.WriteLine($"[JsonManager] FindItem: Find {key}");
            if (jobject.ContainsKey(key))
            {
                value = jobject[key]?.ToString() ?? "";
                Console.WriteLine($"> [FindItem] JSON: {key} Found");
            }
            else
            {
                value = string.Empty;
                Console.WriteLine($"> [FindItem] JSON: {key} Not Found");
            }
        }//FindItem()

        public void FindItems(string key, out List<string> values)
        {
            JArray jArray = JArray.Parse(jobject[key]?.ToString() ?? "");

            values = new List<string>();
            foreach (var item in jArray)
            {
                values.Add(item.ToString());
            }
        } // FindItems()
    }
}
