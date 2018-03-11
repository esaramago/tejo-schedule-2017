
const App = {
    Days: null,
    Hubs: null,
    Schedules: null,

    Current: {
        Day: null,
        Hub: null,
        Schedule: null
    },

    DOM: {
        Title: document.querySelector(".js-title"),
        Tabs: document.querySelector(".js-tabs"),
        TabPanels: document.querySelector(".js-tabpanels")
    },
    
    init() {
        this.getData();
    },
    getData() {

        this.Days = data.days;
        this.Hubs = data.hubs;
        this.Schedules = data.schedules;

        this.firstRender();

        /*
        // get data via Firebase (much slower)
        var _this = this;
        firebase.database().ref().on("value", function (snapshot) {

            // set data
            var data = snapshot.val();
            _this.Days = data.days;
            _this.Hubs = data.hubs;
            _this.Schedules = data.schedules;

            _this.firstRender();

        }, function (error) {
            console.log("Error: " + error.code);
        }); */
    },
    firstRender() {
        this.Current.Hub = this.Hubs[0];
        this.renderTitle();

        this.setCurrentDayTab();
        this.setCurrentSchedule();

    },
    renderTitle() {
        var stations = this.Current.Hub.stations;
        this.DOM.Title.textContent = `${stations[0].name} - ${stations[1].name}`
    },
    setCurrentDayTab() {

        // get current tab id
        var today = getCurrentDay();

        for (var [i, item] in this.Days) {
            var tab = this.Days[i];

            if (tab.id === today) {

                // activate correct tab
                tab.isSelected = true;
                this.Current.Day = tab;

                this.rendertabs();
                return;
            }
        }
    },
    rendertabs() {

        var tabs = "";
        for (let i = 0; i < this.Days.length; i++) {
            var tab = this.Days[i];

            tabs = tabs + `
                <li role="tab" tabindex="0" id="tab${i}" data-index="${i}" aria-controls="tabpanel${i}" aria-selected="${tab.isSelected}" onclick="App.onSelectTab(this)">
                    <span>${tab.label}</span>
                </li>
            `
        }
        this.DOM.Tabs.innerHTML = tabs;
    },
    onSelectTab(e) {

        var _this = App;

        for (let i = 0; i < _this.Days.length; i++) {
            // hide every tab
            _this.Days[i].isSelected = false;

            // hide every tabpanel
            document.getElementById("tabpanel" + i).setAttribute("aria-hidden", true);
        }

        // get selected tab index
        var tab = e;
        var tabIndex = tab.getAttribute("data-index");

        // show selected tab
        _this.Days[tabIndex].isSelected = true;

        // re-render tabs
        _this.rendertabs();

        // show selected tabpanel
        document.getElementById("tabpanel" + tabIndex).setAttribute("aria-hidden", false);

    },
    setCurrentSchedule() {
        var stations = this.Current.Hub.stations;
        var from = stations[0].id;
        var to = stations[1].id;
        var day = this.Current.Day.id;

        for (var [i, item] in this.Schedules) {
            var schedule = this.Schedules[i];
            if (schedule.way === `${from}-${to}`) {

                this.Current.Schedule = schedule.days;

                this.renderSchedule();

                return;
            }
        }
    },
    renderSchedule() {

        //getSchedule("");

        var html = "";
        for (var [i, item] in this.Days) {
            var panel = this.Days[i];
            var schedule = this.Current.Schedule[i].schedule;

            var scheduleHtml = "";
            for (var j=0; j < schedule.length; j++) {
                var time = schedule[j];

                scheduleHtml = scheduleHtml + `
                    <li class="">
                        <span>${time.hour}:${time.minute}</span>
                    </li>
                `;
            }

            html = html + `
                <div role="tabpanel" id="tabpanel${i}" class="o-panel" aria-labelledby="tab${i}" aria-hidden="${!panel.isSelected}">
                    <ul class="c-schedule">${scheduleHtml}</ul>
                </div>
            `;
        }
        this.DOM.TabPanels.innerHTML = html;

    }
}
App.init();

class X {

}