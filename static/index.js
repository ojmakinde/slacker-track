var id_stack_delete = []
var id_stack_edit = []

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

    var start = new Date(start_time);
    if (end_time == null){
        var end = new Date().getTime();
    } else {
        var end = new Date(end_time).getTime();
    }    
    var timeleft = start - end;
    timeleft = Math.abs(timeleft);
    // Calculating the days, hours, minutes and seconds left
    var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

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

    element.innerHTML = countdownString;
};

function countdownTimer() {
    /* store the start_time and end_time as attributes,
    retrieve the values, and do the computation in here */

    // get every item with a start time attribute
    var items = document.querySelectorAll('[data-start-time]');
    items.forEach(function (element) {
        var start_time = element.getAttribute('data-start-time');
        countdown(element, start_time);
        setInterval(function(){
            countdown(element, start_time);
        }, 1000)
})
};

function validateAndSubmit(){
    const form = document.getElementById('newGoalForm');
    if (form.checkValidity()){
        if (document.getElementById('hasEnd').checked){
                createGoal('has_end');
                return;
        }
        createGoal()
    } else {
        alert('Please ensure all fields are correctly filled.')
    }
}

async function createGoal(status=null) {
    var goalInfo = new FormData();
    var user = document.getElementById('user_span').getAttribute('data-user');
    var title = document.getElementById('goal_title').value;
    var description = document.getElementById('goal_description').value;
    var start_date = document.getElementById('start_date').value;
    var end_date = document.getElementById('end_date').value;

    goalInfo.append('title', title);
    goalInfo.append('description', description);
    goalInfo.append('start_date', start_date);

    if (status === 'has_end'){
        goalInfo.append('end_date', end_date);
    }
    try {
        const response = await fetch(`/create_goal/${user}`, {
            method: 'POST',
            body: goalInfo
        })

        if (!response.ok){
            alert (`HTTP Error: ${response.status}`);
            return;
        }

        response.json().then(responseData => {
            const new_id = responseData[0]['id']
            window.location.href = `/goals/${user}/${new_id}`
        })

    } catch (error) {
        alert (error);
    }
}

async function addLog() {
    const form = document.getElementById('newLogForm');
    if (!form.checkValidity()){
        alert('Please ensure fields are correctly filled.')
        return;
    }

    var logInfo = new FormData();
    var title = document.getElementById('new_title').value;
    var description = document.getElementById('new_description').value;
    var info = document.getElementById('info_span');
    var goal_id = info.getAttribute('data-goal-id');

    logInfo.append('title', title);
    logInfo.append('description', description);
    logInfo.append('goal_id', goal_id);

    try {
        const response = await fetch(`/add_log/${goal_id}`, {
            method: 'POST',
            body: logInfo
        })

        if (!response.ok){
            alert (`HTTP Error: ${response.status}`);
            return;
        }

        location.reload();

    } catch (error) {
        alert (error);
    }
}

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
    const logDescription = button.previousElementSibling;
    const description_short = logDescription.getAttribute('data-shortened');
    const description_long = logDescription.getAttribute('data-long');

    if (logDescription.textContent.trim() === description_short.trim()) {
        logDescription.innerHTML = description_long;
        button.textContent = 'Show less';
    } else {
        logDescription.innerHTML = description_short;
        button.textContent = 'Show more';
    }
};



function add_id_edit(button){
    id_stack_edit.push(button.getAttribute('data-log-id'));
}

function populateEditModal(button){
    add_id_edit(button);
    const log_object = document.getElementById(button.getAttribute('data-log-id'));
    const log_title = log_object.previousElementSibling.textContent;
    const log_description = log_object.nextElementSibling.getAttribute('data-long');
    document.getElementById('log_title').value = log_title;
    document.getElementById('log_description').innerHTML = log_description;
}

async function saveEditLog(button){
    if (!id_stack_edit) {
        throw new Error('Cannot find log!') 
    }

    if (button.getAttribute('data-purpose') == "clear"){
        id_stack_edit.pop();
        return;
    }

    const log_id = id_stack_edit[0];
    
    const user = document.getElementById(log_id).parentElement.getAttribute('data-user');

    id_stack_edit.pop();
    
    const form = new FormData();
    form.append('action', 'edit');

    const log_title = document.getElementById('log_title').value;
    const log_description = document.getElementById('log_description').value;
    form.append('title', log_title);
    form.append('description', log_description);

    try {
        const response = await fetch(`/goals/${user}/${log_id}`, {
            method: 'POST',
            body: form
        })

        if (!response.ok) {
            alert(`HTTP Error: ${response.status}`);
            return;
        } else {
            alert(`Edit successful!`)
        }
        
    } catch (error) {
        alert(error);
    }
}

function add_id_delete(button){
    id_stack_delete.push(button.getAttribute('data-log-id'));
}

async function deleteLog(button) {
    if (!id_stack_delete) {
        alert(`Unexpected error encountered.`) 
    }

    if (button.getAttribute('data-purpose') == "clear"){
        id_stack_delete.pop();
        return;
    }

    const log_id = id_stack_delete[0];
    const logInfo = document.getElementById(log_id);
    const user = logInfo.parentElement.getAttribute('data-user');
    const logCard = logInfo.parentElement.parentElement;

    id_stack_delete.pop();

    const form = new FormData();
    form.append('action', 'delete');

    try {
        const response = await fetch(`/goals/${user}/${log_id}`, {
            method: 'POST',
            body: form
        })

        if (!response.ok) {
            alert(`HTTP Error: ${response.status}`);
        } else {
            alert('Log successfully deleted.');
            logCard.style.display = "none";
        }
        
    } catch (error) {
        prompt(error);
    }
};