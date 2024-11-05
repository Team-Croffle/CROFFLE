using CROFFLE.Classes;
using CROFFLE.xamls.Controls;
using CROFFLE.xamls.Dialog;
using CroffleDataManager.SQLiteDB;
using System.Data;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;

namespace CROFFLE.xamls.Windows
{

    /// <summary>
    /// MemoEditor.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class TaskEditor : Window
    {
        private Tasks task;
        private RoundButton color_btn;

        private DateTime deadline;

        private string title;

        private SQLiteDB db;

        private bool isChanged = false;
        private bool isColorChanged = false;

        public TaskEditor(DateTime date)
        {
            InitializeComponent();
            db = new SQLiteDB();
            task = null;
            deadline = date.AddHours(DateTime.Now.Hour);
            deadline = deadline.AddMinutes(DateTime.Now.Minute);
            WindowStartupLocation = WindowStartupLocation.CenterOwner;
        }
        public TaskEditor(string contentID)
        {
            InitializeComponent();
            task = new Tasks(contentID);
            db = new SQLiteDB();
            WindowStartupLocation = WindowStartupLocation.CenterOwner;
        }
        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            if (task == null)
            {
                color_btn = btn_color1;
                isColorChanged = true;
                title = "";
            }
            else
            {
                task.GetARGB(out Color color);
                color_btn = ButtonFind(color);
                title = task.title;
                deadline = task.deadline;

                tb_title.Text = title;
                lb_deadLine.Content = deadline.ToString("yyyy년 MM월 dd일 HH시 mm분");
                /*sw_alarm.state = task.bAlarm;
                sw_done.state = task.bDone;*/

                lb_title.Foreground = Brushes.Transparent;
            }
            ChangeColor(color_btn);
            CheckChange();
        }
        private void Btn_Delete_Click(object sender, RoutedEventArgs e)
        {
            /*if (task == null) return;
            OkCancel_DIalog ok_Dialog = new OkCancel_DIalog("주의", "메모를 삭제하시겠습니까?");
            ok_Dialog.Owner = this;

            if (ok_Dialog.ShowDialog() == true)
            {
                task.DeleteOnDB();
                RaiseEvent(new RoutedEventArgs(AskUpdate));
                Close();
            }*/
            task.DeleteOnDB(); // test
            Console.WriteLine("Task delete_btn ok"); // test
        } // Btn_Delete_Click

        private void btn_delete_MouseEnter(object sender, MouseEventArgs e)
        {
            img_delete.Opacity = 1;
            img_delete.Source = new ImageSourceConverter().ConvertFromString("../../../Icon/trash-can-red.png") as ImageSource;
        }

        private void btn_delete_MouseLeave(object sender, MouseEventArgs e)
        {
            img_delete.Opacity = 0.5;
            img_delete.Source = new ImageSourceConverter().ConvertFromString("../../../Icon/trash-can-solid.png") as ImageSource;
        }

        private void tb_title_TextChanged(object sender, TextChangedEventArgs e)
        {
            CheckChange();
        }

        private void tb_title_GotFocus(object sender, RoutedEventArgs e)
        {
            TextBox tb = (TextBox)sender;
            if (tb == null) return;

            if (tb == tb_title)
            {
                lb_title.Foreground = Brushes.Transparent;
            }
        }
        private void tb_title_LostFocus(object sender, RoutedEventArgs e)
        {
            var tb = sender as TextBox;
            if (tb == null) return;

            if (tb == tb_title)
            {
                if (tb_title.Text == "") lb_title.Foreground = Brushes.DimGray;
            }
        }

        // EditorCalendar Open
        private void Btn_Deadline_Click(object sender, RoutedEventArgs e)
        {
            EditorCalendar editorCalendar = new EditorCalendar(deadline);
            // editorCalendar를 현 마우스 위치에 띄운다.
            editorCalendar.WindowStartupLocation = WindowStartupLocation.Manual;
            Point mousePosition = Mouse.GetPosition(Application.Current.MainWindow);
            editorCalendar.Left = mousePosition.X + Application.Current.MainWindow.Left;
            editorCalendar.Top = mousePosition.Y + Application.Current.MainWindow.Top;
            if (editorCalendar.ShowDialog() == true)
            {
                db.LoadOnDB("date_temp", out DataTable table);
                var selectedValue = table.Rows[0]["value"].ToString();
                deadline = DateTime.Parse(selectedValue);
                lb_deadLine.Content = deadline.ToString("시작: yyyy년 MM월 dd일 HH시 mm분");
                isChanged = true;
                db.ResetTable("date_temp");
            }
            CheckChange();
        }

        private void btn_Color_Click(object sender, RoutedEventArgs e)
        {
            var btn = sender as RoundButton;
            if (btn == null) return;

            ChangeColor(btn);
            color_btn = btn;

            /*if (task != null)
            {
                task.GetARGB(out Color color);
                isColorChanged = !ButtonFind(color).Equals(color_btn);
            }*/
            CheckChange();
        }

        /*function area*/
        private void CheckChange()
        {
            bool changed = tb_title.Text != title;
            if (task != null) changed = changed || isColorChanged;
            /*if (task != null) changed = changed || sw_alarm.state != task.bAlarm || sw_done.state != task.bDone;*/
            if (task != null) changed = changed || deadline != task.deadline;
            if (changed)
            {
                isChanged = true;
                btn_ok.Foreground = Brushes.White;
            }
            else
            {
                isChanged = false;
                btn_ok.Foreground = Brushes.DimGray;
            }
        } // CheckChange

        #region ColorChange
        private void ChangeColor(RoundButton button)
        {
            var border = BorderFind(color_btn);
            if (border != null) border.ButtonBorderThickness = new Thickness(0);
            border = BorderFind(button);
            if (border != null) border.ButtonBorderThickness = new Thickness(3);
        } // ChangeColor

        private RoundButton BorderFind(RoundButton button)
        {
            if (button == btn_color1) return btn_color1;
            if (button == btn_color2) return btn_color2;
            if (button == btn_color3) return btn_color3;

            return null;
        } // BorderFind

        private RoundButton ButtonFind(Color color)
        {
            if (color.Equals(((SolidColorBrush)btn_color1.Background).Color)) return btn_color1;
            if (color.Equals(((SolidColorBrush)btn_color2.Background).Color)) return btn_color2;
            if (color.Equals(((SolidColorBrush)btn_color3.Background).Color)) return btn_color3;

            return null;
        } // ColorChecker
        #endregion

        #region Footer
        private void MouseClick_Save(object sender, RoutedEventArgs e)
        {
            if (!isChanged) return;
            if (tb_title.Text == string.Empty)
            {
                /*ConfirmDialog ok_Dialog = new ConfirmDialog("주의", "제목을 입력해주세요.");
                ok_Dialog.Owner = this;
                ok_Dialog.ShowDialog();*/
                Console.WriteLine("Warning : no title"); //test
                return;
            }
            if (task == null) task = new Tasks();
            /*Console.WriteLine("What the fuck who are you" + ((SolidColorBrush)BorderFind(color_btn).ButtonColor).Color);*/
            var color = ((SolidColorBrush)(BorderFind(color_btn).ButtonColor)).Color;
            task.FromARGB(color);
            task.title = tb_title.Text;
            task.deadline = deadline;
            task.whens = deadline.Date;
            /*task.bAlarm = sw_alarm.state;
            task.bDone = sw_done.state;*/
            task.bAlarm = false;
            task.bDone = false;
            task.SaveOnDB();

            /*RaiseEvent(new RoutedEventArgs(AskUpdate));*/

            Close();
        } // MouseClick_Save

        private void MouseClick_Close(object sender, RoutedEventArgs e)
        {
            if (!isChanged) { Close(); return; }
            /*OkCancel_DIalog ok_Dialog = new OkCancel_DIalog("주의", "저장하지 않았습니다. 취소하시겠습니까?");
            ok_Dialog.Owner = this;*/

            /*if (ok_Dialog.ShowDialog() == true)
            {
                Close();
            }*/
            Close();
        } // MouseClick_Close
        #endregion
    }
}
