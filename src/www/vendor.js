import "./sass/style.scss";
import bulmaCalendar from 'bulma-calendar/dist/js/bulma-calendar.min.js';

// initialize the bulma calandar npm plugin I doewnloaded from the internet
document.addEventListener('DOMContentLoaded',function(){
    // Initialize all input of date type.
    const calendars = bulmaCalendar.attach('[type="date"]',{
        startDate: "16/06/2021",
        min: "16/06/2021", // should be minDate
        max: "10/10/2024", // should be maxDate
        showFooter: false,
        displayMode: "dialog",
        dateFormat: "dd/MM/yyyy"
    });
});