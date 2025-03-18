// calendar.js - Calendar functionality

const Calendar = {
    date: new Date(),
    currentView: 'month',
    
    init: function() {
        // Initialize the calendar with current date
        this.date = new Date();
        this.updateDateDisplay();
    },
    
    render: function() {
        // Render the calendar based on current view
        this.updateDateDisplay();
        
        switch (this.currentView) {
            case 'month':
                this.renderMonthView();
                break;
            case 'week':
                this.renderWeekView();
                break;
            case 'day':
                this.renderDayView();
                break;
        }
        
        // Update upcoming events in sidebar
        this.renderUpcomingEvents();
    },
    
    updateDateDisplay: function() {
        // Update the date display in the header
        const dateElement = document.getElementById('current-date');
        
        switch (this.currentView) {
            case 'month':
                dateElement.textContent = this.date.toLocaleString('default', { month: 'long', year: 'numeric' });
                break;
            case 'week':
                const weekStart = this.getWeekStart(this.date);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                
                if (weekStart.getMonth() === weekEnd.getMonth()) {
                    dateElement.textContent = `${weekStart.toLocaleString('default', { month: 'long' })} ${weekStart.getDate()} - ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
                } else if (weekStart.getFullYear() === weekEnd.getFullYear()) {
                    dateElement.textContent = `${weekStart.toLocaleString('default', { month: 'short' })} ${weekStart.getDate()} - ${weekEnd.toLocaleString('default', { month: 'short' })} ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
                } else {
                    dateElement.textContent = `${weekStart.toLocaleString('default', { month: 'short' })} ${weekStart.getDate()}, ${weekStart.getFullYear()} - ${weekEnd.toLocaleString('default', { month: 'short' })} ${weekEnd.getDate()}, ${weekEnd.getFullYear()}`;
                }
                break;
            case 'day':
                dateElement.textContent = this.date.toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
                break;
        }
    },
    
    navigatePrevious: function() {
        // Navigate to previous month/week/day
        switch (this.currentView) {
            case 'month':
                this.date.setMonth(this.date.getMonth() - 1);
                break;
            case 'week':
                this.date.setDate(this.date.getDate() - 7);
                break;
            case 'day':
