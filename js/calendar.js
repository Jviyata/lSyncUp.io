/**
 * Calendar.js - Handles calendar display and navigation
 */

const Calendar = (function() {
    // State
    let currentDate = new Date();
    let currentView = 'month'; // 'month', 'week', or 'day'
    
    // DOM Elements
    let calendarViewElement;
    let currentDateRangeElement;
    
    // Initialize the calendar
    function init(containerSelector) {
        calendarViewElement = document.querySelector(containerSelector);
        currentDateRangeElement = document.getElementById('current-date-range');
        
        // Render the initial view
        render();
    }
    
    // Render the calendar based on the current view
    function render() {
        // Clear the container
        calendarViewElement.innerHTML = '';
        
        // Update class based on view
        calendarViewElement.className = `calendar-view ${currentView}-view`;
        
        // Render the appropriate view
        switch (currentView) {
            case 'month':
                renderMonthView();
                break;
            case 'week':
                renderWeekView();
                break;
            case 'day':
                renderDayView();
                break;
        }
        
        // Update the date range display
        updateDateRangeHeader();
    }
    
    // Render the month view
    function renderMonthView() {
        // Get the first day of the month
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        // Calculate the first day to display (might be from previous month)
        const firstDayToDisplay = new Date(firstDayOfMonth);
        firstDayToDisplay.setDate(firstDayToDisplay.getDate() - firstDayToDisplay.getDay());
        
        // Create weekday header
        const weekdaysElement = document.createElement('div');
        weekdaysElement.className = 'weekdays';
        
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekdays.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            weekdaysElement.appendChild(dayElement);
        });
        
        calendarViewElement.appendChild(weekdaysElement);
        
        // Create the month grid
        const monthGridElement = document.createElement('div');
        monthGridElement.className = 'month-grid';
        
        // Calculate dates to display (42 days = 6 weeks)
        const currentDayForGrid = new Date(firstDayToDisplay);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get all events for the visible date range
        const lastDayToDisplay = new Date(firstDayToDisplay);
        lastDayToDisplay.setDate(lastDayToDisplay.getDate() + 41);
        
        const startDateStr = formatDate(firstDayToDisplay);
        const endDateStr = formatDate(lastDayToDisplay);
        const events = Storage.getEventsByDateRange(startDateStr, endDateStr);
        
        // Create each day cell
        for (let i = 0; i < 42; i++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            
            // Check if this day is in the current month
            if (currentDayForGrid.getMonth() !== currentDate.getMonth()) {
                dayCell.classList.add('other-month');
            }
            
            // Check if this day is today
            if (currentDayForGrid.getTime() === today.getTime())
