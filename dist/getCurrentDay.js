// This file is to GET CURRENT TIME AND DATE

// ==========================================================================

function getCurrentDay() {
    
    // 1.0. Get current date and time =====================================

    // get full date
    var date = new Date();

    // get weekday (sunday is 0, monday is 1, and so on.)
    var weekday = date.getDay();

    // get time
    currentHours   = (date.getHours()<10?'0':'') + date.getHours(); // get current hours, with leading zero
    currentMinutes = (date.getMinutes()<10?'0':'') + date.getMinutes(); // get current minutes, with leading zero
    currentSeconds = date.getSeconds(); // get current seconds
    
    // add 24hours, if after midnight, to make sums easier
    currentHours = ((currentHours < 5) ? currentHours = (parseInt(currentHours)+24) : currentHours)

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
    if ( weekday >= 1 && weekday <= 5 ) {
        today = 'weekday';
    }
    else if ( weekday == 6 ) {
        today = 'saturday';
    }
    else if ( weekday == 0 ) {
        today = 'sunday';
    }

    return {
        today,
        currentHours,
        currentMinutes,
        currentSeconds
    }

}
