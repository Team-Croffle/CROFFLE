using CroffleLogManager;
using DataManager.SQLiteDBMS;
using DataManager.SQLiteDBMS.Scheme;

namespace DataManager.View
{
    public class AlarmView
    {
        SQLiteDB db;
        private List<Alarm>? alarmTable;

        public Alarm? this[int index] { get => alarmTable?.ElementAt(index); }
        public List<Alarm>? ListAll => alarmTable;

        public AlarmView()
        {
            db = new();
            db.DB_Init();
        }

        public void LoadAlarms()
        {
            alarmTable = db.GetItems<Alarm>(
                t => t.AlarmTime > DateTime.Now && t.AlarmTime < DateTime.Now.AddHours(1),
                t => t.AlarmTime);
        } // LoadAlarms

        public static void SaveAlarm(Alarm alarm)
        {
            SQLiteDB db = new();
            var result = db.SaveItem(alarm);
            if (result is not 1)
            {
                Log.LogError("[AlarmView] SaveAlarm: Alarm Save Failed.");
                return;
            }
            else
            {
                Log.LogInfo("[AlarmView] SaveAlarm: Alarm Save Succeed.");
            }
        } // SaveAlarm

        public static void DeleteAlarm(string alarm_id)
        {
            SQLiteDB db = new();
            var result = db.DeleteItem<Alarm>(alarm_id);
            if (result is not 1)
            {
                Log.LogError("[AlarmView] DeleteAlarm: Alarm Delete Failed.");
                return;
            }
            else
            {
                Log.LogInfo("[AlarmView] DeleteAlarm: Alarm Delete Succeed.");
            }
        } // DeleteAlarm

        public int? Count()
        {
            if (alarmTable is null) return null;
            return alarmTable.Count;
        }
    } // AlarmView
} // CROFFLE_Core.Data