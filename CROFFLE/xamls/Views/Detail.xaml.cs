using DataManager.View;

namespace CROFFLE.xamls.Views;

[QueryProperty(nameof(contentsID), "contentsID")]
public partial class Detail : ContentPage
{
    private ComponentAll? componentAll;

    public string contentsID
    {
        get => contentsID;
        set
        {
            contentsID = Uri.UnescapeDataString(value);
            componentAll = new ComponentAllView().LoadComponent(contentsID);
        }
    }

    public Detail()
	{
		InitializeComponent();
	}
}