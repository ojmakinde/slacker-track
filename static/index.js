function userAuth(){
    /* use the same func to handle login/sign up user auth.
    have the default id be "login". if the user wants to
    create, change the id to "sign up", and have two major
    conditionals for handling the logic */
};

function countdown(element, start_time, end_time = null) {

    /* This would need a few parameters, including:
    - start time
    - end time
    - id of time slot to be worked with. we can simply pass that in with this.id as a parameter
    - then, we get the current time, compute the calculation, and return that.
    */

    // building placeholder going from past time to present time.
    if (end_time == null){

    }
    var start = new Date(start_time);
    var now = new Date().getTime();
    var timeleft = start - now;
        
    timeleft = Math.abs(timeleft);
    // Calculating the days, hours, minutes and seconds left
    var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
        
    // Result is output to the specific element
    // element.innerHTML = `${days}:${hours}:${minutes}:${seconds}`
    // Display the message when countdown is over

    // Build the countdown string in the desired format
    var countdownString = '';
    if (days > 0) {
        countdownString += days + ' days, ';
    }
    if (hours > 0 || days > 0) {
        countdownString += hours + ' hours, ';
    }
    if (minutes > 0 || hours > 0 || days > 0) {
        countdownString += minutes + ' minutes, ';
    }
    countdownString += seconds + ' seconds';

    // Result is output to the specific element
    element.innerHTML = countdownString;
};

function countdownTimer() {
    /* store the start_time and end_time as attributes,
    retrieve the values, and do the computation in here */

    // get every item with a start time attribute
    var items = document.querySelectorAll('[data-start-time]')
    items.forEach(function (element) {
        var start_time = element.getAttribute('data-start-time')
        countdown(element, start_time)
        setInterval(function(){
            countdown(element, start_time);
        }, 1000)
})
};

function setLogDate() {
    var logs = document.querySelectorAll('[data-log-date]');
    logs.forEach(function (element) {
        var creation_date = new Date(element.getAttribute('data-log-date'));
        var date = creation_date.toLocaleDateString();
        var time = creation_date.toLocaleTimeString("en-US");
        element.innerHTML = element.innerHTML + date + ", " + time;
    })
}

function truncateLog(button) {
    var logDescription = button.previousElementSibling;
    var description_short = logDescription.getAttribute('data-shortened');
    var description_long = logDescription.getAttribute('data-long');

    if (logDescription.textContent.trim() === description_short.trim()) {
        logDescription.innerHTML = description_long;
        button.textContent = 'Show less';
    } else {
        logDescription.innerHTML = description_short;
        button.textContent = 'Show more';
    }
};