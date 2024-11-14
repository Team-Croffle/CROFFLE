using DataManager.SQLiteDBMS;
using DataManager.SQLiteDBMS.Scheme;
using Microsoft.Win32;
using System.Xml.Linq;

namespace CROFFLE
{
    public static class AppSetting
    {
        public static bool AutoStart { get; set; } = false;

        public static bool SystemTray { get; set; } = false;
        public static bool ShowWeekend { get; set; } = false;
        public static bool ShowDone { get; set; } = true;
        public static bool AlarmOn { get; set; } = true;

        public static void LoadSettings()
        {
            var set = new SQLiteDB().GetItems<Settings>();
            if (set is not null)
            {

#if WINDOWS
                var wres = set[set.FindIndex(s => s.Key == "AutoStart")];
                AutoStart = bool.Parse(wres.Value);

                wres = set[set.FindIndex(s => s.Key == "SystemTray")];
                SystemTray = bool.Parse(wres.Value);
#endif

                var res = set[set.FindIndex(s => s.Key == "ShowWeekend")];
                ShowWeekend = bool.Parse(res.Value);

                res = set[set.FindIndex(s => s.Key == "ShowDone")];
                ShowDone = bool.Parse(res.Value);

                res = set[set.FindIndex(s => s.Key == "AlarmOn")];
                AlarmOn = bool.Parse(res.Value);
            }
        }

        public static void SaveSettings()
        {
            SQLiteDB db = new();
#if WINDOWS
            db.SaveItem<Settings>(new() { Key = "AutoStart", Value = AutoStart.ToString() });
            db.SaveItem<Settings>(new() { Key = "SystemTray", Value = SystemTray.ToString() });
#endif
            db.SaveItem<Settings>(new() { Key = "ShowWeekend", Value = ShowWeekend.ToString() });
            db.SaveItem<Settings>(new() { Key = "ShowDone", Value = ShowDone.ToString() });
            db.SaveItem<Settings>(new() { Key = "AlarmOn", Value = AlarmOn.ToString() });

#if WINDOWS
            string regStartUpPath = @"Software\Microsoft\Windows\CurrentVersion\Run";
            using (RegistryKey? key = Registry.CurrentUser.OpenSubKey(regStartUpPath, true))
            {
                if (key is null) return;
                if (AutoStart)
                {
                    key.SetValue("Croffle", System.Reflection.Assembly.GetExecutingAssembly().Location);
                }
                else
                {
                    key.DeleteValue("Croffle", false);
                }
            }
#elif MACCATALYST
            var plistPath = Path.Combine
                (Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "Croffle", "com.croffle.plist");

            XDocument doc = new XDocument(
                new XElement("plist",
                    new XAttribute("version", "1.0"),
                    new XElement("dict",
                        new XElement("key", "Label"),
                        new XElement("string", "com.croffle"),
                        new XElement("key", "ProgramArguments"),
                        new XElement("array",
                            new XElement("string", "open"),
                            new XElement("string", "-a"),
                            new XElement("string", "Croffle")
                        ),
                        new XElement("key", "RunAtLoad"),
                        new XElement("true"),
                        new XElement("key", "KeepAlive"),
                        new XElement("true")
                    )
                )
            );

            var path = Path.GetDirectoryName(plistPath);
            if (path is not null) {
                Directory.CreateDirectory(path);
                doc.Save(plistPath);
            }
#endif
        }
    }
}
