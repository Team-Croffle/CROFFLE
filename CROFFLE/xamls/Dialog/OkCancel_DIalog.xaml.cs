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

namespace CROFFLE.xamls.Dialog
{
    /// <summary>
    /// OkCancel_DIalog.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class OkCancel_DIalog : Window
    {
        public OkCancel_DIalog()
        {
            InitializeComponent();
            WindowStartupLocation = WindowStartupLocation.CenterOwner;
        }

        public OkCancel_DIalog(string message)
        {
            InitializeComponent();
            WindowStartupLocation = WindowStartupLocation.CenterOwner;
            description.Content = message;
        }

        private void MouseDragTitle(object sender, MouseButtonEventArgs e)
        {
            if (e.LeftButton == MouseButtonState.Pressed)
            {
                DragMove();
            }
        }

        private void OKButton_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = true;
        }

        private void MouseClick_Close(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}
