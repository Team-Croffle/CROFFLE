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
    /// Daily_tuto.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class Daily_tuto : Page
    {
        public Daily_tuto()
        {
            InitializeComponent();
        }

        private void previous_Click(object sender, RoutedEventArgs e)
        {
            var tuto_main = new Tuto_main();
            NavigationService.Navigate(tuto_main);
        }
    }
}

