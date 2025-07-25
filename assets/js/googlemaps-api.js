

// google maps api implementation

function initMap() {
    const startPosition = { lat: 59.3293, lng: 18.0686};
    const map = new google.maps.Map(document.getElementById("map-area"), {

        zoom: 6,
        center: startPosition,
        disableDefaultUI: true,
        fullscreenControl: true,
        styles: [ // generated from https://snazzymaps.com
            {
                "featureType": "administrative",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": "-100"
                    }
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 65
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": "50"
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": "-100"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "all",
                "stylers": [
                    {
                        "lightness": "30"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "all",
                "stylers": [
                    {
                        "lightness": "40"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "hue": "#ffff00"
                    },
                    {
                        "lightness": -25
                    },
                    {
                        "saturation": -97
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels",
                "stylers": [
                    {
                        "lightness": -25
                    },
                    {
                        "saturation": -100
                    }
                ]
            }
        ]
    });

}

window.initMap = initMap;



function initApp() {
    let events = loadEventsFromLocalStorage();
    renderEventList(events);
}

function handleFormSubmit(event) {

    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const address = document.getElementById('address').value;
    const flag1 = document.getElementById('flag1').checked;
    const flag2 = document.getElementById('flag2').checked;
    const flag3 = document.getElementById('flag3').checked;
    const flag4 = document.getElementById('flag4').checked;
    const description = document.getElementById('description').value;


    const newEvent = {
        id: Date.now(),
        title,
        date,
        time,
        address,
        flag1,
        flag2,
        flag3,
        flag4,
        description
    };

    let events = loadEventsFromLocalStorage();
    events.push(newEvent);
    saveEventsToLocalStorage(events);

    renderEventList(events);

    event.target.reset();
}

function handleFilterChange() {
    const filterLat = parseFloat(document.getElementById('filterLat').value);
    const filterLng = parseFloat(document.getElementById('filterLng').value);
    const filterFlag1 = document.getElementById('filterFlag1').checked;
    const filterFlag2 = document.getElementById('filterFlag2').checked;
    const filterFlag3 = document.getElementById('filterFlag3').checked;
    const filterFlag4 = document.getElementById('filterFlag4').checked;

    const filterCriteria = {
        lat: filterLat,
        lng: filterLng,
        flag1: filterFlag1,
        flag2: filterFlag2,
        flag3: filterFlag3,
        flag4: filterFlag4
    };

    const events = loadEventsFromLocalStorage();

    const filteredEvents = events.filter(event => {
        return isNearby(event.address, filterCriteria.lat, filterCriteria.lng) &&
               matchesFlags(event, filterCriteria);
    });

    renderEventList(filteredEvents);
}

function matchesFlags(event, filter) {
    if (filter.flag1 && !event.flag1) return false;
    if (filter.flag2 && !event.flag2) return false;
    if (filter.flag3 && !event.flag3) return false;
    if (filter.flag4 && !event.flag4) return false;
    return true;
}

function saveEventsToLocalStorage(events) {
    localStorage.setItem('events', JSON.stringify(events));
}

function loadEventsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('events')) || [];
}


function renderEventList(events) {
    const container = document.getElementById('event-list');
    container.innerHTML = '';

    if (events.length === 0) {
        container.textContent = 'Inga events att visa.';
        return;
    }

    events.forEach(event => {
        const div = document.createElement('div');
        div.classList.add('event-item');
        div.innerHTML = `
            <h3>${event.title}</h3>
            <p><strong>Datum:</strong> ${event.date}</p>
            <p><strong>Plats:</strong> Lat ${event.address.lat}, Lng ${event.address.lng}</p>
            <p><strong>Beskrivning:</strong> ${event.description}</p>
            <p><strong>Flaggor:</strong> ${[
                event.flag1 ? 'Flag1' : '',
                event.flag2 ? 'Flag2' : '',
                event.flag3 ? 'Flag3' : '',
                event.flag4 ? 'Flag4' : ''
            ].filter(f => f).join(', ')}</p>
        `;
        container.appendChild(div);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    initApp();

    const form = document.getElementById('event-form-form');
    form.addEventListener('submit', handleFormSubmit);

    const filterInputs = document.querySelectorAll('.filter-input');
    filterInputs.forEach(input => input.addEventListener('change', handleFilterChange));
});
