// document.write("<label id='year'>Tue Jul 28 1914 00:00:00 GMT-0025 (Irish Standard Time)</label><input id='slider' type='range' min='0' max='135397279000' step='86400000' value='0' onkeydown='return false;' /><br> <div id='map'>");

function week() {
    $("#slider").attr("step", "604800000")
}

function month() {
    $("#slider").attr("step", "2628000000")
}

function threeMonths() {
    $("#slider").attr("step", "7884000000")
}

let locations = [];
var slider = document.getElementById("slider");
var year = document.getElementById("year");

let wwOne = [
    {
        battle: "battle of year 1914",
        coords: { lat: 40.785091, lng: -73.968285 },
        startDate: "03/24/1914",
        endDate: "03/30/1916",
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
        endDate: "11/10/1918",
        description: "The bloody battle took place in 1972 mostly"
    }
];


slider.addEventListener('input', function (e) {
    let sliderDif = parseInt(slider.value);
    let dateShown = (1749252879000 - sliderDif) * (-1);
    console.log(dateShown);
    year.textContent = new Date(dateShown);

    for (i = 0; i < wwOne.length; i++) {
        let startMsec = Date.parse(wwOne[i].startDate);
        let endMsec = Date.parse(wwOne[i].endDate);

        if (dateShown >= startMsec && dateShown <= endMsec) {
            console.log(wwOne[i].battle);
            locations.push(wwOne[i].coords)
        }
    }

    initMap();

    locations = [];
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