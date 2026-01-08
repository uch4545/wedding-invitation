// Guest data will be loaded from guests.json
let guestsData = [];
let currentGuest = null;

// DOM Elements
const welcomePage = document.getElementById('welcomePage');
const invitationPage = document.getElementById('invitationPage');
const guestSearch = document.getElementById('guestSearch');
const suggestionsDropdown = document.getElementById('suggestions');
const searchBtn = document.getElementById('searchBtn');
const backBtn = document.getElementById('backBtn');
const guestNameDisplay = document.getElementById('guestName');
const eventsContainer = document.getElementById('eventsContainer');

// Load guest data
async function loadGuestData() {
    try {
        const response = await fetch('guests.json');
        const data = await response.json();
        guestsData = data.guests;
        console.log('Guest data loaded:', guestsData.length, 'guests');
    } catch (error) {
        console.error('Error loading guest data:', error);
        alert('خرابی: مہمانوں کی فہرست لوڈ نہیں ہو سکی');
    }
}

// Search functionality with auto-suggestions
function searchGuests(query) {
    if (!query || query.trim().length === 0) {
        return [];
    }

    const searchTerm = query.toLowerCase().trim();
    
    // Filter guests that match the search term
    return guestsData.filter(guest => 
        guest.name.toLowerCase().includes(searchTerm)
    );
}

// Display suggestions
function displaySuggestions(matches) {
    suggestionsDropdown.innerHTML = '';
    
    if (matches.length === 0) {
        suggestionsDropdown.classList.remove('active');
        return;
    }

    matches.forEach(guest => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = guest.name;
        item.addEventListener('click', () => {
            selectGuest(guest);
        });
        suggestionsDropdown.appendChild(item);
    });

    suggestionsDropdown.classList.add('active');
}

// Select guest and show invitation
function selectGuest(guest) {
    currentGuest = guest;
    guestSearch.value = guest.name;
    suggestionsDropdown.classList.remove('active');
    showInvitation();
}

// Show invitation page
function showInvitation() {
    if (!currentGuest) {
        alert('براہ کرم اپنا نام منتخب کریں');
        return;
    }

    // Update guest name
    guestNameDisplay.textContent = currentGuest.name;

    // Clear previous events
    eventsContainer.innerHTML = '';

    // Add event cards based on guest's events
    currentGuest.events.forEach((event, index) => {
        setTimeout(() => {
            addEventCard(event);
        }, index * 200); // Stagger animations
    });

    // Switch pages
    welcomePage.classList.add('hidden');
    invitationPage.classList.remove('hidden');

    // Scroll to top
    window.scrollTo(0, 0);
}

// Add event card
function addEventCard(eventType) {
    let template;
    
    switch(eventType) {
        case 'mehndi':
            template = document.getElementById('mehndiTemplate');
            break;
        case 'barat':
            template = document.getElementById('baratTemplate');
            break;
        case 'walima':
            template = document.getElementById('walimaTemplate');
            break;
        default:
            return;
    }

    const clone = template.content.cloneNode(true);
    eventsContainer.appendChild(clone);
}

// Go back to welcome page
function goBack() {
    invitationPage.classList.add('hidden');
    welcomePage.classList.remove('hidden');
    guestSearch.value = '';
    currentGuest = null;
    window.scrollTo(0, 0);
}

// Event Listeners
guestSearch.addEventListener('input', (e) => {
    const query = e.target.value;
    const matches = searchGuests(query);
    displaySuggestions(matches);
});

guestSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value;
        const matches = searchGuests(query);
        
        if (matches.length === 1) {
            selectGuest(matches[0]);
        } else if (matches.length > 0) {
            // Show suggestions if multiple matches
            displaySuggestions(matches);
        } else {
            alert('کوئی نام نہیں ملا۔ براہ کرم دوبارہ کوشش کریں');
        }
    }
});

searchBtn.addEventListener('click', () => {
    const query = guestSearch.value;
    const matches = searchGuests(query);
    
    if (matches.length === 1) {
        selectGuest(matches[0]);
    } else if (matches.length > 1) {
        alert('کئی نام ملے ہیں۔ براہ کرم فہرست سے منتخب کریں');
        displaySuggestions(matches);
    } else {
        alert('کوئی نام نہیں ملا۔ براہ کرم دوبارہ کوشش کریں');
    }
});

backBtn.addEventListener('click', goBack);

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!guestSearch.contains(e.target) && !suggestionsDropdown.contains(e.target)) {
        suggestionsDropdown.classList.remove('active');
    }
});

// Initialize
loadGuestData();
