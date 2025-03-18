// events.js - Event handling logic

const Events = {
    currentEditingEventId: null,
    
    init: function() {
        // Initialize event handling
        this.setupEventListeners();
    },
    
    setupEventListeners: function() {
        // Event form submission
        document.getElementById('event-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEvent();
        });
        
        // Delete event button
        document.getElementById('delete-event-btn').addEventListener('click', () => {
            this.deleteEvent();
        });
        
        // Close modal buttons
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', (e) => {
                UI.closeModal(e.target.closest('.modal').id);
            });
        });
        
        // Add friend button in event form
        document.getElementById('add-friend-btn').addEventListener('click', () => {
            UI.openModal('friend-modal');
        });
        
        // Confirm add friend button
        document.getElementById('confirm-add-friend').addEventListener('click', () => {
            this.addFriendToEvent();
        });
    },
    
    openEventModal: function(eventId = null) {
        this.currentEditingEventId = eventId;
        const modalTitle = document.getElementById('modal-title');
        const deleteButton = document.getElementById('delete-event-btn');
        const form = document.getElementById('event-form');
        
        // Reset form
        form.reset();
        
        // Clear friends list
        document.getElementById('friends-list').innerHTML = '';
        
        if (eventId) {
            // Edit existing event
            const event = Storage.getEventById(eventId);
            if (!event) return;
            
            modalTitle.textContent = 'Edit Event';
            deleteButton.hidden = false;
            
            // Populate form with event data
            document.getElementById('event-title').value = event.title;
            document.getElementById('event-date').value = event.date;
            document.getElementById('event-start').value = event.startTime;
            document.getElementById('event-end').value = event.endTime;
            document.getElementById('event-category').value = event.category;
            document.getElementById('event-description').value = event.description || '';
            document.getElementById('event-location').value = event.location || '';
            document.getElementById('event-reminder').value = event.reminder || 'none';
            
            // Add invitees
            this.populateInvitees(event.invitees || []);
        } else {
            // Create new event
            modalTitle.textContent = 'Add Event';
            deleteButton.hidden = true;
            
            // Pre-populate with today's date
            const today = new Date();
            document.getElementById('event-date').value = today.toISOString().split('T')[0];
            
            // Set default times (round to nearest half hour)
            const now = new Date();
            now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30);
            const formattedHour = now.getHours().toString().padStart(2, '0');
            const formattedMinutes = now.getMinutes().toString().padStart(2, '0');
            
            const startTime = `${formattedHour}:${formattedMinutes}`;
            document.getElementById('event-start').value = startTime;
            
            // Default end time is 1 hour later
            const endTime = new Date(now);
            endTime.setHours(endTime.getHours() + 1);
            const formattedEndHour = endTime.getHours().toString().padStart(2, '0');
            const formattedEndMinutes = endTime.getMinutes().toString().padStart(2, '0');
            
            document.getElementById('event-end').value = `${formattedEndHour}:${formattedEndMinutes}`;
        }
        
        UI.openModal('event-modal');
    },
    
    saveEvent: function() {
        // Get form data
        const title = document.getElementById('event-title').value;
        const date = document.getElementById('event-date').value;
        const startTime = document.getElementById('event-start').value;
        const endTime = document.getElementById('event-end').value;
        const category = document.getElementById('event-category').value;
        const description = document.getElementById('event-description').value;
        const location = document.getElementById('event-location').value;
        const reminder = document.getElementById('event-reminder').value;
        
        // Get invitees
        const invitees = [];
        document.querySelectorAll('.friend-item').forEach(item => {
            invitees.push(item.dataset.friendId);
        });
        
        // Create event object
        const event = {
            title,
            date,
            startTime,
            endTime,
            category,
            description,
            location,
            reminder,
            invitees,
            createdBy: Storage.getUser()?.id || 'guest'
        };
        
        // Add or update event
        if (this.currentEditingEventId) {
            event.id = this.currentEditingEventId;
            Storage.updateEvent(event);
        } else {
            event.id = 'event' + Date.now();
            Storage.addEvent(event);
        }
        
        // Close modal and refresh calendar
        UI.closeModal('event-modal');
        Calendar.render();
    },
    
    deleteEvent: function() {
        if (!this.currentEditingEventId) return;
        
        if (confirm('Are you sure you want to delete this event?')) {
            Storage.deleteEvent(this.currentEditingEventId);
            UI.closeModal('event-modal');
            Calendar.render();
        }
    },
    
    populateInvitees: function(inviteeIds) {
        const friendsList = document.getElementById('friends-list');
        friendsList.innerHTML = '';
        
        inviteeIds.forEach(id => {
            const friend = Storage.getFriendById(id);
            if (!friend) return;
            
            const friendItem = document.createElement('div');
            friendItem.className = 'friend-item';
            friendItem.dataset.friendId = friend.id;
            
            friendItem.innerHTML = `
                <span>${friend.name}</span>
                <span class="remove-friend">&times;</span>
            `;
            
            // Add remove friend handler
            friendItem.querySelector('.remove-friend').addEventListener('click', () => {
                friendItem.remove();
            });
            
            friendsList.appendChild(friendItem);
        });
    },
    
    addFriendToEvent: function() {
        const emailInput = document.getElementById('friend-email');
        const email = emailInput.value.trim();
        
        if (!email) {
            alert('Please enter an email address');
            return;
        }
        
        // Check if friend exists
        let friend = Storage.getFriends().find(f => f.email === email);
        
        // If friend doesn't exist, create a new one
        if (!friend) {
            const name = email.split('@')[0]; // Simple name extraction from email
            friend = {
                id: 'friend' + Date.now(),
                name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
                email: email
            };
            Storage.addFriend(friend);
        }
        
        // Check if friend is already added
        const existingFriend = document.querySelector(`.friend-item[data-friend-id="${friend.id}"]`);
        if (existingFriend) {
            alert('This friend is already invited');
            UI.closeModal('friend-modal');
            return;
        }
        
        // Add friend to list
        const friendsList = document.getElementById('friends-list');
        const friendItem = document.createElement('div');
        friendItem.className = 'friend-item';
        friendItem.dataset.friendId = friend.id;
        
        friendItem.innerHTML = `
            <span>${friend.name}</span>
            <span class="remove-friend">&times;</span>
        `;
        
        // Add remove friend handler
        friendItem.querySelector('.remove-friend').addEventListener('click', () => {
            friendItem.remove();
        });
        
        friendsList.appendChild(friendItem);
        
        // Clear input and close modal
        emailInput.value = '';
        UI.closeModal('friend-modal');
    },
    
    getInviteeNames: function(inviteeIds) {
        return inviteeIds.map(id => {
            const friend = Storage.getFriendById(id);
            return friend ? friend.name : '';
        }).filter(name => name !== '').join(', ');
    }
};
