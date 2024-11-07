using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.OS;
using CROFFLE.Interface;
using CROFFLE.Platforms.Android;

namespace CROFFLE
{
    [Activity(Theme = "@style/Maui.SplashTheme", MainLauncher = true, LaunchMode = LaunchMode.SingleTop, ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation | ConfigChanges.UiMode | ConfigChanges.ScreenLayout | ConfigChanges.SmallestScreenSize | ConfigChanges.Density)]
    public class MainActivity : MauiAppCompatActivity
    {
        protected override void OnCreate(Bundle? savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            CreateNotificationFromIntent(Intent);
        }

        protected override void OnNewIntent(Intent intent)
        {
            base.OnNewIntent(intent);

            CreateNotificationFromIntent(intent);
        }

        private static void CreateNotificationFromIntent(Intent intent)
        {
           if (intent?.Extras != null)
            {
                string title = intent.GetStringExtra(AndroidNotificationManagerService.TitleKey);
                string message = intent.GetStringExtra(AndroidNotificationManagerService.MessageKey);

                var service = IPlatformApplication.Current.Services.GetRequiredService<INotificationManagerService>();
                service.ReceiveNotification(title, message);
            }
        }
    }
}
