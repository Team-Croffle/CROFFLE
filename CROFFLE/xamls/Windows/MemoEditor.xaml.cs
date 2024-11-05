using CROFFLE.Classes;
using CROFFLE.xamls.Controls;
using System.Windows.Controls;
using System.Windows.Media;

using System.Windows;
using System.Windows.Input;

namespace CROFFLE.xamls.Windows
{

    /// <summary>
    /// MemoEditor.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class MemoEditor : Window
    {
        private Memos memo;
        private RoundButton color_btn;

        private DateTime memo_date;

        private string title;
        private string detailText;

        private bool isChanged = false;
        private bool isColorChanged = false;

        public MemoEditor(DateTime date)
        {
            memo = null;
            memo_date = date;
            InitializeComponent();
            WindowStartupLocation = WindowStartupLocation.CenterOwner;
        }
        public MemoEditor(string contentID)
        {
            memo = new Memos(contentID);
            memo_date = memo.whens;
            InitializeComponent();
            WindowStartupLocation = WindowStartupLocation.CenterOwner;
        } // MemoEditor

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            if (memo == null)
            {
                color_btn = btn_color1;
                isColorChanged = true;
                title = "";
                detailText = "";
            }
            else
            {
                memo.GetARGB(out Color color);
                color_btn = ButtonFind(color);
                title = memo.title;
                detailText = memo.detailText;

                tb_title.Text = memo.title;
                tb_memo.Text = memo.detailText;
                lb_title.Foreground = Brushes.Transparent;
                tb_memo.Foreground = Brushes.Transparent;

            }
            ChangeColor(color_btn);
            CheckChange();
        } // Window_Loaded

        #region 휴지통 아이콘 상호작용

        // delete event
        private void Btn_Delete_Click(object sender, RoutedEventArgs e)
        {
            if (memo == null) return;
            /*OkCancel_DIalog ok_Dialog = new OkCancel_DIalog("주의", "메모를 삭제하시겠습니까?");
            ok_Dialog.Owner = this;

            if (ok_Dialog.ShowDialog() == true)
            {
                memo.DeleteOnDB();
                RaiseEvent(new RoutedEventArgs(AskUpdate));
                Close();
            }*/
            memo.DeleteOnDB();
            Console.WriteLine("Delete working"); // test
            Close(); //test
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
        #endregion

        private void tb_TextChanged(object sender, TextChangedEventArgs e)
        {
            CheckChange();
        } // tb_TextChanged

        // textbox event
        private void tb_GotFocus(object sender, RoutedEventArgs e)
        {
            var tb = sender as TextBox;
            if (tb == null) return;

            if (tb == tb_title)
            {
                lb_title.Foreground = Brushes.Transparent;
            }
            if (tb == tb_memo)
            {
                lb_memo.Foreground = Brushes.Transparent;
            }
        } // tb_GotFocus

        private void tb_LostFocus(object sender, RoutedEventArgs e)
        {
            var tb = sender as TextBox;
            if (tb == null) return;

            if (tb == tb_title)
            {
                if (tb_title.Text == "") lb_title.Foreground = Brushes.LightGray;
            }
            if (tb == tb_memo)
            {
                if (tb_memo.Text == "") lb_memo.Foreground = Brushes.LightGray;
            }
        } // tb_LostFocus
        private void Btn_Color_Click(object sender, RoutedEventArgs e)
        {
            var btn = sender as RoundButton;
            if (btn == null) return;

            ChangeColor(btn);
            color_btn = btn;

            if (memo != null)
            {
                memo.GetARGB(out Color color);
                isColorChanged = !ButtonFind(color).Equals(color_btn);
                Console.WriteLine("color Changed!!!!!!! = " + isColorChanged.ToString()); //test
            }
            CheckChange();
        } // Btn_Color_Click

        private void CheckChange()
        {
            bool changed = !(tb_title.Text == title && tb_memo.Text == detailText);
            if (memo != null) changed = changed || isColorChanged;
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
            if (color.Equals(((SolidColorBrush)btn_color1.ButtonColor).Color))
            {
                Console.WriteLine("color1 is same!!!!!!"); //test
                return btn_color1;
            }
            if (color.Equals(((SolidColorBrush)btn_color2.ButtonColor).Color)) return btn_color2;
            if (color.Equals(((SolidColorBrush)btn_color3.ButtonColor).Color)) return btn_color3;

            return null;
        } // ColorChecker
        #endregion

        #region Footer
        // 변수명 바꿔야함
        private void MouseClick_Save(object sender, RoutedEventArgs e)
        {
            if (!isChanged) return;
            if (tb_title.Text == string.Empty)
            {
                /*ConfirmDialog ok_Dialog = new ConfirmDialog("주의", "제목을 입력해주세요.");
                ok_Dialog.Owner = this;
                ok_Dialog.ShowDialog();*/
                return;
            }
            if (tb_memo.Text == string.Empty)
            {
                /*ConfirmDialog ok_Dialog = new ConfirmDialog("주의", "내용을 입력해주세요.");
                ok_Dialog.Owner = this;
                ok_Dialog.ShowDialog();*/
                return;
            }

            if (memo == null) memo = new Memos();
            var color = ((SolidColorBrush)(BorderFind(color_btn).ButtonColor)).Color;
            memo.FromARGB(color);
            memo.whens = memo_date;
            memo.title = tb_title.Text;
            memo.detailText = tb_memo.Text;
            memo.SaveOnDB();

            /*RaiseEvent(new RoutedEventArgs(AskUpdate));*/

            Close();
        } // MouseClick_Save

        private void MouseClick_Close(object sender, RoutedEventArgs e)
        {
            /*if (!isChanged) { Close(); return; }
            OkCancel_DIalog ok_Dialog = new OkCancel_DIalog("주의", "저장하지 않았습니다. 취소하시겠습니까?");
            ok_Dialog.Owner = this;

            if (ok_Dialog.ShowDialog() == true)
            {
                Close();
            }*/
            Close(); // test
        } // MouseClick_Close
        #endregion
    }
}