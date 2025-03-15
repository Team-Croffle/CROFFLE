namespace CROFFLE_Core.Alerts
{
    internal interface INotificationManagerService
    {
        void SendNotification(string title, string message, DateTime? notifyTime = null);
        void SendNotification(string title, string message);
    }
}
