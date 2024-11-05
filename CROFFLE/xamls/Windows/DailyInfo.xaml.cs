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
    /// Interaction logic for DailyInfo.xaml
    /// </summary>
    public partial class DailyInfo : Window
    {

        DateTime _date;
        public DailyInfo(DateTime date)
        {
            _date = date;
            InitializeComponent();
            test(_date);
        }

        private void test(DateTime date)
        {
            lb_annv_title.Content = date.ToString("yyyy-MM월-dd일");
        }
    }
}
