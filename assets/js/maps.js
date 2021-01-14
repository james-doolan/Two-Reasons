document.write('<div><button id="day">Daily</button><button id="week">Weekly</button><button id="month">Monthly</button><button id="tmonth">Quarterly</button><label id="year">Tue Jul 28 1914 00:00:00 GMT-0025 (Irish Standard Time)</label><div id="contSlider"><input id="slider" type="range" min="0" max="135397279000" step="86400000" value="0" /></div><br> <div id="map"></div></div>');

const dayStep = 86400000;
const weekStep = 604800000;
const monthStep = 2654848607;
const tmonthStep = 7964545823;

$("#day").click(function() {
  $("#slider").attr("step", dayStep);
});

$("#week").click(function() {
  $("#slider").attr("step", weekStep);
});

$("#month").click(function() {
  $("#slider").attr("step", monthStep);
});

$("#tmonth").click(function() {
  $("#slider").attr("step", tmonthStep);
});

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

slider.addEventListener('input', function () {
    let sliderDif = parseInt(slider.value);
    let dateShown = (1749252879000 - sliderDif) * (-1);
    console.log(dateShown);
    let longDate = new Date(dateShown);
    let longDateStr = JSON.stringify(longDate);
    let shortDate = longDateStr.slice(1,11);
    year.textContent = shortDate;

    if ($("#slider").attr("step") == dayStep) {
        for (i = 0; i < wwOne.length; i++) {
            let startMsec = Date.parse(wwOne[i].startDate);
            let endMsec = Date.parse(wwOne[i].endDate);
            console.log("daily")
            if (dateShown >= startMsec && dateShown <= endMsec) {
                console.log(wwOne[i].battle);
                locations.push(wwOne[i].coords);
            }
        }
    } else if ($("#slider").attr("step") == weekStep) {
        for (i = 0; i < wwOne.length; i++) {
            let startMsec = Date.parse(wwOne[i].startDate) - 302400000;
            let endMsec = Date.parse(wwOne[i].endDate) + 302400000;
            console.log("weekly")
            if (dateShown >= startMsec && dateShown <= endMsec) {
                console.log(wwOne[i].battle);
                locations.push(wwOne[i].coords);
            }
        }
    } else if ($("#slider").attr("step") == monthStep) {
        for (i = 0; i < wwOne.length; i++) {
            let startMsec = Date.parse(wwOne[i].startDate) - 1314000000;
            let endMsec = Date.parse(wwOne[i].endDate) + 1314000000;
            console.log("monthly")
            if (dateShown >= startMsec && dateShown <= endMsec) {
                console.log(wwOne[i].battle);
                locations.push(wwOne[i].coords);
            }
        }
    } else {
        for (i = 0; i < wwOne.length; i++) {
            let startMsec = Date.parse(wwOne[i].startDate) - 3942000000;
            let endMsec = Date.parse(wwOne[i].endDate) + 3942000000;
            console.log("3monthly")
            if (dateShown >= startMsec && dateShown <= endMsec) {
                console.log(wwOne[i].battle);
                locations.push(wwOne[i].coords);
            }
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
    });

    new MarkerClusterer(map, markers, {
        gridSize: 5,
        imagePath:
            "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    });
}