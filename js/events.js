const Events = {
    currentEditingEventId: null,
    
    init: function() {
        this.setupEventListeners();
    },
    
    setupEventListeners: function() {
        const eventForm = document.getElementById('event-form');
        if (eventForm) {
            eventForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveEvent();
            });
        }
        
        const deleteEventBtn = document.getElementById('delete-event-btn');
        if (deleteEventBtn) {
            deleteEventBtn.addEventListener('click', () => {
                this.deleteEvent();
            });
        }
        
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    UI.closeModal(modal.id);
                }
            });
        });
        
        const addFriendBtn = document.getElementById('add-friend-btn');
        if (addFriendBtn) {
            addFriendBtn.addEventListener('click', () => {
                UI.openModal('friend-modal');
            });
        }
        
        const confirmAddFriend = document.getElementById('confirm-add-friend');
        if (confirmAddFriend) {
            confirmAddFriend.addEventListener('click', () => {
                this.addFriendToEvent();
            });
        }
    },
    
    openEventModal: function(eventId = null) {
        console.log("openEventModal function called");
        this.currentEditingEventId = eventId;
        
        const modalTitle = document.getElementById('modal-title');
        const deleteButton = document.getElementById('delete-event-btn');
        const form = document.getElementById('event-form');
        const friendsList = document.getElementById('friends-list');
        
        if (!modalTitle || !deleteButton || !form) {
            console.error("Missing essential elements in openEventModal");
            return;
        }
        
        form.reset();
        
        if (friendsList) {
            friendsList.innerHTML = '';
        }
        
        if (eventId) {
            console.log("Editing event with ID:", eventId);
            const event = Storage.getEventById(eventId);
            if (!event) {
                console.error("Event not found with ID:", eventId);
                return;
            }
            
            modalTitle.textContent = 'Edit Event';
            deleteButton.style.display = 'block';
            
            this.populateEventForm(event);
            
            if (event.invitees && friendsList) {
                this.populateInvitees(event.invitees);
            }
        } else {
            console.log("Creating a new event");
            modalTitle.textContent = 'Add Event';
            deleteButton.style.display = 'none';
            
            this.setDefaultDateTime();
        }
        
        console.log("Opening modal...");
        UI.openModal('event-modal');
    },
    
    populateEventForm: function(event) {
        const fields = [
            { id: 'event-title', value: event.title },
            { id: 'event-date', value: event.date },
            { id: 'event-start', value: event.startTime },
            { id: 'event-end', value: event.endTime },
            { id: 'event-category', value: event.category },
            { id: 'event-description', value: event.description || '' },
            { id: 'event-location', value: event.location || '' },
            { id: 'event-reminder', value: event.reminder || 'none' }
        ];
        
        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                element.value = field.value;
            }
        });
    },
    
    setDefaultDateTime: function() {
        const today = new Date();
        const dateField = document.getElementById('event-date');
        if (dateField) {
            dateField.value = today.toISOString().split('T')[0];
        }
        
        const now = new Date();
        now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30);
        
        const startField = document.getElementById('event-start');
        if (startField) {
            startField.value = now.toTimeString().slice(0, 5);
        }
        
        const endTime = new Date(now);
        endTime.setHours(endTime.getHours() + 1);
        
        const endField = document.getElementById('event-end');
        if (endField) {
            endField.value = endTime.toTimeString().slice(0, 5);
        }
    },
    
    populateInvitees: function(invitees) {
        const friendsList = document.getElementById('friends-list');
        if (!friendsList) return;
        
        friendsList.innerHTML = '';
        
        invitees.forEach(invitee => {
            const inviteeElement = document.createElement('div');
            inviteeElement.classList.add('invitee-item');
            inviteeElement.innerHTML = `
                <span>${invitee.name}</span>
                <button type="button" class="remove-invitee" data-id="${invitee.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            friendsList.appendChild(inviteeElement);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-invitee').forEach(button => {
            button.addEventListener('click', (e) => {
                const inviteeId = e.target.closest('.remove-invitee').dataset.id;
                this.removeInvitee(inviteeId);
            });
        });
    },
    
    saveEvent: function() {
        // Implementation for saving event would go here
        console.log("Saving event", this.currentEditingEventId);
        UI.closeModal('event-modal');
    },
    
    deleteEvent: function() {
        // Implementation for deleting event would go here
        console.log("Deleting event", this.currentEditingEventId);
        UI.closeModal('event-modal');
    },
    
    addFriendToEvent: function() {
        // Implementation for adding friend to event would go here
        console.log("Adding friend to event");
        UI.closeModal('friend-modal');
    },
    
    removeInvitee: function(inviteeId) {
        // Implementation for removing invitee would go here
        console.log("Removing invitee", inviteeId);
    }
};
