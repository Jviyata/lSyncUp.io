// app.js - Application initialization

const App = {
    init: function() {
        // Initialize all components
        Storage.init();
        Calendar.init();
        Events.init();
        UI.init();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load initial data
        this.loadInitialData();
    },
    
    setupEventListeners: function() {
        // View switching
        document.getElementById('month-view')?.addEventListener('click', () => UI.switchView('month'));
        document.getElementById('week-view')?.addEventListener('click', () => UI.switchView('week'));
        document.getElementById('day-view')?.addEventListener('click', () => UI.switchView('day'));
        
        // Date navigation
        document.getElementById('prev-btn')?.addEventListener('click', () => Calendar.navigatePrevious());
        document.getElementById('next-btn')?.addEventListener('click', () => Calendar.navigateNext());
        
        // Add event button
        document.getElementById('add-event-btn')?.addEventListener('click', () => Events.openEventModal());
        
        // Login button
        document.getElementById('login-btn')?.addEventListener('click', this.toggleLogin.bind(this));
        
        // Category filters
        document.querySelectorAll('#category-filters input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (typeof Calendar.applyFilters === "function") {
                    Calendar.applyFilters();
                } else {
                    console.warn("Calendar.applyFilters() is not implemented yet.");
                }
            });
        });
    },
    
    loadInitialData: function() {
        // Load user data
        const user = Storage.getUser();
        if (user) {
            document.getElementById('current-user')?.textContent = user.name;
            document.getElementById('login-btn')?.textContent = 'Logout';
        }
        
        // Load events
        const events = Storage.getEvents();
        if (events.length === 0) {
            // Add sample events if none exist
            this.addSampleEvents();
        }
        
        // Load friends
        const friends = Storage.getFriends();
        if (friends.length === 0) {
            // Add sample friends if none exist
            this.addSampleFriends();
        }
        
        // Render the calendar
        Calendar.render();
    },
    
    toggleLogin: function() {
        const currentUser = Storage.getUser();
        
        if (currentUser) {
            // Log out
            Storage.setUser(null);
            document.getElementById('current-user')?.textContent = 'Guest';
            document.getElementById('login-btn')?.textContent = 'Login';
        } else {
            // Log in (simplified for demo)
            const user = {
                id: 'user1',
                name: 'John Doe',
                email: 'john@example.com'
            };
            Storage.setUser(user);
            document.getElementById('current-user')?.textContent = user.name;
            document.getElementById('login-btn')?.textContent = 'Logout';
        }
    },
    
    addSampleEvents: function() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const events = [
            {
                id: 'event1',
                title: 'Team Meeting',
                date: today.toISOString().split('T')[0],
                startTime: '10:00',
                endTime: '11:00',
                category: 'work',
                description: 'Weekly team status meeting',
                location: 'Conference Room A',
                createdBy: 'user1',
                invitees: ['friend1', 'friend2'],
                reminder: '15'
            },
            {
                id: 'event2',
                title: 'Lunch with Sarah',
                date: today.toISOString().split('T')[0],
                startTime: '12:30',
                endTime: '13:30',
                category: 'social',
                description: 'Catch up over lunch',
                location: 'Bistro on Main',
                createdBy: 'user1',
                invitees: ['friend3'],
                reminder: 'none'
            },
            {
                id: 'event3',
                title: 'Gym Session',
                date: tomorrow.toISOString().split('T')[0],
                startTime: '07:00',
                endTime: '08:00',
                category: 'personal',
                description: 'Morning workout',
                location: 'Fitness Center',
                createdBy: 'user1',
                invitees: [],
                reminder: '30'
            }
        ];
        
        events.forEach(event => Storage.addEvent(event));
    },
    
    addSampleFriends: function() {
        const friends = [
            {
                id: 'friend1',
                name: 'Alice Johnson',
                email: 'alice@example.com'
            },
            {
                id: 'friend2',
                name: 'Bob Smith',
                email: 'bob@example.com'
            },
            {
                id: 'friend3',
                name: 'Sarah Williams',
                email: 'sarah@example.com'
            }
        ];
        
        friends.forEach(friend => Storage.addFriend(friend));
    }
};

// Ensure App initializes after everything is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
