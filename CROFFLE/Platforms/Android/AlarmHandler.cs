using Android.Content;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CROFFLE.Platforms.Android
{
    [BroadcastReceiver(Enabled = true, Label = "Local notifications Broadcast Receiver")]
    internal class AlarmHandler : BroadcastReceiver
    {
        public override void OnReceive(Context context, Intent intent)
        {
            string title = intent.GetStringExtra(AndroidNotificationManagerService.TitleKey);
            string message = intent.GetStringExtra(AndroidNotificationManagerService.MessageKey);

            AndroidNotificationManagerService manager = AndroidNotificationManagerService.Instance ?? new();
            manager.Show(title, message);
        }
    }
}
