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

    calendarGrid.innerHTML = '';

    let firstDay = monthStart.getDay();
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

    document.getElementById('month-view-container').classList.add('active');
    document.getElementById('week-view-container').classList.remove('active');
    document.getElementById('day-view-container').classList.remove('active');
}

function showWeekView() {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    currentDateElement.textContent = `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
    weekGrid.innerHTML = '';

    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        const dayCell = document.createElement('div');
        dayCell.classList.add('week-day');
        dayCell.textContent = `${day.getDate()} ${day.toLocaleString('default', { weekday: 'short' })}`;
        weekGrid.appendChild(dayCell);
    }

    document.getElementById('week-view-container').classList.add('active');
    document.getElementById('month-view-container').classList.remove('active');
    document.getElementById('day-view-container').classList.remove('active');
}

function showDayView() {
    currentDateElement.textContent = currentDate.toLocaleDateString();
    dayGrid.innerHTML = '';
    const eventsForDay = events.filter(event => event.date === currentDate.toLocaleDateString());

    eventsForDay.forEach(event => {
        const eventCell = document.createElement('div');
        eventCell.classList.add('day-event');
        eventCell.textContent = event.title;
        dayGrid.appendChild(eventCell);
    });

    document.getElementById('day-view-container').classList.add('active');
    document.getElementById('month-view-container').classList.remove('active');
    document.getElementById('week-view-container').classList.remove('active');
}

function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    updateCalendarView();
}

window.onload = updateCalendarView;
