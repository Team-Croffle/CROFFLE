using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace CROFFLE.xamls.Pages
{
    public abstract class SettingPages : Page
    {
        public SettingPages() : base() { }

        public abstract void Save();
    }
}
