import "./sass/style.scss";
import bulmaCalendar from 'bulma-calendar/dist/js/bulma-calendar.min.js';


// initialize the bulma calandar npm plugin I doewnloaded from the internet
document.addEventListener('DOMContentLoaded',function(){
    // Initialize all input of date type.
    const calendars = bulmaCalendar.attach('[type="date"]',{
        startDate: "2021-07-21",
        min: "2021-07-20", // should be minDate
        max: "2050-12-31", // should be maxDate
        showFooter: false,
        displayMode: "dialog",
        dateFormat: "yyyy-MM-dd"
    });

    let filterStartDate = document.getElementById('filter-start-date');
    let filterEndDate = document.getElementById('filter-end-date');
    
    filterStartDate.bulmaCalendar.on('select', function(datepicker) {
        console.log('filter-start-date changed');
        
        let event = new CustomEvent("start-dateChange", { detail:datepicker });
        document.dispatchEvent(event);
    });

    filterEndDate.bulmaCalendar.on('select', function(datepicker) {
        console.log('filter-end date changed')

        let event = new CustomEvent("end-dateChange", { detail:datepicker });
        document.dispatchEvent(event);
    });
});