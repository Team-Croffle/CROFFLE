using Android.Content;

namespace CROFFLE_Core.Platforms.Android
{
    [BroadcastReceiver(Enabled = true, Label = "Local notifications Broadcast Receiver")]
    internal class AlarmHandler : BroadcastReceiver
    {
        public override void OnReceive(Context? context, Intent? intent)
        {
<<<<<<< HEAD
            if (intent == null) return;
=======
            if (intent is null) return;
>>>>>>> release
            string title = intent.GetStringExtra(NotificationManagerService.TitleKey) ?? "";
            string message = intent.GetStringExtra(NotificationManagerService.MessageKey) ?? "";

            NotificationManagerService manager = NotificationManagerService.Instance ?? new();
            manager.Show(title, message);
        }
    }
}
