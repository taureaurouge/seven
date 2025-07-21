

let geocoder;
let autocomplete;
let input;

function initMap() {
    const startPosition = { lat: 59.3293, lng: 18.0686};
    const map = new google.maps.Map(document.getElementById("map-area"), {

        zoom: 6,
        center: startPosition,
        disableDefaultUI: true,
        fullscreenControl: true,
        styles: [
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

    const marker = new google.maps.Marker({
        position: startPosition,
        map: map,
    });

    marker.setVisible(false);

    input = document.getElementById("location-input");

    geocoder = new google.maps.Geocoder();

    autocomplete = new google.maps.places.Autocomplete(input, {
      types: ["(cities)"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        map.setCenter(place.geometry.location);
        map.setZoom(12);
      }
    });

    map.addListener("idle", updateCityFromCenter);

    updateCityFromCenter();

    function updateCityFromCenter() {
        const center = map.getCenter();
        geocoder.geocode({ location: center }, (results, status) => {
        if (status === "OK" && results.length > 0) {
            const cityResult = results.find(result =>
            result.types.includes("locality") || result.types.includes("postal_town")
            );

            if (cityResult) {
            const cityName = cityResult.address_components[0].long_name;
            input.value = cityName;
            } else {
            input.value = "Okänd plats";
            }
        } else {
            console.error("Geokodning misslyckades:", status);
        }
        });
    }

}

window.initMap = initMap;

