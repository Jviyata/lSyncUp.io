 // ui.js - UI manipulation functions

const UI = {
    init: function() {
        // Initialize UI
        this.setupEventListeners();
    },
    
    setupEventListeners: function() {
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            document.querySelectorAll('.modal').forEach(modal => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
        
        // Listen for escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    if (modal.style.display === 'block') {
                        this.closeModal(modal.id);
                    }
                });
            }
        });
    },
    
    switchView: function(view) {
        // Update active view button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${view}-view`).classList.add('active');
        
        // Update view containers
        document.querySelectorAll('.calendar-view').forEach(container => {
            container.classList.remove('active');
        });
        document.getElementById(`${view}-view-container`).classList.add('active');
        
        // Update calendar data
        Calendar.setView(view);
    },
    
    openModal: function(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
        
        // Focus first input if present
        const firstInput = modal.querySelector('input, textarea, select');
        if (firstInput) {
            firstInput.focus();
        }
    },
    
    closeModal: function(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'none';
    },
    
    showNotification: function(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add close button
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close-notification';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(notification);
        });
        
        notification.appendChild(closeBtn);
        
        // Add to body
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 5000);
    },
    
    formatTime: function(timeString) {
        if (!timeString) return '';
        
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        
        return `${formattedHour}:${minutes} ${period}`;
    },
    
    formatTimeRange: function(startTime, endTime) {
        return `${this.formatTime(startTime)} - ${this.formatTime(endTime)}`;
    },
    
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    },
    
    getCategoryColor: function(category) {
        const colors = {
            personal: 'var(--personal-color)',
            work: 'var(--work-color)',
            social: 'var(--social-color)'
        };
        
        return colors[category] || 'var(--primary-color)';
    },
    
    // Calculate time position for event display
    calculateTimePosition: function(timeString) {
        if (!timeString) return 0;
        
        const [hours, minutes] = timeString.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        return (totalMinutes / 1440) * 100; // Percentage of day
    },
    
    // Calculate event duration as percentage of day
    calculateEventDuration: function(startTime, endTime) {
        if (!startTime || !endTime) return 10; // Default height if times not provided
        
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;
        
        // Handle events that span across midnight
        const durationMinutes = endTotalMinutes < startTotalMinutes
            ? (24 * 60 - startTotalMinutes) + endTotalMinutes
            : endTotalMinutes - startTotalMinutes;
        
        return (durationMinutes / 1440) * 100; // Percentage of day
    },
    
    // Calculate event width and position for overlapping events
    calculateEventOverlap: function(event, allEvents) {
        // Find overlapping events
        const overlapping = allEvents.filter(e => {
            if (e.id === event.id) return false;
            
            const eventStart = this.timeStringToMinutes(event.startTime);
            const eventEnd = this.timeStringToMinutes(event.endTime);
            const eStart = this.timeStringToMinutes(e.startTime);
            const eEnd = this.timeStringToMinutes(e.endTime);
            
            return (eventStart < eEnd && eventEnd > eStart);
        });
        
        if (overlapping.length === 0) {
            return { width: '95%', left: '2.5%' };
        }
        
        // Simple algorithm for now - just divide available space
        const position = overlapping.findIndex(e => e.startTime < event.startTime) + 1;
        const totalSlots = overlapping.length + 1;
        
        const width = 95 / totalSlots;
        const left = 2.5 + (position * width);
        
        return { width: `${width}%`, left: `${left}%` };
    },
    
    timeStringToMinutes: function(timeString) {
        if (!timeString) return 0;
        
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    },
    
    getReminderText: function(reminderValue) {
        const reminderOptions = {
            'none': 'No reminder',
            '15': '15 minutes before',
            '30': '30 minutes before',
            '60': '1 hour before',
            '1440': '1 day before'
        };
        
        return reminderOptions[reminderValue] || 'No reminder';
    }
};
