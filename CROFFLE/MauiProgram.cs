using CROFFLE.Interface;
using Microsoft.Extensions.Logging;

namespace CROFFLE
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("AgaveNerdFont-Bold.ttf", "AgaveNerdFontBold");
                    fonts.AddFont("AgaveNerdFontMono-Bold.ttf", "AgaveNerdFontMonoBold");
                    fonts.AddFont("AgaveNerdFontMono-Regular.ttf", "AgaveNerdFontMonoRegular");
                    fonts.AddFont("AgaveNerdFontPropo-Bold.ttf", "AgaveNerdFontPropoBold");
                    fonts.AddFont("AgaveNerdFontPropo-Regular.ttf", "AgaveNerdFontPropoRegular");
                    fonts.AddFont("AgaveNerdFont-Regular.ttf", "AgaveNerdFontRegular");
                    fonts.AddFont("Dongle-Bold.ttf", "DongleBold");
                    fonts.AddFont("Dongle-Light.ttf", "DongleLight");
                    fonts.AddFont("Dongle-Regular.ttf", "DongleRegular");
                    fonts.AddFont("KCC-Ganpan.ttf", "KCC-Ganpan");
                    fonts.AddFont("LeagueSpartan-Black.ttf", "LeagueSpartanBlack");
                    fonts.AddFont("LeagueSpartan-Bold.ttf", "LeagueSpartanBold");
                    fonts.AddFont("LeagueSpartan-ExtraBold.ttf", "LeagueSpartanExtraBold");
                    fonts.AddFont("LeagueSpartan-ExtraLight.ttf", "LeagueSpartanExtraLight");
                    fonts.AddFont("LeagueSpartan-Light.ttf", "LeagueSpartanLight");
                    fonts.AddFont("LeagueSpartan-Medium.ttf", "LeagueSpartanMedium");
                    fonts.AddFont("LeagueSpartan-Regular.ttf", "LeagueSpartanRegular");
                    fonts.AddFont("LeagueSpartan-SemiBold.ttf", "LeagueSpartanSemiBold");
                    fonts.AddFont("LeagueSpartan-Thin.ttf", "LeagueSpartanThin");
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                    fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
                });
#if ANDROID
            builder.Services.AddSingleton<INotificationManagerService, CROFFLE.Platforms.Android.AndroidNotificationManagerService>();
#endif

#if DEBUG
            builder.Logging.AddDebug();
#endif

            return builder.Build();
        }
    }
}
