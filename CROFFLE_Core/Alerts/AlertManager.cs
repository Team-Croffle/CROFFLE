namespace CROFFLE_Core.Alerts
{
    public class AlertManager
    {
        INotificationManagerService? _notificationManagerService = null;

        public AlertManager()
        {
#if ANDROID
            _notificationManagerService = new Platforms.Android.NotificationManagerService();
#elif WINDOWS
            _notificationManagerService = new Platforms.Windows.NotificationManagerService();
#endif
        } // AlertManager

        public void SendNotification(string title, string message, DateTime? notifyTime = null)
        {
            _notificationManagerService?.SendNotification(title, message, notifyTime);
        } // SendNotification
    } // AlertManager
} // CROFFLE_Core.Alerts
