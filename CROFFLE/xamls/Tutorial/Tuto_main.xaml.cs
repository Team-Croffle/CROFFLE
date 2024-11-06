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

namespace CROFFLE.xamls.Tutorial
{
    /// <summary>
    /// Tuto_main.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class Tuto_main : Page
    {
        public Tuto_main()
        {
            InitializeComponent();

        }


        private void tutoMainMoveBtn_Click(object sender, RoutedEventArgs e)
        {
            var main_Screen_tuto = new Main_Screen_tuto();
            NavigationService.Navigate(main_Screen_tuto);


        }

        private void tutoLoginBtn_Click(object sender, RoutedEventArgs e)
        {
            var login_tuto = new Login_tuto();
            NavigationService.Navigate(login_tuto);
        }

        private void tutoDailyBtn_Click(object sender, RoutedEventArgs e)
        {
            var daily_tuto = new Daily_tuto();
            NavigationService.Navigate(daily_tuto);
        }

        private void tutoEditorBtn_Click(object sender, RoutedEventArgs e)
        {
            var editor_tuto = new Editor_tuto();
            NavigationService.Navigate(editor_tuto);
        }

    }
}
