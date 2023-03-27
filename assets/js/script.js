
// Initialization of variables 
const currTime = dayjs().format("HH:mm");
let time_blocks = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
let formatted_time_blocks = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
let time_period; 

const container = document.querySelector('.container-lg');
const current_day = document.getElementById('currentDay');

// Interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html

$(() => {

  generate_currentday()
  generate_containers()
  
});


function generate_currentday() {

  // This function sets the current_day element
  // This function does not have any inputs

  current_day.textContent = dayjs().format('dddd, MMMM D, YYYY');
}

function generate_containers() {

  // This function creates the time block containers with their appropriate id and color.
  // It also says sets the textcontent if there is an activity associated with the id.
  // This function does not have any inputs

  for (let i = 0; i < time_blocks.length; i++) {

    const divElement = document.createElement('div');
    divElement.setAttribute('id', `hour-${formatted_time_blocks[i]}`);

    if (formatted_time_blocks[i] === parseInt(currTime.split(":")[0])) {
      divElement.classList.add('row', 'time-block', 'present');
    } else if (formatted_time_blocks[i] < parseInt(currTime.split(":")[0])) {
      divElement.classList.add('row', 'time-block', 'past');
    } else {
      divElement.classList.add('row', 'time-block', 'future');
    }

    if (time_blocks[i] > 7 && time_blocks[i] < 12) {
      time_period = 'AM';
    } else {
      time_period = 'PM';
    }

    const hourElement = document.createElement('div');
    hourElement.classList.add('col-2', 'col-md-1', 'hour', 'text-center', 'py-3');
    hourElement.textContent = `${time_blocks[i]}` + time_period;
    divElement.appendChild(hourElement);
    
    const textareaElement = document.createElement('textarea');
    textareaElement.classList.add('col-8', 'col-md-10', 'description');
    textareaElement.setAttribute('rows', '3');

    let activities = JSON.parse(localStorage.getItem("activities")) || [];
    let savedActivity = activities.find(a => a.hour === `hour-${formatted_time_blocks[i]}`);

    if (savedActivity) {
      textareaElement.value = savedActivity.activity;
    }

    divElement.appendChild(textareaElement);
    
    const buttonElement = document.createElement('button');
    buttonElement.classList.add('btn', 'saveBtn', 'col-2', 'col-md-1');
    buttonElement.setAttribute('aria-label', 'save');
    
    const iconElement = document.createElement('i');
    iconElement.classList.add('fas', 'fa-save');
    iconElement.setAttribute('aria-hidden', 'true');
    buttonElement.appendChild(iconElement);
    
    divElement.appendChild(buttonElement);
    
    container.appendChild(divElement);
  }
}

function save_actObj(id, text) {

  // This function stores id and text value in local storage. 
  // If the id exists, it'll overwrite the previous activity.

  // id: time block of container
  // text: text value of container 

  let activities = JSON.parse(localStorage.getItem("activities")) || [];
  let actObj = {hour: id, activity: text};

  let existingActObj = activities.find(obj => obj.hour === id);

  if (existingActObj) {
    existingActObj.activity = text;
  } else {
    activities.push(actObj);
  }

  localStorage.setItem("activities", JSON.stringify(activities));
}

$(document).on("click", "button", function() {

  // This function is the event listener of the save button when clicked. 
  // A modal will appear dependent upon the action.

  const id = $(this).parent().attr("id");
  const text_val = $(this).prev().val();

  if (text_val) {
    save_actObj(id, text_val);
    $('#ValueModal .modal-title').text("Confirm");
    $('#ValueModal .modal-body').text("Activity was saved!");
    $('#ValueModal').modal('show');
  } else {
    $('#ValueModal .modal-title').text("Warning");
    $('#ValueModal .modal-body').text("No activity was inputted!");
    $('#ValueModal').modal('show');
  }
});

// Modal OK button click event
$('#ValueModal').on('shown.bs.modal', function () {
  $('#ok-btn').click(function () {
    $('#ValueModal').modal('hide');
  });
});

// Modal 'X' button click event
$('#ValueModal').on('shown.bs.modal', function () {
  $('#close-btn').click(function () {
    $('#ValueModal').modal('hide');
  });
});


