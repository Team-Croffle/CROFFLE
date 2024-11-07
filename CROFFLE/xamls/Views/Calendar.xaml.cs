namespace CROFFLE.xamls.Views;

public partial class Calendar : ContentView
{
    public static readonly BindableProperty CalendarDateProperty = BindableProperty.Create("CalendarDate", typeof(DateTime), typeof(Calendar), DateTime.Today, BindingMode.OneWay, null, delegate (BindableObject bindable, object oldvalue, object newvalue)
    {
        Calendar calendar = (Calendar)bindable;
        calendar.LoadCalendar((DateTime)newvalue);
    });

    public DateTime CalendarDate
    {
        get => calendar_date;
        set => SetValue(CalendarDateProperty, value);
    }

    private DateTime calendar_date = DateTime.Today;

    public Calendar()
    {
        InitializeComponent();
    }

    public void LoadCalendar(DateTime date)
    {
        calendar_date = date;
        DateTime firstDayOfMonth = new(date.Year, date.Month, 1);

        var daysOfFirstWeek = (int)firstDayOfMonth.DayOfWeek;
        var datePointer = firstDayOfMonth.AddDays(-daysOfFirstWeek);
        if (datePointer.Day < 7) datePointer = datePointer.AddDays(-7);

        Grid_Calendar.Children.Clear();

        for (int row = 0; row < 6; row++)
        {
            for (int col = 0; col < 7; col++)
            {
                if (datePointer == DateTime.Today)
                {
                    DataTemplate borderTemplate = (DataTemplate)Resources["TodayBorder"];

                    Border border = (Border)borderTemplate.CreateContent();
                    Grid.SetRow(border, row);
                    Grid.SetColumn(border, col);
                    Grid_Calendar.Children.Add(border);
                }
                DataTemplate template = (DataTemplate)Resources["MyLabel"];

                Label label = (Label)template.CreateContent();
                label.Text = datePointer.Day.ToString();

                if (datePointer.Month != date.Month)
                {
                    label.TextColor = Color.FromArgb("#919191");
                }

                Grid.SetRow(label, row);
                Grid.SetColumn(label, col);
                Grid_Calendar.Children.Add(label);


                datePointer = datePointer.AddDays(1);
            }
        }
    }
}