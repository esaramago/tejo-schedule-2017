
const App = {
    Data: {},
    Schedule: "barreiro",
    Day: "",
    Tabs: [
        {
            Label: "Dias Úteis",
            isSelected: true
        },
        {
            Label: "Sábados",
            isSelected: false
        },
        {
            Label: "Domingos e Feriados",
            isSelected: false
        }
    ],
    
    init() {
        this.getData();
        this.rendertabs();
        document.querySelector(".js-tabs").addEventListener("click", this.onSelectTab);
    },
    getData() {
        var app = this;
        firebase.database().ref().on("value", function (snapshot) {
            app.Data = snapshot.val();
        }, function (error) {
            console.log("Error: " + error.code);
        });
    },
    onSelectTab(e) {

        var _this = App;

        // get clicked tab
        var tab;
        if (e.target) {
            if (e.target.nodeName == "li") {
                tab = e.target;
            }
            else {
                tab = e.target.closest("li");
            }
        }
        
        for (let i = 0; i < _this.Tabs.length; i++) {
            // hide every tab
            _this.Tabs[i].isSelected = false;

            // hide every tabpanel
            document.getElementById("tabpanel" + i).setAttribute("aria-hidden", true);
        }

        // get selected tab index
        var tabIndex = tab.getAttribute("data-index");
        
        // show selected tab
        _this.Tabs[tabIndex].isSelected = true;
    
        // re-render tabs
        _this.rendertabs();

        // show selected tabpanel
        document.getElementById("tabpanel" + tabIndex).setAttribute("aria-hidden", false);

    },
    rendertabs() {

        var tabs = "";
        
        for (let i = 0; i < this.Tabs.length; i++) {
            tabs = tabs + `
                <li role="tab" tabindex="0" id="tab${i}" data-index="${i}" aria-controls="tabpanel${i}" aria-selected="${this.Tabs[i].isSelected}">
                    <span>${this.Tabs[i].Label}</span>
                </li>
            `
        }
        document.querySelector(".js-tabs").innerHTML = tabs;
    }
}
App.init();

class X {

}