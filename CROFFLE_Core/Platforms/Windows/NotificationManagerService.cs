using CROFFLE_Core.Alerts;
using Microsoft.Toolkit.Uwp.Notifications;

namespace CROFFLE_Core.Platforms.Windows
{
    internal class NotificationManagerService : INotificationManagerService
    {
        public void SendNotification(string title, string message, DateTime? notifyTime = null)
        {
            if (notifyTime is null)
            {
                SendNotification(title, message);
            }
            else
            {
                var ticks = notifyTime.Value.Ticks;
                new ToastContentBuilder()
                    .AddText(title)
                    .AddText(message)
                    .AddCustomTimeStamp(new DateTime(ticks, DateTimeKind.Utc))
                    .Show();
            }
        }

        public void SendNotification(string title, string message)
        {
            new ToastContentBuilder()
                .AddText(title)
                .AddText(message)
                .Show();
        }
    }
}
