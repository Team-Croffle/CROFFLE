using CROFFLE.xamls.Controls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace CROFFLE.xamls.Windows
{
    /// <summary>
    /// ScheduleEditor.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class ScheduleEditor : Window
    {

        private RoundButton color_btn;

        public ScheduleEditor()
        {
            InitializeComponent();
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
            /*if (task != null) changed = changed || isColorChanged;
            if (task != null) changed = changed || sw_alarm.state != task.bAlarm || sw_done.state != task.bDone;
            if (task != null) changed = changed || deadline != task.deadline;
            if (changed)
            {
                isChanged = true;
                lb_OK.Foreground = Brushes.White;
            }
            else
            {
                isChanged = false;
                lb_OK.Foreground = Brushes.DimGray;
            }*/
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
            /*if (!isChanged) return;
            if (tb_title.Text == string.Empty)
            {
                ConfirmDialog ok_Dialog = new ConfirmDialog("주의", "제목을 입력해주세요.");
                ok_Dialog.Owner = this;
                ok_Dialog.ShowDialog();
                return;
            }
            if (task == null) task = new Tasks();
            var color = ((SolidColorBrush)BorderFind(color_btn).Background).Color;
            task.FromARGB(color);
            task.title = tb_title.Text;
            task.deadline = deadline;
            task.whens = deadline.Date;
            task.bAlarm = sw_alarm.state;
            task.bDone = sw_done.state;
            task.SaveOnDB();

            RaiseEvent(new RoutedEventArgs(AskUpdate));*/

            Close();
        } // MouseClick_Save

        private void MouseClick_Close(object sender, RoutedEventArgs e)
        {
            /* if (!isChanged) { Close(); return; }
             OkCancel_DIalog ok_Dialog = new OkCancel_DIalog("주의", "저장하지 않았습니다. 취소하시겠습니까?");
             ok_Dialog.Owner = this;

             if (ok_Dialog.ShowDialog() == true)
             {
                 Close();
             }*/
        } // MouseClick_Close
        #endregion
    }
}
