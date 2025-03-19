const Events = {
    currentEditingEventId: null,
    
    init: function() {
        this.setupEventListeners();
    },
    
    setupEventListeners: function() {
        const eventForm = document.getElementById('event-form');
        const deleteEventBtn = document.getElementById('delete-event-btn');
        const addFriendBtn = document.getElementById('add-friend-btn');
        const confirmAddFriendBtn = document.getElementById('confirm-add-friend');
        
        if (eventForm) {
            eventForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveEvent();
            });
        }
        
        if (deleteEventBtn) {
            deleteEventBtn.addEventListener('click', () => this.deleteEvent());
        }
        
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', (e) => {
                UI.closeModal(e.target.closest('.modal').id);
            });
        });
        
        if (addFriendBtn) {
            addFriendBtn.addEventListener('click', () => UI.openModal('friend-modal'));
        }
        
        if (confirmAddFriendBtn) {
            confirmAddFriendBtn.addEventListener('click', () => this.addFriendToEvent());
        }
    },
    
    openEventModal: function(eventId = null) {
        this.currentEditingEventId = eventId;
        const modalTitle = document.getElementById('modal-title');
        const deleteButton = document.getElementById('delete-event-btn');
        const form = document.getElementById('event-form');
        const friendsList = document.getElementById('friends-list');
        
        if (!form) return;
        form.reset();
        friendsList.innerHTML = '';
        
        if (eventId) {
            const event = Storage.getEventById(eventId);
            if (!event) return;
            
            modalTitle.textContent = 'Edit Event';
            deleteButton.hidden = false;
            
            form['event-title'].value = event.title;
            form['event-date'].value = event.date;
            form['event-start'].value = event.startTime;
            form['event-end'].value = event.endTime;
            form['event-category'].value = event.category;
            form['event-description'].value = event.description || '';
            form['event-location'].value = event.location || '';
            form['event-reminder'].value = event.reminder || 'none';
            
            this.populateInvitees(event.invitees || []);
        } else {
            modalTitle.textContent = 'Add Event';
            deleteButton.hidden = true;
            
            const today = new Date().toISOString().split('T')[0];
            form['event-date'].value = today;
            
            const now = new Date();
            now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30);
            
            const startTime = now.toTimeString().slice(0, 5);
            form['event-start'].value = startTime;
            
            now.setHours(now.getHours() + 1);
            form['event-end'].value = now.toTimeString().slice(0, 5);
        }
        
        UI.openModal('event-modal');
    },
    
    saveEvent: function() {
        const form = document.getElementById('event-form');
        if (!form) return;
        
        const event = {
            id: this.currentEditingEventId || 'event' + Date.now(),
            title: form['event-title'].value,
            date: form['event-date'].value,
            startTime: form['event-start'].value,
            endTime: form['event-end'].value,
            category: form['event-category'].value,
            description: form['event-description'].value,
            location: form['event-location'].value,
            reminder: form['event-reminder'].value,
            invitees: Array.from(document.querySelectorAll('.friend-item')).map(item => item.dataset.friendId),
            createdBy: Storage.getUser()?.id || 'guest'
        };
        
        if (this.currentEditingEventId) {
            Storage.updateEvent(event);
        } else {
            Storage.addEvent(event);
        }
        
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
        if (!friendsList) return;
        
        friendsList.innerHTML = '';
        inviteeIds.forEach(id => {
            const friend = Storage.getFriendById(id);
            if (!friend) return;
            
            const friendItem = document.createElement('div');
            friendItem.className = 'friend-item';
            friendItem.dataset.friendId = friend.id;
            friendItem.innerHTML = `<span>${friend.name}</span> <span class="remove-friend">&times;</span>`;
            
            friendItem.querySelector('.remove-friend').addEventListener('click', () => friendItem.remove());
            friendsList.appendChild(friendItem);
        });
    },
    
    addFriendToEvent: function() {
        const emailInput = document.getElementById('friend-email');
        if (!emailInput) return;
        
        const email = emailInput.value.trim();
        if (!email) return alert('Please enter an email address');
        
        let friend = Storage.getFriends().find(f => f.email === email);
        
        if (!friend) {
            friend = { id: 'friend' + Date.now(), name: email.split('@')[0], email };
            Storage.addFriend(friend);
        }
        
        if (document.querySelector(`.friend-item[data-friend-id="${friend.id}"]`)) {
            alert('This friend is already invited');
            UI.closeModal('friend-modal');
            return;
        }
        
        const friendsList = document.getElementById('friends-list');
        const friendItem = document.createElement('div');
        friendItem.className = 'friend-item';
        friendItem.dataset.friendId = friend.id;
        friendItem.innerHTML = `<span>${friend.name}</span> <span class="remove-friend">&times;</span>`;
        
        friendItem.querySelector('.remove-friend').addEventListener('click', () => friendItem.remove());
        friendsList.appendChild(friendItem);
        
        emailInput.value = '';
        UI.closeModal('friend-modal');
    }
};

Events.init();
