// Initialize calendar data
let currentDate = new Date();
let selectedView = 'month'; // default view
let events = []; // Will hold events for the calendar

// Get DOM elements
const currentDateElement = document.getElementById('current-date');
const calendarGrid = document.getElementById('calendar-grid');
const weekGrid = document.getElementById('week-grid');
const dayGrid = document.getElementById('day-grid');
const monthViewBtn = document.getElementById('month-view');
const weekViewBtn = document.getElementById('week-view');
const dayViewBtn = document.getElementById('day-view');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const addEventBtn = document.getElementById('add-event-btn');

// Event listener for view buttons
monthViewBtn.addEventListener('click', () => changeView('month'));
weekViewBtn.addEventListener('click', () => changeView('week'));
dayViewBtn.addEventListener('click', () => changeView('day'));

// Event listener for navigation buttons
prevBtn.addEventListener('click', () => changeMonth(-1));
nextBtn.addEventListener('click', () => changeMonth(1));

// Change the current view (month, week, day)
function changeView(view) {
    selectedView = view;
    updateCalendarView();
}

// Update calendar view based on the selected view
function updateCalendarView() {
    switch (selectedView) {
        case 'month':
            showMonthView();
            break;
        case 'week':
            showWeekView();
            break;
        case 'day':
            showDayView();
            break;
    }
}

// Display the calendar in month view
function showMonthView() {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = monthEnd.getDate();
    
    currentDateElement.textContent = monthStart.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Clear the grid before filling
    calendarGrid.innerHTML = '';
    
    // Generate calendar grid for the month
    let firstDay = monthStart.getDay(); // Start of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar-day');
        dayCell.textContent = day;
        dayCell.addEventListener('click', () => openDayView(day));
        calendarGrid.appendChild(dayCell);
    }

    // Show the month view and hide other views
    document.getElementById('month-view-container').classList.add('active');
    document.getElementById('week-view-container').classList.remove('active');
    document.getElementById('day-view-container').classList.remove('active');
}

// Display the calendar in week view
function showWeekView() {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Go back to Sunday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week (Saturday)

    currentDateElement.textContent = `${startOfWeek.toLocaleString('default', { weekday: 'long' })}, ${startOfWeek.getMonth() + 1}/${startOfWeek.getDate()} - ${endOfWeek.toLocaleString('default', { weekday: 'long' })}, ${endOfWeek.getMonth() + 1}/${endOfWeek.getDate()}`;

    // Clear the week grid
    weekGrid.innerHTML = '';

    // Generate the week grid
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        const dayCell = document.createElement('div');
        dayCell.classList.add('week-day');
        dayCell.textContent = `${day.getDate()} ${day.toLocaleString('default', { weekday: 'short' })}`;
        weekGrid.appendChild(dayCell);
    }

    // Show the week view and hide other views
    document.getElementById('week-view-container').classList.add('active');
    document.getElementById('month-view-container').classList.remove('active');
    document.getElementById('day-view-container').classList.remove('active');
}

// Display the calendar in day view
function showDayView() {
    const currentDayString = currentDate.toLocaleDateString();
    currentDateElement.textContent = currentDayString;

    // Clear the day grid
    dayGrid.innerHTML = '';

    // Create grid for the day's events
    const eventsForDay = events.filter(event => event.date === currentDayString);

    eventsForDay.forEach(event => {
        const eventCell = document.createElement('div');
        eventCell.classList.add('day-event');
        eventCell.textContent = event.title;
        dayGrid.appendChild(eventCell);
    });

    // Show the day view and hide other views
    document.getElementById('day-view-container').classList.add('active');
    document.getElementById('month-view-container').classList.remove('active');
    document.getElementById('week-view-container').classList.remove('active');
}

// Handle the 'add event' button click
addEventBtn.addEventListener('click', () => {
    // This would open a modal to add an event. For now, we'll log to the console.
    alert('Add event clicked');
});

// Change the month when clicking prev/next buttons
function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    updateCalendarView();
}

// Initialize the calendar on page load
window.onload = () => {
    updateCalendarView();
};
