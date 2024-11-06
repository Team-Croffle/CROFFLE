using CROFFLE.Classes;
using CROFFLE.xamls.Controls;
using CROFFLE.xamls.Dialog;
using CROFFLE.xamls.Pages;
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
    /// Preferences.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class Preferences : Window
    {
        public static RoutedEvent SettingChanged = EventManager.RegisterRoutedEvent(
            "SettingChanged", RoutingStrategy.Bubble, typeof(RoutedEventHandler), typeof(Preferences));
        public event RoutedEventHandler SettingChange
        {
            add { AddHandler(SettingChanged, value); }
            remove { RemoveHandler(SettingChanged, value); }
        }

        private Settings setting;
        private SettingPages settingPages;

        private SolidColorBrush activateColor = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#ffd8a3"));
        private SolidColorBrush activateText = Brushes.White;
        private SolidColorBrush standardColor = Brushes.LightGray;
        private SolidColorBrush standardText = Brushes.Black;


        internal Preferences(Settings settings)
        {
            InitializeComponent();

            setting = settings;

            settings.LoadAccount();
            settings.LoadSetting();

            mainFrame.Navigate(new GeneralPage());
            mainFrame.Content = settingPages;
        }

        private void Check_Login()
        {
            if (setting.logged_in)
            {
                settingPages = new WaffleUserPage(setting);
            }
            else
            {
                settingPages = new WaffleLoginPage(ref setting);
            }
            ((LoginPage)settingPages).LoggedChange += WafflePage_LoggedChange;
        }

        internal void CheckSave()
        {
            if (settingPages.GetType() == typeof(LoginPage) || settingPages.GetType() == typeof(InfoPage))
            {
                return;
            }
            var dialog = new OkCancel_DIalog("저장하시겠습니까?");
            dialog.Owner = this;

            //세팅 저장
            if (dialog.ShowDialog() == true)
            {
                settingPages.Save();
                new ConfirmDialog("저장되었습니다.") { Owner = this }.ShowDialog();
            }
        }

        private void btn_general_Click(object sender, RoutedEventArgs e)
        {
            mainFrame.Navigate(new GeneralPage());
            btn_general.ButtonColor = activateColor;
            btn_general.ButtonForeground = activateText;
            btn_alarm.ButtonColor = standardColor;
            btn_alarm.ButtonForeground = standardText;
            btn_waffle.ButtonColor = standardColor;
            btn_waffle.ButtonForeground = standardText;
            btn_info.ButtonColor = standardColor;
            btn_info.ButtonForeground = standardText;

        }

        private void btn_alarm_Click(object sender, RoutedEventArgs e)
        {
            mainFrame.Navigate(new AlarmPage());
            btn_general.ButtonColor = standardColor;
            btn_general.ButtonForeground = standardText;
            btn_alarm.ButtonColor = activateColor;
            btn_alarm.ButtonForeground = activateText;
            btn_waffle.ButtonColor = standardColor;
            btn_waffle.ButtonForeground = standardText;
            btn_info.ButtonColor = standardColor;
            btn_info.ButtonForeground = standardText;
        }

        private void btn_waffle_Click(object sender, RoutedEventArgs e)
        {
            Check_Login();
            mainFrame.Content = settingPages;
            btn_general.ButtonColor = standardColor;
            btn_general.ButtonForeground = standardText;
            btn_alarm.ButtonColor = standardColor;
            btn_alarm.ButtonForeground = standardText;
            btn_waffle.ButtonColor = activateColor;
            btn_waffle.ButtonForeground = activateText;
            btn_info.ButtonColor = standardColor;
            btn_info.ButtonForeground = standardText;
        }

        private void btn_info_Click(object sender, RoutedEventArgs e)
        {
            mainFrame.Navigate(new InfoPage());
            btn_general.ButtonColor = standardColor;
            btn_general.ButtonForeground = standardText;
            btn_alarm.ButtonColor = standardColor;
            btn_alarm.ButtonForeground = standardText;
            btn_waffle.ButtonColor = standardColor;
            btn_waffle.ButtonForeground = standardText;
            btn_info.ButtonColor = activateColor;
            btn_info.ButtonForeground = activateText;
        }

        private void btn_ok(object sender, RoutedEventArgs e)
        {
            settingPages.Save();
        }

        private void btn_cancel_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void WafflePage_LoggedChange(object sender, RoutedEventArgs e)
        {
            Visibility = Visibility.Collapsed;
            RaiseEvent(new RoutedEventArgs(SettingChanged));
            Close();
        }
    }
}
