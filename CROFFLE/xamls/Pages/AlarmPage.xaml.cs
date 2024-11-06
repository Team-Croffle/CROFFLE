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
    /// AlarmPage.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class AlarmPage : Page
    {
        public AlarmPage()
        {
            InitializeComponent();
        }

        private void keep_ComboBox_Initialized(object sender, EventArgs e)
        {
            for (int i = 5; i <= 30; i += 5)
            {
                keep_ComboBox.Items.Add(i.ToString() + "초");
            }
            keep_ComboBox.Text = "5초";
        }

        private void time_ComboBox_Initialized(object sender, EventArgs e)
        {
            for (int i = 1; i <= 2; i += 1)
            {
                time_ComboBox.Items.Add(i.ToString() + "시간 전");
            }
            for (int i = 6; i <= 24; i += 6)
            {
                time_ComboBox.Items.Add(i.ToString() + "시간 전");
            }
            time_ComboBox.Text = "1시간 전";
        }

        private void repeat_ComboBox_Initialized(object sender, EventArgs e)
        {
            for (int i = 5; i <= 30; i += 5)
            {
                repeat_ComboBox.Items.Add(i.ToString() + "분 마다");
            }
            repeat_ComboBox.Text = "5분 마다";
        }
    }
}
