const Events = {
    currentEditingEventId: null,
    
    init: function() {
        this.setupEventListeners();
    },
    
    setupEventListeners: function() {
        document.getElementById('event-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEvent();
        });
        
        document.getElementById('delete-event-btn')?.addEventListener('click', () => {
            this.deleteEvent();
        });
        
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', (e) => {
                UI.closeModal(e.target.closest('.modal')?.id);
            });
        });
        
        document.getElementById('add-friend-btn')?.addEventListener('click', () => {
            UI.openModal('friend-modal');
        });
        
        document.getElementById('confirm-add-friend')?.addEventListener('click', () => {
            this.addFriendToEvent();
        });
    },
    
    openEventModal: function(eventId = null) {
        console.log("openEventModal function called");
        this.currentEditingEventId = eventId;
        
        const modalTitle = document.getElementById('modal-title');
        const deleteButton = document.getElementById('delete-event-btn');
        const form = document.getElementById('event-form');
        
        if (!modalTitle || !deleteButton || !form) {
            console.error("Missing elements in openEventModal");
            return;
        }
        
        form.reset();
        document.getElementById('friends-list').innerHTML = '';
        
        if (eventId) {
            console.log("Editing event with ID:", eventId);
            const event = Storage.getEventById(eventId);
            if (!event) {
                console.error("Event not found");
                return;
            }
            
            modalTitle.textContent = 'Edit Event';
            deleteButton.hidden = false;
            
            document.getElementById('event-title').value = event.title;
            document.getElementById('event-date').value = event.date;
            document.getElementById('event-start').value = event.startTime;
            document.getElementById('event-end').value = event.endTime;
            document.getElementById('event-category').value = event.category;
            document.getElementById('event-description').value = event.description || '';
            document.getElementById('event-location').value = event.location || '';
            document.getElementById('event-reminder').value = event.reminder || 'none';
            
            this.populateInvitees(event.invitees || []);
        } else {
            console.log("Creating a new event");
            modalTitle.textContent = 'Add Event';
            deleteButton.hidden = true;
            
            const today = new Date();
            document.getElementById('event-date').value = today.toISOString().split('T')[0];
            
            const now = new Date();
            now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30);
            document.getElementById('event-start').value = now.toTimeString().slice(0, 5);
            
            now.setHours(now.getHours() + 1);
            document.getElementById('event-end').value = now.toTimeString().slice(0, 5);
        }
        
        console.log("Opening modal...");
        UI.openModal('event-modal');
    }
};
