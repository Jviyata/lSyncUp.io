// storage.js - Local storage interface

const Storage = {
    keys: {
        events: 'social-calendar-events',
        user: 'social-calendar-user',
        friends: 'social-calendar-friends'
    },
    
    init: function() {
        // Initialize storage if needed
        if (!localStorage.getItem(this.keys.events)) {
            localStorage.setItem(this.keys.events, JSON.stringify([]));
        }
        
        if (!localStorage.getItem(this.keys.friends)) {
            localStorage.setItem(this.keys.friends, JSON.stringify([]));
        }
    },
    
    // Event methods
    getEvents: function() {
        return JSON.parse(localStorage.getItem(this.keys.events)) || [];
    },
    
    getEventById: function(id) {
        const events = this.getEvents();
        return events.find(event => event.id === id);
    },
    
    addEvent: function(event) {
        const events = this.getEvents();
        events.push(event);
        localStorage.setItem(this.keys.events, JSON.stringify(events));
    },
    
    updateEvent: function(updatedEvent) {
        const events = this.getEvents();
        const index = events.findIndex(event => event.id === updatedEvent.id);
        
        if (index !== -1) {
            events[index] = updatedEvent;
            localStorage.setItem(this.keys.events, JSON.stringify(events));
        }
    },
    
    deleteEvent: function(id) {
        const events = this.getEvents();
        const filteredEvents = events.filter(event => event.id !== id);
        localStorage.setItem(this.keys.events, JSON.stringify(filteredEvents));
    },
    
    // Filter events by date range
    getEventsByDateRange: function(startDate, endDate) {
        const events = this.getEvents();
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= startDate && eventDate <= endDate;
        });
    },
    
    // Filter events by category
    getEventsByCategory: function(category) {
        const events = this.getEvents();
        return events.filter(event => event.category === category);
    },
    
    // User methods
    getUser: function() {
        return JSON.parse(localStorage.getItem(this.keys.user));
    },
    
    setUser: function(user) {
        if (user) {
            localStorage.setItem(this.keys.user, JSON.stringify(user));
        } else {
            localStorage.removeItem(this.keys.user);
        }
    },
    
    // Friend methods
    getFriends: function() {
        return JSON.parse(localStorage.getItem(this.keys.friends)) || [];
    },
    
    getFriendById: function(id) {
        const friends = this.getFriends();
        return friends.find(friend => friend.id === id);
    },
    
    addFriend: function(friend) {
        const friends = this.getFriends();
        friends.push(friend);
        localStorage.setItem(this.keys.friends, JSON.stringify(friends));
    },
    
    updateFriend: function(updatedFriend) {
        const friends = this.getFriends();
        const index = friends.findIndex(friend => friend.id === updatedFriend.id);
        
        if (index !== -1) {
            friends[index] = updatedFriend;
            localStorage.setItem(this.keys.friends, JSON.stringify(friends));
        }
    },
    
    deleteFriend: function(id) {
        const friends = this.getFriends();
        const filteredFriends = friends.filter(friend => friend.id !== id);
        localStorage.setItem(this.keys.friends, JSON.stringify(filteredFriends));
    },
    
    // Clear all data
    clearAll: function() {
        localStorage.removeItem(this.keys.events);
        localStorage.removeItem(this.keys.user);
        localStorage.removeItem(this.keys.friends);
        this.init();
    }
};
