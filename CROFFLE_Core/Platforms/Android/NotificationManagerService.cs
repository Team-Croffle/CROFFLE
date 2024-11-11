using Android.App;
using Android.Content;
using Android.OS;
using AndroidX.Core.App;
using CROFFLE_Core.Alerts;

namespace CROFFLE_Core.Platforms.Android
{
    internal class NotificationManagerService : INotificationManagerService
    {
        const string channelId = "default";
        const string channelName = "Default";
        const string channelDescription = "The default channel for notifications.";

        public const string TitleKey = "title";
        public const string MessageKey = "message";

        bool channelInitialized = false;
        int messageId = 0;
        int pendingIntentId = 0;

        private NotificationManagerCompat compatManager;

        public event EventHandler NotificationReceived;

        public static NotificationManagerService? Instance { get; private set; }

        public NotificationManagerService()
        {
            if (Instance == null)
            {
                CreateNotificationChannel();
                compatManager = NotificationManagerCompat.From(Platform.AppContext);
                Instance = this;
            }
        }
        public void SendNotification(string title, string message, DateTime? notifyTime = null)
        {
            if (!channelInitialized)
            {
                CreateNotificationChannel();
            }
            if (notifyTime != null)
            {
                Intent intent = new(Platform.AppContext, typeof(AlarmHandler));
                intent.PutExtra(TitleKey, title);
                intent.PutExtra(MessageKey, message);
                intent.SetFlags(ActivityFlags.ClearTop | ActivityFlags.SingleTop);

                var pendingIntentFlags = (Build.VERSION.SdkInt >= BuildVersionCodes.S)
                    ? PendingIntentFlags.UpdateCurrent | PendingIntentFlags.Immutable
                    : PendingIntentFlags.UpdateCurrent;

                PendingIntent pendingIntent = PendingIntent.GetBroadcast(Platform.AppContext, pendingIntentId++, intent, pendingIntentFlags);
                long triggerTime = GetNotifyTime(notifyTime.Value);
                AlarmManager alarmManager = Platform.AppContext.GetSystemService(Context.AlarmService) as AlarmManager;
                alarmManager.Set(AlarmType.RtcWakeup, triggerTime, pendingIntent);
            }
            else
            {
                Show(title, message);
            }
            
        }

        public void SendNotification(string title, string message)
        {

        }

        public void Show(string title, string message)
        {
            Intent intent = new(Platform.AppContext, typeof(AlarmHandler));
            intent.PutExtra(TitleKey, title);
            intent.PutExtra(MessageKey, message);
            intent.SetFlags(ActivityFlags.ClearTop | ActivityFlags.SingleTop);

            var pendingIntentFlags = (Build.VERSION.SdkInt >= BuildVersionCodes.S)
                ? PendingIntentFlags.UpdateCurrent | PendingIntentFlags.Immutable
                : PendingIntentFlags.UpdateCurrent;

            PendingIntent pendingIntent = PendingIntent.GetActivity(Platform.AppContext, pendingIntentId++, intent, pendingIntentFlags);
            NotificationCompat.Builder builder = new NotificationCompat.Builder(Platform.AppContext, channelId)
                .SetContentIntent(pendingIntent)
                .SetContentTitle(title)
                .SetContentText(message)
                .SetPriority(NotificationCompat.PriorityDefault)
                .SetCategory(NotificationCompat.CategoryEvent);

            Notification notify = builder.Build();
            compatManager.Notify(messageId++, notify);
        }

        private void CreateNotificationChannel()
        {
            if (Build.VERSION.SdkInt >= BuildVersionCodes.O)
            {
                var channelNameJava = new Java.Lang.String(channelName);
                var channel = new NotificationChannel(channelId, channelNameJava, NotificationImportance.Default)
                {
                    Description = channelDescription
                };
                NotificationManager manager = (NotificationManager)Platform.AppContext.GetSystemService(Context.NotificationService);
                manager.CreateNotificationChannel(channel);
                channelInitialized = true;
            }
        }
        private long GetNotifyTime(DateTime notifyTime)
        {
            DateTime utcTime = TimeZoneInfo.ConvertTimeToUtc(notifyTime);
            double epochDiff = (new DateTime(1970, 1, 1) - DateTime.MinValue).TotalSeconds;
            long utcAlarmTime = utcTime.AddSeconds(-epochDiff).Ticks / 10000;
            return utcAlarmTime;
        }
    }
}
