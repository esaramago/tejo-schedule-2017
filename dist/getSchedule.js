// This file is to FIND NEXT SCHEDULE

// ==========================================================================

function getSchedule(schedule) {
    
    // get today's weekday ( 'weekday', 'saturday' or 'sunday' )
    var todayIs = getCurrentDay();

    console.log('#' + todayIs + '-' + schedule +'-schedule');
    var $schedule = $('#'+ today_is + '-' + schedule +'-schedule');

    // clear current next schedule
    $schedule.find('.schedule__next').removeClass('schedule__next');

    $schedule.find('.schedule__item').each(function() {
        var $this = $(this);

        // get each time
        var hours = $this.data('hour');
        var minutes = $this.data('minute');

        // get decimal time, for sums
        var current_time = current_hours+'.'+current_minutes ;

        // add 24hours, if after midnight, to make sums easier
        var schedule_time = ((hours < 5) ? hours = (parseInt(hours)+24) : hours) +'.'+minutes;

        //console.log(schedule_time);

        // find next time in schedule
        if ( current_time < schedule_time ) {

            $this.addClass('schedule__comming schedule__next');

            var next_schedule_hour = $this.data('hour');
            var next_schedule_minute = $this.data('minute');

            $('#next-'+ schedule +'-departure').text(next_schedule_hour + ':' + next_schedule_minute);
            $('#next-'+ schedule +'-departure').text(next_schedule_hour + ':' + next_schedule_minute);

            // STOP searching for comming schedules. remove this to select the rest
            return false;
        }
    });

    // find first comming item
    /*setTimeout(function() {
        $('.schedule__comming:first').addClass('schedule__next');
    }, 500)*/
}



/*setTimeout(function() {
    console.log(next_schedule_hour + ':' + next_schedule_minute);
}, 1900)*/
