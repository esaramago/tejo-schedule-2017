// This file is to GET CURRENT TIME AND DATE

// ==========================================================================

export function getCurrentDay() {
    
    // 1.0. Get current date and time =====================================

    // get full date
    var date = new Date();

    // get weekday (sunday is 0, monday is 1, and so on.)
    var weekday = date.getDay();

    // get time
    var currentHours   = (date.getHours()   < 10 ? '0' : '') + date.getHours(); // get current hours, with leading zero
    var currentMinutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(); // get current minutes, with leading zero
    var currentSeconds = date.getSeconds(); // get current seconds


    // 1.1. Fix current weekday =====================================

    // add 24hours, if after midnight, to make sums easier
    var currentHours = (currentHours < 5) ? (parseInt(currentHours) + 24) : currentHours;



    // fake date (for test purposes)
    //var weekday = 5;
    //currentHours = '01';
    //currentMinutes = '55';
    //currentSeconds = date.getSeconds();


    // check if time is after midnight
    //if (currentHours >= 0 && currentHours >= 24) {
    if (currentHours >= 0 && currentHours < 5) {

        // make today yesterday
        weekday = weekday - 1;
        date.setDate(date.getDate() - 1);

        // if sunday gets a negative value, make it saturday
        if (weekday == -1) {
            weekday = 6;
        }
    }

    // NOW, I HAVE THE CORRECT WEEKDAY!!!!
    var dayOfWeek;
    if ( weekday >= 1 && weekday <= 5 ) {
        dayOfWeek = 'weekday';
    }
    else if ( weekday == 6 ) {
        dayOfWeek = 'saturday';
    }
    else if ( weekday == 0 ) {
        dayOfWeek = 'sunday';
    }

    return {
        date,
        dayOfWeek,
        currentHours,
        currentMinutes,
        currentSeconds
    }

}
