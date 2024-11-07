using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Input;
using CROFFLE.xamls.Views;
using Microsoft.Maui.Controls.Shapes;

namespace CROFFLE.xamls.ViewModels
{
    internal class MainViewModel : INotifyPropertyChanged
    {
        private DateTime date = DateTime.Today;
        private string labelMonthText = string.Empty;
        private string buttonText = string.Empty;

        private int calendarIndex = 1;
        private Calendar[] calendars = 
        {
            new(), new(), new()
        };

        private View calendarTemplate;

        public event PropertyChangedEventHandler? PropertyChanged;

        public ICommand? IncrementMonth { get; }
        public ICommand? DecrementMonth { get; }
        public ICommand? NavigateToday { get; }

        public RoundRectangle BorderStrokeShape { get; } = new() { CornerRadius = new CornerRadius(10) };

        public DateTime Date
        {
            get => date;
            set
            {
                date = value;
                OnPropertyChanged();
            }
        }

        public string LabelMonthText
        {
            get => labelMonthText;
            set
            {
                labelMonthText = value;
                OnPropertyChanged();
            }
        }

        public string ButtonText
        {
            get => buttonText;
            set
            {
                buttonText = value;
                OnPropertyChanged();
            }
        }

        public View CalendarTemplate
        {
            get => calendarTemplate;
            set
            {
                calendarTemplate = value;
                OnPropertyChanged();
            }
        }


        protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        public MainViewModel()
        {
            IncrementMonth = new Command(() => UpdateLabelMonth(1));
            DecrementMonth = new Command(() => UpdateLabelMonth(-1));
            NavigateToday = new Command(LoadToday);

            calendars[0].LoadCalendar(Date.AddMonths(-1));
            calendars[1].LoadCalendar(Date);
            calendars[2].LoadCalendar(Date.AddMonths(1));

            calendarTemplate = calendars[calendarIndex];

            labelMonthText = Date.ToString("yyyy년 MM월");
        }

        private void UpdateLabelMonth(int month)
        {
            Date = Date.AddMonths(month);
            LabelMonthText = Date.ToString("yyyy년 MM월");

            if (month > 0)
            {
                calendarIndex = (calendarIndex + 1) % 3;
                CalendarTemplate = calendars[calendarIndex];
                calendars[(calendarIndex + 1) % 3].LoadCalendar(Date.AddMonths(1));
            }
            else
            {
                calendarIndex = (calendarIndex + 2) % 3;
                CalendarTemplate = calendars[calendarIndex];
                calendars[(calendarIndex + 2) % 3].LoadCalendar(Date.AddMonths(-1));
            }
        }

        private void LoadToday()
        {
            if(date != DateTime.Today)
            {
                Date = DateTime.Today;
                LabelMonthText = Date.ToString("yyyy년 MM월");

                if (calendars[(calendarIndex + 2) % 3].CalendarDate == date) UpdateLabelMonth(-1);
                else if (calendars[(calendarIndex + 1) % 3].CalendarDate == date) UpdateLabelMonth(1);
                else
                {
                    calendarIndex = 1;
                    calendars[0].LoadCalendar(Date.AddMonths(-1));
                    calendars[1].LoadCalendar(Date);
                    calendars[2].LoadCalendar(Date.AddMonths(1));
                    CalendarTemplate = calendars[calendarIndex];
                }
            }
        }
    }
}
