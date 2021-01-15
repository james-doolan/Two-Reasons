document.write('<div><button id="day">Daily</button><button id="week">Weekly</button><button id="month">Monthly</button><button id="tmonth">Quarterly</button><label id="year">1914-07-28</label><div id="contSlider"><input id="slider" type="range" min="0" max="135397279000" step="86400000" value="0" /></div><br> <div id="map"></div></div>');

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
let slider = document.getElementById("slider");
let year = document.getElementById("year");

let wws = [
    {
        battle: "battle of year 1914",
        coords: { lat: 40.785091, lng: -73.968285 },
        startDate: "03/24/1914",
        endDate: "03/30/1916",
        description: "The bloody battle took place in 1914 mostly"
    },
    {
        battle: "battle of year 1915",
        coords: { lat: 41.084045, lng: -73.874245 },
        startDate: "03/24/1916",
        endDate: "09/20/1916",
        description: "The bloody battle took place in 1915 mostly"
    },
    {
        battle: "battle of year 1918",
        coords: { lat: 40.754932, lng: -73.984016 },
        startDate: "03/20/1918",
        endDate: "11/10/1918",
        description: "The bloody battle took place in 1918 mostly"
    },
    {
        battle: "Battle of Liege",
        coords: { lat: 50.473889, lng:  5.572222},
        startDate: "08/04/1914",
        endDate: "08/17/1914",
        allies: "Belgium",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Liège (French: Bataille de Liège) was the opening engagement of the German invasion of Belgium and the first battle of the First World War. The attack on Liège, a town protected by the Fortified position of Liège, a ring fortress built from the late 1880s to the early 1890s, began on 5 August 1914 and lasted until 16 August, when the last fort surrendered."
    },
    {
        battle: "Battle of Mulhouse",
        coords: { lat: 47.749444, lng: 7.34 },
        startDate: "08/07/1914",
        endDate: "08/26/1914",
        allies: "France",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Mulhouse (German: Mülhausen), also called the Battle of Alsace (Bataille d'Alsace), which began on 7 August 1914, was the opening attack of the First World War by the French Army against Germany. The battle was part of a French attempt to recover the province of Alsace, which France had ceded to the new German Empire following defeat in the Franco-Prussian War."
    },
    {
        battle: "Battle of Halen",
        coords: { lat: 50.949167, lng: 5.110556 },
        startDate: "08/12/1914",
        endDate: "08/12/1914",
        allies: "Belgium",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Halen, also known as the Battle of the Silver Helmets (Dutch: Slag der Zilveren Helmen, French: Bataille des casques d'argent) because of the many cavalry helmets left behind on the battlefield by the German cuirassiers, took place on 12 August 1914 at the beginning of the First World War, between German forces and Belgian troops led by Léon De Witte."
    },
    {
        battle: "Battle of Lorraine",
        coords: { lat: 49.033889, lng: 6.661944 },
        startDate: "08/14/1914",
        endDate: "08/25/1914",
        allies: "France",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Lorraine (14 August – 7 September 1914) was a battle on the Western Front during the First World War. The armies of France and Germany had completed their mobilisation, the French with Plan XVII, to conduct an offensive through Lorraine and Alsace into Germany and the Germans with Aufmarsch II West, in the north through Luxembourg and Belgium into France,"
    },
    {
        battle: "Battle of Agbeluvhoe",
        coords: { lat: 6.6595, lng: 1.167333 },
        startDate: "08/15/1914",
        endDate: "08/15/1914",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Agbeluvhoe was fought during the First World War between invading British Empire soldiers of the West African Rifles and German troops in German Togoland (now Togo) on 15 August 1914. British troops occupying the Togolese capital of Lomé on the coast, had advanced towards a wireless station at Kamina, 100 mi (160 km) inland on hills near Atakpamé. "
    },
    {
        battle: "Battle of Dinant",
        coords: { lat: 50.266667, lng: 4.916667 },
        startDate: "08/15/1914",
        endDate: "08/24/1914",
        allies: "France",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Dinant was an engagement fought by French and German forces in and around the Belgian town of Dinant in the First World War, during the German invasion of Belgium. The French Fifth Army and the British Expeditionary Force (BEF) advanced into Belgium and fought the Battle of Charleroi and Battle of Mons, from the Meuse crossings in the east, to Mons in the west."
    },
    {
        battle: "Battle of Cer",
        coords: { lat: 44.603056, lng: 19.494167 },
        startDate: "08/15/1914",
        endDate: "08/24/1914",
        allies: "Serbia",
        adversaries: "Austro-Hungarian Empire",
        battleType: "Ground",
        description: "The Battle of Cer was a military campaign fought between Austria-Hungary and Serbia in August 1914, starting three weeks into the Serbian Campaign, the initial military action of the First World War. It took place around Cer Mountain and several surrounding villages, as well as the town of Šabac."
    },
    {
        battle: "Battle of Stallupönen",
        coords: { lat: 49.033889, lng: 6.661944 },
        startDate: "08/17/1914",
        endDate: "08/17/1914",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Stallupönen, fought between Russian and German armies on August 17, 1914, was the opening battle of World War I on the Eastern Front. The Germans under the command of Hermann von François conducted a successful counterattack against four Russian infantry divisions from different infantry corps, which heavily outnumbered them but were separated from each other."
    },
    {
        battle: "Battle of Gumbinnen",
        coords: { lat: 54.6, lng: 22.2 },
        startDate: "08/20/1914",
        endDate: "08/20/1914",
        allies: "Russian Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Gumbinnen, initiated by forces of the German Empire on 20 August 1914, was a German offensive on the Eastern Front during the First World War. Because of the hastiness of the German attack, the Russian Army emerged victorious."
    },
    {
        battle: "Battle of ",
        coords: { lat: 49.033889, lng: 6.661944 },
        startDate: "08/14/1914",
        endDate: "08/25/1914",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: ""
    },
    {
        battle: "Battle of ",
        coords: { lat: 49.033889, lng: 6.661944 },
        startDate: "08/14/1914",
        endDate: "08/25/1914",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: ""
    },
    {
        battle: "Battle of ",
        coords: { lat: 49.033889, lng: 6.661944 },
        startDate: "08/14/1914",
        endDate: "08/25/1914",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: ""
    },
    {
        battle: "Battle of ",
        coords: { lat: 49.033889, lng: 6.661944 },
        startDate: "08/14/1914",
        endDate: "08/25/1914",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: ""
    },
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
        for (i = 0; i < wws.length; i++) {
            let startMsec = Date.parse(wws[i].startDate);
            let endMsec = Date.parse(wws[i].endDate);
            console.log("daily")
            if (dateShown >= startMsec && dateShown <= endMsec) {
                console.log(wws[i].battle);
                locations.push(wws[i].coords);
            }
        }
    } else if ($("#slider").attr("step") == weekStep) {
        for (i = 0; i < wws.length; i++) {
            let startMsec = Date.parse(wws[i].startDate) - 302400000;
            let endMsec = Date.parse(wws[i].endDate) + 302400000;
            console.log("weekly")
            if (dateShown >= startMsec && dateShown <= endMsec) {
                console.log(wws[i].battle);
                locations.push(wws[i].coords);
            }
        }
    } else if ($("#slider").attr("step") == monthStep) {
        for (i = 0; i < wws.length; i++) {
            let startMsec = Date.parse(wws[i].startDate) - 1314000000;
            let endMsec = Date.parse(wws[i].endDate) + 1314000000;
            console.log("monthly")
            if (dateShown >= startMsec && dateShown <= endMsec) {
                console.log(wws[i].battle);
                locations.push(wws[i].coords);
            }
        }
    } else {
        for (i = 0; i < wws.length; i++) {
            let startMsec = Date.parse(wws[i].startDate) - 3942000000;
            let endMsec = Date.parse(wws[i].endDate) + 3942000000;
            console.log("3monthly")
            if (dateShown >= startMsec && dateShown <= endMsec) {
                console.log(wws[i].battle);
                locations.push(wws[i].coords);
            }
        }
    }

    // initMap();

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