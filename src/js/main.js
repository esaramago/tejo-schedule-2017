import { data } from './data';
import { getCurrentDay } from './getCurrentDay';



const App = {
    Days: data.days,
    Hubs: data.hubs,
    Schedules: data.schedules,

    Current: {
        Date: null, // now date (or yesterday)
        DayOfWeek: '',
        Time: {
            Hour: null, // now hour
            Minute: null, // now minute
            Second: null // now second
        },
        Hub: '' // selected hub
    },
    Next: {
        ScheduleTimes: [] // next hour and minute of the two ways
    },

    DOM: {
        Pages: {
            Home: document.getElementById('homePage'),
            Schedule: document.getElementById('schedulePage')
        },
        Itineraries: document.querySelector('.js-itineraries'),
        Title: document.querySelector('.js-title'),
        Tabs: document.querySelector('.js-tabs'),
        TabPanels: document.querySelector('.js-tabpanels')
    },
    
    init() {
        // 1. Get and set data
        this.setNow();
        this.Current.Hub = this.Hubs[0].id; // ToDo: get Hub from user preferences (localstorage)

        // 2. Render initial components
        this.renderItineraries();
        this.createNavigation();

    },

    // GET/SET DATA
    setNow() {

        // get current tab id
        var now = getCurrentDay();

        // get current Day
        this.Current.Date = now.date;
        this.Current.DayOfWeek = now.dayOfWeek;

        // get current time
        var time = this.Current.Time;
        time.Hour = now.currentHours;
        time.Minute = now.currentMinutes;
        time.Second = now.currentSeconds;

    },
    /*getData() {

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
        });
    }, */
    getNextScheduleTime(hub) {

        // find schedules based on inbound/outbound
        var station1 = hub.stations[0].id;
        var station2 = hub.stations[1].id;

        var ways = [
            `${station1}-${station2}`,
            `${station2}-${station1}`
        ];

        var itineraries = [
            this.Schedules.find(x => x.way == ways[0]),
            this.Schedules.find(x => x.way == ways[1])
        ];

        var nextTimes = [];
        itineraries.forEach((way, i) => {

            // get decimal time, for sums
            var currentHour = this.Current.Time.Hour;
            var auxCurrentHour = (currentHour < 5) ? (parseInt(currentHour) + 24) : currentHour;
            var currentTime = auxCurrentHour + this.Current.Time.Minute.toString();

            // get current day and hub schedule
            var scheduleDayTimes = way.days.find(x => x.day == this.Current.DayOfWeek).schedule;

            // find next hub time
            var timeIndex = scheduleDayTimes.findIndex(x => {

                // add 24hours, if after midnight, to make sums easier
                var auxHour = (x.hour < 5) ? (parseInt(x.hour) + 24) : x.hour;
                var scheduleTime = auxHour + x.minute;

                // return next time in schedule
                return currentTime < scheduleTime;
            });

            // check if time was found
            if (scheduleDayTimes[timeIndex]) {
                // create item in array
                nextTimes.push(scheduleDayTimes[timeIndex]);
            }
            else {
                // next schedule time is tomorrow!
                var currentDate = this.Current.Date;
                currentDate.setDate(currentDate.getDate() + 1);
                var dayOfWeek = currentDate.getDay();

                if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                    dayOfWeek = 'weekday';
                }
                else if (dayOfWeek == 6) {
                    dayOfWeek = 'saturday';
                }
                else if (dayOfWeek == 0) {
                    dayOfWeek = 'sunday';
                }
                var scheduleDayTimes = way.days.find(x => x.day == dayOfWeek).schedule;

                // create item in array
                nextTimes.push(scheduleDayTimes[0]);

                // Fix: on friday at 01:55, dayOfWeek is saturday for outbound but weekday for return
                if (this.Current.DayOfWeek !== dayOfWeek) {
                    nextTimes[i].newDayOfWeek = dayOfWeek;
                }

            }
            
            // add way to array
            nextTimes[i].way = ways[i];
        });
        
        return nextTimes;
    },


    // RENDER
    renderItineraries() {

        var hub = this.Hubs.find(hub => hub.id === this.Current.Hub); // find current hub in Model
        this.Next.ScheduleTimes = this.getNextScheduleTime(hub); // set next schedule times

        var itineraries = [
            {
                inbound: hub.stations[0].name,
                outbound: hub.stations[1].name,
                nextTime: `${this.Next.ScheduleTimes[0].hour}:${this.Next.ScheduleTimes[0].minute}`,
                comming: '19:30' // ToDo: get comming
            },
            {
                inbound: hub.stations[1].name,
                outbound: hub.stations[0].name,
                nextTime: `${this.Next.ScheduleTimes[1].hour}:${this.Next.ScheduleTimes[1].minute}`,
                comming: '19:40' // ToDo: get comming
            }
        ];

        var html = '';
        for (let i in itineraries) {
            var inbound = itineraries[i].inbound;
            var outbound = itineraries[i].outbound;
            var nextTime = itineraries[i].nextTime;
            var comming = itineraries[i].comming;
            var way = this.Next.ScheduleTimes[i].way;

            html = html + `
                <button type="button" class="c-card js-goto-schedule" data-way="${way}">
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
                            <span class="c-button">Ver Horários</span>
                        </div>
                    </div>
                </button>
            `;
        }

        this.DOM.Itineraries.innerHTML = html; // place itineraries in DOM

    },
    createNavigation() {

        document.addEventListener('click', () => {

            var clickedElement = event.currentTarget.activeElement;

            if (clickedElement.matches('.js-goto-schedule')) {
                this.goToSchedulePage(clickedElement.dataset.way);
            }
            else if (clickedElement.matches('.js-goto-home')) {
                this.goToHomePage();
            }

        }, false);
    },
    renderTitle(way) {
        var currentHub = this.Hubs.find(x => x.id === this.Current.Hub).stations; // find current hub stations in Model
        var stations = way.split('-'); 
        var ways = [
            currentHub.find(x => x.id === stations[0]).name,
            currentHub.find(x => x.id === stations[1]).name
        ];

        this.DOM.Title.textContent = `${ways[0]} - ${ways[1]}`; // render title
    },
    renderTabs(way, selectedTabIndex) {

        // check if next schedule date is tomorrow
        if (way) {
            var next = this.Next.ScheduleTimes.find(x => x.way === way);
            var dayOfWeek = next.newDayOfWeek ? next.newDayOfWeek : this.Current.DayOfWeek;
        }

        var html = '';
        for (let i in this.Days) {
            var tab = this.Days[i];
            // get tab to select
            var isSelected = false;
            if (selectedTabIndex) { // check if selectedTabIndex is passed
                if (selectedTabIndex == i) {
                    isSelected = true;
                }
            }
            else {
                // check if is this tab is current day of week
                if (tab.id === dayOfWeek) {
                    isSelected = true;
                }
            }

            html = html + `
                <li role="tab" tabindex="0" id="tab${i}" class="js-tab" data-index="${i}" aria-controls="tabpanel${i}" aria-selected="${isSelected}">
                    <span>${tab.label}</span>
                </li>
            `;
        }
        this.DOM.Tabs.innerHTML = html; // place tabs in DOM

        // set click event  
        var tabs = document.getElementsByClassName("js-tab");
        for (let j=0; j < tabs.length; j++) {
            tabs[j].addEventListener("click", this.onSelectTab);
        }
    },
    renderSchedule(way) {

        var html = '';
        var days = this.Schedules.find(x => x.way === way).days;
        var next = this.Next.ScheduleTimes.find(x => x.way === way);
        var dayOfWeek = next.newDayOfWeek || this.Current.DayOfWeek; // check if next schedule date is tomorrow

        for (let i in days) {
            var isSelected = dayOfWeek === days[i].day; // check if today's day of week is the same as this iteration

            var schedule = days[i].schedule;
            var scheduleHtml = '';
            for (var j = 0; j < schedule.length; j++) {
                var time = schedule[j];
                var isNext = isSelected && next.hour === time.hour && next.minute === time.minute; // check if next time as this iteration
                scheduleHtml = scheduleHtml + `
                    <li ${isNext ? 'class="is-next"' : ''}>
                        <span>${time.hour}:${time.minute}</span>
                    </li>
                `;
            }

            html = html + `
                <div role="tabpanel" id="tabpanel${i}" class="o-panel o-panel--scrollable" aria-labelledby="tab${i}" aria-hidden="${!isSelected}">
                    <ul class="c-schedule">${scheduleHtml}</ul>
                </div>
            `;
        }
        this.DOM.TabPanels.innerHTML = html;

    },



    // EVENTS
    onSelectTab(e) {

        var _this = App;

        for (let i=0; i < _this.Days.length; i++) {

            // hide every tabpanel
            document.getElementById("tabpanel" + i).setAttribute("aria-hidden", true);
        }

        // get selected tab index
        var tab = e.currentTarget;
        var tabIndex = tab.getAttribute("data-index");
        
        // re-render tabs
        _this.renderTabs(null, tabIndex);

        // show selected tab and tabpanel
        document.getElementById("tabpanel" + tabIndex).setAttribute("aria-hidden", false);

    },
    scrollToCurrentTime() {

        // scroll to current time schedule
        setTimeout(() => {
            document.querySelector(".is-next").scrollIntoView({ block: "center" });
        }, 400);
    },
    goToSchedulePage(way) {

        this.renderTabs(way, null);
        this.renderSchedule(way);
        this.renderTitle(way);

        // close Home page tab
        this.DOM.Pages.Home.setAttribute("aria-hidden", true);

        // open Schedule page
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