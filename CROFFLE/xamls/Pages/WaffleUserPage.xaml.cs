using CROFFLE.Classes;
using CROFFLE.xamls.Dialog;
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
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace CROFFLE.xamls.Pages
{
    /// <summary>
    /// WaffleUserPage.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class WaffleUserPage : LoginPage
    {
        Settings settings;
        internal WaffleUserPage(Settings settings)
        {
            InitializeComponent();
            this.settings = settings;
            lb_welcome.Content = $@"{settings.sno} {settings.sname}님 안녕하세요!";
        }


        private void Hyperlink_Request(object sender, RequestNavigateEventArgs e)
        {
            System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo(e.Uri.AbsoluteUri));
            e.Handled = true;
        }

        private void Logout_btn_Click(object sender, RoutedEventArgs e)
        {
            OkCancel_DIalog dialog = new OkCancel_DIalog("로그아웃 하시겠습니까?");
            dialog.Owner = Window.GetWindow(this);
            if (dialog.ShowDialog() == true)
            {
                settings.RemoveAccount();
                settings.logged_in = false;
                RaiseEvent(new RoutedEventArgs(LoggedChangeEvent));
            }
        }
    }
}
