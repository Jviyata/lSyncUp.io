/**
 * Storage.js - Handles data storage and retrieval
 * Uses browser's localStorage for persistence
 */

const Storage = (function() {
    // Default events for demo purposes
    const defaultEvents = [
        {
            id: '1',
            title: 'Team Meeting',
            date: '2025-03-18',
            time: '10:00',
            calendar: 'work',
            description: 'Weekly team sync meeting',
            public: true,
            shareWith: []
        },
        {
            id: '2',
            title: 'Lunch with Sarah',
            date: '2025-03-20',
            time: '12:30',
            calendar: 'personal',
            description: 'Lunch at Italian restaurant',
            public: false,
            shareWith: ['sarah@example.com']
        },
        {
            id: '3',
            title: 'Family Dinner',
            date: '2025-03-21',
            time: '18:00',
            calendar: 'family',
            description: 'Dinner at mom\'s house',
            public: false,
            shareWith: []
        }
    ];

    // Initialize storage with default events if empty
    function init() {
        if (!localStorage.getItem('events')) {
            localStorage.setItem('events', JSON.stringify(defaultEvents));
        }
    }

    // Get all events
    function getEvents() {
        return JSON.parse(localStorage.getItem('events')) || [];
    }

    // Get a specific event by ID
    function getEvent(id) {
        const events = getEvents();
        return events.find(event => event.id === id);
    }

    // Save a new event
    function saveEvent(event) {
        const events = getEvents();
        
        // Generate a new ID if this is a new event
        if (!event.id) {
            event.id = Date.now().toString();
        } else {
            // Remove the existing event if we're updating
            const index = events.findIndex(e => e.id === event.id);
            if (index !== -1) {
                events.splice(index, 1);
            }
        }
        
        events.push(event);
        localStorage.setItem('events', JSON.stringify(events));
        return event;
    }

    // Delete an event
    function deleteEvent(id) {
        const events = getEvents();
        const newEvents = events.filter(event => event.id !== id);
        localStorage.setItem('events', JSON.stringify(newEvents));
    }

    // Get events for a specific date
    function getEventsByDate(date) {
        const events = getEvents();
        return events.filter(event => event.date === date);
    }

    // Get events for a date range
    function getEventsByDateRange(startDate, endDate) {
        const events = getEvents();
        return events.filter(event => {
            return event.date >= startDate && event.date <= endDate;
        });
    }

    // Get upcoming events
    function getUpcomingEvents(limit = 5) {
        const events = getEvents();
        const today = new Date().toISOString().split('T')[0];
        
        return events
            .filter(event => event.date >= today)
            .sort((a, b) => {
                if (a.date !== b.date) {
                    return a.date.localeCompare(b.date);
                }
                return a.time.localeCompare(b.time);
            })
            .slice(0, limit);
    }

    // Public API
    return {
        init,
        getEvents,
        getEvent,
        saveEvent,
        deleteEvent,
        getEventsByDate,
        getEventsByDateRange,
        getUpcomingEvents
    };
})();

// Initialize storage when the script loads
Storage.init();
