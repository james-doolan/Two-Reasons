let locations = [];

var slider = document.getElementById("slider");
var year = document.getElementById("year");
var yearInt;
let contempBattles = [];
let contempCoords = [];
var battles = [
    {
        battle: "battle of year 1914",
        coords: { lat: 40.785091, lng: -73.968285 },
        year: [1914, 1915, 1916],
        description: "The bloody battle took place in 1903 mostly"
    },
    {
        battle: "battle of year 1915",
        coords: { lat: 41.084045, lng: -73.874245 },
        year: [1915, 1916, 1917],
        description: "The bloody battle took place in 1905 mostly"
    },
    {
        battle: "battle of year 1918",
        coords: { lat: 40.754932, lng: -73.984016 },
        year: [1918],
        description: "The bloody battle took place in 1972 mostly"
    }
]

let tdate = [
    {
        battle: "battle of year 1914",
        coords: { lat: 40.785091, lng: -73.968285 },
        startDate: "03/24/1914",
        endDate: "03/20/1915",
        description: "The bloody battle took place in 1903 mostly"
    },
    {
        battle: "battle of year 1915",
        coords: { lat: 41.084045, lng: -73.874245 },
        startDate: "03/24/1916",
        endDate: "09/20/1916",
        description: "The bloody battle took place in 1905 mostly"
    },
    {
        battle: "battle of year 1918",
        coords: { lat: 40.754932, lng: -73.984016 },
        startDate: "03/20/1918",
        endDate: "03/24/1918",
        description: "The bloody battle took place in 1972 mostly"
    }
]




slider.addEventListener('mouseup', function (e) {
    let sliderDif = parseInt(slider.value);
    let dateShown = (1749252879000 - sliderDif) * (-1);
    console.log(dateShown);
    year.textContent = new Date(dateShown);

    for (i = 0; i < tdate.length; i++) {
        let startMsec = Date.parse(tdate[i].startDate);
        let endMsec = Date.parse(tdate[i].endDate);

        if (dateShown >= startMsec && dateShown <= endMsec) {
            console.log(tdate[i].battle);
        }
    }

    contempBattles = battles.filter(o => o.year.includes(yearInt));
    // console.log(contempBattles);
    for (i = 0; i < contempBattles.length; i++) {
        locations.push(contempBattles[i].coords)
    }

    // console.log(locations);

    initMap();

    locations = [];
    contempCoords = [];
    contempBattles = [];
});

function setMarkers() {
    let latv = parseFloat(document.getElementById("latitude").value, 10);
    let lngv = parseFloat(document.getElementById("longitude").value, 10);
    console.log(latv, lngv);
    locations.push({ lat: latv, lng: lngv });
    console.log(locations);
}

function initMap() {
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 2.3,
        center: {
            lat: 20.047867,
            lng: 12.898272
        }
    });

    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    var markers = locations.map(function (location, i) {
        return new google.maps.Marker({
            position: location,
            label: labels[i % labels.length]
        })
    })

    new MarkerClusterer(map, markers, {
        gridSize: 5,
        imagePath:
            "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    });
}