// This file is to GET CURRENT TIME AND DATE

// ==========================================================================

function getCurrentDay() {
    
    // 1.0. Get current date and time =====================================

    // get full date
    var date = new Date();

    // get weekday (sunday is 0, monday is 1, and so on.)
    var weekday = date.getDay();

    // get time
    current_hours   = (date.getHours()<10?'0':'') + date.getHours(); // get current hours, with leading zero
    current_minutes = (date.getMinutes()<10?'0':'') + date.getMinutes(); // get current minutes, with leading zero
    current_seconds = date.getSeconds(); // get current seconds
    
    // add 24hours, if after midnight, to make sums easier
    current_hours = ((current_hours < 5) ? current_hours = (parseInt(current_hours)+24) : current_hours)

    // fake date (for test purposes)
    //var weekday = 2;
    //current_hours   = 22;
    //current_minutes = 25;
    //current_seconds = date.getSeconds();


    // 1.1. Fix current weekday =====================================

    // check if time is after midnight
    if (current_hours >= 0 && current_hours >= 24) {

        // make today yesterday
        weekday = weekday - 1;

        // if sunday gets a negative value, make it saturday
        if (weekday == -1) {
            weekday = 6;

        }
    }

    // NOW, I HAVE THE CORRECT WEEKDAY!!!!

    if ( weekday >= 1 && weekday <= 5 ) {
        todayIs = 'weekday';
    }
    else if ( weekday == 6 ) {
        todayIs = 'saturday';
    }
    else if ( weekday == 0 ) {
        todayIs = 'sunday';
    }

    return todayIs;

}
