using CroffleLogManager;
using Microsoft.Maui.Controls.Shapes;
using System.Windows.Input;

namespace CROFFLE.xamls.ViewModels
{
    internal class DailyInfoViewModel
    {
        public RoundRectangle BorderStrokeShape { get; } = new() { CornerRadius = new CornerRadius(10, 10, 0, 0) };

        public ICommand? NavPrevious { get; }
        public ICommand? NavAdd { get; }
        public EventHandler? LoadCompleteVerticalStackLayout { get; }
        public EventHandler? LoadInCompleteVerticalStackLayout { get; }

        public DailyInfoViewModel()
        {
            NavPrevious = new Command(async () =>
            {
                Log.LogInfo("[DailyInfoViewModel] NavPrevious");
                await Shell.Current.GoToAsync("../");
                Log.LogInfo("[DailyInfoViewModel] NavPrevious: Done");
            });

            NavAdd = new Command(async () =>
            {
                Log.LogInfo("[DailyInfoViewModel] NavAdd");
                await Shell.Current.GoToAsync("Detail");
                Log.LogInfo("[DailyInfoViewModel] NavAdd: Done");
            });

        }


    }
}
