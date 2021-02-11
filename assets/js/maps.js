const dayStep = 86400000;
const weekStep = 604800000;
const monthStep = 2654848607;
const tmonthStep = 7964545823;
const smonthStep = 15929091646;

const ww1StartMsec = 1749252879000;
const ww1LengthMsec = 143361824814;
const ww2StartMsec = 973244691646;
const ww2LengthMsec = 207132291646;
let sliderStartMsec;
let wwLengthMsec;

let overview;
let map;
let markedLocations = [];
const OVERVIEW_DIFFERENCE = 5;
const OVERVIEW_MIN_ZOOM = 1;
const OVERVIEW_MAX_ZOOM = 3.5;

let mapCenter = { lat: 28, lng: 12 };
let locations = [];
let slider = document.getElementById("slider");
let year = document.getElementById("year");

let filteredWws = [];
let wwsLength = wws.length;
let scount = 0;
let count = [];

function wwsFilter() {
    for (i = 0; i < wwsLength; i++) {
        let currentUn = wws[i].allies;
        scount += 1;
        if (typeof currentUn == 'object') {
            for (j = 0; j < currentUn.length; j++) {
                if (count.indexOf(currentUn[j]) === -1) {
                    count.push(currentUn[j]);
                }
            }
        } else {
            count.push(currentUn);
        }
    }
    console.log(scount);
    console.log(count);
    console.log([... new Set(count)]);
}


function initMapWithMarkers() {
    initMap();
    sliderMapChange();
}

let initContent = (function () {
    let executed = false;
    return function () {
        if (!executed) {
            executed = true;
            $(".init-page-container").removeClass("init-page-container").addClass("page-container");
            $(".intro").css({ "height": "0px", "transform": "scale(0)", "opacity": "0%" });
            $(".key").css({ "height": "400px", "transform": "scale(1)" });
            $(".map-button-container").css("visibility", "visible");
            $("#buttonsNMap").addClass("map-button-container").removeClass("init-map-button-container");
            $(".contact-link").css('opacity', '100%')
            setTimeout(initMapWithMarkers, 1000);
        }
    };
})();

$(".ww1").click(function () {
    $("#startHeading").html("<h3>1914</h3>");
    $("#endHeading").html("<h3>1918</h3>");
    $("#slider").attr("max", ww1LengthMsec);
    sliderStartMsec = ww1StartMsec;
    wwLengthMsec = ww1LengthMsec;
    if ($(".ww1").hasClass('world-highlighted')) {
        return;
    } else {
        $(".ww2").removeClass('world-highlighted')
        $(".ww1").addClass('world-highlighted');
    }
    sliderMapChange();
    initContent();
});

$(".ww2").click(function () {
    $("#startHeading").html("<h3>1939</h3>");
    $("#endHeading").html("<h3>1945</h3>");
    $("#slider").attr("max", ww2LengthMsec);
    sliderStartMsec = ww2StartMsec;
    wwLengthMsec = ww2LengthMsec;
    if ($(".ww2").hasClass('world-highlighted')) {
        return;
    } else {
        $(".ww1").removeClass('world-highlighted')
        $(".ww2").addClass('world-highlighted');
    }
    sliderMapChange();
    initContent();
});




$("#day").click(function () {
    $("#slider").attr("step", dayStep);
    sliderMapChange();
});

$("#week").click(function () {
    $("#slider").attr("step", weekStep);
    sliderMapChange();
});

$("#month").click(function () {
    $("#slider").attr("step", monthStep);
    sliderMapChange();
});

$("#tmonth").click(function () {
    $("#slider").attr("step", tmonthStep);
    sliderMapChange();
});

$("#smonth").click(function () {
    $("#slider").attr("step", smonthStep);
    sliderMapChange();
});

$("#wholeWar").click(function () {
    $("#slider").attr("step", 1000000000000);
    sliderMapChange();
    if ($(this).hasClass('highlighted')) {
        return;
    } else {
        $('.highlighted').removeClass('highlighted')
        $("#slider").css('filter', 'brightness(20%)');
        $(this).addClass('highlighted');
    }
});

$(".period-button").click(function () {
    let clicked = $(this);

    if (clicked.hasClass('highlighted')) {
        return;
    } else {
        $('.highlighted').removeClass('highlighted')
        $(this).addClass('highlighted');
        $("#slider").css('filter', 'brightness(100%)');
    }
});

$("#slider").on('input', function () {
    sliderMapChange();
});

$("#slider").on('mousedown', function () {
    $("#slider").css('cursor', 'grabbing !important');
});

$("#slider").on('mouseup', function () {
    $("#slider").css('cursor', 'grab');
});


function sliderMapChange() {
    let sliderDif = parseInt(slider.value);
    let dateShown = (sliderStartMsec - sliderDif) * (-1);
    let longDate = new Date(dateShown);
    let longDateStr = JSON.stringify(longDate);
    let shortDate = longDateStr.slice(1, 11);
    year.textContent = shortDate;

    if ($("#slider").attr("step") == dayStep) {
        for (i = 0; i < wws.length; i++) {
            let startMsec = Date.parse(wws[i].startDate);
            let endMsec = Date.parse(wws[i].endDate);
            if (dateShown >= startMsec && dateShown <= endMsec) {
                locations.push(wws[i].coords);
            }
        }
    } else if ($("#slider").attr("step") == weekStep) {
        for (i = 0; i < wws.length; i++) {
            let startMsec = Date.parse(wws[i].startDate) - 302400000;
            let endMsec = Date.parse(wws[i].endDate) + 302400000;
            if (dateShown >= startMsec && dateShown <= endMsec) {
                locations.push(wws[i].coords);
            }
        }
    } else if ($("#slider").attr("step") == monthStep) {
        for (i = 0; i < wws.length; i++) {
            let startMsec = Date.parse(wws[i].startDate) - 1314000000;
            let endMsec = Date.parse(wws[i].endDate) + 1314000000;
            if (dateShown >= startMsec && dateShown <= endMsec) {
                locations.push(wws[i].coords);
            }
        }
    } else if ($("#slider").attr("step") == tmonthStep) {
        for (i = 0; i < wws.length; i++) {
            let startMsec = Date.parse(wws[i].startDate) - 3942000000;
            let endMsec = Date.parse(wws[i].endDate) + 3942000000;
            if (dateShown >= startMsec && dateShown <= endMsec) {
                locations.push(wws[i].coords);
            }
        }
    } else if ($("#slider").attr("step") == smonthStep) {
        for (i = 0; i < wws.length; i++) {
            let startMsec = Date.parse(wws[i].startDate) - 7964545823;
            let endMsec = Date.parse(wws[i].endDate) + 7964545823;
            if (dateShown >= startMsec && dateShown <= endMsec) {
                locations.push(wws[i].coords);
            }
        }
    } else {
        for (i = 0; i < wws.length; i++) {
            let startMsec = Date.parse(wws[i].startDate);
            let endMsec = Date.parse(wws[i].endDate);
            let wwStartMsec = (sliderStartMsec) * (-1);
            let wwEndMsec = wwStartMsec + wwLengthMsec;
            if (wwStartMsec <= startMsec && wwEndMsec >= endMsec) {
                locations.push(wws[i].coords);
            }
        }
    }

    // initMap();
    removeMarkers();
    setMarkers();
    map.setCenter(mapCenter);
    map.setZoom(2.47);

    locations = [];
};

function CenterControl(controlDiv, map) {
    // Set CSS for the control border.
    const controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "2px solid #fff";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.title = "Click to recenter the map";
    controlDiv.appendChild(controlUI);
    // Set CSS for the control interior.
    const controlText = document.createElement("div");
    controlText.style.color = "rgb(25,25,25)";
    controlText.style.fontFamily = "Roboto,Arial,sans-serif";
    controlText.style.fontSize = "16px";
    controlText.style.lineHeight = "38px";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "5px";
    controlText.innerHTML = "Center Map";
    controlUI.appendChild(controlText);
    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener("click", () => {
        map.setCenter(mapCenter);
        map.setZoom(2.47);
    });
}

function initMap() {
    const styledMapType = new google.maps.StyledMapType(
        [
            { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
            {
                featureType: "administrative",
                elementType: "geometry.stroke",
                stylers: [{ color: "#c9b2a6" }],
            },
            {
                featureType: "administrative.land_parcel",
                elementType: "geometry.stroke",
                stylers: [{ color: "#dcd2be" }],
            },
            {
                featureType: "administrative.land_parcel",
                elementType: "labels.text.fill",
                stylers: [{ color: "#ae9e90" }],
            },
            {
                featureType: "landscape.natural",
                elementType: "geometry",
                stylers: [{ color: "#dfd2ae" }],
            },
            {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{ color: "#dfd2ae" }],
            },
            {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#93817c" }],
            },
            {
                featureType: "poi.park",
                elementType: "geometry.fill",
                stylers: [{ color: "#a5b076" }],
            },
            {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#447530" }],
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#f5f1e6" }],
            },
            {
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [{ color: "#fdfcf8" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#f8c967" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#e9bc62" }],
            },
            {
                featureType: "road.highway.controlled_access",
                elementType: "geometry",
                stylers: [{ color: "#e98d58" }],
            },
            {
                featureType: "road.highway.controlled_access",
                elementType: "geometry.stroke",
                stylers: [{ color: "#db8555" }],
            },
            {
                featureType: "road.local",
                elementType: "labels.text.fill",
                stylers: [{ color: "#806b63" }],
            },
            {
                featureType: "transit.line",
                elementType: "geometry",
                stylers: [{ color: "#dfd2ae" }],
            },
            {
                featureType: "transit.line",
                elementType: "labels.text.fill",
                stylers: [{ color: "#8f7d77" }],
            },
            {
                featureType: "transit.line",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#ebe3cd" }],
            },
            {
                featureType: "transit.station",
                elementType: "geometry",
                stylers: [{ color: "#dfd2ae" }],
            },
            {
                featureType: "water",
                elementType: "geometry.fill",
                stylers: [{ color: "#afa27e" }],
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#92998d" }],
            },
        ],
        { name: "Old War Style" }
    );

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 2.47,
        center: mapCenter,
        mapTypeControlOptions: {
            mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "styled_map"],
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        },
        streetViewControl: false,
        scaleControl: false,
        fullscreenControl: false,
    });
    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    const centerControlDiv = document.createElement("div");
    CenterControl(centerControlDiv, map);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
    // instantiate the overview map without controls
    overview = new google.maps.Map(document.getElementById("overview"), {
        center: { lat: 20.047867, lng: 12.898272 },
        zoom: 1.5,
        disableDefaultUI: true,
        gestureHandling: "none",
        zoomControl: false,
    });

    function clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }
    map.addListener("bounds_changed", () => {
        overview.setCenter(map.getCenter());
        overview.setZoom(
            clamp(
                map.getZoom() - OVERVIEW_DIFFERENCE,
                OVERVIEW_MIN_ZOOM,
                OVERVIEW_MAX_ZOOM
            )
        );
    });

    map.mapTypes.set("styled_map", styledMapType);
    map.setMapTypeId("styled_map");
    overview.mapTypes.set("styled_map", styledMapType);
    overview.setMapTypeId("styled_map");
}


function removeMarkers() {

    (markerRemoval = function () {
        for (let i = 0; i < markedLocations.length; i++) {
            markedLocations[i].setMap(null);
        }
    })();

    markedLocations = [];
}

function closeInfoWindow() {

}

function setMarkers() {

    let markers = locations.map(function (location, i) {

        const startDate = wws.find(x => x.coords === location).startDate;
        const startDateMsec = Date.parse(startDate) * (-1);
        let battleType = wws.find(x => x.coords === location).battleType;
        const battleTitle = wws.find(x => x.coords === location).battle;
        let battleImageType;
        let battleImageSort;
        if (startDateMsec > ww2StartMsec) {
            if (typeof battleType == 'string') {
                battleImageType = battleType;
            } else {
                battleType = battleType.sort();
                battleTypeStr = battleType.toString();
                battleImageType = battleTypeStr.replace(/,/g, '-');
            }
        } else {
            if (typeof battleType == 'string') {
                battleImageType = "ww2" + battleType;
            } else {
                battleType = battleType.sort();
                battleTypeStr = battleType.toString();
                battleImageSort = battleTypeStr.replace(/,/g, '-');
                battleImageType = "ww2" + battleImageSort;
            }
        }

        const infowindow = new google.maps.InfoWindow({
            content: battleTitle,
        });

        const image =
        {
            url: "/assets/cluster_images/m" + battleImageType + ".png",
            scaledSize: new google.maps.Size(40, 40),
        };

        const marker = new google.maps.Marker({
            position: location,
            icon: image,
            map,
        });
        markedLocations.push(marker);

        marker.addListener("click", () => {
            infowindow.open(map, marker);
            map.setZoom(11);
            map.setCenter(marker.getPosition())
            battleInfoDiv(battleTitle, startDate);
            setTimeout(function () { infowindow.close(); }, 3000);
        });
        return marker;
    });
}

function battleInfoDiv(battleTitle, startDate) {
    const endDate = wws.find(x => x.battle === battleTitle).endDate;
    const description = wws.find(x => x.battle === battleTitle).description;
    const allies = wws.find(x => x.battle === battleTitle).allies;
    const adversaries = wws.find(x => x.battle === battleTitle).adversaries;
    const titleLink = battleTitle.replace(/ /g, '_');
    const wikiLink = "https://en.wikipedia.org/wiki/" + titleLink;
    $(".page-container").css("height", "250vh");
    $(".page-container").css("transition", "none");
    $("#battleInfoBox").html(
        "<div class='fFlagsNpole'><div class='flagpole friendly-flagpole'></div><div class='flags fFlags' id='friendly-flags'></div></div>" +
        "<table class='infoBoxTable'>" +
        "<tr>" +
        "<th colspan='2'><a href='" + wikiLink + "' target='_blank'><h1>" + battleTitle + "</h1></a></th>" +
        "</tr>" +
        "<tr>" +
        "<td>Start Date: " + startDate + "</td>" +
        "<td>End Date: " + endDate + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>Allies: " + allies + "</td>" +
        "<td>Antagonists: " + adversaries + "</td>" +
        "</tr>" +
        "<tr>" +
        "<th colspan='2'><p class='battle-description'>" + description + "</p></th>" +
        "</tr>" +
        "</table>" +
        "<div class='eFlagsNpole'><div class='flags eFlags' id='enemy-flags'></div><div class='flagpole enemy-flagpole'></div></div>"
    );
    let enemyFlags = document.getElementById("enemy-flags");
    let friendlyFlags = document.getElementById("friendly-flags");
    if (typeof allies == 'object') {
        let aLen = allies.length;
        aLen > 11 ? aLen = 11 : aLen;
        for (i = 0; i < aLen; i++) {
            let lilAllies = allies[i].toLowerCase();
            let aArranged = lilAllies.replace(/ /g, '_');
            friendlyFlags.innerHTML += "<img src='/assets/flag_images/" + aArranged + ".png'></img>";
        }
    } else {
        let lilAlly = allies.toLowerCase();
        let aArranged = lilAlly.replace(/ /g, '_');
        $("#friendly-flags").html("<img src='/assets/flag_images/" + aArranged + ".png'></img>");
    }
    if (typeof adversaries == 'object') {
        let eLen = adversaries.length;
        for (i = 0; i < eLen; i++) {
            let lilEnemies = adversaries[i].toLowerCase();
            let eArranged = lilEnemies.replace(/ /g, '_');
            enemyFlags.innerHTML += "<img src='/assets/flag_images/" + eArranged + ".png'></img>";
        }
    } else {
        let lilEnemy = adversaries.toLowerCase();
        let eArranged = lilEnemy.replace(/ /g, '_');
        $("#enemy-flags").html("<img src='/assets/flag_images/" + eArranged + ".png'></img>");
    }
    setTimeout(function () {
        window.scrollTo({
            top: document.body.scrollHeight,
            left: 0,
            behavior: "smooth"
        });
    }, 1);
}