/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _data = __webpack_require__(1);

var _getCurrentDay = __webpack_require__(2);

var App = {
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
        Pages: {
            Home: document.getElementById("homePage"),
            Schedule: document.getElementById("schedulePage")
        },
        Title: document.querySelector(".js-title"),
        Tabs: document.querySelector(".js-tabs"),
        TabPanels: document.querySelector(".js-tabpanels")
    },

    init: function init() {
        var _this2 = this;

        this.getData();

        document.addEventListener('click', function () {
            debugger;
            if (event.target.matches('.js-goto-schedule')) {
                _this2.goToSchedulePage();
            } else if (event.target.matches('.js-goto-home')) {
                _this2.goToHomePage();
            }
        }, false);
    },
    getData: function getData() {

        this.Days = _data.data.days;
        this.Hubs = _data.data.hubs;
        this.Schedules = _data.data.schedules;

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
    firstRender: function firstRender() {
        this.Current.Hub = this.Hubs[0];
        this.renderTitle();

        this.setCurrentDayTab();
        this.setCurrentSchedule();
    },
    renderTitle: function renderTitle() {
        var stations = this.Current.Hub.stations;
        this.DOM.Title.textContent = stations[0].name + " - " + stations[1].name;
    },
    setCurrentDayTab: function setCurrentDayTab() {

        // get current tab id
        var currentDay = (0, _getCurrentDay.getCurrentDay)();
        var today = currentDay.today;

        // get current time
        var time = this.Current.Time;
        time.Hour = currentDay.currentHours;
        time.Minute = currentDay.currentMinutes;
        time.Second = currentDay.currentSeconds;

        for (var _ref in this.Days) {
            var _ref2 = _slicedToArray(_ref, 2);

            var i = _ref2[0];
            var item = _ref2[1];

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
    rendertabs: function rendertabs() {

        var tabs = "";
        for (var i = 0; i < this.Days.length; i++) {
            var tab = this.Days[i];

            tabs = tabs + ("\n                <li role=\"tab\" tabindex=\"0\" id=\"tab" + i + "\" class=\"js-tab\" data-index=\"" + i + "\" aria-controls=\"tabpanel" + i + "\" aria-selected=\"" + tab.isSelected + "\">\n                    <span>" + tab.label + "</span>\n                </li>\n            ");
        }
        this.DOM.Tabs.innerHTML = tabs;

        var tabs = document.getElementsByClassName("js-tab");
        for (var j = 0; j < tabs.length; j++) {
            tabs[j].addEventListener("click", this.onSelectTab);
        }
    },
    onSelectTab: function onSelectTab(e) {

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
    setCurrentSchedule: function setCurrentSchedule() {
        var stations = this.Current.Hub.stations;
        var from = stations[0].id;
        var to = stations[1].id;
        var day = this.Current.Day.id;

        for (var _ref3 in this.Schedules) {
            var _ref4 = _slicedToArray(_ref3, 2);

            var i = _ref4[0];
            var item = _ref4[1];

            var schedule = this.Schedules[i];
            if (schedule.way === from + "-" + to) {

                this.Current.Way = schedule.days;

                this.getNextScheduleTime();

                return;
            }
        }
    },
    getNextScheduleTime: function getNextScheduleTime() {
        var _this3 = this;

        //this.Current.Schedule = this.Current.Way.filter(x => x.day == this.Current.Day.id);
        var scheduleIndex = this.Current.Way.findIndex(function (x) {
            return x.day == _this3.Current.Day.id;
        });

        // get decimal time, for sums
        var currentTime = this.Current.Time.Hour + '.' + this.Current.Time.Minute;

        var schedule = this.Current.Way[scheduleIndex].schedule;
        for (var i = 0; i < schedule.length; i++) {
            var time = schedule[i];

            // add 24hours, if after midnight, to make sums easier
            var scheduleTime = (time.hour < 5 ? time.hour = parseInt(time.hour) + 24 : time.hour) + '.' + time.minute;

            // find next time in schedule
            if (currentTime < scheduleTime) {

                this.Next.TimeSchedule = time;
                time.isNext = true;

                this.renderSchedule();

                return;
            }
        }
    },
    renderSchedule: function renderSchedule() {

        var html = "";
        for (var _ref5 in this.Days) {
            var _ref6 = _slicedToArray(_ref5, 2);

            var i = _ref6[0];
            var item = _ref6[1];

            var panel = this.Days[i];
            var schedule = this.Current.Way[i].schedule;

            var scheduleHtml = "";
            for (var j = 0; j < schedule.length; j++) {
                var time = schedule[j];

                scheduleHtml = scheduleHtml + ("\n                    <li " + (time.isNext ? 'class="is-next"' : '') + ">\n                        <span>" + time.hour + ":" + time.minute + "</span>\n                    </li>\n                ");
            }

            html = html + ("\n                <div role=\"tabpanel\" id=\"tabpanel" + i + "\" class=\"o-panel o-panel--scrollable\" aria-labelledby=\"tab" + i + "\" aria-hidden=\"" + !panel.isSelected + "\">\n                    <ul class=\"c-schedule\">" + scheduleHtml + "</ul>\n                </div>\n            ");
        }
        this.DOM.TabPanels.innerHTML = html;
    },


    // ToDo: Correr esta função só depois de abrir a página dos horários
    scrollToCurrentTime: function scrollToCurrentTime() {

        // scroll to current time schedule
        setTimeout(function () {
            document.querySelector(".is-next").scrollIntoView({ behavior: "smooth" });
        }, 100);
    },
    goToSchedulePage: function goToSchedulePage() {
        //this.DOM.Pages.Home.classList.remove("is-active");
        this.DOM.Pages.Schedule.classList.add("is-active");
    },
    goToHomePage: function goToHomePage() {
        //this.DOM.Pages.Home.classList.add("is-active");
        this.DOM.Pages.Schedule.classList.remove("is-active");
    }
};

App.init();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var data = exports.data = {
    "days": [{
        "id": "weekday",
        "label": "Dias Úteis",
        "isSelected": false
    }, {
        "id": "saturday",
        "label": "Sábados",
        "isSelected": false
    }, {
        "id": "sunday",
        "label": "Domingos e Feriados",
        "isSelected": false
    }],

    "hubs": [{
        "id": "barreiro",
        "stations": [{
            "id": "barreiro",
            "name": "Barreiro"
        }, {
            "id": "terreiro",
            "name": "Terreiro do Paço"
        }]
    }, {
        "id": "seixal",
        "stations": [{
            "id": "caissodre",
            "name": "Cais do Sodré"
        }, {
            "id": "seixal",
            "name": "Seixal"
        }]

    }],

    "schedules": [{
        "way": "barreiro-terreiro",
        "days": [{
            "day": "weekday",
            "schedule": [{ "hour": "05", "minute": "15" }, { "hour": "05", "minute": "45" }, { "hour": "06", "minute": "15" }, { "hour": "06", "minute": "35" }, { "hour": "06", "minute": "45" }, { "hour": "06", "minute": "55" }, { "hour": "07", "minute": "05" }, { "hour": "07", "minute": "15" }, { "hour": "07", "minute": "20" }, { "hour": "07", "minute": "25" }, { "hour": "07", "minute": "35" }, { "hour": "07", "minute": "40" }, { "hour": "07", "minute": "50" }, { "hour": "07", "minute": "55" }, { "hour": "08", "minute": "05" }, { "hour": "08", "minute": "10" }, { "hour": "08", "minute": "15" }, { "hour": "08", "minute": "25" }, { "hour": "08", "minute": "30" }, { "hour": "08", "minute": "40" }, { "hour": "08", "minute": "45" }, { "hour": "08", "minute": "55" }, { "hour": "09", "minute": "00" }, { "hour": "09", "minute": "10" }, { "hour": "09", "minute": "25" }, { "hour": "09", "minute": "40" }, { "hour": "09", "minute": "55" }, { "hour": "10", "minute": "25" }, { "hour": "10", "minute": "55" }, { "hour": "11", "minute": "25" }, { "hour": "11", "minute": "55" }, { "hour": "12", "minute": "25" }, { "hour": "12", "minute": "55" }, { "hour": "13", "minute": "25" }, { "hour": "13", "minute": "55" }, { "hour": "14", "minute": "25" }, { "hour": "14", "minute": "55" }, { "hour": "15", "minute": "25" }, { "hour": "15", "minute": "45" }, { "hour": "16", "minute": "00" }, { "hour": "16", "minute": "20" }, { "hour": "16", "minute": "30" }, { "hour": "16", "minute": "40" }, { "hour": "16", "minute": "50" }, { "hour": "17", "minute": "00" }, { "hour": "17", "minute": "15" }, { "hour": "17", "minute": "25" }, { "hour": "17", "minute": "30" }, { "hour": "17", "minute": "35" }, { "hour": "17", "minute": "45" }, { "hour": "17", "minute": "55" }, { "hour": "18", "minute": "05" }, { "hour": "18", "minute": "15" }, { "hour": "18", "minute": "20" }, { "hour": "18", "minute": "25" }, { "hour": "18", "minute": "35" }, { "hour": "18", "minute": "45" }, { "hour": "18", "minute": "55" }, { "hour": "19", "minute": "05" }, { "hour": "19", "minute": "10" }, { "hour": "19", "minute": "20" }, { "hour": "19", "minute": "30" }, { "hour": "19", "minute": "40" }, { "hour": "20", "minute": "05" }, { "hour": "20", "minute": "20" }, { "hour": "20", "minute": "40" }, { "hour": "21", "minute": "00" }, { "hour": "21", "minute": "25" }, { "hour": "22", "minute": "00" }, { "hour": "22", "minute": "25" }, { "hour": "23", "minute": "00" }, { "hour": "23", "minute": "30" }, { "hour": "00", "minute": "30" }, { "hour": "01", "minute": "30" }]
        }, {
            "day": "saturday",
            "schedule": [{ "hour": "05", "minute": "15" }, { "hour": "05", "minute": "45" }, { "hour": "06", "minute": "22" }, { "hour": "06", "minute": "50" }, { "hour": "07", "minute": "25" }, { "hour": "07", "minute": "55" }, { "hour": "08", "minute": "25" }, { "hour": "08", "minute": "55" }, { "hour": "09", "minute": "25" }, { "hour": "09", "minute": "55" }, { "hour": "10", "minute": "25" }, { "hour": "11", "minute": "25" }, { "hour": "12", "minute": "25" }, { "hour": "13", "minute": "25" }, { "hour": "14", "minute": "25" }, { "hour": "14", "minute": "55" }, { "hour": "15", "minute": "25" }, { "hour": "15", "minute": "55" }, { "hour": "16", "minute": "25" }, { "hour": "16", "minute": "55" }, { "hour": "17", "minute": "25" }, { "hour": "17", "minute": "55" }, { "hour": "18", "minute": "25" }, { "hour": "18", "minute": "55" }, { "hour": "19", "minute": "25" }, { "hour": "20", "minute": "25" }, { "hour": "20", "minute": "55" }, { "hour": "21", "minute": "25" }, { "hour": "22", "minute": "25" }, { "hour": "23", "minute": "30" }, { "hour": "00", "minute": "30" }, { "hour": "01", "minute": "30" }]
        }, {
            "day": "sunday",
            "schedule": [{ "hour": "05", "minute": "15" }, { "hour": "05", "minute": "45" }, { "hour": "06", "minute": "22" }, { "hour": "06", "minute": "50" }, { "hour": "07", "minute": "25" }, { "hour": "08", "minute": "25" }, { "hour": "09", "minute": "25" }, { "hour": "10", "minute": "25" }, { "hour": "11", "minute": "25" }, { "hour": "12", "minute": "25" }, { "hour": "13", "minute": "25" }, { "hour": "14", "minute": "25" }, { "hour": "14", "minute": "55" }, { "hour": "15", "minute": "25" }, { "hour": "15", "minute": "55" }, { "hour": "16", "minute": "25" }, { "hour": "16", "minute": "55" }, { "hour": "17", "minute": "25" }, { "hour": "17", "minute": "55" }, { "hour": "18", "minute": "25" }, { "hour": "18", "minute": "55" }, { "hour": "19", "minute": "25" }, { "hour": "20", "minute": "25" }, { "hour": "20", "minute": "55" }, { "hour": "21", "minute": "25" }, { "hour": "22", "minute": "25" }, { "hour": "23", "minute": "30" }, { "hour": "00", "minute": "30" }, { "hour": "01", "minute": "30" }]
        }]
    }, {
        "way": "terreiro-barreiro",
        "days": [{
            "day": "weekday",
            "schedule": [{ "hour": "05", "minute": "45" }, { "hour": "06", "minute": "10" }, { "hour": "06", "minute": "40" }, { "hour": "07", "minute": "00" }, { "hour": "07", "minute": "10" }, { "hour": "07", "minute": "20" }, { "hour": "07", "minute": "30" }, { "hour": "07", "minute": "40" }, { "hour": "07", "minute": "45" }, { "hour": "07", "minute": "50" }, { "hour": "08", "minute": "00" }, { "hour": "08", "minute": "05" }, { "hour": "08", "minute": "15" }, { "hour": "08", "minute": "20" }, { "hour": "08", "minute": "30" }, { "hour": "08", "minute": "35" }, { "hour": "08", "minute": "40" }, { "hour": "08", "minute": "50" }, { "hour": "08", "minute": "55" }, { "hour": "09", "minute": "05" }, { "hour": "09", "minute": "10" }, { "hour": "09", "minute": "20" }, { "hour": "09", "minute": "40" }, { "hour": "09", "minute": "55" }, { "hour": "10", "minute": "25" }, { "hour": "10", "minute": "55" }, { "hour": "11", "minute": "25" }, { "hour": "11", "minute": "55" }, { "hour": "12", "minute": "25" }, { "hour": "12", "minute": "55" }, { "hour": "13", "minute": "25" }, { "hour": "13", "minute": "55" }, { "hour": "14", "minute": "25" }, { "hour": "14", "minute": "55" }, { "hour": "15", "minute": "25" }, { "hour": "15", "minute": "55" }, { "hour": "16", "minute": "15" }, { "hour": "16", "minute": "30" }, { "hour": "16", "minute": "50" }, { "hour": "17", "minute": "00" }, { "hour": "17", "minute": "10" }, { "hour": "17", "minute": "20" }, { "hour": "17", "minute": "30" }, { "hour": "17", "minute": "40" }, { "hour": "17", "minute": "50" }, { "hour": "17", "minute": "55" }, { "hour": "18", "minute": "00" }, { "hour": "18", "minute": "10" }, { "hour": "18", "minute": "20" }, { "hour": "18", "minute": "30" }, { "hour": "18", "minute": "40" }, { "hour": "18", "minute": "45" }, { "hour": "18", "minute": "50" }, { "hour": "19", "minute": "00" }, { "hour": "19", "minute": "10" }, { "hour": "19", "minute": "20" }, { "hour": "19", "minute": "30" }, { "hour": "19", "minute": "40" }, { "hour": "19", "minute": "50" }, { "hour": "20", "minute": "00" }, { "hour": "20", "minute": "10" }, { "hour": "20", "minute": "30" }, { "hour": "20", "minute": "50" }, { "hour": "21", "minute": "10" }, { "hour": "21", "minute": "25" }, { "hour": "21", "minute": "55" }, { "hour": "22", "minute": "25" }, { "hour": "22", "minute": "55" }, { "hour": "23", "minute": "30" }, { "hour": "00", "minute": "00" }, { "hour": "01", "minute": "00" }, { "hour": "02", "minute": "00" }]
        }, {
            "day": "saturday",
            "schedule": [{ "hour": "05", "minute": "45" }, { "hour": "06", "minute": "15" }, { "hour": "06", "minute": "47" }, { "hour": "07", "minute": "15" }, { "hour": "07", "minute": "55" }, { "hour": "08", "minute": "25" }, { "hour": "08", "minute": "55" }, { "hour": "09", "minute": "25" }, { "hour": "09", "minute": "55" }, { "hour": "10", "minute": "25" }, { "hour": "10", "minute": "55" }, { "hour": "11", "minute": "55" }, { "hour": "12", "minute": "55" }, { "hour": "13", "minute": "55" }, { "hour": "14", "minute": "55" }, { "hour": "15", "minute": "25" }, { "hour": "15", "minute": "55" }, { "hour": "16", "minute": "25" }, { "hour": "16", "minute": "55" }, { "hour": "17", "minute": "25" }, { "hour": "17", "minute": "55" }, { "hour": "18", "minute": "25" }, { "hour": "18", "minute": "55" }, { "hour": "19", "minute": "25" }, { "hour": "19", "minute": "55" }, { "hour": "20", "minute": "55" }, { "hour": "21", "minute": "25" }, { "hour": "21", "minute": "55" }, { "hour": "22", "minute": "55" }, { "hour": "00", "minute": "00" }, { "hour": "01", "minute": "00" }, { "hour": "02", "minute": "00" }]
        }, {
            "day": "sunday",
            "schedule": [{ "hour": "05", "minute": "45" }, { "hour": "06", "minute": "15" }, { "hour": "06", "minute": "47" }, { "hour": "07", "minute": "15" }, { "hour": "07", "minute": "55" }, { "hour": "08", "minute": "55" }, { "hour": "09", "minute": "55" }, { "hour": "10", "minute": "55" }, { "hour": "11", "minute": "55" }, { "hour": "12", "minute": "55" }, { "hour": "13", "minute": "55" }, { "hour": "14", "minute": "55" }, { "hour": "15", "minute": "25" }, { "hour": "15", "minute": "55" }, { "hour": "16", "minute": "25" }, { "hour": "16", "minute": "55" }, { "hour": "17", "minute": "25" }, { "hour": "17", "minute": "55" }, { "hour": "18", "minute": "25" }, { "hour": "18", "minute": "55" }, { "hour": "19", "minute": "25" }, { "hour": "19", "minute": "55" }, { "hour": "20", "minute": "55" }, { "hour": "21", "minute": "25" }, { "hour": "21", "minute": "55" }, { "hour": "22", "minute": "55" }, { "hour": "00", "minute": "00" }, { "hour": "01", "minute": "00" }, { "hour": "02", "minute": "00" }]

        }]
    }]

};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getCurrentDay = getCurrentDay;
// This file is to GET CURRENT TIME AND DATE

// ==========================================================================

function getCurrentDay() {

    // 1.0. Get current date and time =====================================

    // get full date
    var date = new Date();

    // get weekday (sunday is 0, monday is 1, and so on.)
    var weekday = date.getDay();

    // get time
    var currentHours = (date.getHours() < 10 ? '0' : '') + date.getHours(); // get current hours, with leading zero
    var currentMinutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(); // get current minutes, with leading zero
    var currentSeconds = date.getSeconds(); // get current seconds

    // add 24hours, if after midnight, to make sums easier
    currentHours = currentHours < 5 ? currentHours = parseInt(currentHours) + 24 : currentHours;

    // fake date (for test purposes)
    //var weekday = 2;
    //currentHours   = 22;
    //currentMinutes = 25;
    //currentSeconds = date.getSeconds();


    // 1.1. Fix current weekday =====================================

    // check if time is after midnight
    if (currentHours >= 0 && currentHours >= 24) {

        // make today yesterday
        weekday = weekday - 1;

        // if sunday gets a negative value, make it saturday
        if (weekday == -1) {
            weekday = 6;
        }
    }

    // NOW, I HAVE THE CORRECT WEEKDAY!!!!
    var today;
    if (weekday >= 1 && weekday <= 5) {
        today = 'weekday';
    } else if (weekday == 6) {
        today = 'saturday';
    } else if (weekday == 0) {
        today = 'sunday';
    }

    return {
        today: today,
        currentHours: currentHours,
        currentMinutes: currentMinutes,
        currentSeconds: currentSeconds
    };
}

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map