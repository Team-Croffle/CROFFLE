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
    /// WaffleNotice.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class WaffleNotice : Page
    {
        public WaffleNotice()
        {
            InitializeComponent();
        }

        private void ComboBox_Initialized(object sender, EventArgs e)
        {
            array_ComboBox.Items.Add("일자 순");
            array_ComboBox.Items.Add("과목 순");

            array_ComboBox.Text = "일자 순";
        }
    }
}
