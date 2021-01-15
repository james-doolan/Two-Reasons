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
        coords: { lat: 54.630556, lng: 22.573333 },
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
        battle: "Battle of Ardennes",
        coords: { lat: 50.25, lng: 5.666667 },
        startDate: "08/21/1914",
        endDate: "08/23/1914",
        allies: "France",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of the Ardennes was a battle of the First World War fought on the frontiers of France, Germany, Belgium and Luxembourg from 21 to 23 August 1914. The German armies defeated the French armies and forced the French armies to retreat. The battle was part of the larger Battle of the Frontiers, the first battle of the Western Front."
    },
    {
        battle: "Battle of Charleroi",
        coords: { lat: 50.4, lng: 4.433333 },
        startDate: "08/21/1914",
        endDate: "08/23/1914",
        allies: "France",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Charleroi, by the French Fifth Army and the German 2nd and 3rd armies, during the Battle of the Frontiers. The French were planning an attack across the Sambre River, when the Germans attacked first, forced back the French from the river and nearly cut off the French retreat by crossing the Meuse around Dinant and getting behind the French right flank."
    },
    {
        battle: "Battle of Chra",
        coords: { lat: 7.170667, lng: 1.158667 },
        startDate: "08/22/1914",
        endDate: "08/22/1914",
        allies: ["British Empire", "France"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Chra was fought by British and French troops against German soldiers and paramilitary police, during the Togoland Campaign of the First World War. The German defenders mined the approaches to the river, blew the bridges and dug in around the village on the far bank, ready to defend the crossing with rifles and three concealed machine-guns. "
    },
    {
        battle: "Battle of Mons",
        coords: { lat: 50.45, lng: 3.95 },
        startDate: "08/23/1914",
        endDate: "08/23/1914",
        allies: "United Kingdom",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Mons was the first major action of the British Expeditionary Force (BEF) in the First World War. It was a subsidiary action of the Battle of the Frontiers, in which the Allies clashed with Germany on the French borders. At Mons, the British Army attempted to hold the line of the Mons–Condé Canal against the advancing German 1st Army."
    },
    {
        battle: "Battle of Tannenberg",
        coords: { lat: 53.495833, lng: 20.134444 },
        startDate: "08/26/1914",
        endDate: "08/30/1914",
        allies: "Russian Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Tannenberg, also known as Second Battle of Tannenberg, was fought between Russia and Germany between 26 and 30 August 1914, the first month of World War I. The battle resulted in the almost complete destruction of the Russian Second Army and the suicide of its commanding general, Alexander Samsonov."
    },
    {
        battle: "Battle of the Trouée de Charmes",
        coords: { lat: 48.666667, lng: 6.166667 },
        startDate: "08/24/1914",
        endDate: "08/26/1914",
        allies: "France",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of the Trouée de Charmes (French: Bataille de la trouée de Charmes) or Battle of the Mortagne was fought at the beginning of World War I, between 24 and 26 August 1914 by the French Second Army and the German 6th Army, after the big German victory at the Battle of the Frontiers, earlier in August."
    },
    {
        battle: "Battle of Le Cateau",
        coords: { lat: 50.104167, lng: 3.544444 },
        startDate: "08/26/1914",
        endDate: "08/26/1914",
        allies: ["United Kingdom", "France"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Le Cateau was fought on the Western Front during the First World War on 26 August 1914. The British Expeditionary Force (BEF) and the French Fifth Army had retreated after their defeats at the Battle of Charleroi (21–23 August) and the Battle of Mons (23 August). The British II Corps fought a delaying action at Le Cateau to slow the German pursuit."
    },
    {
        battle: "Battle of Galicia",
        coords: { lat: 49.83, lng: 24.014167 },
        startDate: "08/23/1914",
        endDate: "09/01/1914",
        allies: "Russian Empire",
        adversaries: "Austro-Hungarian Empire",
        battleType: "Ground",
        description: "The Battle of Galicia was a major battle between Russia and Austria-Hungary during the early stages of World War I in 1914. In the course of the battle, the Austro-Hungarian armies were severely defeated and forced out of Galicia, while the Russians captured Lemberg and, for approximately nine months, ruled Eastern Galicia until their defeat at Gorlice and Tarnów."
    },
    {
        battle: "Battle of Heligoland Bight",
        coords: { lat: 54.19, lng: 7.51 },
        startDate: "08/28/1914",
        endDate: "08/28/1914",
        allies: "United Kingdom",
        adversaries: "German Empire",
        battleType: "Naval",
        description: "The Battle of Heligoland Bight was the first naval battle of the First World War, between ships of the UK and Germany. It took place in the south-eastern North Sea, when the British attacked German patrols off the north-west German coast. The German High Seas Fleet was in harbour on the north German coast while the British Grand Fleet was out in the northern North Sea."
    },
    {
        battle: "Battle of St. Quentin",
        coords: { lat: 49.900833, lng: 3.628333 },
        startDate: "08/29/1914",
        endDate: "08/30/1914",
        allies: "France",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of St. Quentin (also called the First Battle of Guise (French: 1ere Bataille de Guise) was fought from 29 to 30 August 1914, during the First World War."
    },
    {
        battle: "Occupation of German Samoa",
        coords: { lat: -13.8, lng: -172.1 },
        startDate: "08/29/1914",
        endDate: "08/30/1914",
        allies: ["New Zealand", "Australia", "France"],
        adversaries: "German Empire",
        battleType: ["Ground", "Naval"],
        description: "The Occupation of Samoa was the takeover – and subsequent administration – of the Pacific colony of German Samoa by New Zealand. It started in late August 1914 with landings by the Samoa Expeditionary Force from New Zealand. The landings were unopposed and the New Zealanders took possession of Samoa for the New Zealand Government on behalf of King George V."
    },
    {
        battle: "Siege of Maubeuge",
        coords: { lat: 50.2775, lng: 3.973333 },
        startDate: "08/24/1914",
        endDate: "09/07/1914",
        allies: "France",
        adversaries: "German Empire",
        battleType: "Siege",
        description: "The Siege of Maubeuge took place from 24 August – 7 September 1914, at le camp retranché de Maubeuge (the Entrenched Camp of Maubeuge) the start of World War I on the Western Front. The Entrenched Camp blocked the railway from Thionville (Diedenhofen, 1871–1919) to Luxembourg, which had also been cut by the demolition of the rail bridge over the Meuse at Namur in Belgium."
    },
    {
        battle: "First Battle of Garua",
        coords: { lat: 9.3, lng: 13.4 },
        startDate: "08/29/1914",
        endDate: "08/31/1914",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The First Battle of Garua took place from 29 to 31 August 1914 during the Kamerun Campaign of the First World War between German and invading British forces in northern Kamerun at Garua. It was the first significant action to take place in the campaign and resulted in the German repulsion of the British force."
    },
    {
        battle: "First Battle of the Marne",
        coords: { lat: 49.016667, lng: 3.383333 },
        startDate: "09/06/1914",
        endDate: "09/12/1914",
        allies: ["France", "United Kingdom"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The First Battle of the Marne was a battle of the First World War fought from 6 to 12 September 1914.[1] It resulted in an Allied victory against the German armies in the west. The battle was the culmination of the Retreat from Mons and pursuit of the Franco–British armies which followed the Battle of the Frontiers in August and reached the eastern outskirts of Paris."
    },
    {
        battle: "Battle of Nsanakong",
        coords: { lat: 5, lng: 16 },
        startDate: "09/06/1914",
        endDate: "09/06/1914",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Nsanakong or Battle of Nsanakang took place between defending British and attacking German forces during the Kamerun Campaign of the First World War. The town of Nsanakong had been occupied by the British on 30 August 1914. On 6 September, German forces attacked, driving the British force over the border back into Nigeria."
    },
    {
        battle: "First Battle of the Masurian Lakes",
        coords: { lat: 54, lng: 22 },
        startDate: "09/07/1914",
        endDate: "09/14/1914",
        allies: "Russian Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The First Battle of the Masurian Lakes was a German offensive in the Eastern Front 4 September - 13 September 1914, 2nd month of World War I. It pushed the Russian First Army back across its entire front, eventually ejecting it from Germany. Further progress was hampered by the arrival of the Russian Tenth Army on the Germans' right flank."
    },
    {
        battle: "Battle of Bita Paka",
        coords: { lat: -4.416667, lng: 152.316667 },
        startDate: "09/11/1914",
        endDate: "09/11/1914",
        allies: "Australia",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Bita Paka (11 September 1914) was fought south of Kabakaul, on the island of New Britain, and was a part of the invasion and subsequent occupation of German New Guinea by the Australian Naval and Military Expeditionary Force (AN&MEF) shortly after the outbreak of the First World War."
    },
    {
        battle: "First Battle of the Aisne",
        coords: { lat: 49.433333, lng: 3.666667 },
        startDate: "09/13/1914",
        endDate: "09/28/1914",
        allies: ["France", "United Kingdom"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The First Battle of the Aisne (Bataille de l'Aisne) was the Allied follow-up offensive against the right wing of the German First Army (led by Alexander von Kluck) and the Second Army (led by Karl von Bülow) as they retreated after the First Battle of the Marne. The Advance to the Aisne consisted of the Battle of the Marne and the Battle of the Aisne."
    },
    {
        battle: "Battle of Ukoko",
        coords: { lat: 0.983333, lng: 9.566667 },
        startDate: "09/21/1914",
        endDate: "09/21/1914",
        allies: ["British Empire", "France"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Ukoko took place on 21 September 1914 during the Kamerun Campaign of the First World War between French and German troops in Ukoko, Kamerun or modern day Cocobeach, Gabon."
    },
    {
        battle: "Siege of Przemyśl",
        coords: { lat: 49.786111, lng: 22.773889 },
        startDate: "09/16/1914",
        endDate: "03/22/1915",
        allies: "Russian Empire",
        adversaries: "Austro-Hungarian Empire",
        battleType: "Siege",
        description: "The Siege of Przemyśl was the longest siege of the First World War, and a crushing defeat for Austria-Hungary against Russian attackers. Przemyśl (German: Premissel) was a fortress town on the River San and a Galician stronghold. The investment of Przemyśl began on 16 September 1914, and was briefly suspended on 11 October, due to an Austro-Hungarian offensive."
    },
    {
        battle: "Battle of Sandfontein",
        coords: { lat: 28.6847, lng: 18.5166 },
        startDate: "09/26/1914",
        endDate: "09/26/1914",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Sandfontein was fought between the Union of South Africa on behalf of the British Imperial Government and the German Empire (modern day Namibia) on 26 September 1914 at Sandfontein, during the first stage of the South West Africa Campaign of World War I, and ended in a German victory."
    },
    {
        battle: "Siege of Antwerp",
        coords: { lat: 51.216667, lng: 4.4 },
        startDate: "09/28/1914",
        endDate: "10/10/1914",
        allies: ["Belgium", "United Kingdom"],
        adversaries: ["Austro-Hungarian Empire", "German Empire"],
        battleType: "Siege",
        description: "The Siege of Antwerp was an engagement between the German and the Belgian, British and French armies around the fortified city of Antwerp during World War I. German troops besieged a garrison of Belgian fortress troops, the Belgian field army and the British Royal Naval Division in the Antwerp area, after the German invasion of Belgium in August 1914."
    },
    {
        battle: "Battle of Vistula River",
        coords: { lat: 52.233333, lng: 21.016667 },
        startDate: "09/29/1914",
        endDate: "10/31/1914",
        allies: "Russian Empire",
        adversaries: ["German Empire", "Austro-Hungarian Empire"],
        battleType: "Ground",
        description: "The Battle of the Vistula River, also known as the Battle of Warsaw, was a Russian victory against the German Empire and Austria-Hungary on the Eastern Front during the First World War."
    },
    {
        battle: "Battle of Yser",
        coords: { lat: 51.152778, lng: 2.723056 },
        startDate: "10/16/1914",
        endDate: "10/31/1914",
        allies: ["Belgium", "France"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of the Yser (Bataille de l'Yser) was a battle of the First World War that took place in October 1914 between the towns of Nieuwpoort and Diksmuide, along a 35 km (22 mi) stretch of the Yser River and the Yperlee Canal, in Belgium. The front line was held by a large Belgian force, which halted the German advance in a costly defensive battle."
    },
    {
        battle: "Battle of Rufiji Delta",
        coords: { lat: -7.868333, lng: 39.24 },
        startDate: "10/20/1914",
        endDate: "07/11/1915",
        allies: "United Kingdom",
        adversaries: "German Empire",
        battleType: "Naval",
        description: "The Battle of the Rufiji Delta was fought in German East Africa (modern Tanzania) from October 1914 – July 1915 during the First World War, between the German Navy's light cruiser SMS Königsberg, and a powerful group of British warships. The battle was a series of attempts, ultimately successful, to sink the blockaded German cruiser."
    },
    {
        battle: "First Battle of Ypres",
        coords: { lat: 50.8641, lng: 2.8956 },
        startDate: "09/19/1914",
        endDate: "11/22/1914",
        allies: ["France", "Belgium", "United Kingdom"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The First Battle of Ypres was a battle of the First World War, fought on the Western Front around Ypres, in West Flanders, Belgium. The battle was part of the First Battle of Flanders, in which German, French, Belgian armies and the British Expeditionary Force fought from Arras in France to Nieuport on the Belgian coast, from 10 October to mid-November."
    },
    {
        battle: "First Battle of Edea",
        coords: { lat: 3.8, lng: 10.133333 },
        startDate: "09/20/1914",
        endDate: "09/26/1914",
        allies: ["British Empire", "France"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The First Battle of Edea involved the British and French assault on German forces. Allied forces from Duala launched their advance on 20 October. Following stiff resistance along the southern railway line between Duala and Edea, German forces withdrew from the town to Jaunde, allowing Allied troops to finally occupy Edea on 26 October 1914."
    },
    {
        battle: "Battle of Penang",
        coords: { lat: 5.433333, lng: 100.333333 },
        startDate: "09/28/1914",
        endDate: "09/28/1914",
        allies: ["Russian Empire", "France"],
        adversaries: "German Empire",
        battleType: "Naval",
        description: "The Battle of Penang occurred on 28 October 1914, during World War I. It was a naval action in the Strait of Malacca, in which the German cruiser SMS Emden sank two Allied warships."
    },
    {
        battle: "Battle of Coronel",
        coords: { lat: -36.983611, lng: -73.813611 },
        startDate: "11/01/1914",
        endDate: "11/01/1914",
        allies: "United Kingdom",
        adversaries: "German Empire",
        battleType: "Naval",
        description: "The Battle of Coronel was a First World War Imperial German Naval victory over the Royal Navy, off the coast of central Chile near the city of Coronel. The East Asia Squadron of the Kaiserliche Marine (Imperial German Navy) led by Vice-Admiral Graf Maximilian von Spee met and overpowered a British squadron commanded by Rear-Admiral Sir Christopher Cradock."
    },
    {
        battle: "Battle of Kilimanjaro",
        coords: { lat: -3.075833, lng: 37.353333 },
        startDate: "11/03/1914",
        endDate: "11/03/1914",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Kilimanjaro at Longido took place in German East Africa in November 1914 and was an early skirmish during the East African Campaign of the First World War."
    },
    {
        battle: "Battle of Tanga",
        coords: { lat: -5.066667, lng: 39.1 },
        startDate: "11/03/1914",
        endDate: "11/05/1914",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Tanga, sometimes also known as the Battle of the Bees, was the unsuccessful attack by the British Indian Expeditionary Force under Major General A.E. Aitken to capture German East Africa (the mainland portion of present-day Tanzania) during the First World War in concert with the invasion Force near Longido on the slopes of Mount Kilimanjaro."
    },
    {
        battle: "Fao Landing",
        coords: { lat: 29.928041, lng: 48.466148 },
        startDate: "11/06/1914",
        endDate: "11/08/1914",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Fao Landing occurred when British forces attacking the Ottoman stronghold of Fao and its fortress. The landing was met with little resistance from the Turkish defenders who fled after intense shelling. It was the first military operation of the Mesopotamian Campaign of World War I which was carried out to protect the British Empire's oil supplies in the Persian Gulf."
    },
    {
        battle: "Battle of Cocos",
        coords: { lat: -11.833333, lng: 96.816667 },
        startDate: "11/09/1914",
        endDate: "11/09/1914",
        allies: "Australia",
        adversaries: "German Empire",
        battleType: "Naval",
        description: "The Battle of Cocos was a single-ship action that occurred on 9 November 1914, after the Australian light cruiser HMAS Sydney (under the command of John Glossop) responded to an attack on a communications station at Direction Island by the German light cruiser SMS Emden (commanded by Karl von Müller)."
    },
    {
        battle: "Battle of Łódź",
        coords: { lat: 51.776944, lng: 19.454722 },
        startDate: "11/11/1914",
        endDate: "12/06/1914",
        allies: "Russian Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Łódź took place near the city of Łódź in Poland. It was fought between the German Ninth Army and the Russian First, Second, and Fifth Armies, in harsh winter conditions. The Germans redeployed their Ninth Army around Thorn, so as to threaten the Russian northern flank, following German reversals after the Battle of the Vistula River. "
    },
    {
        battle: "Battle of Limanowa",
        coords: { lat: 49.83, lng: 24.0142 },
        startDate: "12/01/1914",
        endDate: "12/13/1914",
        allies: "Russian Empire",
        adversaries: ["Austro-Hungarian", "German Empire"],
        battleType: "Ground",
        description: "The Battle of Limanowa-Łapanów took place from 1 December to 13 December 1914, between the Austro-Hungarian Army and the Russian Army near the town of Limanowa.The Austro-Hungarian high command had assumed that the German success would weaken Russian forces in the north and that the Galician front would remain quiet. Both these assumptions were incorrect."
    },
    {
        battle: "Battle of Kolubara",
        coords: { lat: 44.662, lng: 20.2485 },
        startDate: "11/16/1914",
        endDate: "12/15/1914",
        allies: "Serbia",
        adversaries: "Austro-Hungarian Empire",
        battleType: "Ground",
        description: "The Battle of Kolubara (Serbian Cyrillic: Колубарска битка, German: Schlacht an der Kolubara) was a campaign fought between Austria-Hungary and Serbia in November and December 1914, during the Serbian Campaign of World War I."
    },
    {
        battle: "Battle of the Falkland Islands",
        coords: { lat: -52.499444, lng: -56.166389 },
        startDate: "12/08/1914",
        endDate: "12/08/1914",
        allies: "United Kingdom",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of the Falkland Islands was a First World War naval action between the British Royal Navy and Imperial German Navy. The British, after their defeat at the Battle of Coronel on 1 November, sent a large force to track down and destroy the German cruiser squadron. The battle is commemorated every year on 8 December in the Falkland Islands as a public holiday."
    },
    // {
    //     battle: "Battle of ",
    //     coords: { lat: 1, lng: 1 },
    //     startDate: "11/03/1914",
    //     endDate: "11/05/1914",
    //     allies: "British Empire",
    //     adversaries: "German Empire",
    //     battleType: "Ground",
    //     description: "1"
    // },
    // {
    //     battle: "Battle of ",
    //     coords: { lat: 1, lng: 1 },
    //     startDate: "11/03/1914",
    //     endDate: "11/05/1914",
    //     allies: "British Empire",
    //     adversaries: "German Empire",
    //     battleType: "Ground",
    //     description: "1"
    // },
    // {
    //     battle: "Battle of ",
    //     coords: { lat: 1, lng: 1 },
    //     startDate: "11/03/1914",
    //     endDate: "11/05/1914",
    //     allies: "British Empire",
    //     adversaries: "German Empire",
    //     battleType: "Ground",
    //     description: "1"
    // },
    // {
    //     battle: "Battle of ",
    //     coords: { lat: 1, lng: 1 },
    //     startDate: "11/03/1914",
    //     endDate: "11/05/1914",
    //     allies: "British Empire",
    //     adversaries: "German Empire",
    //     battleType: "Ground",
    //     description: "1"
    // },
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
        gridSize: 1,
        imagePath:
            "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    });
}