using AnniversaryAPI;
using AnniversaryAPI.Scheme;
using CroffleLogManager;
using DataManager.View;
using Microsoft.Maui.Controls.Shapes;

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
    private DateTime startPointer;
    private bool[][][] labelExists;
    private readonly SQLiteDBAnnv annvDB;
    private ComponentView? scheList;

    public Calendar()
    {
        InitializeComponent();
        annvDB = new SQLiteDBAnnv();
        annvDB.DB_Init();
        labelExists = new bool[6][][];
        for (int i = 0; i < 6; i++)
        {
            labelExists[i] = new bool[7][];
        }
    }

    public Calendar(DateTime date) : this()
    {
        CalendarDate = date;
        LoadCalendar(CalendarDate);
    }

    public void LoadCalendar()
    {
        LoadCalendar(calendar_date);
    }

    public void LoadSchedules(object sender, EventArgs e)
    {
        LoadSchedules();
    }

    public void LoadCalendar(DateTime date)
    {
        Log.LogInfo($@"[Calendar] LoadCalendar");
        calendar_date = date;
        DateTime firstDayOfMonth = new(date.Year, date.Month, 1);

        var daysOfFirstWeek = (int)firstDayOfMonth.DayOfWeek;
        startPointer = firstDayOfMonth.AddDays(-daysOfFirstWeek);
        if (startPointer.Day < 7) startPointer = startPointer.AddDays(-7);
        var datePointer = new DateTime(startPointer.Year, startPointer.Month, startPointer.Day);

        Grid_Calendar.Children.Clear();

        for (int row = 0; row < 6; row++)
        {
            for (int col = 0; col < 7; col++)
            {
                if (datePointer == DateTime.Today)
                {
                    DataTemplate borderTemplate = (DataTemplate)Resources["TodayBorder"];

                    Border border = (Border)borderTemplate.CreateContent();
                    Grid.SetRow(border, row * 5);
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

                if(datePointer.DayOfWeek == DayOfWeek.Sunday)
                {
                    label.TextColor = Colors.IndianRed;
                }
                else if(datePointer.DayOfWeek == DayOfWeek.Saturday)
                {
                    label.TextColor = Colors.RoyalBlue;
                }
                
                if (annvDB.IsHoliday(datePointer))
                {
                    label.TextColor = Colors.IndianRed;
                }


                Grid.SetRow(label, row * 5);
                Grid.SetColumn(label, col);
                Grid_Calendar.Children.Add(label);

                datePointer = datePointer.AddDays(1);
            }
        }
        //Log.LogInfo("[Calendar] LoadCalendar: Done");
    }

    public void LoadSchedules()
    {
        Log.LogInfo("[Calendar] LoadSchedules");

        Grid_Calendar_Schedule.Children.Clear();

        for (int i = 0; i < 6; i++)
        {
            for (int j = 0; j < 7; j++)
            {
                labelExists[i][j] = new bool[3];
                for (int k = 0; k < 3; k++)
                {
                    labelExists[i][j][k] = false;
                }
            }
        }
        DateTime firstDayOfMonth = new(calendar_date.Year, calendar_date.Month, 1);
        DateTime lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

        //Log.LogInfo("[Calendar] LoadSchedules: Load Anniversaries");
        var annvList = annvDB.GetItems<Anniversary>(t => t.locdate >= firstDayOfMonth && t.locdate <= lastDayOfMonth, t => t.locdate);
        if (annvList is not null)
            foreach (var al in annvList)
            {
                var index = (al.locdate - startPointer).Days;
                var row = index / 7;
                var col = index % 7;
                if (labelExists[row][col][1] && !al.isHoliday) continue;
                var label = (Label)((DataTemplate)Resources["ContentAnnvLabel"]).CreateContent();
                label.Text = al.dateName;
                if (al.isHoliday) label.TextColor = Colors.Red;
                Grid.SetRow(label, row * 5 + 1);
                Grid.SetColumn(label, col);
                if (labelExists[row][col][1]) Grid_Calendar_Schedule.Children.RemoveAt(Grid_Calendar_Schedule.Children.Count - 1);
                Grid_Calendar_Schedule.Children.Add(label);
                labelExists[row][col][1] = true;
            }

        //Log.LogInfo("[Calendar] LoadSchedules: Load Components");
        //Log.LogInfo("[Calendar] LoadSchedules: Initialize Label Number Array");
        for (int row = 0; row < 6; row++)
        {
            for (int col = 0; col < 7; col++)
            {
                for (int lbCount = 0; lbCount < 3; lbCount++)
                    labelExists[row][col][lbCount] = false;
            }
        }

        //Log.LogInfo("[Calendar] LoadSchedules: Draw Components");
        scheList = new();

        if (AppSetting.ShowDone) scheList.LoadComponent(firstDayOfMonth, lastDayOfMonth);
        else scheList.LoadComponent(firstDayOfMonth, lastDayOfMonth, false);

        if (scheList.ListAll is null) return;

        var count = scheList.ListAll.Count();
        //Log.LogInfo($@"[Calendar] LoadSchedules: Count - {count}");

        if (count is 0) return;
        foreach (Components sche in scheList.ListAll)
        {
            DrawContentLabelAlgorithm(sche);
        }
        //Log.LogInfo("[Calendar] LoadSchedules: Done");
    }

    private void DrawContentLabelAlgorithm(Components components)
    {
        //Log.LogInfo("[Calendar] DrawContentLabelAlgorithm");
        var startRow = (components.start_time - startPointer).Days / 7;
        var startCol = (components.start_time - startPointer).Days % 7;
        var scheduleLength = (components.end_time - components.start_time).Days + 1;
        var needLabelCount = (startCol + scheduleLength) / 7;
        if ((startCol + scheduleLength) % 7 > 0) needLabelCount += 1;
        int actualRow, canDraw, actualLength;
        
        //Log.LogInfo($@"[Calendar] DrawContentLabelAlgorithm: Label Count - {needLabelCount}");
        //Log.LogInfo($@"[Calendar] DCLA: {components.title} {components.start_time:yyyy-MM-dd} {components.end_time:yyyy-MM-dd} {startRow} {startCol} {scheduleLength} {needLabelCount}");
        if (needLabelCount == 1)
        {
            canDraw = CheckCanDraw(startRow, startCol, scheduleLength);
            //Log.LogWarn($@"[Calendar] DrawContentLabelAlgorithm: canDraw - {canDraw}");
            if (canDraw == -1) return;
            actualRow = startRow * 5 + 2 + canDraw;
            DrawMyLabel(actualRow, startCol, scheduleLength, components.title ?? "", Color.FromInt(components.color), 3);
            DrawRecog(startRow, startCol, scheduleLength, canDraw);
        }
        else
        {
            canDraw = CheckCanDraw(startRow, startCol, 7 - startCol);
            //Log.LogWarn($@"[Calendar] DrawContentLabelAlgorithm: canDraw - {canDraw}");
            if (canDraw is not -1)
            {
                actualRow = startRow * 5 + 2 + canDraw;
                DrawMyLabel(actualRow, startCol, 7 - startCol, components.title ?? "", Color.FromInt(components.color), 0);
                DrawRecog(startRow, startCol, 7 - startCol, canDraw);
            }
            for (int i = 1; i < needLabelCount - 1; i++)
            {
                canDraw = CheckCanDraw(startRow + i, 0, 7);
                //Log.LogWarn($@"[Calendar] DrawContentLabelAlgorithm: canDraw - {canDraw}");
                if (canDraw is not -1)
                {
                    actualRow = (startRow + i) * 5 + 2 + canDraw;
                    DrawMyLabel(actualRow, 0, 7, components.title ?? "", Color.FromInt(components.color), 1);
                    DrawRecog(startRow + i, 0, 7, canDraw);
                }
            }

            canDraw = CheckCanDraw(startRow + needLabelCount - 1, 0, (startCol + scheduleLength) % 7);
            //Log.LogWarn($@"[Calendar] DrawContentLabelAlgorithm: canDraw - {canDraw}");
            if (canDraw is not -1){
                actualRow = (startRow + needLabelCount - 1) * 5 + 2 + canDraw;
                actualLength = (startCol + scheduleLength) % 7;
                if (actualLength == 0) actualLength = 7;
                DrawMyLabel(actualRow, 0, actualLength, components.title ?? "",
                    Color.FromInt(components.color), 2);
                DrawRecog(startRow + needLabelCount - 1, 0, (startCol + scheduleLength) % 7, canDraw);
            }
        }
    }

    private int CheckCanDraw(int row, int startCol, int length)
    {
        //Log.LogInfo($@"[Calendar] DrawMyLabel: row - {row}, col - {startCol}, length - {length}");
        for (int i = 0; i < 3; i++)
        {
            for (int col = startCol; col < startCol + length; col++)
            {
                if (labelExists[row][col][i]) break;
                if (col == startCol + length - 1) return i;
            }
        }
        return -1;
    }

    private void DrawMyLabel(int row, int col, int length, string text, Color background, int type)
    {
        Border border = new()
        {
            Stroke = Colors.Transparent,
            BackgroundColor = background,
            StrokeShape = new RoundRectangle()
            {
                CornerRadius = type == 0 ? new CornerRadius(10, 0, 10, 0)
                : type == 1 ? new CornerRadius(0)
                : type == 2 ? new CornerRadius(0, 10, 0, 10)
                : new CornerRadius(10)
            }
        };
        Grid.SetRow(border, row);
        Grid.SetColumn(border, col);
        Grid.SetColumnSpan(border, length);
        Grid_Calendar_Schedule.Children.Add(border);


        var Label = (Label)((DataTemplate)Resources["ContentLabel"]).CreateContent();
        if (text.Length > 10) text = text.Substring(0, 10) + "...";
        Label.Text = text;
        Label.BackgroundColor = Colors.Transparent;
        Grid.SetRow(Label, row);
        Grid.SetColumn(Label, col);
        Grid.SetColumnSpan(Label, length);
        Grid_Calendar_Schedule.Children.Add(Label);
    }
    private void DrawRecog(int row, int col, int length, int canDraw)
    {
        for(int i = 0; i < length; i++)
        {
            labelExists[row][col + i][canDraw] = true;
        }
    }

    private async void Cal_Clicked(object sender, EventArgs e)
    {
        var obj = (Button)sender;
        var col = Grid.GetColumn(obj);
        var row = Grid.GetRow(obj);
        var selected = startPointer.AddDays(col + row * 7);
        //Log.LogInfo($@"[Calendar] Cal_Clicked: row - {row}, col - {col}");
        Log.LogInfo($@"[Calendar] Cal_Clicked: {selected:yyyy-MM-dd}");
        var navigationParameter = new ShellNavigationQueryParameters
        {
            { "date", selected.ToString() }
        };
        await Shell.Current.GoToAsync($"DailyInfo", navigationParameter);
    }
}