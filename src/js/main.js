import { data } from "./data";
import { getCurrentDay } from "./getCurrentDay";

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
        Schedules: [],
        DaySchedules: []
    },
    Next: {
        TimeSchedules: []
    },

    DOM: {
        Pages: {
            Home: document.getElementById("homePage"),
            Schedule: document.getElementById("schedulePage")
        },
        Itineraries: document.querySelector(".js-itineraries"),
        Title: document.querySelector(".js-title"),
        Tabs: document.querySelector(".js-tabs"),
        TabPanels: document.querySelector(".js-tabpanels")
    },
    
    init() {
        this.getData();

        document.addEventListener('click', () => {

            var clickedElement = event.currentTarget.activeElement;

            if (clickedElement.matches('.js-goto-schedule')) {
                this.goToSchedulePage(clickedElement.dataset.itinerary);
            }
            else if (clickedElement.matches('.js-goto-home')) {
                this.goToHomePage();
            }

        }, false);
    },
    getData() {

        this.Days = data.days;
        this.Hubs = data.hubs;
        this.Schedules = data.schedules;

        this.filterData();

        /*
        // get data via Firebase (much slower)
        var _this = this;
        firebase.database().ref().on("value", function (snapshot) {

            // set data
            var data = snapshot.val();
            _this.Days = data.days;
            _this.Hubs = data.hubs;
            _this.Schedules = data.schedules;

            _this.filterData();

        }, function (error) {
            console.log("Error: " + error.code);
        }); */
    },
    filterData() {

        this.Current.Hub = this.Hubs[0];
        this.getCurrentDay();
        this.getCurrentSchedules();

        this.renderTitle();

    },
    getCurrentSchedules() {
        var stations = this.Current.Hub.stations;
        var station1 = stations[0].id;
        var station2 = stations[1].id;

        // find schedules based on inbound/outbound
        var itinerary1 = this.Schedules.filter(x => x.way == `${station1}-${station2}`)[0];
        var itinerary2 = this.Schedules.filter(x => x.way == `${station2}-${station1}`)[0];

        this.Current.Schedules.push(itinerary1);
        this.Current.Schedules.push(itinerary2);

        this.getNextItineraryScheduleTime(0);
        this.getNextItineraryScheduleTime(1);

        this.renderItineraries();

    },
    getNextItineraryScheduleTime(index) {

        // get decimal time, for sums
        var currentTime = this.Current.Time.Hour + '.' + this.Current.Time.Minute;

        // get current day and hub schedule
        var scheduleDay = this.Current.Schedules[index].days.filter(x => x.day == this.Current.Day.id)[0];

        // set current day and hub schedule
        this.Current.DaySchedules.push(scheduleDay);

        // get next hub time
        for (var i = 0; i < scheduleDay.schedule.length; i++) {
            var time = scheduleDay.schedule[i];

            // add 24hours, if after midnight, to make sums easier
            var scheduleTime = ((time.hour < 5) ? time.hour = (parseInt(time.hour) + 24) : time.hour) + '.' + time.minute;

            // find next time in schedule
            if (currentTime < scheduleTime) {
                this.Next.TimeSchedules.push(time);
                time.isNext = true;

                return;
            }
        }

    },
    renderItineraries() {

        var template = "";

        var itineraries = [
            {
                inbound: this.Current.Hub.stations[0].name,
                outbound: this.Current.Hub.stations[1].name,
                nextTime: `${this.Next.TimeSchedules[0].hour}:${this.Next.TimeSchedules[0].minute}`,
                comming: "19:30"
            },
            {
                inbound: this.Current.Hub.stations[1].name,
                outbound: this.Current.Hub.stations[0].name,
                nextTime: `${this.Next.TimeSchedules[1].hour}:${this.Next.TimeSchedules[1].minute}`,
                comming: "19:40"
            }
        ];

        for (const itinerary in itineraries) {
            var inbound = itineraries[itinerary].inbound;
            var outbound = itineraries[itinerary].outbound;
            var nextTime = itineraries[itinerary].nextTime;
            var comming = itineraries[itinerary].comming;

            _render(inbound, outbound, nextTime, comming, itinerary);
        }

        function _render(inbound, outbound, nextTime, comming, itinerary) {

            template = template + `
                <button type="button" class="c-card js-goto-schedule" data-itinerary="${itinerary}">
                    <div class="o-row c-itinerary">
                        <span>${inbound}</span>
                        <div class="o-row__wide">
                            <span class="c-itinerary__arrow"></span>
                        </div>
                        <span>${outbound}</span>
                    </div>
                    <div class="o-row o-row--middle">
                        <div class="o-row__wide c-time">
                            <svg viewBox="0 0 32 32" class="c-icon--xl">
                                <path d="M 16 4 C 9.382813 4 4 9.382813 4 16 C 4 22.617188 9.382813 28 16 28 C 22.617188 28 28 22.617188 28 16 C 28 9.382813 22.617188 4 16 4 Z M 16 6 C 21.535156 6 26 10.464844 26 16 C 26 21.535156 21.535156 26 16 26 C 10.464844 26 6 21.535156 6 16 C 6 10.464844 10.464844 6 16 6 Z M 15 8 L 15 17 L 22 17 L 22 15 L 17 15 L 17 8 Z "></path>
                            </svg>
                            <span>${nextTime}</span>
                        </div>
                        <div>
                            <span class="c-button">Horários</span>
                        </div>
                    </div>
                </button>
            `;
        }

        this.DOM.Itineraries.innerHTML = template;
    },
    renderTitle() {
        var stations = this.Current.Hub.stations;
        this.DOM.Title.textContent = `${stations[0].name} - ${stations[1].name}`
    },
    getCurrentDay() {

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
                <li role="tab" tabindex="0" id="tab${i}" class="js-tab" data-index="${i}" aria-controls="tabpanel${i}" aria-selected="${tab.isSelected}">
                    <span>${tab.label}</span>
                </li>
            `
        }
        this.DOM.Tabs.innerHTML = tabs;

        var tabs = document.getElementsByClassName("js-tab");
        for (var j = 0; j < tabs.length; j++) {
            tabs[j].addEventListener("click", this.onSelectTab);
        }
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
        var tab = e.currentTarget;
        var tabIndex = tab.getAttribute("data-index");

        // show selected tab
        _this.Days[tabIndex].isSelected = true;

        // re-render tabs
        _this.rendertabs();

        // show selected tabpanel
        document.getElementById("tabpanel" + tabIndex).setAttribute("aria-hidden", false);

    },
    renderSchedule(itineraryIndex) {

        var html = "";
        var days = this.Current.Schedules[itineraryIndex].days;
        for (var [i, item] in days) {
            var panel = this.Current.Day;
            var schedule = days[i].schedule;
            
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

    },

    scrollToCurrentTime() {

        // scroll to current time schedule
        setTimeout(() => {
            document.querySelector(".is-next").scrollIntoView({ block: "center" });
        }, 300);
    },

    goToSchedulePage(itineraryIndex) {

        this.renderSchedule(itineraryIndex);

        this.DOM.Pages.Home.setAttribute("aria-hidden", true);
        
        this.DOM.Pages.Schedule.classList.add("is-active");
        this.DOM.Pages.Schedule.setAttribute("aria-hidden", false);

        this.scrollToCurrentTime();
    },
    goToHomePage() {
        this.DOM.Pages.Home.setAttribute("aria-hidden", false);

        this.DOM.Pages.Schedule.classList.remove("is-active");
        this.DOM.Pages.Schedule.setAttribute("aria-hidden", true);
    }

}

App.init();