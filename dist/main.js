
const App = {
    Days: null,
    Hubs: null,
    Schedules: null,

    Current: {
        Time: {
            Hour: null,
            Minute: null,
            Second: null
        },
        Day: null,
        Hub: null,
        Way: null,
        Schedule: null
    },
    Next: {
        TimeSchedule: null
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
        var currentDay = getCurrentDay();
        var today = currentDay.today;
        
        // get current time
        var time = this.Current.Time;
        time.Hour = currentDay.currentHours;
        time.Minute = currentDay.currentMinutes;
        time.Second = currentDay.currentSeconds;

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
        for (var i = 0; i < this.Days.length; i++) {
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

        for (var i = 0; i < _this.Days.length; i++) {
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

                this.Current.Way = schedule.days;

                this.getNextScheduleTime();

                return;
            }
        }

    },
    getNextScheduleTime() {

        //this.Current.Schedule = this.Current.Way.filter(x => x.day == this.Current.Day.id);
        var scheduleIndex = this.Current.Way.findIndex(x => x.day == this.Current.Day.id);

        // get decimal time, for sums
        var currentTime = this.Current.Time.Hour + '.' + this.Current.Time.Minute;
        
        var schedule = this.Current.Way[scheduleIndex].schedule;
        for (var i = 0; i < schedule.length; i++) {
            var time = schedule[i];

            // add 24hours, if after midnight, to make sums easier
            var scheduleTime = ((time.hour < 5) ? time.hour = (parseInt(time.hour) + 24) : time.hour) + '.' + time.minute;

            // find next time in schedule
            if (currentTime < scheduleTime) {
                
                this.Next.TimeSchedule = time;
                time.isNext = true;

                this.renderSchedule();

                return;
            }
        }
    },
    renderSchedule() {

        var html = "";
        for (var [i, item] in this.Days) {
            var panel = this.Days[i];
            var schedule = this.Current.Way[i].schedule;
            
            var scheduleHtml = "";
            for (var j=0; j < schedule.length; j++) {
                var time = schedule[j];

                scheduleHtml = scheduleHtml + `
                    <li ${time.isNext ? 'class="is-next"' : ''}>
                        <span>${time.hour}:${time.minute}</span>
                    </li>
                `;
            }

            html = html + `
                <div role="tabpanel" id="tabpanel${i}" class="o-panel o-panel--scrollable" aria-labelledby="tab${i}" aria-hidden="${!panel.isSelected}">
                    <ul class="c-schedule">${scheduleHtml}</ul>
                </div>
            `;
        }
        this.DOM.TabPanels.innerHTML = html;

        // scroll to current time schedule
        setTimeout(() => {
            document.querySelector(".is-next").scrollIntoView({ behavior: "smooth"});
        }, 100);

    }
}
App.init();

class X {

}