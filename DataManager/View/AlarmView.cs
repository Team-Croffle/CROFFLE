using CroffleLogManager;
using DataManager.SQLiteDBMS;
using DataManager.SQLiteDBMS.Scheme;

namespace DataManager.View
{
    public class AlarmView
    {
        SQLiteDB db;
        private List<Alarm>? alarmTable;

        public AlarmView()
        {
            db = new();
        }

        public async Task LoadAlarms()
        {
            alarmTable = await db.GetItemsAsync<Alarm>(
                t => t.AlarmTime > DateTime.Now && t.AlarmTime < DateTime.Now.AddHours(1),
                t => t.AlarmTime);
        } // LoadAlarms

        public async Task SaveAlarm(Alarm alarm)
        {
            var result = await db.SaveItemASync(alarm);
            if (result is not 1)
            {
                Log.LogError("[AlarmView] SaveAlarm: Alarm Save Failed.");
                alarmTable = null;
                return;
            }
            else
            {
                Log.LogInfo("[AlarmView] SaveAlarm: Alarm Save Succeed.");
            }
        } // SaveAlarm

        public async Task DeleteAlarm(Alarm alarm)
        {
            var result = await db.DeleteItemAsync(alarm);
            if (result is not 1)
            {
                Log.LogError("[AlarmView] DeleteAlarm: Alarm Delete Failed.");
                alarmTable = null;
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