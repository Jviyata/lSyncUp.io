// calendar.js - Calendar functionality

const Calendar = {
    date: new Date(),
    currentView: 'month',
    
    init: function() {
        // Initialize the calendar with current date
        this.date = new Date();
        this.updateDateDisplay();
        this.render();
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
                this.date.setDate(this.date.getDate() - 1);
                break;
        }
        this.render();
    },

    navigateNext: function() {
        // Navigate to next month/week/day
        switch (this.currentView) {
            case 'month':
                this.date.setMonth(this.date.getMonth() + 1);
                break;
            case 'week':
                this.date.setDate(this.date.getDate() + 7);
                break;
            case 'day':
                this.date.setDate(this.date.getDate() + 1);
                break;
        }
        this.render();
    },

    changeView: function(view) {
        this.currentView = view;
        this.render();
    },

    getWeekStart: function(date) {
        // Get the start of the current week (Sunday)
        const tempDate = new Date(date);
        const dayOfWeek = tempDate.getDay();
        tempDate.setDate(tempDate.getDate() - dayOfWeek);
        return tempDate;
    },

    renderMonthView: function() {
        console.log("Rendering month view...");
        // TODO: Implement actual rendering logic
    },

    renderWeekView: function() {
        console.log("Rendering week view...");
        // TODO: Implement actual rendering logic
    },

    renderDayView: function() {
        console.log("Rendering day view...");
        // TODO: Implement actual rendering logic
    },

    renderUpcomingEvents: function() {
        console.log("Updating upcoming events...");
        // TODO: Implement event fetching and display logic
    }
};

// Initialize the calendar when the page loads
document.addEventListener("DOMContentLoaded", () => {
    Calendar.init();
});
