using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Input;
using CROFFLE.xamls.Views;
using Microsoft.Maui.Controls.Shapes;

namespace CROFFLE.xamls.ViewModels;

public class MainViewModel : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler? PropertyChanged;

    private DateTime date = DateTime.Today;
    private string labelMonthText = string.Empty;
    private string buttonText = string.Empty;

    private int calendarIndex = 1;

    private Calendar[] calendars = 
    {
        new(), new(), new()
    };

    private View calendarTemplate;
    private CarouselView carouselView;
    private Color deleteBtnBackground = Colors.Transparent;

    public ICommand? NavPrevious { get; } = new Command(async () =>
        {
            await Shell.Current.GoToAsync("../");
        });

    public ICommand? NavPreviousEditor { get; } = new Command(async () =>
        {
            await Shell.Current.GoToAsync("//MainPage/DailyInfo");
        });
    public ICommand? IncrementMonth { get; }
    public ICommand? DecrementMonth { get; }
    public ICommand? NavigateToday { get; }

    public ICommand OnPointerEnteredBtnDelete { get; }
    public ICommand OnPointerExitedBtnDelete { get; }
    //public ICommand OnPointerEntered { get; }
    //public ICommand OnPointerExited { get; }

    public EventHandler? LoadCompleteVerticalStackLayout { get; }
    public EventHandler? LoadInCompleteVerticalStackLayout { get; }
    public EventHandler<PointerEventArgs> OnPointerEntered { get; } = new((sender, e) =>
        {
            if (sender is null) return;
            var obj = (Button)sender;
            obj.BackgroundColor = new Color(0x7F, 0x7F, 0x7F, 0x7F);
    });

    public EventHandler<PointerEventArgs> OnPointerExited { get; } = new((sender, e) =>
        {
            if (sender is null) return;
            var obj = (Button)sender;
            obj.BackgroundColor = Colors.Transparent;
        });


    public RoundRectangle BorderStrokeShape_DailyInfo { get; } = new() { CornerRadius = new CornerRadius(10, 10, 0, 0) };
    public RoundRectangle BorderStrokeShape { get; } = new() { CornerRadius = new CornerRadius(10) };

    public Color DeleteBtnBackground
    {
        get => deleteBtnBackground;
        set
        {
            deleteBtnBackground = value;
            OnPropertyChanged();
        }
    }

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
        private set
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

    //range: 0 ~ 365
    public List<int> DayPicker { get; } = new() { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
        22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
        50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78,
        79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105,
        106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130,
        131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154,
        155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178,
        179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202,
        203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225,
        226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247,
        248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269,
        270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291,
        292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313,
        314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335,
        336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356,
        357, 358, 359, 360, 361, 362, 363, 364, 365 };

    public List<int> HourPicker { get; } = new() { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 };
    public List<int> MinPicker { get; } = new() { 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 };


    protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }

    public MainViewModel()
    {
        carouselView = new CarouselView();
        OnPointerEnteredBtnDelete = new Command(() => DeleteBtnBackground = Colors.Red);
        OnPointerExitedBtnDelete = new Command(() => DeleteBtnBackground = Colors.Transparent);
        //OnPointerEntered = new Command(() => BtnBackground = new Color(0x7F, 0x7F, 0x7F, 0x7F));
        //OnPointerExited = new Command(() => BtnBackground = Colors.Transparent);

#if ANDROID
#else
        IncrementMonth = new Command(() => UpdateLabelMonth(1));
        DecrementMonth = new Command(() => UpdateLabelMonth(-1));
        NavigateToday = new Command(LoadToday);
#endif

        calendars[0].LoadCalendar(Date.AddMonths(-1));
        calendars[1].LoadCalendar(Date);
        calendars[1].LoadSchedules();
        calendars[2].LoadCalendar(Date.AddMonths(1));

#if ANDROID
        carouselView.ItemTemplate = new DataTemplate(() =>
        {
            Calendar calendar = new();
            calendar.SetBinding(Calendar.CalendarDateProperty, "CalendarDate");
            calendar.LoadCalendar();
            return calendar;
        });
        carouselView.ItemsSource = calendars;
        carouselView.Position = 1;
        carouselView.PositionChanged += (sender, e) =>
        {
            if ((calendarIndex + 1) % 3 == e.CurrentPosition)
            {
                UpdateLabelMonth(1);
            }
            else
            {
                UpdateLabelMonth(-1);
            }
        };

        calendarTemplate = carouselView;
        
        IncrementMonth = new Command(() => carouselView.Position = (carouselView.Position + 1) % 3);
        DecrementMonth = new Command(() => carouselView.Position = (carouselView.Position + 2) % 3);
        NavigateToday = new Command(LoadToday);
#else
        calendarTemplate = calendars[calendarIndex];
#endif

        labelMonthText = Date.ToString("yyyy년 MM월");
    }

    private void UpdateLabelMonth(int month)
    {
        Date = Date.AddMonths(month);
        if (month > 0)
        {
            calendarIndex = (calendarIndex + 1) % 3;
            calendars[(calendarIndex + 1) % 3].LoadCalendar(Date.AddMonths(1));
        }
        else
        {
            calendarIndex = (calendarIndex + 2) % 3;
            calendars[(calendarIndex + 2) % 3].LoadCalendar(Date.AddMonths(-1));
        }
        LabelMonthText = Date.ToString("yyyy년 MM월");
#if !ANDROID
        calendars[calendarIndex].LoadSchedules();
        CalendarTemplate = calendars[calendarIndex];
#endif
    }

    private void LoadToday()
    {
        if (date != DateTime.Today)
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
                calendars[1].LoadSchedules();
                calendars[2].LoadCalendar(Date.AddMonths(1));
                CalendarTemplate = calendars[calendarIndex];
            }
        }
        else ReLoadCalendar();
    }

    private void ReLoadCalendar()
    {
        calendars[0].LoadCalendar(Date.AddMonths(-1));
        calendars[1].LoadCalendar(Date);
        calendars[1].LoadSchedules();
        calendars[2].LoadCalendar(Date.AddMonths(1));
    }

} // class MainViewModel
// namespace CROFFLE.xamls.ViewModels
