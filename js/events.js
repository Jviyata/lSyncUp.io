const Events = {
    currentEditingEventId: null,
    
    init: function() {
        this.setupEventListeners();
    },
    
    setupEventListeners: function() {
        // Add event listener for the "Add Event" button
        const addEventBtn = document.getElementById('add-event-btn');
        if (addEventBtn) {
            addEventBtn.addEventListener('click', () => {
                this.openEventModal();
            });
        }
        
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
        
        if (!modalTitle || !form) {
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
            if (deleteButton) deleteButton.style.display = 'block';
            
            this.populateEventForm(event);
            
            if (event.invitees && friendsList) {
                this.populateInvitees(event.invitees);
            }
        } else {
            console.log("Creating a new event");
            modalTitle.textContent = 'Add Event';
            if (deleteButton) deleteButton.style.display = 'none';
            
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
        const title = document.getElementById('event-title')?.value;
        const date = document.getElementById('event-date')?.value;
        const startTime = document.getElementById('event-start')?.value;
        const endTime = document.getElementById('event-end')?.value;
        const category = document.getElementById('event-category')?.value;
        const description = document.getElementById('event-description')?.value;
        const location = document.getElementById('event-location')?.value;
        const reminder = document.getElementById('event-reminder')?.value;
        
        if (!title || !date || !startTime || !endTime || !category) {
            alert('Please fill in all required fields');
            return;
        }
        
        const eventData = {
            id: this.currentEditingEventId || Date.now().toString(),
            title,
            date,
            startTime,
            endTime,
            category,
            description,
            location,
            reminder,
            invitees: this.getInviteesFromUI()
        };
        
        if (this.currentEditingEventId) {
            Storage.updateEvent(eventData);
            console.log("Updated event:", eventData);
        } else {
            Storage.addEvent(eventData);
            console.log("Added new event:", eventData);
        }
        
        // Refresh the calendar or events list
        if (typeof Calendar !== 'undefined' && Calendar.renderEvents) {
            Calendar.renderEvents();
        }
        
        UI.closeModal('event-modal');
    },
    
    getInviteesFromUI: function() {
        const invitees = [];
        const inviteeItems = document.querySelectorAll('#friends-list .invitee-item');
        
        inviteeItems.forEach(item => {
            const removeBtn = item.querySelector('.remove-invitee');
            if (removeBtn) {
                invitees.push({
                    id: removeBtn.dataset.id,
                    name: item.querySelector('span').textContent
                });
            }
        });
        
        return invitees;
    },
    
    deleteEvent: function() {
        if (!this.currentEditingEventId) return;
        
        if (confirm('Are you sure you want to delete this event?')) {
            Storage.deleteEvent(this.currentEditingEventId);
            console.log("Deleted event:", this.currentEditingEventId);
            
            // Refresh the calendar or events list
            if (typeof Calendar !== 'undefined' && Calendar.renderEvents) {
                Calendar.renderEvents();
            }
            
            UI.closeModal('event-modal');
        }
    },
    
    addFriendToEvent: function() {
        const friendSelect = document.getElementById('friend-select');
        const friendsList = document.getElementById('friends-list');
        
        if (!friendSelect || !friendsList) {
            console.error("Missing friends elements");
            return;
        }
        
        const friendId = friendSelect.value;
        if (!friendId) {
            alert('Please select a friend');
            return;
        }
        
        const friendName = friendSelect.options[friendSelect.selectedIndex].text;
        
        // Check if friend is already added
        const existingInvitee = document.querySelector(`.remove-invitee[data-id="${friendId}"]`);
        if (existingInvitee) {
            alert('This friend is already invited');
            return;
        }
        
        const inviteeElement = document.createElement('div');
        inviteeElement.classList.add('invitee-item');
        inviteeElement.innerHTML = `
            <span>${friendName}</span>
            <button type="button" class="remove-invitee" data-id="${friendId}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        friendsList.appendChild(inviteeElement);
        
        // Add event listener to remove button
        const removeBtn = inviteeElement.querySelector('.remove-invitee');
        removeBtn.addEventListener('click', () => {
            this.removeInvitee(friendId);
        });
        
        UI.closeModal('friend-modal');
    },
    
    removeInvitee: function(inviteeId) {
        const inviteeElement = document.querySelector(`.remove-invitee[data-id="${inviteeId}"]`).closest('.invitee-item');
        if (inviteeElement) {
            inviteeElement.remove();
        }
    }
};

// Initialize the Events module when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    Events.init();
});
