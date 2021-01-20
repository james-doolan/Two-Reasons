document.write('<button id="day">Daily</button><button id="week">Weekly</button><button id="month">Monthly</button><button id="tmonth">Quarterly</button><button id="smonth">6 Months</button>' + 
'<label id="year">1914-07-28</label><div id="contSlider"><input id="slider" type="range" min="0" max="135397279000" step="2654848607" value="0" onkeydown="return false;"/></div><br>' +
' <div id="map"></div><div id="overview"></div><div id="battleInfoBox"></div>');

const dayStep = 86400000;
const weekStep = 604800000;
const monthStep = 2654848607;
const tmonthStep = 7964545823;
const smonthStep = 15929091646;

let map, overview;
const OVERVIEW_DIFFERENCE = 5;
const OVERVIEW_MIN_ZOOM = 2;
const OVERVIEW_MAX_ZOOM = 5;

let locations = [];
let slider = document.getElementById("slider");
let year = document.getElementById("year");

let wws = [
    {
        battle: "Battle of Liege",
        coords: { lat: 50.473889, lng: 5.572222 },
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
    {
        battle: "Second Battle of Edea",
        coords: { lat: 3.8, lng: 10.133333 },
        startDate: "05/01/1915",
        endDate: "05/01/1915",
        allies: "France",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Second Battle of Edea was the German counter-attack against French forces stationed in the village of Edea during the Kamerun Campaign of the First World War. Allied forces from Duala occupied the town following the First Battle of Edea in October 1914. The Germans, eager to retake the position attacked on 5 January 1915 but were repulsed by the French force."
    },
    {
        battle: "Battle of Jassin",
        coords: { lat: -4.6814, lng: 39.1847 },
        startDate: "01/18/1915",
        endDate: "01/19/1915",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Jassin (also known as the Battle of Yasin, the Battle of Jasin, the Battle of Jasini[1] or the Battle of Jassini)[2] [3] was a World War I battle that took place on 18– 19 January 1915 at Jassin on the German East African side of the border with British East Africa between a German Schutztruppe force and British and Indian troops."
    },
    {
        battle: "Battle of Dogger Bank",
        coords: { lat: 54.557778, lng: 5.463889 },
        startDate: "01/24/1915",
        endDate: "01/24/1915",
        allies: "United Kingdom",
        adversaries: "German Empire",
        battleType: "Naval",
        description: "The Battle of Dogger Bank was a naval engagement, between squadrons of the British Grand Fleet and the Kaiserliche Marine (High Seas Fleet). The British had intercepted and decoded German wireless transmissions, gaining advance knowledge that a German raiding squadron was heading for Dogger Bank and ships of the Grand Fleet sailed to intercept the raiders."
    },
    {
        battle: "Raid on the Suez Canal",
        coords: { lat: 30.705, lng: 32.344167 },
        startDate: "01/26/1915",
        endDate: "02/04/1915",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Raid on the Suez Canal, also known as Actions on the Suez Canal, took place between 26 January and 4 February 1915 when a German-led Ottoman Army force advanced from Southern Palestine to attack the British Empire-protected Suez Canal, marking the beginning of the Sinai and Palestine Campaign (1915-1918) of World War I (1914-1918)."
    },
    {
        battle: "Battle of Battle of Bolimów",
        coords: { lat: 52.076389, lng: 20.163056 },
        startDate: "01/31/1915",
        endDate: "01/31/1915",
        allies: "Russian Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Bolimów was an inconclusive battle of World War I fought on January 31, 1915 between Germany and Russia and considered a preliminary to the Second Battle of the Masurian Lakes."
    },
    {
        battle: "Battle of Kakamas",
        coords: { lat: -28.8, lng: 20.65 },
        startDate: "02/04/1915",
        endDate: "02/04/1915",
        allies: "South Africa",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The battle of Kakamas took place in Kakamas, Northern Cape Province of South Africa on 4 February 1915. It was a skirmish for control of two river fords over the Orange River between contingents of a German invasion force and South African armed forces. The South Africans succeed in preventing the Germans gaining control of the fords and crossing the river."
    },
    {
        battle: "Second Battle of the Masurian Lakes",
        coords: { lat: 54, lng: 22 },
        startDate: "02/07/1915",
        endDate: "02/22/1915",
        allies: "Russian Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Second Battle of the Masurian Lakes, also known as the Winter Battle of the Masurian Lakes, was the northern part of the Central Powers' offensive on the Eastern Front in the winter of 1915. The offensive was intended to advance beyond the Vistula River and perhaps knock Russia out of the war."
    },
    {
        battle: "Gallipoli campaign",
        coords: { lat: 40.366667, lng: 26.45 },
        startDate: "02/17/1915",
        endDate: "01/09/1916",
        allies: ["British Empire", "France", "Russian Empire"],
        adversaries: ["Ottoman Empire", "German Empire", "Austro-Hungarian Empire"],
        battleType: "Ground",
        description: "The Gallipoli campaign was a military campaign in the First World War that took place on the Gallipoli peninsula (Gelibolu in modern Turkey), from 17 February 1915 to 9 January 1916. The Entente powers, Britain, France and Russia, sought to weaken the Ottoman Empire, one of the Central Powers, by taking control of the Turkish straits."
    },
    {
        battle: "Naval operations in the Dardanelles campaign",
        coords: { lat: 40.2, lng: 26.4 },
        startDate: "02/19/1915",
        endDate: "03/18/1915",
        allies: ["United Kingdom", "France", "Russian Empire"],
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Naval",
        description: "The naval operations in the Dardanelles campaign took place against the Ottoman Empire during the First World War. Ships of the Royal Navy, French Marine nationale, Imperial Russian Navy and the Royal Australian Navy, attempted to force the Dardanelles Straits, a narrow waterway connecting the Mediterranean Sea with the Sea of Marmara and the Black Sea further north."
    },
    {
        battle: "Battle of Hill 60",
        coords: { lat: 50.821389, lng: 2.931667 },
        startDate: "04/17/1915",
        endDate: "05/07/1915",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Hill 60 took place near Hill 60 south of Ypres on the Western Front, during the First World War. Hill 60 had been captured by the German 30th Division, during the First Battle of Ypres. Initial French preparations to raid the hill were continued by the British 28th Division, which took over the line in February 1915 and then by the 5th Division."
    },
    {
        battle: "Second Battle of Ypres",
        coords: { lat: 50.899444, lng: 2.940556 },
        startDate: "04/22/1915",
        endDate: "05/25/1915",
        allies: ["British Empire", "France", "Belgium"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "During the First World War, the Second Battle of Ypres was fought from 22 April – 25 May 1915 for control of the strategic Flemish town of Ypres in western Belgium. The First Battle of Ypres had been fought the previous autumn. The Second Battle of Ypres was the first mass use by Germany of poison gas on the Western Front."
    },
    {
        battle: "Landing at Cape Helles",
        coords: { lat: 40.0431, lng: 26.1753 },
        startDate: "04/25/1915",
        endDate: "04/26/1915",
        allies: ["United Kingdom", "France"],
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The landing at Cape Helles was part of the amphibious invasion of the Gallipoli peninsula by British and French forces on 25 April 1915. Helles, at the foot of the peninsula, was the main landing area. With the support of the guns of the Royal Navy, the 29th Division was to advance along the peninsula on the first day and seize the heights of Achi Baba."
    },
    {
        battle: "Landing at Anzac Cove",
        coords: { lat: 40.246111, lng: 26.277778 },
        startDate: "04/25/1915",
        endDate: "04/25/1915",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The landing at Anzac Cove on Sunday, 25 April 1915, also known as the landing at Gaba Tepe, and to the Turks as the Arıburnu Battle, was part of the amphibious invasion of the Gallipoli Peninsula by the forces of the British Empire, which began the land phase of the Gallipoli Campaign of the First World War."
    },
    {
        battle: "Battle of Trekkopjes",
        coords: { lat: -22.293, lng: 15.103 },
        startDate: "04/26/1915",
        endDate: "04/26/1915",
        allies: "South Africa",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Trekkopjes on 26 April 1915 was a German assault on the South African held town of Trekkopjes during the South West Africa Campaign of World War I. The South African Major Skinner had been ordered to defend Trekkopjes, and came into contact with a German column advancing on that town. Skinner withdrew back into Trekkopjes and dug in his forces."
    },
    {
        battle: "First Battle of Krithia",
        coords: { lat: 40.05, lng: 26.1753 },
        startDate: "04/28/1915",
        endDate: "04/28/1915",
        allies: ["United Kingdom", "France"],
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The First Battle of Krithia was the first Allied attempt to advance in the Battle of Gallipoli. Starting on 28 April, three days after the Landing at Cape Helles, the defensive power of the Ottoman forces quickly overwhelmed the attack, which suffered from poor leadership and planning, lack of communications and exhaustion and demoralisation of the troops."
    },
    {
        battle: "Battle of Gurin",
        coords: { lat: 9.114889, lng: 12.877278 },
        startDate: "04/29/1915",
        endDate: "04/29/1915",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Gurin took place on 29 April 1915 during the Kamerun Campaign of World War I in Gurin, British Nigeria near the border with German Kamerun. The battle was one of the largest of the German forays into the British colony. It ended in a successful British repulsion of the German force."
    },
    {
        battle: "Battle for Baby 700",
        coords: { lat: 40.246121, lng: 26.277788 },
        startDate: "05/02/1915",
        endDate: "05/03/1915",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Battle for Baby 700 (2/3 May 1915), was an engagement fought during the Gallipoli Campaign of the First World War, between the forces of the British Empire and the Ottoman Turkish Empire. On 25 April 1915, the Australian and New Zealand Army Corps (ANZAC), conducted an amphibious landing on the Gallipoli Peninsula."
    },
    {
        battle: "Second Battle of Krithia",
        coords: { lat: 40.07, lng: 26.2 },
        startDate: "05/06/1915",
        endDate: "05/08/1915",
        allies: ["British Empire", "France"],
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Second Battle of Krithia continued the Allies' attempts to advance on the Helles battlefield during the Battle of Gallipoli of the First World War. The village of Krithia and neighbouring hill of Achi Baba had to be captured in order for the British to advance up the Gallipoli peninsula to the forts that controlled passage of the Dardanelles straits."
    },
    {
        battle: "Third attack on Anzac Cove",
        coords: { lat: 40.24614, lng: 26.29 },
        startDate: "05/19/1915",
        endDate: "05/19/1915",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The third attack on Anzac Cove (19 May 1915) was an engagement during the Gallipoli Campaign of the First World War. The attack was conducted by the forces of the Ottoman Turkish Empire, against the forces of the British Empire defending the cove."
    },
    {
        battle: "Second Battle of Garua",
        coords: { lat: 9.3, lng: 13.4 },
        startDate: "05/31/1915",
        endDate: "06/10/1915",
        allies: ["British Empire", "France"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Second Battle of Garua took place from 31 May to 10 June 1915 during the Kamerun campaign of the First World War in Garua, German Kamerun. The battle was between a combined French and British force and defending German garrison and resulted in an Allied victory."
    },
    {
        battle: "Second attack on Anzac Cove",
        coords: { lat: 40.367222, lng: 26.455 },
        startDate: "04/27/1915",
        endDate: "04/27/1915",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The second attack on ANZAC Cove (27 April 1915) was an engagement during the Gallipoli Campaign of the First World War. The attack was conducted by the forces of the Ottoman Turkish Empire, against the forces of the British Empire defending the cove."
    },
    {
        battle: "Third Battle of Krithia",
        coords: { lat: 40.078889, lng: 26.203889 },
        startDate: "06/04/1915",
        endDate: "06/04/1915",
        allies: ["British Empire", "France"],
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Third Battle of Krithia, fought on the Gallipoli peninsula, was the last in a series of Allied attacks against the Ottoman defences aimed at achieving the original objectives of 25 April 1915. The previous failures in the first and second battles resulted in a less ambitious plan being developed for the attack, but the outcome was another costly failure for the Allies."
    },
    {
        battle: "Battle of Bukoba",
        coords: { lat: -1.333333, lng: 31.816667 },
        startDate: "06/21/1915",
        endDate: "06/23/1915",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Bukoba was the first victory for Entente forces in German East Africa, coming after the disastrous battles of Tanga and Jassin. The British objective was the destruction of the Bukoba wireless station. Due to Bukoba's location on the shore of Lake Victoria, it was decided that the raid should take the form of an amphibious assault."
    },
    {
        battle: "Battle of Gully Ravine",
        coords: { lat: 40.078333, lng: 26.188611 },
        startDate: "06/28/1915",
        endDate: "07/05/1915",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Battle of Gully Ravine was a WWI battle fought at Cape Helles on the Gallipoli peninsula. By June 1915 all thoughts the Allies had of a swift decisive victory over the Ottoman Empire had vanished. The preceding Third Battle of Krithia and the attack at Gully Ravine had limited objectives and had much in common with the trench warfare prevailing on the Western Front."
    },
    {
        battle: "First Battle of the Isonzo",
        coords: { lat: 45.9425, lng: 13.6025 },
        startDate: "06/23/1915",
        endDate: "07/07/1915",
        allies: "Kingdom of Italy",
        adversaries: "Austro-Hungarian Empire",
        battleType: "Ground",
        description: "The First Battle of the Isonzo was fought between the Armies of Italy and Austria-Hungary on the Italian Front in World War I, between 23 June and 7 July 1915. The aim of the Italian Army was to drive the Austrians away from its defensive positions along the Isonzo (Soča) and on the nearby mountains."
    },
    {
        battle: "Second Battle of the Isonzo",
        coords: { lat: 45.863333, lng: 13.528056 },
        startDate: "07/18/1915",
        endDate: "08/03/1915",
        allies: "Kingdom of Italy",
        adversaries: "Austro-Hungarian Empire",
        battleType: "Ground",
        description: "The Second Battle of the Isonzo was fought between the armies of the Kingdom of Italy and of Austria-Hungary in the Italian Front in World War I, between 18 July and 3 August 1915."
    },
    {
        battle: "Battle of Chunuk Bair",
        coords: { lat: 40.252, lng: 26.3085 },
        startDate: "08/07/1915",
        endDate: "08/19/1915",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Battle of Chunuk Bair (Turkish: Conk Bayırı Muharebesi) was a World War I battle fought between the Ottoman defenders and troops of the British Empire over control of the peak in August 1915. The capture of Chunuk Bair, (Turkish: Çanak Bayır Basin Slope, now Conk Bayırı), the secondary peak of the Sari Bair range, was one of the two objectives of the Battle of Sari Bair."
    },
    {
        battle: "Battle of Lone Pine",
        coords: { lat: 40.230278, lng: 26.287222 },
        startDate: "08/06/1915",
        endDate: "08/10/1915",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Battle of Lone Pine (also known as the Battle of Kanlı Sırt) was fought between Australian and New Zealand Army Corps (ANZAC) and Ottoman Empire[Note 2] forces during the Gallipoli Campaign of the First World War, between 6 and 10 August 1915. The battle was part of a diversionary attack to draw Ottoman attention away from the main assaults being conducted by British."
    },
    {
        battle: "Battle of Krithia Vineyard",
        coords: { lat: 40.078, lng: 26.216 },
        startDate: "08/06/1915",
        endDate: "08/13/1915",
        allies: "United Kingdom",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Battle of Krithia Vineyard was fought during the Gallipoli Campaign. It was intended as a minor British action at Helles on the Gallipoli peninsula to divert attention from the imminent launch of the August Offensive, but instead, the British commander mounted a futile and bloody series of attacks that in the end gained a small patch of ground known as 'The Vineyard'."
    },
    {
        battle: "Landing at Suvla Bay",
        coords: { lat: 40.305278, lng: 26.228333 },
        startDate: "08/06/1915",
        endDate: "08/15/1915",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The landing at Suvla Bay was an amphibious landing made at Suvla on the Aegean coast of the Gallipoli peninsula in the Ottoman Empire as part of the August Offensive, the final British attempt to break the deadlock of the Battle of Gallipoli. The landing was intended to support a breakout from the ANZAC sector, five miles (8 km) to the south."
    },
    {
        battle: "Battle of the Nek",
        coords: { lat: 40.2414, lng: 26.288385 },
        startDate: "08/07/1915",
        endDate: "08/07/1915",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Battle of the Nek was a minor battle that took place on 7 August 1915, during the Gallipoli campaign of World War I. 'The Nek' was a narrow stretch of ridge on the Gallipoli Peninsula. The name derives from the Afrikaans word for a 'mountain pass' but the terrain itself was a perfect bottleneck and easy to defend, as had been proven during an Ottoman attack in June."
    },
    {
        battle: "Battle of Scimitar Hill",
        coords: { lat: 40.303, lng: 26.25 },
        startDate: "08/21/1915",
        endDate: "08/21/1915",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Battle of Scimitar Hill was the last offensive mounted by the British at Suvla during the Battle of Gallipoli in World War I. It was also the largest single-day attack ever mounted by the Allies at Gallipoli, involving three divisions. The purpose of the attack was to remove the immediate Ottoman threat from the exposed Suvla landing."
    },
    {
        battle: "Battle of Hill 60 (Gallipoli)",
        coords: { lat: 40.2726, lng: 26.2931 },
        startDate: "08/22/1915",
        endDate: "08/29/1915",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Battle of Hill 60 was the last major assault of the Gallipoli Campaign. It was launched on 21 August 1915 to coincide with the attack on Scimitar Hill made from the Suvla front by Major-General Frederick Stopford having been replaced in the few days previous. Hill 60 was a low knoll at the northern end of the Sari Bair range which dominated the Suvla landing."
    },
    {
        battle: "Battle of Loos",
        coords: { lat: 50.458333, lng: 2.794167 },
        startDate: "09/25/1915",
        endDate: "10/08/1915",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Loos took place from 25 September – 8 October 1915 in France on the Western Front. It was the biggest British attack of 1915, the first time that the British used poison gas and the first mass engagement of New Army units. The French and British tried to break through the German defences in Artois and Champagne and restore a war of movement."
    },
    {
        battle: "Battle of Es Sinn",
        coords: { lat: 33.9414, lng: 41.17626 },
        startDate: "09/28/1915",
        endDate: "09/28/1915",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Battle of Es Sinn between Anglo-Indian and Ottoman forces took place on 28 September 1915, during the Mesopotamian Campaign. The sides fought to determine control of the lower Tigres and Euphrates rivers, in what is now Iraq. The British and Indian governments also viewed it as a test of the Ottoman forces, and whether a further advance to capture Baghdad was possible."
    },
    {
        battle: "Third Battle of the Isonzo",
        coords: { lat: 45.856667, lng: 13.400278 },
        startDate: "10/18/1915",
        endDate: "11/04/1915",
        allies: "Kingdom of Italy",
        adversaries: "Austro-Hungarian Empire",
        battleType: "Ground",
        description: "The Third Battle of the Isonzo was fought from 18 October through 4 November 1915 between the armies of Italy and Austria-Hungary. The first move was made in Italy, on the eastern sector; because this was their third attack that year, it was named as the Third Battle of the Isonzo (as the previous two were named the First and Second Battles of the Isonzo)."
    },
    {
        battle: "Battle of Banjo",
        coords: { lat: 6.775, lng: 11.818333 },
        startDate: "11/04/1915",
        endDate: "11/06/1915",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "During the Battle of Banjo, British forces besieged German forces entrenched on the Banjo mountain from 4 to 6 November 1915 during the Kamerun campaign of the First World War. By 6 November much of the German force had deserted, while the rest surrendered. The battle resulted in victory for the Allies and breakdown of German resistance in northern Kamerun."
    },
    {
        battle: "Battle of Ctesiphon",
        coords: { lat: 33.093611, lng: 44.5805561 },
        startDate: "11/22/1915",
        endDate: "11/25/1915",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Battle of Ctesiphon was fought by the British Empire and British India, against the Ottoman Empire, within the Mesopotamian Campaign of World War I. Indian Expeditionary Force D, mostly made up of Indian units and under the command of Gen. Sir John Nixon, had met with success in Mesopotamia since landing at Al Faw upon the Ottoman Empire's Declaration of War."
    },
    {
        battle: "Siege of Kut",
        coords: { lat: 32.505556, lng: 45.824722 },
        startDate: "12/07/1915",
        endDate: "04/29/1916",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Siege",
        description: "The siege of Kut Al Amara, 'the First Battle of Kut', was the besieging of an 8,000 strong British Army garrison in the town of Kut, 160 kilometres south of Baghdad, by the Ottoman Army. In 1915, its population was around 6,500. Following the surrender of the garrison on 29 April 1916, the survivors of the siege were marched to imprisonment at Aleppo, during which many died."
    },
    {
        battle: "Battle of Salaita Hill",
        coords: { lat: -3.3878, lng: 37.7882 },
        startDate: "02/12/1916",
        endDate: "02/12/1916",
        allies: "South Africa",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Salaita Hill was the first large-scale engagement of the East African Campaign of the First World War to involve British, Indian, Rhodesian, and South African troops. The battle took place on February 12, 1916, as part of the three-pronged offensive into German East Africa, who had been given overall command of the Allied forces in the region."
    },
    {
        battle: "Battle of Verdun",
        coords: { lat: 49.208056, lng: 5.421944 },
        startDate: "02/21/1916",
        endDate: "12/18/1916",
        allies: "France",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Verdun was fought from 21 February to 18 December 1916 on the Western Front in France. The battle was the longest of the First World War and took place on the hills north of Verdun-sur-Meuse. The German 5th Army attacked the defences of the Fortified Region of Verdun and those of the French Second Army on the right (east) bank of the Meuse. "
    },
    {
        battle: "Battle of Dujaila",
        coords: { lat: 32.5056, lng: 45.8247 },
        startDate: "03/08/1916",
        endDate: "03/08/1916",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Battle of Dujaila (Turkish: Sâbis Muharebesi) was fought on 8 March 1916, between British and Ottoman forces during the First World War. The Ottoman forces, led by Colmar Freiherr von der Goltz were besieging Kut, when the Anglo-Indian relief force, led by Lieutenant-General Fenton Aylmer, attempted to relieve the city. The attempt failed, and Aylmer lost 4,000 men."
    },
    {
        battle: "Battle of Asiago",
        coords: { lat: 45.901944, lng: 11.508889 },
        startDate: "05/15/1916",
        endDate: "06/10/1916",
        allies: "Kingdom of Italy",
        adversaries: "Austro-Hungarian Empire",
        battleType: "Ground",
        description: "The Battle of Asiago (Battle of the Plateaux) or the Trentino Offensive by the Italians, was a major counteroffensive launched by the Austro-Hungarians on the Italian Front on 15 May 1916, during World War I. It was an unexpected attack that took place near Asiago in the province of Vicenza after the Fifth Battle of the Isonzo (March 1916)."
    },
    {
        battle: "Battle of Kahe",
        coords: { lat: -2.266667, lng: 37.866667 },
        startDate: "03/18/1916",
        endDate: "03/18/1916",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Kahe, fought during the East African Campaign of WWI, was the last action between German and Entente forces before the German retreat. British and South African forces surrounded German positions at Kahe, south of Mount Kilimanjaro. Entente forces inflicted heavy casualties and captured large German artillery pieces while receiving comparably little casualties."
    },
    {
        battle: "Battle of Latema Nek",
        coords: { lat: -3.4, lng: 37.5833 },
        startDate: "03/11/1916",
        endDate: "03/12/1916",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Latema Nek was a battle of the East African Campaign in World War I. After the Battle of Salaita, General Paul von Lettow-Vorbeck, commander of German forces in East Africa, reorganised the defences to the north of the colony in anticipation of another assault. The Salaita positions were abandoned, and German forces moved south to the Latema-Reata Hills."
    },
    {
        battle: "Raid on Jifjafa",
        coords: { lat: 29.5, lng: 33.833333 },
        startDate: "04/11/1916",
        endDate: "04/14/1916",
        allies: "British Empire",
        adversaries: ["Ottoman Empire", "Austro-Hungarian"],
        battleType: "Ground",
        description: "The Raid on Jifjafa (11–14 April 1916) was a long range pre-emptive operation by a composite formation of the British Empire against Ottoman forces at the Jifjafa well in the Sinai Desert. It was part of the Sinai and Palestine Campaign of World War I."
    },
    {
        battle: "Battle of Kondoa Irangi",
        coords: { lat: -4.903611, lng: 35.776667 },
        startDate: "05/07/1916",
        endDate: "05/10/1916",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Kondoa Irangi was a battle of the East African Campaign of World War I. Following successes at the battles of Latema Nek and Kahe, Entente forces under the overall command of General Jan Smuts continued their advance southwards into German East Africa."
    },
    {
        battle: "Battle of Jutland",
        coords: { lat: 56.7, lng: 5.866667 },
        startDate: "05/31/1916",
        endDate: "06/01/1916",
        allies: "United Kingdom",
        adversaries: "German Empire",
        battleType: "Naval",
        description: "The Battle of Jutland (German: Skagerrakschlacht, the Battle of Skagerrak) was a naval battle fought between Britain's Royal Navy Grand Fleet, under Admiral Sir John Jellicoe, and the Imperial German Navy's High Seas Fleet, under Vice-Admiral Reinhard Scheer, during the First World War."
    },
    {
        battle: "Brusilov Offensive",
        coords: { lat: 49.83, lng: 24.014167 },
        startDate: "06/04/1916",
        endDate: "09/20/1916",
        allies: "Russian Empire",
        adversaries: ["Austro-Hungarian Empire", "German Empire", "Ottoman Empire"],
        battleType: "Ground",
        description: "The Brusilov Offensive (Russian: Брусиловский прорыв Brusilovskiĭ proryv, literally: 'Brusilov's breakthrough'), also known as the 'June Advance', of June to September 1916 was the Russian Empire's greatest feat of arms during World War I, and among the most lethal offensives in world history."
    },
    {
        battle: "Battle of Albert",
        coords: { lat: 50.01555, lng: 2.697 },
        startDate: "07/01/1916",
        endDate: "07/01/1916",
        allies: ["British Empire", "France"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The first day on the Somme was the beginning of the Battle of Albert, the name given by the British to the first two weeks of the Battle of the Somme. Nine corps of the French Sixth Army and the British Fourth and Third armies attacked the German 2nd Army from Foucaucourt south of the Somme northwards across the Ancre to Serre and at Gommecourt in the Third Army area."
    },
    {
        battle: "Battle of the Somme",
        coords: { lat: 50.015556, lng: 2.6975 },
        startDate: "07/01/1916",
        endDate: "11/18/1916",
        allies: ["British Empire", "France"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of the Somme, also known as the Somme Offensive, was a battle of the First World War fought by the armies of the British Empire and French Third Republic against the German Empire. It took place between 1 July and 18 November 1916 on both sides of the upper reaches of the River Somme in France. The battle was intended to hasten a victory for the Allies."
    },
    {
        battle: "Battle of Bazentin Ridge",
        coords: { lat: 50.027444, lng: 2.754167 },
        startDate: "07/14/1916",
        endDate: "07/17/1916",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Bazentin Ridge (14–17 July 1916) was part of the Battle of the Somme (1 July – 18 November) on the Western Front in France, during the First World War. On 14 July, the British Fourth Army (General Henry Rawlinson) made a dawn attack against the German 2nd Army in the Brown Position (Braune Stellung), from Delville Wood westwards to Bazentin le Petit Wood."
    },
    {
        battle: "Attack at Fromelles",
        coords: { lat: 50.60625, lng: 2.854694 },
        startDate: "07/19/1916",
        endDate: "07/20/1916",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Attack at Fromelles (French pronunciation: ​[fʁɔmɛl], Battle of Fromelles, Battle of Fleurbaix or Schlacht von Fromelles) 19–20 July 1916, was a military operation on the Western Front during the First World War. The attack was carried out by British and Australian troops and was subsidiary to the Battle of the Somme."
    },
    {
        battle: "Battle of Pozières",
        coords: { lat: 50.016667, lng: 2.8 },
        startDate: "07/23/1916",
        endDate: "09/03/1916",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Pozières (23 July – 3 September 1916) took place in northern France around the village of Pozières, during the Battle of the Somme. The costly fighting ended with the British in possession of the plateau north and east of the village, in a position to menace the German bastion of Thiepval from the rear."
    },
    {
        battle: "Battle of Romani",
        coords: { lat: 30.992, lng: 32.648 },
        startDate: "08/03/1916",
        endDate: "08/05/1916",
        allies: "British Empire",
        adversaries: ["Austro-Hungarian Empire", "German Empire", "Ottoman Empire"],
        battleType: "Ground",
        description: "The Battle of Romani was the last ground attack of the Central Powers on the Suez Canal at the beginning of the Sinai and Palestine Campaign during the First World War. The battle was fought between 3 and 5 August 1916 near the Egyptian town of Romani and the site of ancient Pelusium on the Sinai Peninsula, 23 miles (37 km) east of the Suez Canal."
    },
    {
        battle: "Sixth Battle of the Isonzo",
        coords: { lat: 45.933, lng: 13.616 },
        startDate: "08/04/1916",
        endDate: "08/16/1916",
        allies: "Kingdom of Italy",
        adversaries: "Austro-Hungarian Empire",
        battleType: "Ground",
        description: "The Sixth Battle of the Isonzo also known as the Battle of Gorizia was the most successful Italian offensive along the Soča (Isonzo) River during World War I. Franz Conrad von Hötzendorf had reduced the Austro-Hungarian forces along the Soča (Isonzo) front to reinforce his Trentino Offensive and also to assist with the defense of the Russian Brusilov Offensive."
    },
    {
        battle: "Battle of Mouquet Farm",
        coords: { lat: 50.051469, lng: 2.712733 },
        startDate: "07/23/1916",
        endDate: "09/26/1916",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Mouquet Farm, also known as the Fighting for Mouquet Farm was part of the Battle of the Somme and began during the Battle of Pozières (23 July – 3 September). The fighting began on 23 July with attacks by the British Reserve Army. The farm was captured by the 3rd Canadian Division of the Canadian Corps on 16 September."
    },
    {
        battle: "Battle of Bir el Abd",
        coords: { lat: 31.018056, lng: 33.011111 },
        startDate: "08/09/1916",
        endDate: "08/09/1916",
        allies: "British Empire",
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The Battle of Bir el Abd or the Abd well (9 August 1916) was fought between the forces of the British Empire and the Ottoman Turkish Empire, during the Sinai and Palestine Campaign of the First World War. The battle took place in the Sinai Desert following the British victory at the Battle of Romani (3–5 August)."
    },
    {
        battle: "Battle of Mlali",
        coords: { lat: -6.96667, lng: 37.55 },
        startDate: "08/24/1916",
        endDate: "08/24/1916",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Mlali was fought during the East African Campaign of World War I. In mid-August 1916, the British General led three divisions from Kenya south into the Imperial German colony of Tanganyika in order to seize and disrupt their vital railway. The German commander was informed by his scouts of the British movement and sent Captain Otto to investigate."
    },
    {
        battle: "Battle of Guillemont",
        coords: { lat: 50.013778, lng: 2.824444 },
        startDate: "09/03/1916",
        endDate: "09/06/1916",
        allies: ["British Empire", "France"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Guillemont was an attack by the British Fourth Army on the village of Guillemont. The village is on the D 20 running east to Combles and the D 64 south-west to Montauban. Longueval and Delville Wood lie to the north-west and Ginchy to the north-east. The village was on the right flank of the British sector, near the boundary with the French Sixth Army."
    },
    {
        battle: "Battle of Herkulesfürdő",
        coords: { lat: 45.7, lng: 120.9 },
        startDate: "09/06/1916",
        endDate: "09/10/1916",
        allies: "Romania",
        adversaries: ["Austro-Hungarian Empire", "German Empire"],
        battleType: "Ground",
        description: "The Battle of Herkulesfürdő was a military engagement during the Romanian Campaign of World War I. It was fought between Romanian forces on one side and Central Powers forces (Austria-Hungary and Germany) on the other side. It resulted in a Romanian victory."
    },
    {
        battle: "Battle of Kisaki",
        coords: { lat: -7.486111, lng: 37.601389 },
        startDate: "09/07/1916",
        endDate: "09/11/1916",
        allies: "South Africa",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Kisaki was a confrontation between German and South Africa forces near the town of Kisaki, German East Africa, on 7–11 September 1916. Paul Emil von Lettow-Vorbeck was appointed the military commander of the German colonial forces known as the Schutztruppe protection force in German East Africa on 13 April 1914."
    },
    {
        battle: "Battle of Ginchy",
        coords: { lat: 50.022667, lng: 2.832444 },
        startDate: "09/09/1916",
        endDate: "09/09/1916",
        allies: ["United Kingdom", "France"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Ginchy took place on 9 September 1916 during the Battle of the Somme, when the 16th (Irish) Division captured the German-held village. Ginchy is 0.93 mi (1.5 km) north-east of Guillemont, at the junction of six roads, on a rise overlooking Combles, 2.5 mi (4 km) to the south-east."
    },
    {
        battle: "Battle of Flers–Courcelette",
        coords: { lat: 50.058889, lng: 2.747778 },
        startDate: "09/15/1916",
        endDate: "09/22/1916",
        allies: ["United Kingdom", "New Zealand", "Canada", "France"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Flers–Courcelette was fought during the Battle of the Somme, by the French Sixth Army and the British Fourth Army and Reserve Army, against the German 1st Army. The Anglo-French attack began the third period of the Battle of the Somme but by its conclusion on 22 September, the strategic objective of a decisive victory had not been achieved."
    },
    {
        battle: "Battle of Morval",
        coords: { lat: 50.031944, lng: 2.873333 },
        startDate: "09/25/1916",
        endDate: "09/28/1916",
        allies: ["British Empire", "France"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Morval was an attack during the Battle of the Somme by the British Fourth Army on the villages of Morval, Gueudecourt and Lesbœufs held by the German 1st Army, which had been the final objectives of the Battle of Flers–Courcelette. The main British attack was postponed to combine with attacks by the French Sixth Army on the village of Combles south of Morval."
    },
    {
        battle: "Battle of Thiepval Ridge",
        coords: { lat: 50.054528, lng: 2.688389 },
        startDate: "09/26/1916",
        endDate: "09/28/1916",
        allies: ["British Empire", "France"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Thiepval Ridge was the first large offensive of the Reserve Army (Lieutenant General Hubert Gough), during the Battle of the Somme on the Western Front during the First World War. The attack was intended to benefit from the Fourth Army attack in the Battle of Morval, by starting 24 hours afterwards."
    },
    {
        battle: "Battle of Le Transloy",
        coords: { lat: 50.057389, lng: 2.887722 },
        startDate: "10/01/1916",
        endDate: "10/18/1916",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Le Transloy was the last big attack by the Fourth Army of the British Expeditionary Force in the 1916 Battle of the Somme in France, during the First World War. The battle was fought in conjunction with attacks by the French Tenth and Sixth armies on the southern flank and the Reserve/5th Army on the northern flank, against Army Group Rupprecht of Bavaria."
    },
    {
        battle: "Battle of Kőhalom",
        coords: { lat: 46.216667, lng: 24.8 },
        startDate: "10/02/1916",
        endDate: "10/02/1916",
        allies: "Romania",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Kőhalom was a military engagement during the Battle of Transylvania, at the beginning of the Romanian Campaign of World War I. It consisted in a German offensive that was successfully repulsed by the Romanians, who then carried out a largely unhindered tactical retreat."
    },
    {
        battle: "Battle of Cinghinarele Island",
        coords: { lat: 43.67, lng: 25.19 },
        startDate: "10/02/1916",
        endDate: "10/08/1916",
        allies: "Romania",
        adversaries: ["German Empire", "Austro-Hungarian Empire"],
        battleType: "Ground",
        description: "The Battle of Cinghinarele Island was a military engagement between Central Powers forces on one side and Romanian forces on the other side during the Romanian Campaign of World War I. It took place in early October 1916. In late September 1916, Romanian forces occupied the island, setting up a garrison comprising an infantry company and six guns in two batteries."
    },
    {
        battle: "Battle of the Ancre",
        coords: { lat: 50.066667, lng: 2.7 },
        startDate: "11/13/1916",
        endDate: "11/18/1916",
        allies: ["British Empire", "France"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of the Ancre (13–18 November 1916), was fought by the British Fifth Army (Lieutenant-General Hubert Gough), against the German 1st Army (General Fritz von Below). The battle was the last of the big British attacks of the Battle of the Somme; the Reserve Army had been renamed the Fifth Army on 30 October."
    },
    {
        battle: "Battle of Magdhaba",
        coords: { lat: 30.89, lng: 34.02 },
        startDate: "12/23/1916",
        endDate: "12/23/1916",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Battle of Magdhaba (officially known by the British as the Affair of Magdhaba) took place on 23 December 1916 during the Defence of Egypt section of the Sinai and Palestine Campaign in the First World War.[1][Note 1] The attack by the Anzac Mounted Division took place against an entrenched Ottoman Army garrison to the south and east of Bir Lahfan in the Sinai desert."
    },
    {
        battle: "Battle of Rafa",
        coords: { lat: 31.267, lng: 34.223 },
        startDate: "01/09/1917",
        endDate: "01/09/1917",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Battle of Rafa, also known as the Action of Rafah, was the third and final battle to complete the recapture of the Sinai Peninsula by British forces during the Sinai and Palestine campaign of the First World War. The Desert Column of the Egyptian Expeditionary Force attacked an entrenched Ottoman Army garrison at El Magruntein to the south of Rafah."
    },
    {
        battle: "Second Battle of Kut",
        coords: { lat: 32.505556, lng: 45.824722 },
        startDate: "02/23/1917",
        endDate: "02/23/1917",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Second Battle of Kut was fought on 23 February 1917, between British and Ottoman forces at Kut, Mesopotamia (present-day Iraq). The battle was part of the British advance to Baghdad begun in December 1916 by a 50,000-man British force (mainly from British India) organised in two army corps."
    },
    {
        battle: "Fall of Baghdad",
        coords: { lat: 33.2208, lng: 44.5064 },
        startDate: "03/08/1917",
        endDate: "03/11/1917",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Fall of Baghdad (11 March 1917) occurred during the Mesopotamia Campaign, fought between the forces of the British Indian Army and the Ottoman Empire in the First World War."
    },
    {
        battle: "Battle of Nambanje",
        coords: { lat: -8.709063, lng: 38.600262 },
        startDate: "03/13/1917",
        endDate: "03/13/1917",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Nambanje was a minor engagement between British and German colonial forces during the East African Campaign of World War I. It involved the 1st East African Division and took place on 13 March 1917.[1] Several British units were ordered to attack German forces that had been spotted near Nambanje."
    },
    {
        battle: "Battle of Mount Hamrin",
        coords: { lat: 35.0325, lng: 43.646389 },
        startDate: "03/25/1917",
        endDate: "03/25/1917",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Battle of Mount Hamrin was an unsuccessful British effort to cut off part of the Ottoman Sixth Army after the capture of Baghdad during the Mesopotamia campaign during the First World War."
    },
    {
        battle: "First Battle of Gaza",
        coords: { lat: 31.48, lng: 34.47 },
        startDate: "03/26/1917",
        endDate: "03/26/1917",
        allies: "British Empire",
        adversaries: ["Ottoman Empire", "German Empire", "Austro-Hungarian Empire"],
        battleType: "Ground",
        description: "The First Battle of Gaza was fought during the first attempt by the Egyptian Expeditionary Force to invade the south of Palestine in the Ottoman Empire during the Sinai and Palestine Campaign of the First World War. Fighting took place in and around the town of Gaza on the Mediterranean coast when infantry and mounted infantry from the Desert Column attacked the town."
    },
    {
        battle: "Battle of Vimy Ridge",
        coords: { lat: 50.379, lng: 2.774 },
        startDate: "04/09/1917",
        endDate: "04/12/1917",
        allies: ["United Kingdom", "Canada"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Vimy Ridge was part of the Battle of Arras, in the Nord-Pas-de-Calais region of France. The main combatants were the four divisions of the Canadian Corps in the First Army, against three divisions of the German 6th Army. The battle took place from 9 to 12 April 1917 at the beginning of the Battle of Arras, the first attack of the Nivelle Offensive."
    },
    {
        battle: "Battle of Arras",
        coords: { lat: 50.289722, lng: 2.780833 },
        startDate: "04/09/1917",
        endDate: "05/16/1917",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Arras was a British offensive on the Western Front during World War I. From 9 April to 16 May 1917, British troops attacked German defences near the French city of Arras on the Western Front. The British achieved the longest advance since trench warfare had begun, surpassing the record set by the French Sixth Army on 1 July 1916."
    },
    {
        battle: "Nivelle Offensive",
        coords: { lat: 49.5, lng: 3.5 },
        startDate: "04/16/1917",
        endDate: "05/09/1917",
        allies: ["France", "United Kingdom", "Russian Empire"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Nivelle Offensive (16 April – 9 May 1917), was a Franco-British operation on the Western Front in the First World War. The French part of the offensive was intended to be strategically decisive by breaking through the German defences on the Aisne front within 48 hours, with casualties expected to be around 10,000 men. "
    },
    {
        battle: "Second Battle of Gaza",
        coords: { lat: 31.4893, lng: 34.4737 },
        startDate: "04/17/1917",
        endDate: "04/19/1917",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Second Battle of Gaza was fought between 17 and 19 April 1917, following the defeat of the Egyptian Expeditionary Force (EEF) at the First Battle of Gaza in March, during the Sinai and Palestine Campaign of the First World War. Gaza was defended by the strongly entrenched Ottoman Army garrison, which had been reinforced after the first battle by substantial forces."
    },
    {
        battle: "Battle of Istabulat",
        coords: { lat: 34.2667, lng: 44.5167 },
        startDate: "04/21/1917",
        endDate: "04/21/1917",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Battle of Istabulat was a part of the Samarrah Campaign during the First World War occurring when the British Empire attempted to further its strategic position after the capture of Baghdad from the Ottoman Empire."
    },
    {
        battle: "Action of 4 May 1917",
        coords: { lat: 56, lng: 3 },
        startDate: "05/04/1917",
        endDate: "05/04/1917",
        allies: ["United Kingdom", "Australia"],
        adversaries: "German Empire",
        battleType: "Naval",
        description: "The Action of 4 May 1917 was a naval and air engagement of the First World War in the North Sea. The action took place between the German Zeppelin LZ 92 (tactical name: L.43), several German submarines and a naval force led by the Australian light cruiser HMAS Sydney."
    },
    {
        battle: "Raid on the Beersheba to Hafir el Auja railway",
        coords: { lat: 26, lng: 30 },
        startDate: "05/23/1917",
        endDate: "05/23/1917",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Raid on the Beersheba to Hafir el Auja railway took place on 23 May 1917 after the Second Battle of Gaza and before the Battle of Beersheba during the Stalemate in Southern Palestine in the Sinai and Palestine Campaign of World War I."
    },
    {
        battle: "Battle of Messines",
        coords: { lat: 50.7625, lng: 2.895278 },
        startDate: "06/07/1917",
        endDate: "06/14/1917",
        allies: ["United Kingdom", "Australia", "Canada", "New Zealand"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Messines (7–14 June 1917) was an attack by the British Second Army, on the Western Front near the village of Messines in West Flanders, Belgium, during the First World War.[a] The Nivelle Offensive in April and May had failed to achieve its more grandiose aims, had led to the demoralisation of French troops and confounded the Anglo-French strategy for 1917."
    },
    {
        battle: "Battle of Mount Ortigara",
        coords: { lat: 46.445556, lng: 11.173056 },
        startDate: "06/10/1917",
        endDate: "06/25/1917",
        allies: "Kingdom of Italy",
        adversaries: "Austro-Hungarian Empire",
        battleType: "Ground",
        description: "The Battle of Mount Ortigara was fought from 10 to 25 June 1917 between the Italian and Austro-Hungarian armies for possession of Mount Ortigara, in the Asiago Plateau."
    },
    {
        battle: "Battle of Zboriv",
        coords: { lat: 49.666667, lng: 25.15 },
        startDate: "07/01/1917",
        endDate: "07/02/1917",
        allies: ["Czechoslovak Legions", "Russian Empire"],
        adversaries: "Austro-Hungarian Empire",
        battleType: "Ground",
        description: "The Battle of Zborov was a part of the Kerensky Offensive (the last Russian offensive in World War I, taking place in July 1917). The battle was the first significant action of the Czechoslovak Legions (volunteers fighting against the Central Powers) on the Eastern Front and the only successful engagement of the failed Russian offensive."
    },
    {
        battle: "Battle of Aqaba",
        coords: { lat: 29.531944, lng: 35.005556 },
        startDate: "07/06/1917",
        endDate: "07/06/1917",
        allies: ["Hejaz", "British Empire"],
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Battle of Aqaba (6 July 1917) was fought for the Red Sea port of Aqaba (now in Jordan) during the Arab Revolt of World War I. The attacking forces, led by Auda abu Tayi and advised by T. E. Lawrence ('Lawrence of Arabia'), were victorious over the Ottoman Empire defenders."
    },
    {
        battle: "Battle of Kiawe Bridge",
        coords: { lat: -1.25825, lng: 36.64875 },
        startDate: "07/29/1917",
        endDate: "07/29/1917",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Kiawe Bridge was fought during the East African Campaign of World War I."
    },
    {
        battle: "Battle of Passchendaele",
        coords: { lat: 50.900278, lng: 3.021111 },
        startDate: "07/31/1917",
        endDate: "11/10/1917",
        allies: ["British Empire", "France", "Belgium"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "Also Known as 'The Third Battle of Ypres', it was a campaign of the First World War, fought by the Allies against the German Empire. The battle took place on the Western Front for control of the ridges south and east of the Belgian city of Ypres in West Flanders, as part of a strategy decided by the Allies at conferences in November 1916 and May 1917."
    },
    {
        battle: "Battle of Pilckem Ridge",
        coords: { lat: 50.916667, lng: 2.916667 },
        startDate: "07/31/1917",
        endDate: "08/02/1917",
        allies: ["United Kingdom", "New Zealand", "France"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Pilckem Ridge was the opening attack of the Third Battle of Ypres in WW1. The British Fifth Army, supported by the Second Army on the southern flank and the French 1reArmée (First Army) on the northern flank, attacked the German 4th Army, which defended the Western Front from Lille northwards to the Ypres Salient in Belgium and on to the North Sea coast."
    },
    {
        battle: "Battle of Langemarck",
        coords: { lat: 50.91, lng: 2.917 },
        startDate: "08/16/1917",
        endDate: "08/18/1917",
        allies: ["United Kingdom", "Newfoundland", "France"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Langemarck was the second Anglo-French general attack of the Third Battle of Ypres. The battle took place near Ypres in Belgian Flanders, on the Western Front against the Germans. The French had a big success on the northern flank from Bixschoote to Drie Grachten and the British gained a lot of ground northwards from Langemark to the boundary with the French."
    },
    {
        battle: "Battle of Megiddo",
        coords: { lat: 32.4, lng: 34.883 },
        startDate: "09/19/1917",
        endDate: "09/25/1917",
        allies: ["British Empire", "Hejaz", "France"],
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The Battle of Megiddo (Turkish: Megiddo Muharebesi) also known in Turkish as the Nablus Hezimeti ('Rout of Nablus'), or the Nablus Yarması ('Breakthrough at Nablus') was fought between 19 and 25 September 1918, on the Plain of Sharon, in front of Tulkarm, Tabsor and Arara in the Judean Hills as well as on the Esdralon Plain at Nazareth, Afulah, Beisan, Jenin and Samakh."
    },
    {
        battle: "Battle of the Menin Road Ridge",
        coords: { lat: 50.900278, lng: 3.016667 },
        startDate: "09/20/1917",
        endDate: "09/26/1917",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of the Menin Road Ridge, sometimes called 'Battle of the Menin Road', was the third British general attack of the Third Battle of Ypres in the First World War. The battle took place from 20 to 25 September 1917, in the Ypres Salient in Belgium on the Western Front."
    },
    {
        battle: "Battle of Broodseinde",
        coords: { lat: 50.851944, lng: 2.890556 },
        startDate: "10/04/1917",
        endDate: "10/04/1917",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Broodseinde was fought near Ypres, at the east end of the Gheluvelt plateau, by the British Second and Fifth armies against the German 4th Army. The battle was the most successful Allied attack of the Third Battle of Ypres. The British devastated the German defence, which prompted a crisis among the German commanders and caused a severe loss of morale."
    },
    {
        battle: "Battle of Poelcappelle",
        coords: { lat: 50.922, lng: 2.963 },
        startDate: "10/09/1917",
        endDate: "10/09/1917",
        allies: ["British Empire", "France"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Poelcappelle was fought in Flanders, by the British Second Army and Fifth Army against the German 4th Army, during the First World War. The battle marked the end of the string of highly successful British attacks in late September and early October, during the Third Battle of Ypres. Only the supporting attack in the north achieved a substantial advance."
    },
    {
        battle: "Battle of Wadi Musa",
        coords: { lat: 30.32, lng: 35.478333 },
        startDate: "10/23/1917",
        endDate: "10/23/1917",
        allies: "Hejaz",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Battle of Wadi Musa was a battle fought between the Arab Army and the Ottoman Empire during the Arab Revolt of 1916–1918. The battle began when General Djemal Pasha ordered his forces to secure the Hejaz Railway by 'any and all means'. The Ottoman Army at Ma'an was sent to deal with the North Arab Army."
    },
    {
        battle: "Battle of Caporetto",
        coords: { lat: 46.214444, lng: 13.6425 },
        startDate: "10/24/1917",
        endDate: "11/19/1917",
        allies: "Kingdom of Italy",
        adversaries: ["German Empire", "Austro-Hungarian Empire"],
        battleType: "Ground",
        description: "The Battle of Caporetto (also known as the Twelfth Battle of the Isonzo, the Battle of Kobarid or the Battle of Karfreit) was a battle on the Italian front. The battle was fought between the Kingdom of Italy and the Central Powers and took place from 24 October to 19 November 1917, near the town of Kobarid (now in north-western Slovenia, then part of the Austrian Littoral)."
    },
    {
        battle: "Second Battle of Passchendaele",
        coords: { lat: 50.9, lng: 3.02 },
        startDate: "10/26/1917",
        endDate: "11/10/1917",
        allies: ["British Empire", "France", "Belgium"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Second Battle of Passchendaele was the culminating attack during the Third Battle of Ypres of the First World War. The battle took place in the Ypres Salient area of the Western Front, in and around the Belgian village of Passchendaele, between 26 October and 10 November 1917."
    },
    {
        battle: "Battle of Beersheba",
        coords: { lat: 31.249722, lng: 34.799722 },
        startDate: "10/31/1917",
        endDate: "10/31/1917",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Battle of Beersheba (Turkish: Birüssebi Muharebesi, German: Schlacht von Birüssebi) was fought on 31 October 1917, when the British Empire's Egyptian Expeditionary Force (EEF) attacked and captured the Yildirim Army Group garrison at Beersheba, beginning the Southern Palestine Offensive of the Sinai and Palestine campaign of World War I."
    },
    {
        battle: "Third Battle of Gaza",
        coords: { lat: 31.4893, lng: 34.4737 },
        startDate: "11/01/1917",
        endDate: "11/02/1917",
        allies: ["British Empire", "France", "Kingdom of Italy"],
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Third Battle of Gaza was fought on the night of 1 November 1917 between British and Ottoman forces during the Sinai and Palestine Campaign of World War I and came after the British Egyptian Expeditionary Force (EEF) victory at the Battle of Beersheba had ended the Stalemate in Southern Palestine. The fighting occurred at the beginning of the Southern Palestine Offensive."
    },
    {
        battle: "Battle of Tel el Khuweilfe",
        coords: { lat: 31.666667, lng: 35.166667 },
        startDate: "11/01/1917",
        endDate: "11/06/1917",
        allies: "British Empire",
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The Battle of Tel el Khuweilfe, part of the Southern Palestine Offensive, began on 1 November 1917, the day after the Egyptian Expeditionary Force (EEF) victory at the Battle of Beersheba during the Sinai and Palestine Campaign of World War I. "
    },
    {
        battle: "Battle of Hareira and Sheria",
        coords: { lat: 31.382117, lng: 34.606522 },
        startDate: "11/06/1917",
        endDate: "11/07/1917",
        allies: "British Empire",
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The Battle of Hareira and Sheria was fought on 6–7 November 1917 when the Egyptian Expeditionary Force attacked and captured the Yildirim Army Group's defensive systems protecting Hareira and Sheria in the centre of the Gaza to Beersheba line, during the Southern Palestine Offensive of the Sinai and Palestine Campaign in World War I."
    },
    {
        battle: "Battle of Mughar Ridge",
        coords: { lat: 31.258889, lng: 34.799722 },
        startDate: "11/13/1917",
        endDate: "11/13/1917",
        allies: "British Empire",
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The Battle of Mughar Ridge, officially known by the British as the Action of El Mughar, took place during the Pursuit phase of the Southern Palestine Offensive of the Sinai and Palestine Campaign. Fighting between the advancing Egyptian Expeditionary Force and the retreating Yildirim Army Group, occurred after the Battle of Beersheba and the Third Battle of Gaza."
    },
    {
        battle: "Battle of Ayun Kara",
        coords: { lat: 31.948333, lng: 34.775556 },
        startDate: "11/14/1917",
        endDate: "11/14/1917",
        allies: "New Zealand",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Battle of Ayun Kara (14 November 1917) was an engagement in the Sinai and Palestine Campaign during the First World War. The battle was fought between the New Zealand Mounted Rifles Brigade and a similar-sized rearguard from the Turkish 3rd Infantry Division, which was part of the XXII Corps of the Ottoman Eighth Army under Kress von Kressenstein."
    },
    {
        battle: "Second Battle of Heligoland Bight",
        coords: { lat: 54.166667, lng: 8.066667 },
        startDate: "11/17/1917",
        endDate: "11/17/1917",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Second Battle of Heligoland Bight, also the Action in the Helgoland Bight and the Zweiten Seeschlacht bei Helgoland, was an inconclusive naval engagement fought between British and German squadrons on 17 November 1917 during the First World War."
    },
    {
        battle: "Battle of Cambrai",
        coords: { lat: 50.176667, lng: 3.235556 },
        startDate: "11/20/1917",
        endDate: "12/07/1917",
        allies: ["United Kingdom", "India", "France", "United States"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Cambrai (Battle of Cambrai, 1917, First Battle of Cambrai and Schlacht von Cambrai) was a British attack followed by the biggest German counter-attack against the British Expeditionary Force (BEF) since 1914, in the First World War. The town of Cambrai, in the département of Nord, was an important supply point for the German Siegfriedstellung (Hindendburg)."
    },
    {
        battle: "Battle of Ngomano",
        coords: { lat: -11.428333, lng: 38.493611 },
        startDate: "11/25/1917",
        endDate: "11/25/1917",
        allies: "Portugal",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Ngomano or Negomano was fought between Germany and Portugal during the East African Campaign of World War I. A force of Germans and Askaris under Paul Emil von Lettow-Vorbeck had recently won a costly victory against the British at the Battle of Mahiwa, in present-day Tanzania and ran very short of food and other supplies."
    },
    {
        battle: "Battle of Polygon Wood",
        coords: { lat: 50.851944, lng: 2.985278 },
        startDate: "09/26/1917",
        endDate: "10/03/1917",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Polygon Wood took place from 26 September to 3 October 1917, during the second phase of the Third Battle of Ypres in the First World War. The battle was fought near Ypres in Belgium, in the area from the Menin road to Polygon Wood and thence north, to the area beyond St Julien."
    },
    {
        battle: "Battle of Buqqar Ridge",
        coords: { lat: 31.2036, lng: 34.535097 },
        startDate: "10/27/1917",
        endDate: "10/27/1917",
        allies: "British Empire",
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The Battle of el Buqqar Ridge took place on 27 October 1917, when one infantry regiment and cavalry troops of the Yildirim Army Group, attacked the 8th Mounted Brigade of the Egyptian Expeditionary Force (EEF) in the last days of the stalemate in Southern Palestine during the Sinai and Palestine campaign of World War I."
    },
    {
        battle: "Battle of Jerusalem",
        coords: { lat: 31.783333, lng: 35.216667 },
        startDate: "11/17/1917",
        endDate: "12/30/1917",
        allies: "British Empire",
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The Battle of Jerusalem occurred during the British Empire's 'Jerusalem Operations' against the Ottoman Empire, in World War I, when fighting for the city developed from 17 November, continuing after the surrender until 30 December 1917, to secure the final objective of the Southern Palestine Offensive during the Sinai and Palestine Campaign of World War I."
    },
    {
        battle: "Battle of Kämärä",
        coords: { lat: 60.59144, lng: 29.04473 },
        startDate: "01/27/1918",
        endDate: "01/27/1918",
        allies: "Finnish Reds",
        adversaries: "Finnish Whites",
        battleType: "Ground",
        description: "The Battle of Kämärä was a 1918 Finnish Civil War battle fought at the Kämärä (now Gavrilovo, Leningrad oblast, Russia) railway station on 27 January 1918 between the Whites and the Reds. The battle began as a White Guard battalion from Vyborg attacked Kämärä on its march to the White controlled side of the Karelian Isthmus."
    },
    {
        battle: "Battle of Vilppula",
        coords: { lat: 62.012382, lng: 24.485806 },
        startDate: "01/31/1918",
        endDate: "03/18/1918",
        allies: "Finnish Reds",
        adversaries: "Finnish Whites",
        battleType: "Ground",
        description: "Battle of Vilppula was a Finnish Civil War battle fought in Vilppula and Ruovesi, Finland in 31 January – 18 March 1918 between the Whites and the Reds. Due to its location by the Tampere–Haapamäki railway, Vilppula was a gateway to the White controlled Central Finland."
    },
    {
        battle: "Battle of Ruovesi",
        coords: { lat: 61.896865, lng: 24.106484 },
        startDate: "02/05/1918",
        endDate: "03/19/1918",
        allies: ["Russian Empire", "Finnish Reds"],
        adversaries: "Finnish Whites",
        battleType: "Ground",
        description: "The Battle of Ruovesi was a major battle during the Finnish Civil War and on the Eastern Front of World War I fought in Ruovesi, Finland from 5 February to 19 March 1918 between the Whites and the Reds with support from Russian volunteers. The fighting took mostly place in the villages of Pekkala, Jäminkipohja ja Pihlajalahti in the southern part of the Ruovesi municipality."
    },
    {
        battle: "Battle of Antrea",
        coords: { lat: 60.861936, lng: 28.962024 },
        startDate: "02/11/1918",
        endDate: "04/25/1918",
        allies: ["Finnish Reds", "Russian Empire"],
        adversaries: "Finnish Whites",
        battleType: "Ground",
        description: "Battle of Antrea was a Finnish Civil War battle, fought in Antrea (now Kamennogorsk, Russia) and Jääski (now Lesogorsky, Russia), between the Finnish Whites against the Finnish Reds. It was fought by the Vyborg–Joensuu railroad between Vyborg, the Red capital in Eastern Finland, and Antrea, an important railroad junction 30 kilometres north of Vyborg."
    },
    {
        battle: "Battle of Rarańcza",
        coords: { lat: 48.337222, lng: 26.066667 },
        startDate: "02/15/1918",
        endDate: "02/16/1918",
        allies: "Poland",
        adversaries: "Austro-Hungarian Empire",
        battleType: "Ground",
        description: "The Battle of Rarańcza was fought between Polish Legionnaires, and Austria-Hungary, from February 15 to 16, 1918, near Rarańcza in Bukovina, and ended with a Polish victory."
    },
    {
        battle: "Capture of Jericho",
        coords: { lat: 31.871111, lng: 35.444167 },
        startDate: "02/19/1918",
        endDate: "02/21/1918",
        allies: "British Empire",
        adversaries: "Ottoman Empire",
        battleType: "Ground",
        description: "The Capture of Jericho occurred between 19 and 21 February 1918 to the east of Jerusalem beginning the Occupation of the Jordan Valley during the Sinai and Palestine Campaign of the First World War. Fighting took place in an area bordered by the Bethlehem–Nablus road in the west, the Jordan River in the east, and north of a line from Jerusalem to the Dead Sea."
    },
    {
        battle: "Battle of Varkaus",
        coords: { lat: 62.316667, lng: 27.893056 },
        startDate: "02/19/1918",
        endDate: "02/21/1918",
        allies: "Finnish Reds",
        adversaries: "Finnish Whites",
        battleType: "Ground",
        description: "Battle of Varkaus was a battle of the 1918 Finnish Civil War, fought 19–21 February between the Whites and the Reds in Varkaus, Leppävirta. The victory was important for the Whites, all of Northern Finland was now under their control. The battle is best known of its bloody aftermath as the Whites executed up to 180 surrendered Reds."
    },
    {
        battle: "Battle of Rautu",
        coords: { lat: 60.547069, lng: 30.216672 },
        startDate: "02/21/1918",
        endDate: "04/05/1918",
        allies: ["Finnish Reds", "Russian Empire"],
        adversaries: "Finnish Whites",
        battleType: "Ground",
        description: "Battle of Rautu was a 1918 Finnish Civil War battle, fought in Rautu, Finland (now Sosnovo, Leningrad Oblast, Russia) from 21 February to 5 April 1918 between the Finnish Whites against the Finnish Reds and the Russian Bolsheviks."
    },
    {
        battle: "Battle of Tell 'Asur",
        coords: { lat: 32.035833, lng: 35.286111 },
        startDate: "03/08/1918",
        endDate: "03/12/1918",
        allies: "British Empire",
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The Battle of Tell 'Asur, known as the Action of Tell 'Asur, took place between 8 and 12 March 1918, after the decisive victory at the Battle of Jerusalem and the Capture of Jericho during the Sinai and Palestine Campaign of World War I. Fighting took place over an area which extended from the Mediterranean to Abu Tellul and Mussalabeh on the edge of the Jordan Valley."
    },
    {
        battle: "Battle of Bakhmach",
        coords: { lat: 51.183056, lng: 32.829722 },
        startDate: "03/08/1918",
        endDate: "03/13/1918",
        allies: ["Czechoslovak Legions", "Russian Empire"],
        adversaries: ["German Empire", "Austro-Hungarian Empire"],
        battleType: "Ground",
        description: "Battle of Bakhmach (Bitva u Bachmače in Czech), was one of the last battles on the Eastern Front in World War I between the Entente-backed Czechoslovak Legion, Soviet Russia and the Central Powers occupying Ukraine after the Treaty of Brest-Litovsk."
    },
    {
        battle: "Battle of Tampere",
        coords: { lat: 61.498011, lng: 23.763686 },
        startDate: "03/15/1918",
        endDate: "04/06/1918",
        allies: "Finnish Reds",
        adversaries: ["Finnish Whites", "Swedish Brigade"],
        battleType: "Ground",
        description: "The Battle of Tampere was a 1918 Finnish Civil War battle, fought in Tampere, Finland, between the Whites and the Reds. It is the most famous and the heaviest of all the Finnish Civil War battles. Today it is particularly remembered for its bloody aftermath as the Whites executed hundreds of capitulated Reds and took 11,000 prisoners placed in the Kalevankangas camp."
    },
    {
        battle: "Battle of Länkipohja",
        coords: { lat: 61.735883, lng: 24.795573 },
        startDate: "03/16/1918",
        endDate: "03/16/1918",
        allies: "Finnish Reds",
        adversaries: "Finnish Whites",
        battleType: "Ground",
        description: "The Battle of Länkipohja was a Finnish Civil War battle fought in the village of Länkipohja between the Whites and the Reds. Together with the battles fought in Kuru, Ruovesi and Vilppula between 15 and 18 March, the Battle of Länkipohja was one the first military operations related to the Battle of Tampere, which was the decisive battle of the Finnish Civil War."
    },
    {
        battle: "First Transjordan attack on Amman",
        coords: { lat: 31.94, lng: 35.94 },
        startDate: "03/21/1918",
        endDate: "04/02/1918",
        allies: ["British Empire", "Hejaz"],
        adversaries: ["German Empire", "Ottoman Empire"],
        battleType: "Ground",
        description: "The First Transjordan attack on Amman and to their enemy as the First Battle of the Jordan[5] took place between 21 March and 2 April 1918, as a consequence of the successful Battle of Tell 'Asur which occurred after the Capture of Jericho in February and the Occupation of the Jordan Valley began, during the Sinai and Palestine Campaign of World War I."
    },
    {
        battle: "First Battle of Amman",
        coords: { lat: 31.933333, lng: 35.933333 },
        startDate: "03/27/1918",
        endDate: "03/31/1918",
        allies: ["British Empire", "Hejaz"],
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The First Battle of Amman was fought from 27 to 31 March 1918 during the First Transjordan attack on Amman of the Sinai and Palestine Campaign of the First World War. The 60th Division and the Anzac Mounted Division attacked the Ottoman garrison at Amman deep in enemy occupied territory, 48 kilometres (30 mi) from their front line, after capturing Es Salt and Shunet Nimrin."
    },
    {
        battle: "First Battle of Morlancourt",
        coords: { lat: 49.9517, lng: 2.6294 },
        startDate: "03/28/1918",
        endDate: "03/30/1918",
        allies: ["Australia", "United Kingdom"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The First Battle of Morlancourt was fought over the period 28–30 March 1918, on the Western Front during World War I. The battle saw troops from the Australian 3rd Division advance to fill a gap in the Allied line that had formed north of the River Somme during the German Spring Offensive."
    },
    {
        battle: "Second Battle of the Piave River",
        coords: { lat: 45.830556, lng: 12.209444 },
        startDate: "06/15/1918",
        endDate: "06/23/1918",
        allies: ["Kingdom of Italy", "France", "United Kingdom"],
        adversaries: "Austro-Hungarian Empire",
        battleType: "Ground",
        description: "The Second Battle of the Piave River, fought between 15 and 23 June 1918, was a decisive victory[3][4] for the Italian Army against the Austro-Hungarian Empire during World War I. Though the battle proved to be a decisive blow to the Austro-Hungarian Empire and by extension the Central Powers, its full significance was not initially appreciated in Italy."
    },
    {
        battle: "Battle of Belleau Wood",
        coords: { lat: 49.073, lng: 3.29 },
        startDate: "06/01/1918",
        endDate: "06/26/1918",
        allies: ["United States", "France", "United Kingdom"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Belleau Wood occurred during the German Spring Offensive in World War I, near the Marne River in France. The battle was fought between the U.S. 2nd (under the command of Major General Omar Bundy) and 3rd Divisions along with French and British forces against an assortment of German units including elements from the 237th, 10th, 197th, 87th, and 28th Divisions."
    },
    {
        battle: "Battle of Hamel",
        coords: { lat: 49.898889, lng: 2.570556 },
        startDate: "07/04/1918",
        endDate: "07/04/1918",
        allies: ["Australia", "United States", "United Kingdom"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Hamel (4 July 1918) was a successful attack by Australian Army and US Army infantry, supported by British tanks, against German positions in and around the town of Le Hamel, in northern France, during World War I. The attack was planned and commanded by Lieutenant General John Monash, commander of the Australian Corps."
    },
    {
        battle: "Battle of Abu Tellul",
        coords: { lat: 31.6253, lng: 35.1453 },
        startDate: "07/14/1918",
        endDate: "07/14/1918",
        allies: "British Empire",
        adversaries: ["German Empire", "Ottoman Empire"],
        battleType: "Ground",
        description: "The Battle of Abu Tellul (called the Affair of Abu Tellul by the British) was fought on 14 July 1918 during the Sinai and Palestine Campaign of World War I after German and Ottoman Empire forces attacked the British Empire garrison in the Jordan Valley. The valley had been occupied by the Egyptian Expeditionary Force (EEF) from February 1918 when Jericho was captured."
    },
    {
        battle: "Second Battle of the Marne",
        coords: { lat: 49.083333, lng: 3.666667 },
        startDate: "07/15/1918",
        endDate: "08/06/1918",
        allies: ["France", "United States", "United Kingdom", "Kingdom of Italy", "Russian Empire"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Second Battle of the Marne (French: Seconde Bataille de la Marne) (15 July – 6 August 1918) was the last major German offensive on the Western Front during the First World War. The attack failed when an Allied counterattack, supported by several hundred tanks, overwhelmed the Germans on their right flank, inflicting severe casualties."
    },
    {
        battle: "Battle of Château-Thierry",
        coords: { lat: 49.041944, lng: 3.371944 },
        startDate: "07/18/1918",
        endDate: "07/18/1918",
        allies: ["United States", "France", "Belgium"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Château-Thierry was fought on 31 May 1918 and was one of the first actions of the American Expeditionary Forces (AEF) under General John J. 'Black Jack' Pershing. It was a battle in World War I as part of the Second Battle of the Marne, initially prompted by a German Spring Offensive."
    },
    {
        battle: "Battle of Amiens",
        coords: { lat: 49.893889, lng: 2.294167 },
        startDate: "08/08/1918",
        endDate: "08/12/1918",
        allies: ["British Empire", "France", "United States"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Amiens, also known as the Third Battle of Picardy (French: 3ème Bataille de Picardie), was the opening phase of the Allied offensive which began on 8 August 1918, later known as the Hundred Days Offensive, that ultimately led to the end of the First World War. Allied forces advanced over 11 kilometres on the first day, one of the greatest advances of the war."
    },
    {
        battle: "Hundred Days Offensive",
        coords: { lat: 49.892, lng: 2.299 },
        startDate: "08/08/1918",
        endDate: "11/11/1918",
        allies: ["France", "British Empire", "United States", "Belgium", "Kingdom of Italy", "Porugal", "Siam"],
        adversaries: ["German Empire", "Austro-Hungarian"],
        battleType: "Ground",
        description: "The Hundred Days Offensive (8 August to 11 November 1918) was a series of massive Allied offensives which ended the First World War. Beginning with the Battle of Amiens (8–12 August) on the Western Front, the Allies pushed the Central Powers back, undoing their gains from the Spring Offensive."
    },
    {
        battle: "Battle of the Ailette",
        coords: { lat: 49.577778, lng: 3.161389 },
        startDate: "08/17/1918",
        endDate: "08/23/1918",
        allies: "France",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of the Ailette was a battle that took place during the First World War in August 1918, on the banks of the Ailette between Laon and Aisne."
    },
    {
        battle: "Second Battle of the Somme",
        coords: { lat: 50.1867, lng: 1.6431 },
        startDate: "08/21/1918",
        endDate: "09/02/1918",
        allies: ["British Empire", "United States"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Second Battle of the Somme of 1918 was fought during the First World War on the Western Front from late August to early September, in the basin of the River Somme. It was part of a series of successful counter-offensives in response to the German Spring Offensive, after a pause for redeployment and supply."
    },
    {
        battle: "Battle of Baku",
        coords: { lat: 40.45, lng: 49.783333 },
        startDate: "08/26/1918",
        endDate: "09/14/1918",
        allies: ["Centrocaspian Dictatorship", "Dashnaktsutyun", "United Kingdom", "Russian Empire"],
        adversaries: ["Ottoman Empire", "Azerbaijan"],
        battleType: "Ground",
        description: "The Battle of Baku (Azerbaijani: Bakı döyüşü, Turkish: Bakü Muharebesi, Russian: Битва за Баку) was a battle in World War I that took place between August–September 1918 between the Ottoman–Azerbaijani coalition forces led by Nuri Pasha and Bolshevik–Dashnak Baku Soviet forces, later succeeded by the British–Armenian–White Russian forces."
    },
    {
        battle: "Battle of Ambos Nogales",
        coords: { lat: 31.3328, lng: -110.942224 },
        startDate: "08/27/1918",
        endDate: "08/27/1918",
        allies: "United States",
        adversaries: ["Mexico", "German Empire"],
        battleType: "Ground",
        description: "The Battle of Ambos Nogales (The Battle of Both Nogales), or as it is known in Mexico La batalla del 27 de agosto (The Battle of 27 August), was an engagement fought on 27 August 1918 between Mexican military and civilian militia forces and elements of U.S. Army troops of the 35th Infantry Regiment, who were reinforced by the Buffalo Soldiers of the 10th Cavalry Regiment."
    },
    {
        battle: "Battle of Mont Saint-Quentin",
        coords: { lat: 49.947222, lng: 2.9325 },
        startDate: "08/31/1918",
        endDate: "09/03/1918",
        allies: "Australia",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Mont Saint-Quentin was a battle on the Western Front during World War I. As part of the Allied Hundred Days Offensive on the Western Front in the late summer of 1918, the Australian Corps crossed the Somme River on the night of August 31, and broke the German lines at Mont Saint-Quentin and Péronne."
    },
    {
        battle: "Battle of Havrincourt",
        coords: { lat: 50.111944, lng: 3.086944 },
        startDate: "09/12/1918",
        endDate: "09/12/1918",
        allies: "British Empire",
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Havrincourt was fought on 12 September 1918, involving the British Third Army against German troops, including those of the 3rd and 10th Corps, in the town of Havrincourt, France. Although these battles were relatively small achievements in light of what would follow it marked the first time that the Hindenburg Line was pierced."
    },
    {
        battle: "Battle of Saint-Mihiel",
        coords: { lat: 48.889167, lng: 5.543611 },
        startDate: "09/12/1918",
        endDate: "09/15/1918",
        allies: ["United States", "France"],
        adversaries: ["German Empire", "Austro-Hungarian Empire"],
        battleType: "Ground",
        description: "The Battle of Saint-Mihiel was a major World War I battle fought from 12–15 September 1918, involving the American Expeditionary Forces (AEF) and 110,000 French troops under the command of General John J. Pershing of the United States against German positions. The U.S. Army Air Service played a significant role in this action."
    },
    {
        battle: "Battle of Épehy",
        coords: { lat: 50, lng: 3.116667 },
        startDate: "09/18/1918",
        endDate: "09/18/1918",
        allies: ["British Empire", "France"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of Épehy was a battle of the First World War fought on 18 September 1918, involving the British Fourth Army under the command of General Henry Rawlinson against German outpost positions in front of the Hindenburg Line. The village of Épehy was captured on 18 September by the 12th (Eastern) Division."
    },
    {
        battle: "Battle of Megiddo",
        coords: { lat: 32.4, lng: 34.883 },
        startDate: "09/19/1918",
        endDate: "09/25/1918",
        allies: ["British Empire", "Hejaz", "France"],
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The Battle of Megiddo (Turkish: Megiddo Muharebesi) also known in Turkish as the Nablus Hezimeti ('Rout of Nablus'), or the Nablus Yarması ('Breakthrough at Nablus') was fought between 19 and 25 September 1918, on the Plain of Sharon, in front of Tulkarm, Tabsor and Arara in the Judean Hills as well as on the Esdralon Plain at Nazareth, Afulah, Beisan, Jenin and Samakh."
    },
    {
        battle: "Battle of Tulkarm",
        coords: { lat: 32.311528, lng: 35.027039 },
        startDate: "09/19/1918",
        endDate: "09/19/1918",
        allies: "British Empire",
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The Battle of Tulkarm took place on 19 September 1918, beginning of the Battle of Sharon, which along with the Battle of Nablus formed the set piece Battle of Megiddo fought between 19 and 25 September in the last months of the Sinai and Palestine Campaign of the First World War."
    },
    {
        battle: "Battle of Tabsor",
        coords: { lat: 32.193333, lng: 34.877222 },
        startDate: "09/19/1918",
        endDate: "09/20/1918",
        allies: "British Empire",
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The Battle of Tabsor was fought on 19–20 September 1918 beginning the Battle of Sharon, which along with the Battle of Nablus formed the set piece Battle of Megiddo fought between 19 and 25 September in the last months of the Sinai and Palestine Campaign of the First World War."
    },
    {
        battle: "Battle of Sharon",
        coords: { lat: 32.596389, lng: 35.241944 },
        startDate: "09/19/1918",
        endDate: "09/25/1918",
        allies: ["British Empire", "France"],
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The Battle of Sharon began the set piece Battle of Megiddo half a day before the Battle of Nablus, in which large formations engaged and responded to movements by the opposition in the last months of the Sinai and Palestine Campaign. The fighting took place over a wide area from the Mediterranean Sea east to the Rafat salient in the Judean Hills."
    },
    {
        battle: "Battle of Nablus",
        coords: { lat: 32.220278, lng: 35.278889 },
        startDate: "09/19/1918",
        endDate: "09/25/1918",
        allies: ["British Empire", "Hejaz"],
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The Battle of Nablus took place during the set piece Battle of Megiddo between 19 and 25 September 1918 in the last months of the Sinai and Palestine Campaign of the First World War. Fighting took place in the Judean Hills where the British Empire's XX Corps attacked the Ottoman Empire's Yildirim Army Group's Seventh Army defending their line in front of Nablus."
    },
    {
        battle: "Capture of Jenin",
        coords: { lat: 32.461808, lng: 35.301356 },
        startDate: "09/20/1918",
        endDate: "09/20/1918",
        allies: "British Empire",
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The Capture of Jenin occurred on 20 September 1918, during the Battle of Sharon which together with the Battle of Nablus formed the set piece Battle of Megiddo fought between 19 and 25 September during the last months of the Sinai and Palestine Campaign of the First World War."
    },
    {
        battle: "Second Battle of Amman",
        coords: { lat: 31.933333, lng: 35.933333 },
        startDate: "10/01/1918",
        endDate: "10/01/1918",
        allies: ["British Empire", "Hejaz"],
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The Second Battle of Amman was fought on 25 September 1918 during the Third Transjordan attack as part of the Battle of Nablus which together with the main Battle of Sharon form the major set piece offensive known as the Battle of Megiddo of the Sinai and Palestine Campaign in World War I."
    },
    {
        battle: "Capture of Damascus",
        coords: { lat: 33.513, lng: 36.292 },
        startDate: "09/26/1918",
        endDate: "10/01/1918",
        allies: ["Hejaz", "British Empire"],
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The Capture of Damascus occurred after the capture of Haifa and the victory at the Battle of Samakh which opened the way for the pursuit north from the Sea of Galilee and the Third Transjordan attack which opened the way to Deraa, after the decisive Egyptian Expeditionary Force victory at the Battle of Megiddo during the Sinai and Palestine Campaign of World War I."
    },
    {
        battle: "Meuse–Argonne offensive",
        coords: { lat: 49.2725, lng: 5.141944 },
        startDate: "09/26/1918",
        endDate: "11/11/1918",
        allies: ["United States", "France", "Siam"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Meuse–Argonne offensive (also known as the Meuse River–Argonne Forest offensive,[6] the Battles of the Meuse–Argonne, and the Meuse–Argonne campaign) was a major part of the final Allied offensive of World War I that stretched along the entire Western Front. It was fought from September 26, 1918, until the Armistice of November 11, 1918, a total of 47 days."
    },
    {
        battle: "Battle of Jisr Benat Yakub",
        coords: { lat: 33.186667, lng: 35.619167 },
        startDate: "09/27/1918",
        endDate: "09/27/1918",
        allies: ["British Empire", "France"],
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The Battle of Jisr Benat Yakub was fought on 27 September 1918 at the beginning of the pursuit by the Desert Mounted Corps of the retreating remnants of the Yildirim Army Group towards Damascus during the Sinai and Palestine Campaign of World War I. After the Battle of Samakh and the Capture of Tiberias, which completed the Egyptian Expeditionary Force's decisive victory."
    },
    {
        battle: "Battle of St Quentin Canal",
        coords: { lat: 49.961667, lng: 3.236667 },
        startDate: "09/29/1918",
        endDate: "10/10/1918",
        allies: ["United Kingdom", "United States"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Battle of St. Quentin Canal was a pivotal battle of World War I that began on 29 September 1918 and involved British, Australian and American forces operating as part of the British Fourth Army under the overall command of General Sir Henry Rawlinson."
    },
    {
        battle: "Battle of Durazzo",
        coords: { lat: 41.301389, lng: 19.363333 },
        startDate: "10/02/1918",
        endDate: "10/02/1918",
        allies: ["Kingdom of Italy", "United Kingdom", "United States", "Australia"],
        adversaries: "Austro-Hungarian Empire",
        battleType: "Ground",
        description: "The Second Battle of Durazzo, or the Bombardment of Durazzo was a naval battle fought in the Adriatic Sea during the First World War. A large allied fleet led by the Regia Marina attacked the enemy-held port at Durazzo, Albania. The fleet destroyed the Austro-Hungarian shore defenses and skirmished with a small naval force."
    },
    {
        battle: "Pursuit to Haritan",
        coords: { lat: 34.730833, lng: 36.709444 },
        startDate: "10/03/1918",
        endDate: "10/27/1918",
        allies: ["British Empire", "Hejaz", "France"],
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The Pursuit to Haritan occurred between 29 September and 26 October 1918 when the XXI Corps and Desert Mounted Corps of the Egyptian Expeditionary Force (EEF) pursued the retreating remnants of the Yildirim Army Group advanced north from Damascus after that city was captured on 1 October during the final weeks of the Sinai and Palestine Campaign of the First World War."
    },
    {
        battle: "Battle of Vittorio Veneto",
        coords: { lat: 45.955833, lng: 12.346944 },
        startDate: "10/24/1918",
        endDate: "11/04/1918",
        allies: ["Kingdom of Italy", "United Kingdom", "France", "United States"],
        adversaries: "Austro-Hungarian Empire",
        battleType: "Ground",
        description: "The Battle of Vittorio Veneto was fought from 24 October to 3 November 1918 (with an armistice taking effect 24 hours later) near Vittorio Veneto on the Italian Front. The Italian victory marked the end of the war on the Italian Front, secured the dissolution of the Austro-Hungarian Empire and contributed to the end of the First World War just one week later."
    },
    {
        battle: "Battle of Aleppo",
        coords: { lat: 36.216667, lng: 37.166667 },
        startDate: "10/25/1918",
        endDate: "10/25/1918",
        allies: ["Hejaz", "British Empire"],
        adversaries: ["Ottoman Empire", "German Empire"],
        battleType: "Ground",
        description: "The Battle of Aleppo was fought on 25 October 1918, when Prince Feisal's Sherifial Forces captured the city during the Pursuit to Haritan from Damascus, in the last days of the Sinai and Palestine Campaign in the First World War."
    },
    {
        battle: "Battle of the Sambre",
        coords: { lat: 50.4667, lng: 4.86667 },
        startDate: "11/04/1918",
        endDate: "11/04/1918",
        allies: ["British Empire", "France", "United States"],
        adversaries: "German Empire",
        battleType: "Ground",
        description: "The Second Battle of the Sambre (4 November 1918) (which included the Second Battle of Guise (French: 2ème Bataille de Guise) and the Battle of Thiérache (French: Bataille de Thiérache) was part of the final European Allied offensives of World War I."
    },
    {
        battle: "Battle of Tulgas",
        coords: { lat: 63.5, lng: 43 },
        startDate: "11/11/1918",
        endDate: "11/14/1918",
        allies: ["United Kingdom", "United States", "Canada", "White Russians"],
        adversaries: "Russian Empire",
        battleType: "Ground",
        description: "The Battle of Tulgas was part of the North Russia Intervention into the Russian Civil War and was fought between Allied and Bolshevik troops on the Northern Dvina River 200 miles south of Archangel. It took place on the day the armistice ending World War I was signed, November 11, 1918, and is sometimes referred to as 'The Battle of Armistice Day.'"
    },
    {
        battle: "Invasion of Poland",
        coords: { lat: 52.216667, lng: 21 },
        startDate: "09/01/1939",
        endDate: "10/06/1939",
        allies: "Poland",
        adversaries: ["Germany", "Soviet Union"],
        victor: "e",
        battleType: "Ground",
        description: "B"
    },
    {
        battle: "Battle of the Bzura",
        coords: { lat: 52.233333, lng: 19.366667 },
        startDate: "09/09/1939",
        endDate: "09/19/1939",
        allies: "Poland",
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of the Bzura (or the Battle of Kutno) was the largest battle of the 1939 German invasion of Poland, fought between 9 and 19 September 1939, between Polish and German forces. It began as a Polish counter-offensive, but the Germans outflanked the Polish forces and took all of western Poland."
    },
    {
        battle: "Battle of Mława",
        coords: { lat: 53.116667, lng: 20.366667 },
        startDate: "09/01/1939",
        endDate: "09/03/1939",
        allies: "Poland",
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Mława took place to the north of the town of Mława in northern Poland between 1 and 3 September 1939. It was one of the opening battles of the Invasion of Poland and World War II in general. It was fought between the forces of the Polish Modlin Army under General Krukowicz-Przedrzymirski and the German 3rd Army under General Georg von Küchler."
    },
    {
        battle: "Battle of Tomaszów Lubelski",
        coords: { lat: 50.45, lng: 23.416667 },
        startDate: "09/17/1939",
        endDate: "09/26/1939",
        allies: "Poland",
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Tomaszów Lubelski took place from 18 September to 20 September 1939 near the town of Tomaszów Lubelski. It was the second largest battle of the Invasion of Poland (Battle of Bzura was the largest) and also the largest tank battle of the campaign. It resulted in the surrender of Army Krakow on 20 Sept. 1939."
    },
    {
        battle: "Battle of Kock",
        coords: { lat: 51.633333, lng: 22.433333 },
        startDate: "10/02/1939",
        endDate: "10/05/1939",
        allies: "Poland",
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Kock was the final battle in the invasion of Poland at the beginning of World War II in Europe. It took place between 2–5 October 1939, near the town of Kock, in Poland. The Polish Independent Operational Group Polesie, led by General Franciszek Kleeberg, fought the German XIV Motorized Corps, led by General Gustav Anton von Wietersheim."
    },
    {
        battle: "Siege of Warsaw",
        coords: { lat: 52.23, lng: 21.010833 },
        startDate: "09/08/1939",
        endDate: "09/28/1939",
        allies: "Poland",
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Siege of Warsaw in 1939 was fought between the Polish Warsaw Army (Polish: Armia Warszawa) garrisoned and entrenched in Warsaw and the invading German Army. It began with huge aerial bombardments initiated by the Luftwaffe starting on September 1, 1939 following the Nazi invasion of Poland."
    },
    {
        battle: "Battle of Lwów",
        coords: { lat: 49.83, lng: 24.014167 },
        startDate: "09/12/1939",
        endDate: "09/22/1939",
        allies: "Poland",
        adversaries: ["Germany", "Soviet Union"],
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Lwów (sometimes called the Siege of Lwów) was a World War II battle for the control over the Polish city of Lwów (now Lviv, Ukraine) between the Polish Army and the invading Wehrmacht and the Red Army. The city was seen as the key to the so-called Romanian Bridgehead and was defended at all cost."
    },
    {
        battle: "Battle of Wilno",
        coords: { lat: 54.666667, lng: 25.316667 },
        startDate: "09/18/1939",
        endDate: "09/19/1939",
        allies: "Poland",
        adversaries: "Soviet Union",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Wilno was fought by the Polish Army against the Soviet invasion of Poland in 1939, which accompanied the German Invasion of Poland in accordance with Molotov–Ribbentrop Pact. On 18–19 September, Soviet forces took over the city of Wilno (now Vilnius). Polish forces, concentrated in the west, were relatively weak in the east."
    },
    {
        battle: "Battle of Grodno",
        coords: { lat: 53.666667, lng: 23.833333 },
        startDate: "09/20/1939",
        endDate: "09/24/1939",
        allies: "Poland",
        adversaries: "Soviet Union",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Grodno took place between 21 September and 24 September 1939, during the Soviet invasion of Poland. It was fought between improvised Polish units under Gen. Wacław Przeździecki and Soviet Red Army troops of Komkor Ivan Boldin's Dzerzhinsky Cavalry Mechanized Group, at the time in a non-aggression agreement with Nazi Germany under the Ribbentrop-Molotov Pact."
    },
    {
        battle: "Battle of Szack",
        coords: { lat: 51.487778, lng: 23.929722 },
        startDate: "09/28/1939",
        endDate: "09/28/1939",
        allies: "Poland",
        adversaries: "Soviet Union",
        victor: "a",
        battleType: "Ground",
        description: "Battle of Szack (Shatsk) was one of the battles between the Polish Army and the Red Army fought in 1939 in the beginning of the Second World War."
    },
    {
        battle: "Battle of Wytyczno",
        coords: { lat: 51.433333, lng: 23.266667 },
        startDate: "10/01/1939",
        endDate: "10/01/1939",
        allies: "Poland",
        adversaries: "Soviet Union",
        victor: "e",
        battleType: "Ground",
        description: "The battle of Wytyczno took place on October 1, 1939 near the village of Wytyczno near Włodawa in Poland. It was a struggle between the Polish forces of the Border Defence Corps of Gen. Wilhelm Orlik-Rückemann and the Soviet Red Army during the invasion of Poland."
    },
    {
        battle: "Saar Offensive",
        coords: { lat: 49.166667, lng: 7.25 },
        startDate: "09/07/1939",
        endDate: "09/16/1939",
        allies: "France",
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Saar Offensive was a French ground invasion of Saarland, Germany, during the early stages of World War II. The plans called for roughly 40 divisions, including one armored division, three mechanised divisions, 78 artillery regiments and 40 tank battalions to assist Poland, which was then under invasion, by attacking Germany's understrength western front."
    },
    {
        battle: "Winter War",
        coords: { lat: 64, lng: 26 },
        startDate: "11/30/1939",
        endDate: "03/13/1940",
        allies: "Soviet Union",
        adversaries: "Finland",
        victor: "truce",
        battleType: "Ground",
        description: "The Winter War[F 7] was a war between the Soviet Union (USSR) and Finland. It began with a Soviet invasion of Finland on 30 November 1939, three months after the outbreak of World War II, and ended three and a half months later with the Moscow Peace Treaty on 13 March 1940."
    },
    {
        battle: "Battle of Tolvajärvi",
        coords: { lat: 62.287057, lng: 31.485492 },
        startDate: "12/12/1939",
        endDate: "12/12/1939",
        allies: "Soviet Union",
        adversaries: "Finland",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Tolvajärvi (['tol.va.jær.vi]; Finnish: Tolvajärven–Ägläjärven taistelu, Russian: Битва при Толваярви) was fought on 12 December 1939 between Finland and the Soviet Union. It was the first large offensive victory for the Finns in the Winter War."
    },
    {
        battle: "Battle of Suomussalmi",
        coords: { lat: 64.888333, lng: 28.888889 },
        startDate: "12/07/1939",
        endDate: "01/08/1940",
        allies: "Soviet Union",
        adversaries: "Finland",
        victor: "e",
        battleType: "Ground",
        description: "B"
    },
    {
        battle: "Battle of Changsha",
        coords: { lat: 28.2, lng: 112.967 },
        startDate: "09/17/1939",
        endDate: "10/13/1939",
        allies: "Republic of China",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The First Battle of Changsha (17 September 1939 – 6 October 1939) was the first of four attempts by Japan to take the city of Changsha (長沙市), Hunan (湖南省), during the second Sino-Japanese War. It was the first major battle of the war to fall within the time frame of what is widely considered World War II."
    },
    {
        battle: "1939–40 Winter Offensive",
        coords: { lat: 51, lng: 23 },
        startDate: "10/01/1939",
        endDate: "10/01/1939",
        allies: "Republic of China",
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: "Ground",
        description: "The 1939–40 Winter Offensive was one of the major engagements between the National Revolutionary Army and Imperial Japanese Army during the Second Sino-Japanese War, in which Chinese forces launched their first major counter-offensive on multiple fronts."
    },
    {
        battle: "Battle of the River Plate",
        coords: { lat: -32, lng: -47 },
        startDate: "12/13/1939",
        endDate: "12/13/1939",
        allies: ["United Kingdom", "New Zealand"],
        adversaries: "Germany",
        victor: "a",
        battleType: "Naval",
        description: "The Battle of the River Plate was the first naval battle in the Second World War and the first one of the Battle of the Atlantic in South American waters. The German heavy cruiser Admiral Graf Spee had sailed into the South Atlantic two weeks before the war began, and had been commerce raiding after receiving appropriate authorisation on 26 September 1939."
    },
    {
        battle: "Battle of the Atlantic",
        coords: { lat: 0, lng: -25 },
        startDate: "09/03/1939",
        endDate: "05/08/1945",
        allies: ["United Kingdom", "Canada", "United States", "Brazil", "Norway"],
        adversaries: ["Germany", "Kingdom of Italy"],
        victor: "a",
        battleType: "Naval",
        description: "The Battle of the Atlantic, the longest continuous military campaign in World War II, ran from 1939 to the defeat of Nazi Germany in 1945, covering a major part of the Naval history of World War II. At its core was the Allied naval blockade of Germany, announced the day after the declaration of war, and Germany's subsequent counter-blockade."
    },
    {
        battle: "Battle of Kollaa",
        coords: { lat: 62.027778, lng: 32.255556 },
        startDate: "12/07/1939",
        endDate: "03/13/1940",
        allies: "Soviet Union",
        adversaries: "Finland",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Kollaa was fought from December 7, 1939, to March 13, 1940, in Ladoga's Karelia, Finland, as a part of the Soviet-Finnish Winter War."
    },
    {
        battle: "Battle of Honkaniemi",
        coords: { lat: 60.65, lng: 28.783333 },
        startDate: "02/25/1940",
        endDate: "02/27/1940",
        allies: "Soviet Union",
        adversaries: "Finland",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Honkaniemi was fought between Finnish and Soviet forces on 26 February 1940. This battle was notable for being fought by tanks, the only time they were used en masse in combat by Finnish forces in the Winter War."
    },
    {
        battle: "German invasion of Denmark",
        coords: { lat: 56, lng: 10 },
        startDate: "04/09/1940",
        endDate: "04/09/1940",
        allies: "Denmark",
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The German invasion of Denmark (German: Operation Weserübung – Süd) was the German attack on Denmark on 9 April 1940, during the Second World War. The attack was a prelude to the main attack against Norway (German: Weserübung Nord)."
    },
    {
        battle: "Battle of Drøbak Sound",
        coords: { lat: 59.7009, lng: 10.5927 },
        startDate: "04/09/1940",
        endDate: "04/09/1940",
        allies: "Norway",
        adversaries: "Germany",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Drøbak Sound took place in Drøbak Sound, the northernmost part of the outer Oslofjord in southern Norway, on 9 April 1940. It marked the end of the 'Phoney War' and the beginning of World War II in Western Europe."
    },
    {
        battle: "Battle of Narvik",
        coords: { lat: 68.420556, lng: 17.56 },
        startDate: "04/09/1940",
        endDate: "06/08/1940",
        allies: "Norway",
        adversaries: "Germany",
        victor: "a",
        battleType: "Ground",
        description: "The Battles of Narvik were fought from 9 April to 8 June 1940 as a naval battle in the Ofotfjord and as a land battle in the mountains surrounding the north Norwegian city of Narvik as part of the Norwegian Campaign of the Second World War."
    },
    {
        battle: "Namsos campaign",
        coords: { lat: 64.493889, lng: 11.511667 },
        startDate: "04/01/1940",
        endDate: "05/10/1940",
        allies: ["United Kingdom", "France", "Norway"],
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Namsos campaign, in Namsos, and its surrounding area involved heavy fighting between Anglo-French and Norwegian naval and military forces on the one hand, and German military, naval and air forces on the other in April and early May 1940. It was one of the first significant occasions during the Second World War when British and French land forces fought the German Army."
    },
    {
        battle: "Invasion of Iceland",
        coords: { lat: 64.133333, lng: -20 },
        startDate: "05/10/1940",
        endDate: "05/10/1940",
        allies: "United Kingdom",
        adversaries: "Iceland",
        victor: "a",
        battleType: "Ground",
        description: "The invasion of Iceland by the Royal Navy and Royal Marines occurred on 10 May 1940, during World War II. The invasion took place because the British government feared that Iceland would be used by the Germans, who had recently overrun Denmark, which was in personal union with Iceland and which had previously been largely responsible for Iceland's foreign policy."
    },
    {
        battle: "Battle of the Netherlands",
        coords: { lat: 52.316667, lng: 5.55 },
        startDate: "05/10/1940",
        endDate: "05/17/1940",
        allies: ["Netherlands", "France", "United Kingdom"],
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of the Netherlands (Dutch: Slag om Nederland) was a military campaign part of Case Yellow (German: Fall Gelb), the German invasion of the Low Countries (Belgium, Luxembourg, and the Netherlands) and France during World War II. The battle lasted from 10 May 1940 until the surrender of the main Dutch forces on 14 May."
    },
    {
        battle: "Battle of Belgium",
        coords: { lat: 50.833333, lng: 4 },
        startDate: "05/10/1940",
        endDate: "05/28/1940",
        allies: ["Belgium", "France", "United Kingdom", "Netherlands"],
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Belgium or Belgian Campaign, often referred to within Belgium as the 18 Days' Campaign, formed part of the greater Battle of France, an offensive campaign by Germany during the Second World War. It took place over 18 days in May 1940 and ended with the German occupation of Belgium following the surrender of the Belgian Army."
    },
    {
        battle: "Battle of France",
        coords: { lat: 48.816667, lng: 2.483333 },
        startDate: "05/05/1940",
        endDate: "06/25/1940",
        allies: ["France", "Belgium", "United Kingdom", "Netherlands", "Poland", "Czechoslovakia", "Luxembourg"],
        adversaries: ["Germany", "Kingdom of Italy"],
        victor: "e",
        battleType: "Ground",
        description: "The Battle of France, also known as the Fall of France, was the German invasion of France and the Low Countries during the Second World War. On 3 September 1939 France had declared war on Germany, following the German invasion of Poland. In early September 1939, France began the limited Saar Offensive. By mid-October, the French had withdrawn to their start lines."
    },
    {
        battle: "Battle of Dunkirk",
        coords: { lat: 51.0343, lng: 2.37682 },
        startDate: "05/26/1940",
        endDate: "06/04/1940",
        allies: ["United Kingdom", "France", "Belgium", "Canada", "Netherlands"],
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Dunkirk (French: Bataille de Dunkerque) was fought in Dunkirk (Dunkerque), France, during the Second World War, between the Allies and Nazi Germany. As the Allies were losing the Battle of France on the Western Front, the Battle of Dunkirk was the defence and evacuation to Britain of British and other Allied forces in Europe from 26 May to 4 June 1940."
    },
    {
        battle: "Battle of Arras",
        coords: { lat: 50.25, lng: 2.7 },
        startDate: "05/21/1940",
        endDate: "05/21/1940",
        allies: ["United Kingdom", "France"],
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Arras took place on 21 May 1940, during the Battle of France in the Second World War. Following the German invasion of the Low Countries on 10 May, French and British forces advanced into Belgium. The German campaign plan Fall Gelb (Case Yellow) had evolved into a decoy operation in the Netherlands and Belgium, with the main effort through the Ardennes."
    },
    {
        battle: "Battle of Boulogne",
        coords: { lat: 50.726389, lng: 1.614722 },
        startDate: "05/22/1940",
        endDate: "05/25/1940",
        allies: ["France", "United Kingdom", "Belgium"],
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Boulogne in 1940 was the defence of the port of Boulogne-sur-Mer by French, British and Belgian troops in the Battle of France during the Second World War. The battle was fought at the same time as the Siege of Calais, just before Operation Dynamo, the evacuation of the British Expeditionary Force (BEF) from Dunkirk."
    },
    {
        battle: "Attack on Mers-el-Kébir",
        coords: { lat: 35.719444, lng: -0.688889 },
        startDate: "06/03/1940",
        endDate: "06/03/1940",
        allies: "United Kingdom",
        adversaries: "France",
        victor: "a",
        battleType: "Naval",
        description: "The Attack on Mers-el-Kébir during the Second World War, was a British naval attack on French Navy ships at the naval base at Mers El Kébir on the coast of French Algeria. The attack was part of Operation Catapult, a British plan to neutralise or destroy French ships to prevent them falling into German hands in the aftermath of the Allied defeat in the Battle of France."
    },
    {
        battle: "Battle of Britain",
        coords: { lat: 55, lng: -3 },
        startDate: "07/10/1940",
        endDate: "10/31/1940",
        allies: ["United Kingdom", "Canada"],
        adversaries: ["Germany", "Kingdom of Italy"],
        victor: "a",
        battleType: "Aerial",
        description: "The Battle of Britain was a military campaign of the Second World War, in which the Royal Air Force (RAF) and Fleet Air Arm (FAA) of the Royal Navy defended the United Kingdom (UK) against large-scale attacks by Nazi Germany's air force, the Luftwaffe. It has been described as the first major military campaign fought entirely by air forces."
    },
    {
        battle: "Italian invasion of British Somaliland",
        coords: { lat: 9.55, lng: 44.066667 },
        startDate: "08/03/1940",
        endDate: "08/19/1940",
        allies: "United Kingdom",
        adversaries: "Kingdom of Italy",
        victor: "e",
        battleType: "Ground",
        description: "The Italian invasion of British Somaliland (3–19 August 1940) was part of the East African campaign (1940–1941) in which Italian, Eritrean and Somali forces of Fascist Italy entered British Somaliland and defeated its combined garrison of British, Commonwealth and colonial forces supported by Somali irregulars."
    },
    {
        battle: "Japanese invasion of French Indochina",
        coords: { lat: 21.0333, lng: 105.85 },
        startDate: "09/22/1940",
        endDate: "09/26/1940",
        allies: "France",
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: "Ground",
        description: "The Japanese invasion of French Indochina (仏印進駐, Futsu-in shinchū) was a short undeclared military confrontation between Japan and France in northern French Indochina. Fighting lasted from 22 to 26 September 1940, simultaneous with the Battle of South Guangxi in the Sino-Japanese War."
    },
    {
        battle: "Battle of Dakar",
        coords: { lat: 14.6786, lng: -17.4207 },
        startDate: "09/23/1940",
        endDate: "09/25/1940",
        allies: ["United Kingdom", "Free France", "Australia"],
        adversaries: "Vichy France",
        victor: "e",
        battleType: ["Naval", "Aerial"],
        description: "The Battle of Dakar was an unsuccessful attempt in September 1940 by the Allies to capture the strategic port of Dakar in French West Africa (modern-day Senegal). It was hoped that the success of the operation could overthrow the pro-German Vichy French administration in the colony, and be replaced by a pro-Allied Free French one under General Charles de Gaulle."
    },
    {
        battle: "Greco-Italian War",
        coords: { lat: 42, lng: 22 },
        startDate: "10/28/1940",
        endDate: "04/23/1941",
        allies: ["Greece", "United Kingdom"],
        adversaries: ["Kingdom of Italy", "Germany"],
        victor: "e",
        battleType: "Ground",
        description: "The Greco-Italian War (Italo-Greek War, Italian Campaign in Greece; in Greece: War of '40) took place between the kingdoms of Italy and Greece from 28 October 1940 to 23 April 1941. This local war began the Balkans Campaign between the Axis powers and the Allies. It turned into the Battle of Greece when British and German ground forces intervened early in 1941."
    },
    {
        battle: "Battle of Pindus",
        coords: { lat: 40.088889, lng: 20.925278 },
        startDate: "09/28/1940",
        endDate: "11/13/1940",
        allies: "Greece",
        adversaries: "Kingdom of Italy",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Pindus (Greek: Μάχη της Πίνδου) took place in the Pindus Mountains in Epirus and West Macedonia, Greece, from 28 October–13 November 1940. The battle was fought between the Greek and the Italian armies during the first stages of the Greco-Italian War."
    },
    {
        battle: "Battle of Gabon",
        coords: { lat: 0.39, lng: 9.451667 },
        startDate: "10/27/1940",
        endDate: "11/12/1940",
        allies: ["Free France", "United Kingdom"],
        adversaries: "Vichy France",
        victor: "a",
        battleType: ["Ground", "Naval", "Aerial"],
        description: "The Battle of Gabon (French: Bataille du Gabon), also called the Gabon Campaign (Campagne du Gabon), occurred in November 1940 during World War II. The battle resulted in the Free French Forces taking the colony of Gabon and its capital, Libreville, from Vichy French forces. It was the only significant engagement in Central Africa during the war."
    },
    {
        battle: "Battle of Taranto",
        coords: { lat: 40.451111, lng: 17.2075 },
        startDate: "11/11/1940",
        endDate: "11/12/1940",
        allies: "United Kingdom",
        adversaries: "Kingdom of Italy",
        victor: "a",
        battleType: "Naval",
        description: "The Battle of Taranto took place between British naval forces, under Admiral Andrew Cunningham, and Italian naval forces, under Admiral Inigo Campioni. The Royal Navy launched the first all-aircraft ship-to-ship naval attack in history, employing 21 Fairey Swordfish biplane torpedo bombers from the aircraft carrier HMS Illustrious in the Mediterranean Sea."
    },
    {
        battle: "Hundred Regiments Offensive",
        coords: { lat: 37.45, lng: 116.3 },
        startDate: "08/20/1940",
        endDate: "12/05/1940",
        allies: "Republic of China",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The Hundred Regiments Offensive (Chinese: 百團大戰) (20 August – 5 December 1940)[11] was a major campaign of the Communist Party of China's National Revolutionary Army divisions commanded by Peng Dehuai against the Imperial Japanese Army in Central China."
    },
    {
        battle: "Battle of Sidi Barrani",
        coords: { lat: 31.610833, lng: 25.925556 },
        startDate: "12/10/1940",
        endDate: "12/11/1940",
        allies: ["United Kingdom", "Australia", "Free France"],
        adversaries: "Kingdom of Italy",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Sidi Barrani was the opening battle of Operation Compass, the first big British attack of the Western Desert Campaign of the Second World War. Sidi Barrani, on the Mediterranean coast in Egypt, had been occupied by the Italian 10th Army, during the Italian invasion of Egypt and was attacked by British, Commonwealth and imperial troops, who re-captured the port."
    },
    {
        battle: "Franco-Thai War",
        coords: { lat: 21.0333, lng: 105.85 },
        startDate: "10/13/1940",
        endDate: "01/28/1941",
        allies: "Thailand",
        adversaries: "Vichy France",
        victor: "indecisive",
        battleType: ["Ground", "Naval", "Aerial"],
        description: "The Franco-Thai War (Thai: กรณีพิพาทอินโดจีน; French: Guerre franco-thaïlandaise) was fought between Thailand and Vichy France over certain areas of French Indochina. Negotiations with France shortly before World War II had shown that the French government was willing to make appropriate changes in the boundaries between Thailand and French Indochina, but only slightly."
    },
    {
        battle: "Battle of the Litani River",
        coords: { lat: 33.833333, lng: 35.833333 },
        startDate: "06/09/1941",
        endDate: "06/09/1941",
        allies: ["Australia", "United Kingdom"],
        adversaries: "Vichy France",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of the Litani River (9 June 1941) was a battle of the Second World War that took place on the advance to Beirut during the Syria-Lebanon campaign. The Australian 7th Division, commanded by Major-General John Lavarack, crossed the Litani River and later clashed with Vichy French troops."
    },
    {
        battle: "Battle of Damascus",
        coords: { lat: 33.5, lng: 36.3 },
        startDate: "06/18/1941",
        endDate: "06/21/1941",
        allies: ["United Kingdom", "Free France", "Australia"],
        adversaries: "Vichy France",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Damascus (18–21 June 1941) was the final action of the Allied advance on Damascus in Syria during the Syria–Lebanon Campaign in World War II. The initial advance was undertaken by Indian troops who were tasked with capturing Mezzeh while Free French forces were to capture Qadam."
    },
    {
        battle: "Battle of Beirut",
        coords: { lat: 33.886, lng: 35.513 },
        startDate: "07/12/1941",
        endDate: "07/12/1941",
        allies: ["Free France", "United Kingdom", "Australia"],
        adversaries: "Vichy France",
        victor: "a",
        battleType: ["Ground", "Bombing"],
        description: "The Battle of Beirut (12 July 1941) marked the end of hostilities in the Syria-Lebanon campaign of World War II."
    },
    {
        battle: "Battle of Keren",
        coords: { lat: 15.776667, lng: 38.451111 },
        startDate: "02/05/1941",
        endDate: "04/01/1941",
        allies: ["United Kingdom", "Free France"],
        adversaries: "Kingdom of Italy",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Keren (Cheren) was fought as part of the East African Campaign during the Second World War. The engagement took place from 5 February[citation needed] to 1 April 1941, between a mixed Italian army of regular and colonial troops and British troops (mostly from Sudan and British India) and Free French forces."
    },
    {
        battle: "Battle of Cape Matapan",
        coords: { lat: 35.348006, lng: 20.961231 },
        startDate: "03/27/1941",
        endDate: "03/29/1941",
        allies: ["United Kingdom", "Australia"],
        adversaries: "Kingdom of Italy",
        victor: "a",
        battleType: ["Ground", "Naval", "Aerial"],
        description: "The Battle of Cape Matapan (Greek: Ναυμαχία του Ταινάρου) was a Second World War naval engagement between British Imperial and Axis forces, fought from 27–29 March 1941. The cape is on the south-west coast of the Peloponnesian peninsula of Greece."
    },
    {
        battle: "Battle of the Denmark Strait",
        coords: { lat: 67, lng: -24 },
        startDate: "05/24/1941",
        endDate: "05/24/1941",
        allies: "United Kingdom",
        adversaries: "Germany",
        victor: "indecisive",
        battleType: "Naval",
        description: "The Battle of the Denmark Strait was a naval engagement on 24 May 194, between ships of the Royal Navy and the Kriegsmarine. The British battleship HMS Prince of Wales and the battlecruiser HMS Hood fought the German battleship Bismarck and the heavy cruiser Prinz Eugen, which were attempting to break out into the North Atlantic to attack Allied merchant shipping."
    },
    {
        battle: "Last battle of the battleship Bismarck",
        coords: { lat: 48.39, lng: -5.4 },
        startDate: "05/26/1941",
        endDate: "05/27/1941",
        allies: ["United Kingdom", "Poland"],
        adversaries: "Germany",
        victor: "a",
        battleType: "Naval",
        description: "(350 mi; 560 km) west of Brest, France, on 26–27 May 1941. Although it was a decisive action between capital ships, it has no generally accepted name. On 24 May, before the final action, Bismarck's fuel tanks were damaged and several machinery compartments, including a boiler room, were flooded in the Battle of the Denmark Strait."
    },
    {
        battle: "Invasion of Yugoslavia",
        coords: { lat: 44.820556, lng: 20.462222 },
        startDate: "04/06/1941",
        endDate: "04/18/1941",
        allies: "Yugoslavia",
        adversaries: ["Germany", "Kingdom of Italy", "Hungary"],
        victor: "e",
        battleType: ["Ground", "Aerial"],
        description: "The Invasion of Yugoslavia, also known as the April War or Operation 25, was a German-led attack on the Kingdom of Yugoslavia by the Axis powers which began on 6 April 1941. The order for the invasion was put forward in 'Führer Directive No. 25', which Adolf Hitler issued on 27 March 1941, following a Yugoslav coup d'état that overthrew the pro-Axis government."
    },
    {
        battle: "Battle of Greece",
        coords: { lat: 39.986483, lng: 20.368515 },
        startDate: "10/28/1940",
        endDate: "06/01/1941",
        allies: ["Greece", "United Kingdom", "Australia", "New Zealand"],
        adversaries: ["Germany", "Kingdom of Italy"],
        victor: "e",
        battleType: ["Ground", "Aerial"],
        description: "The Battle of Greece (also known as Operation Marita, German: Unternehmen Marita)[17] is the common name for the invasion of Allied Greece by Fascist Italy and Nazi Germany in April 1941 during World War II. The Italian invasion in October 1940, which is usually known as the Greco-Italian War, was followed by the German invasion in April 1941."
    },
    {
        battle: "Battle of the Metaxas Line",
        coords: { lat: 41.397900, lng: 24.044050 },
        startDate: "04/06/1941",
        endDate: "04/09/1941",
        allies: "Greece",
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of the Metaxas Line (German: Kampf um die Metaxas-Linie), also known in Greece as the Battle of the Forts (Greek: Μάχη των Οχυρών), was the first battle during the German invasion of Greece in World War II. The Germans succeeded in capturing several individual forts but failed to breach the fortified Metaxas Line in general."
    },
    {
        battle: "Battle of Vevi",
        coords: { lat: 40.766667, lng: 21.616667 },
        startDate: "04/11/1941",
        endDate: "04/12/1941",
        allies: ["Australia", "Greece", "New Zealand", "United Kingdom"],
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Vevi (or Veve, Greek: Μάχη της Bεύης), in Greece, also known as the Battle of the Klidi Pass, was part of the Greek campaign of World War II. It took place on 11–12 April 1941, north of the town of Amyntaion, close to the northwestern Greek border. Allied troops fought forces from Nazi Germany."
    },
    {
        battle: "Battle of Thermopylae",
        coords: { lat: 38.805278, lng: 22.562778 },
        startDate: "04/24/1941",
        endDate: "04/25/1941",
        allies: ["Australia", "New Zealand"],
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Thermopylae was part of the German invasion of Greece. A German battlegroup based on a Mountain Division, meeting fierce resistance. Another battlegroup, drawn from a Panzer Division also attacked. The Australians and New Zealanders held out for an entire day, destroyed 15 German tanks and inflicted considerable casualties."
    },
    {
        battle: "Battle of Crete",
        coords: { lat: 35.21, lng: 24.91 },
        startDate: "05/20/1941",
        endDate: "06/01/1941",
        allies: ["United Kingdom", "Greece", "New Zealand", "Australia"],
        adversaries: ["Germany", "Kingdom of Italy"],
        victor: "e",
        battleType: ["Ground", "Aerial", "Naval"],
        description: "The Battle of Crete (German: Luftlandeschlacht um Kreta, also Unternehmen Merkur, 'Operation Mercury', Greek: Μάχη της Κρήτης) was fought during the Second World War on the Greek island of Crete. It began on the morning of 20 May 1941, when Nazi Germany began an airborne invasion of Crete. Greek and other Allied forces, along with Cretan civilians, defended the island."
    },
    {
        battle: "Operation Barbarossa",
        coords: { lat: 50.487994, lng: 13.947741 },
        startDate: "06/22/1941",
        endDate: "12/05/1941",
        allies: "Soviet Union",
        adversaries: ["Germany", "Romania", "Finland", "Kingdom of Italy", "Hungary", "Slovakia"],
        victor: "a",
        battleType: ["Ground", "Aerial"],
        description: "Operation Barbarossa (German: Unternehmen Barbarossa) was the code name for the Axis invasion of the Soviet Union, which started on Sunday, 22 June 1941, during World War II. The operation put into action Nazi Germany's ideological goal of conquering the western Soviet Union so as to repopulate it with Germans."
    },
    {
        battle: "Battle of Smolensk",
        coords: { lat: 54.782778, lng: 32.045278 },
        startDate: "07/08/1941",
        endDate: "09/10/1941",
        allies: "Soviet Union",
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The first Battle of Smolensk was a battle during the second phase of Operation Barbarossa, the Axis invasion of the Soviet Union, in World War II. It was fought around the city of Smolensk between 10 July and 10 September 1941, about 400 km (250 mi) west of Moscow. The Ostheer had advanced 500 km (310 mi) into the USSR in the 18 days after the invasion on 22 June 1941."
    },
    {
        battle: "Battle of Kiev",
        coords: { lat: 50.4536, lng: 30.5164 },
        startDate: "08/23/1941",
        endDate: "09/26/1941",
        allies: "Soviet Union",
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The First Battle of Kiev was the German name for the operation that resulted in a very large encirclement of Soviet troops in the vicinity of Kiev during World War II. This encirclement is considered the largest encirclement in the history of warfare. The operation ran from 7 August to 26 September 1941 as part of Operation Barbarossa, the Axis invasion of the Soviet Union."
    },
    {
        battle: "Battle of Moscow",
        coords: { lat: 55.75, lng: 37.633333 },
        startDate: "10/02/1941",
        endDate: "01/07/1942",
        allies: "Soviet Union",
        adversaries: "Germany",
        victor: "a",
        battleType: ["Ground", "Aerial"],
        description: "The Battle of Moscow was a military campaign that consisted of two periods of strategically significant fighting on a 600 km (370 mi) sector of the Eastern Front during World War II. It took place between October 1941 and January 1942. The Soviet defensive effort frustrated Hitler's attack on Moscow, the capital and largest city of the Soviet Union."
    },
    {
        battle: "Battle of Gondar",
        coords: { lat: 12.6, lng: 37.466667 },
        startDate: "11/13/1941",
        endDate: "11/27/1941",
        allies: ["United Kingdom", "Ethiopia"],
        adversaries: "Kingdom of Italy",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Gondar or Capture of Gondar was the last stand of the Italian forces in Italian East Africa during the Second World War. The battle took place in November 1941, during the East African Campaign. Gondar was the main town of Amhara in the mountains north of Lake Tana in Ethiopia, at an elevation of 7,000 ft and had an Italian garrison of 40,000 men."
    },
    {
        battle: "Attack on Pearl Harbor",
        coords: { lat: 21.365, lng: -157.95 },
        startDate: "12/07/1941",
        endDate: "12/07/1941",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: ["Naval", "Aerial"],
        description: "The Attack on Pearl Harbor[nb 3][11] was a surprise military strike by the Imperial Japanese Navy Air Service upon the United States (a neutral country at the time) against the naval base at Pearl Harbor in Honolulu, Territory of Hawaii, just before 08:00, on Sunday morning, December 7, 1941. The attack led to the United States' formal entry into World War II the next day."
    },
    {
        battle: "Battle of Changsha",
        coords: { lat: 28.2, lng: 112.967 },
        startDate: "09/06/1941",
        endDate: "10/08/1941",
        allies: "Republic of China",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Changsha (6 September – 8 October 1941) was Japan's second attempt at taking the city of Changsha, China, the capital of Hunan Province, as part of the Second Sino-Japanese War. The offensive was carried out by more than 120,000 Japanese troops who had much better equipment all around, including supporting naval and air forces."
    },
    {
        battle: "Battle of Shanggao",
        coords: { lat: 51, lng: 23 },
        startDate: "03/14/1941",
        endDate: "04/09/1941",
        allies: "Republic of China",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Shanggao (simplified Chinese: 上高会战; traditional Chinese: 上高會戰; pinyin: Shànggāo Huìzhàn), also called Operation Kinkō (Japanese: 錦江作戦), was one of the 22 major engagements between the National Revolutionary Army and Imperial Japanese Army during the Second Sino-Japanese War."
    },
    {
        battle: "Japanese invasion of Thailand",
        coords: { lat: 12, lng: 100 },
        startDate: "12/08/1941",
        endDate: "12/08/1941",
        allies: "Thailand",
        adversaries: "Empire of Japan",
        victor: "truce",
        battleType: ["Ground", "Aerial", "Naval"],
        description: "The Japanese invasion of Thailand occurred on 8 December 1941. It was briefly fought between the Kingdom of Thailand and the Empire of Japan. Despite fierce fighting in Southern Thailand, the fighting lasted only five hours before ending in a ceasefire. Thailand and Japan then formed an alliance, making Thailand part of the Axis' alliance until the end of World War II."
    },
    {
        battle: "Battle of Hong Kong",
        coords: { lat: 22.267, lng: 114.188 },
        startDate: "12/08/1941",
        endDate: "12/25/1941",
        allies: ["United Kingdom", "Canada", "China", "Free France"],
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: ["Ground", "Naval"],
        description: "The Battle of Hong Kong also known as the Defence of Hong Kong and the Fall of Hong Kong, was one of the first battles of the Pacific War. On the same morning as the attack on Pearl Harbor, forces of the Empire of Japan attacked the British Crown colony of Hong Kong. The attack was in violation of international law as Japan had not declared war against the British Empire."
    },
    {
        battle: "First Battle of Guam",
        coords: { lat: 13.5, lng: 144.8 },
        startDate: "12/08/1941",
        endDate: "12/10/1941",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: ["Ground", "Naval"],
        description: "The First Battle of Guam was an engagement during the Pacific War in World War II, and took place from 8 December to 10 December 1941 on Guam in the Mariana Islands between Japan and the United States. The American garrison was defeated by Japanese forces on 10 December, which resulted in an occupation until the Second Battle of Guam in 1944."
    },
    {
        battle: "Battle of Wake Island",
        coords: { lat: 19.29, lng: 166.601 },
        startDate: "12/08/1941",
        endDate: "12/23/1941",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: ["Ground", "Aerial", "Naval"],
        description: "The Battle of Wake Island began simultaneously with the attack on Pearl Harbor naval and air bases in Hawaii on the morning of 8 December 1941, and ended on 23 December, with the surrender of the American forces to the Empire of Japan. It was fought on and around the atoll formed by Wake Island and its minor islets of Peale and Wilkes Islands."
    },
    {
        battle: "Malayan campaign",
        coords: { lat: 4, lng: 102.5 },
        startDate: "12/08/1941",
        endDate: "02/15/1942",
        allies: ["United Kingdom", "British Raj", "British Malaya", "Austrslia", "New Zealand", "Netherlands"],
        adversaries: ["Empire of Japan", "Thailand"],
        victor: "e",
        battleType: ["Ground", "Aerial"],
        description: "The Malayan campaign was a military campaign fought by Allied and Axis forces in Malaya, from 8 December 1941 – 31 January 1942 during the Second World War. It was dominated by land battles between British Commonwealth army units, and the Imperial Japanese Army with minor skirmishes at the beginning of the campaign between British Commonwealth and Royal Thai Armed Forces."
    },
    {
        battle: "Japanese invasion of Malaya",
        coords: { lat: 4, lng: 4 },
        startDate: "12/08/1941",
        endDate: "12/08/1941",
        allies: ["United Kingdom", "British Raj", "Austrslia", "New Zealand"],
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: ["Ground", "Aerial"],
        description: "The Japanese Invasion of Malaya began just after midnight on 8 December 1941 (local time) before the attack on Pearl Harbor. It was the first major battle of the Pacific War, and was fought between ground forces of the British Indian Army and the Empire of Japan."
    },
    {
        battle: "Operation Krohcol",
        coords: { lat: 3.159460, lng: 101.745399 },
        startDate: "12/08/1941",
        endDate: "12/11/1941",
        allies: ["United Kingdom", "British Raj"],
        adversaries: ["Empire of Japan", "Thailand"],
        victor: "e",
        battleType: "Ground",
        description: "Operation Krohcol, or the Battle for The Ledge, was a British operation to invade southern Thailand following the Japanese invasion of Malaya and of Thailand. It was authorised by Lieutenant-General Arthur Percival as a 'mini Matador' after Operation Matador, a pre-emptive strike into Thailand which had been opposed by the British government and was not carried out."
    },
    {
        battle: "Bombing of Singapore",
        coords: { lat: 1.283333, lng: 103.833333 },
        startDate: "12/08/1941",
        endDate: "12/08/1941",
        allies: "United Kingdom",
        adversaries: "Empire of Japan",
        victor: "inconclusive",
        battleType: ["Bombing"],
        description: "The bombing of Singapore was an attack on 8 December 1941 by seventeen G3M Nell bombers of Mihoro Air Group, Imperial Japanese Navy, flying from Thu Dau Mot in southern Indochina. The attack began at around 0430, shortly after Japanese forces landed on Kota Bharu, Malaya. It was the first knowledge the Singapore population had that war had broken out in the Far East."
    },
    {
        battle: "Battle of Jitra",
        coords: { lat: 6.268056, lng: 100.421667 },
        startDate: "12/11/1941",
        endDate: "12/13/1941",
        allies: ["United Kingdom", "British Raj"],
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Jitra was fought between the invading Japanese and Allied forces during the Malayan Campaign of the Second World War, from 11–13 December 1941. The British defeat compelled Arthur Percival to order all Allied aircraft stationed in Malaya to withdraw to Singapore."
    },
    {
        battle: "Battle of Kampar",
        coords: { lat: 4.3, lng: 101.15 },
        startDate: "12/30/1941",
        endDate: "01/02/1942",
        allies: ["United Kingdom", "British Malaya"],
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Kampar was an engagement of the Malayan Campaign during World War II, involving British and Indian troops from the 11th Indian Infantry Division and the Japanese 5th Division. On 27 December, in an effort to prevent the capture of RAF Kuala Lumpur, the 11th Indian Infantry Division occupied Kampar, which offered a strong natural defensive position."
    },
    {
        battle: "Battle of Slim River",
        coords: { lat: 3.833333, lng: 101.4 },
        startDate: "01/06/1942",
        endDate: "01/08/1942",
        allies: "British Raj",
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Slim River occurred during the Malayan campaign in January 1942 between the Imperial Japanese Army and the British Indian Army on the west coast of Malaya."
    },
    {
        battle: "Battle of Muar",
        coords: { lat: 2.15, lng: 102.666667 },
        startDate: "01/14/1942",
        endDate: "01/22/1942",
        allies: ["Austrslia", "United Kingdom", "British Raj"],
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: ["Ground", "Aerial"],
        description: "The Battle of Muar was the last major battle of the Malayan Campaign during the Second World War. After the British defeat at Slim River the commander of ABDA decided that Lieutenant General Lewis Heath's III Indian Corps should withdraw south into the State of Johore to rest and regroup, whilst the Australian Division would attempt to stop the Japanese advance."
    },
    {
        battle: "Battle of Gemas",
        coords: { lat: 2.583333, lng: 102.583333 },
        startDate: "01/14/1942",
        endDate: "01/14/1942",
        allies: "Austrslia",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Gemas—part of the wider Battle of Muar—took place during the Japanese invasion of Malaya. The action occurredat the Gemencheh Bridge near Gemas and saw around 1,000 troops of the Japanese 5th Division killed or wounded during a fierce ambush initiated by Australian soldiers from 2/30th Battalion, assigned to the 27th Brigade of the 8th Division."
    },
    {
        battle: "Battle off Endau",
        coords: { lat: 2.698964, lng: 103.664246 },
        startDate: "01/26/1942",
        endDate: "01/27/1942",
        allies: ["United Kingdom", "Austrslia"],
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: ["Naval", "Aerial"],
        description: "The Battle off Endau was took place off Endau on 26–27 January 1942. Part of the Battle of Malaya, it was the first notable naval engagement since the sinking of the battleship Prince of Wales and the battlecruiser Repulse on 10 December 1941, and the last effort by the Royal Navy to intercept Japanese convoy shipping around the Malay Peninsula."
    },
    {
        battle: "Sinking of Prince of Wales and Repulse",
        coords: { lat: 3.566667, lng: 104.433333 },
        startDate: "12/10/1941",
        endDate: "12/10/1941",
        allies: "United Kingdom",
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: ["Naval", "Aerial"],
        description: "The sinking of Prince of Wales and Repulse was a naval engagement that took place on 10 December 1941 in the South China Sea off the east coast of the British colony of Malaya, 70 miles east of Kuantan, Pahang. The Royal Navy battleship HMS Prince of Wales and battlecruiser HMS Repulse were sunk by land-based bombers and torpedo bombers of the Imperial Japanese Navy."
    },
    {
        battle: "Battle of Bataan",
        coords: { lat: 14.685, lng: 120.4319 },
        startDate: "01/07/1942",
        endDate: "04/09/1942",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Bataan (Filipino: Labanan sa Bataan) (7 January – 9 April 1942) was fought by the United States and the Philippine Commonwealth against Japan during World War II. The battle represented the most intense phase of the Japanese invasion of the Philippines during World War II."
    },
    {
        battle: "Battle of Dražgoše",
        coords: { lat: 46.252114, lng: 14.177228 },
        startDate: "01/09/1942",
        endDate: "01/11/1942",
        allies: "Slovene Partisans",
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Dražgoše was a battle between the Slovene Partisans and Nazi Germany armed forces, which took place between January 9th and 11th, 1942, in the village of Dražgoše in German-annexed Slovenia. This battle was the first direct confrontation between the two. It ended with brutal reprisals of German forces against the villagers and the destruction of the village."
    },
    {
        battle: "Battle of Makassar Strait",
        coords: { lat: -7.5, lng: 115.5 },
        startDate: "02/04/1942",
        endDate: "02/04/1942",
        allies: ["Netherlands", "United States"],
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: ["Naval", "Aerial"],
        description: "The Battle of Makassar Strait, also known as the Action of Madura Strait, the Action North of Lombok Strait and the Battle of the Flores Sea, was a naval battle of the Pacific theater. An American-British-Dutch-Australian (ABDA) fleet—under Schout-bij-nacht (Rear Admiral) Karel Doorman—was on its way to intercept a Japanese invasion convoy reported as bound for Surabaya."
    },
    {
        battle: "Battle of Singapore",
        coords: { lat: 4, lng: 6 },
        startDate: "01/26/1942",
        endDate: "01/27/1942",
        allies: ["United Kingdom", "Austrslia"],
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Singapore, also known as the Fall of Singapore, was fought when the Empire of Japan invaded the British stronghold of Singapore—nicknamed the 'Gibraltar of the East'. Singapore was the major British military base in South-East Asia and was the key to British imperial interwar defence planning for South-East Asia and the South-West Pacific. "
    },
    {
        battle: "Battle of Sarimbun Beach",
        coords: { lat: 1.387, lng: 103.692 },
        startDate: "02/08/1942",
        endDate: "02/09/1942",
        allies: "Austrslia",
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Sarimbun Beach was the first stage of the Japanese assault on Singapore in February 1942 during World War II. Sarimbun Beach, located in the northwestern corner of mainland Singapore, was the area in which Japanese troops, under the overall direction of Lieutenant-General Tomoyuki Yamashita, first attacked Allied forces (predominantly British) in Singapore."
    },
    {
        battle: "Battle of Kranji",
        coords: { lat: 1.439255, lng: 103.737601 },
        startDate: "02/09/1942",
        endDate: "02/10/1942",
        allies: "Austrslia",
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Kranji was the second stage of the Empire of Japan's plan for the invasion of Singapore, the Imperial Japanese Army assaulted the north-western front of Singapore. Their primary objective was to secure a second beachhead in order to breach the Jurong-Kranji defence line as part of their southward thrust towards the heart of Singapore City."
    },
    {
        battle: "Battle of Bukit Timah",
        coords: { lat: 1.34869, lng: 103.777022 },
        startDate: "02/10/1942",
        endDate: "02/12/1942",
        allies: ["United Kingdom", "British Raj", "Austrslia"],
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Bukit Timah (10–12 February 1942), was part of the final stage of the Empire of Japan's invasion of Singapore during World War II."
    },
    {
        battle: "Battle of Pasir Panjang",
        coords: { lat: 1.283333, lng: 103.766667 },
        startDate: "02/12/1942",
        endDate: "02/15/1942",
        allies: ["United Kingdom", "British Malaya", "British Raj"],
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Pasir Panjang, which took place between 12 and 15 February 1942, was part of the final stage of the Empire of Japan's invasion of Singapore during World War II. The battle was initiated upon the advancement of elite Imperial Japanese Army forces towards Pasir Panjang Ridge on 13 February."
    },
    {
        battle: "Battle of the Java Sea",
        coords: { lat: -5, lng: 111 },
        startDate: "02/27/1942",
        endDate: "02/27/1942",
        allies: ["United Kingdom", "British Raj", "British Malaya", "Austrslia"],
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: "Naval",
        description: "The Battle of the Java Sea was a decisive naval battle of the Pacific campaign of World War II. Allied navies suffered a disastrous defeat at the hand of the Imperial Japanese Navy, on 27 February 1942, and in secondary actions over successive days. The American-British-Dutch-Australian Command (ABDACOM) Strike Force commander— Dutch Rear-Admiral Karel Doorman—was killed."
    },
    {
        battle: "Battle of Badung Strait",
        coords: { lat: -8.630556, lng: 115.388056 },
        startDate: "02/18/1942",
        endDate: "02/20/1942",
        allies: ["Netherlands", "United States", "United Kingdom"],
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: "Naval",
        description: "The Battle of Badung Strait was a naval battle of the Pacific campaign, fought in Badung Strait between the American-British-Dutch-Australian Command and the Imperial Japanese Navy. In the engagement, the four Japanese destroyers defeated an Allied force that outnumbered and outgunned them, sinking the Dutch destroyer Piet Hein and escorting two transports to safety."
    },
    {
        battle: "Battle of Java",
        coords: { lat: -7.491667, lng: 110.004444 },
        startDate: "02/28/1942",
        endDate: "03/12/1942",
        allies: ["Netherlands", "United Kingdom", "Australia", "United States"],
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Java (Invasion of Java, Operation J) was a battle of the Pacific theatre of World War II. It occurred on the island of Java from 28 February – 12 March 1942. It involved forces from the Empire of Japan, which invaded on 28 February 1942, and Allied personnel. Allied commanders signed a formal surrender at Japanese headquarters at Bandung on 12 March."
    },
    {
        battle: "Indian Ocean raid",
        coords: { lat: -20, lng: 80 },
        startDate: "03/31/1942",
        endDate: "04/10/1942",
        allies: ["United Kingdom", "Austrslia", "Netherlands", "United States", "Canada"],
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: ["Naval", "Aerial"],
        description: "The Indian Ocean raid, also known as Operation C or Battle of Ceylon in Japanese, was a naval sortie carried out by the Imperial Japanese Navy (IJN) from 31 March to 10 April 1942. Japanese aircraft carriers under Admiral Chūichi Nagumo struck Allied shipping and naval bases around Ceylon, but failed to locate and destroy the bulk of the British Eastern Fleet."
    },
    {
        battle: "Battle of Christmas Island",
        coords: { lat: -10.483333, lng: 105.633333 },
        startDate: "03/31/1942",
        endDate: "04/01/1942",
        allies: ["United Kingdom", "Austrslia", "British Raj", "United States"],
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: ["Ground", "Naval"],
        description: "The Battle of Christmas Island was a small engagement. Assisted by a mutiny by soldiers of the British Indian Army against their British officers, Imperial Japanese Army troops were able to occupy Christmas Island without any land-based resistance. The United States Navy submarine Seawolf caused severe damage to the Imperial Japanese Navy cruiser Naka during the landings."
    },
    {
        battle: "Battle of Corregidor",
        coords: { lat: 14.6667, lng: 120.417 },
        startDate: "05/26/1942",
        endDate: "05/27/1942",
        allies: ["United States", "The Philippines"],
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: ["Ground", "Naval"],
        description: "The Battle of Corregidor (Filipino: Labanan sa Corregidor), fought May 5–6, 1942, was the culmination of the Japanese campaign for the conquest of the Commonwealth of the Philippines during World War II. The fall of Bataan on April 9, 1942, ended all organized opposition by the U.S. Army Forces Far East to the invading Japanese forces on Luzon, in the northern Philippines."
    },
    {
        battle: "Japanese invasion of Burma",
        coords: { lat: 21.197532, lng: 96.518256 },
        startDate: "12/05/1941",
        endDate: "05/10/1942",
        allies: ["United Kingdom", "British Raj", "Burma", "Republic of China"],
        adversaries: ["Empire of Japan", "Thailand"],
        victor: "e",
        battleType: ["Ground", "Aerial"],
        description: "The Japanese invasion of Burma was the opening phase of the Burma campaign, which took place over four years from 1942 to 1945. During the first year of the campaign, the Japanese Army drove British Empire and Chinese forces out of Burma, then began the Japanese occupation of Burma and formed a nominally independent Burmese administrative government."
    },
    {
        battle: "Battle of Nanos",
        coords: { lat: 45.798544, lng: 14.065158 },
        startDate: "04/18/1942",
        endDate: "04/18/1942",
        allies: "Yugoslavia",
        adversaries: "Kingdom of Italy",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Nanos took place on Nanos Plateau when Italian soldiers laid siege to Slovene Partisans. 10 Partisans were killed and 11 captured, while the rest pierced the ring. This was one of the first battles between the Partisan insurgence in the Slovene Littoral, and the Italian Army, and was the beginning of the struggle for the western border between the two nations."
    },
    {
        battle: "Doolittle Raid",
        coords: { lat: 34.9, lng: 140 },
        startDate: "04/18/1942",
        endDate: "04/18/1942",
        allies: ["United States", "Republic of China"],
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: ["Aerial", "Naval"],
        description: "The Doolittle Raid was an air raid by the United States on the Japanese capital Tokyo and other places on Honshu. It was the first air operation to strike the Japanese archipelago. It demonstrated that the Japanese mainland was vulnerable to American air attack, served as retaliation for the attack on Pearl Harbor, and provided an important boost to American morale."
    },
    {
        battle: "Battle of the Coral Sea",
        coords: { lat: -18, lng: 158 },
        startDate: "05/04/1942",
        endDate: "05/08/1942",
        allies: ["United States", "Austrslia"],
        adversaries: "Empire of Japan",
        victor: "inconclusive",
        battleType: ["Aerial", "Naval"],
        description: "The Battle of the Coral Sea was a major naval battle between the Imperial Japanese Navy and naval and air forces of the United States and Australia. Taking place in the Pacific Theatre, the battle is significant as the first action in which aircraft carriers engaged each other and the first in which the opposing ships neither sighted nor fired directly upon one another."
    },
    {
        battle: "Battle of Gazala",
        coords: { lat: 32.145278, lng: 23.3575 },
        startDate: "05/26/1942",
        endDate: "06/21/1942",
        allies: ["United Kingdom", "British Raj", "South Africa", "Free France", "United States"],
        adversaries: ["Kingdom of Italy", "Germany"],
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Gazala (near the modern town of Ayn al Ghazālah عين الغزالة) was fought during the Western Desert Campaign of the Second World War, west of the port of Tobruk in Libya, from 26 May to 21 June 1942. Axis troops of the Panzerarmee Afrika (Generaloberst Erwin Rommel) consisting of German and Italian units fought the British Eighth Army."
    },
    {
        battle: "Battle of Midway",
        coords: { lat: 28.2, lng: -177.35 },
        startDate: "06/04/1942",
        endDate: "06/07/1942",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: ["Aerial", "Naval"],
        description: "The Battle of Midway was a major naval battle in the Pacific Theater of World War II that took place on 4–7 June 1942, six months after Japan’s attack on Pearl Harbor and one month after the Battle of the Coral Sea. The U.S. Navy under Admirals Chester W. Nimitz, Frank J. Fletcher, and Raymond A. Spruance defeated an attacking fleet of the Imperial Japanese Navy."
    },
    {
        battle: "Convoy PQ 17",
        coords: { lat: 69.376937, lng: -1.691111 },
        startDate: "06/27/1942",
        endDate: "07/10/1942",
        allies: ["United Kingdom", "United States", "Soviet Union"],
        adversaries: "Germany",
        victor: "e",
        battleType: ["Naval", "Aerial"],
        description: "PQ 17 was the code name for an Allied Arctic convoy during the Second World War. On 27 June 1942, the ships sailed from Hvalfjord, Iceland, for the port of Arkhangelsk in the Soviet Union. The convoy was located by German forces on 1 July, after which it was shadowed continuously and attacked."
    },
    {
        battle: "Aleutian Islands campaign",
        coords: { lat: 52.8325, lng: 173.0725 },
        startDate: "06/03/1942",
        endDate: "08/15/1943",
        allies: ["United States", "Canada"],
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: ["Ground", "Naval", "Aerial"],
        description: "The Aleutian Islands campaign was a military campaign conducted by the United States and Japan in the Aleutian Islands, part of the Territory of Alaska, in the American theater and the Pacific theater of World War II starting on June 3, 1942."
    },
    {
        battle: "Attack on Sydney Harbour",
        coords: { lat: -33.858333, lng: 151.233333 },
        startDate: "05/31/1942",
        endDate: "06/08/1942",
        allies: ["Austrslia", "United States", "United Kingdom", "Netherlands", "British Raj"],
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Naval",
        description: "In late May and early June 1942, during World War II, submarines belonging to the Imperial Japanese Navy made a series of attacks on the cities of Sydney and Newcastle in New South Wales, Australia. On the night of 31 May – 1 June, three Ko-hyoteki-class midget submarines, (M-14, M-21 and M-24) each with a two-member crew, entered Sydney Harbour."
    },
    {
        battle: "First Battle of El Alamein",
        coords: { lat: 30.833333, lng: 28.95 },
        startDate: "07/01/1942",
        endDate: "07/27/1942",
        allies: ["United Kingdom", "British Raj", "Australia", "New Zealand", "South Africa"],
        adversaries: ["Kingdom of Italy", "Germany"],
        victor: "stalemate",
        battleType: ["Ground", "Aerial"],
        description: "The First Battle of El Alamein was a battle of the Western Desert Campaign of the Second World War, fought in Egypt between Axis forces of the Panzer Army Africa (which included the Afrika Korps under Field Marshal Erwin Rommel) and Allied (British Imperial and Commonwealth) forces (Britain, British India, Australia, South Africa and New Zealand) of the Eighth Army."
    },
    {
        battle: "Second Battle of El Alamein",
        coords: { lat: 4, lng: 6 },
        startDate: "06/26/1942",
        endDate: "06/27/1942",
        allies: ["United Kingdom", "British Raj", "Australia", "New Zealand", "South Africa", "Palestine", "Ceylon", "Free France", "Greece", "United States"],
        adversaries: ["Kingdom of Italy", "Germany"],
        victor: "a",
        battleType: ["Ground", "Aerial"],
        description: "The Second Battle of El Alamein (23 October – 11 November 1942) was a battle of the Second World War that took place near the Egyptian railway halt of El Alamein. The First Battle of El Alamein and the Battle of Alam el Halfa had prevented the Axis from advancing further into Egypt."
    },
    {
        battle: "Siege of Sevastopol",
        coords: { lat: 44.604722, lng: 33.541111 },
        startDate: "10/30/1941",
        endDate: "07/04/1942",
        allies: ["Soviet Union"],
        adversaries: ["Germany", "Romania"],
        victor: "e",
        battleType: "Siege",
        description: "The Siege of Sevastopol also known as the Defence of Sevastopol or the Battle of Sevastopol was a military battle that took place on the Eastern Front of the Second World War. The campaign was fought by the Axis powers of Germany and Romania against the Soviet Union for control of Sevastopol, a port in the Crimea on the Black Sea."
    },
    {
        battle: "Battle of Changsha",
        coords: { lat: 28, lng: 113 },
        startDate: "12/24/1941",
        endDate: "01/15/1942",
        allies: "Republic of China",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The third Battle of Changsha was the first major offensive in China by Imperial Japanese forces following the Japanese attack on the Western Allies. The offensive was originally intended to prevent Chinese forces from reinforcing the British Commonwealth forces engaged in Hong Kong. Gen. Anami was furious about Chinese claims of his defeat in his earlier Changsha Offensive."
    },
    {
        battle: "Kokoda Track campaign",
        coords: { lat: -8.877764, lng: 147.737497 },
        startDate: "07/21/1942",
        endDate: "11/16/1942",
        allies: ["Australia", "United States"],
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The Kokoda Track campaign or Kokoda Trail campaign was part of the Pacific War. The campaign consisted of a series of battles fought in what was then the Australian Territory of Papua. It was primarily a land battle, between the Japanese South Seas Detachment under Major General Tomitarō Horii and Australian and Papuan land forces under command of New Guinea Force."
    },
    {
        battle: "Guadalcanal campaign",
        coords: { lat: -9.445556, lng: 160.020278 },
        startDate: "08/07/1942",
        endDate: "02/09/1943",
        allies: ["United States", "United Kingdom", "Solomon Islands", "Fiji", "Tonga", "Australia", "New Zealand"],
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The Guadalcanal campaign, also known as the Battle of Guadalcanal and codenamed Operation Watchtower by American forces, was a military campaign fought between 7 August 1942 and 9 February 1943 on and around the island of Guadalcanal in the Pacific theater of World War II. It was the first major land offensive by Allied forces against the Empire of Japan."
    },
    {
        battle: "Battle of Savo Island",
        coords: { lat: -9.133333, lng: 159.816667 },
        startDate: "08/08/1942",
        endDate: "08/09/1942",
        allies: ["United States", "Australia"],
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: "Naval",
        description: "The Battle of Savo Island, also known as the First Battle of Savo Island and, in Japanese sources, as the First Battle of the Solomon Sea, and colloquially among Allied Guadalcanal veterans as The Battle of the Five Sitting Ducks, was a naval battle of the Pacific Campaign of World War II between the Imperial Japanese Navy and Allied naval forces."
    },
    {
        battle: "Dieppe Raid",
        coords: { lat: 49.9333, lng: 1.0833 },
        startDate: "08/19/1942",
        endDate: "08/19/1942",
        allies: ["Canada", "United Kingdom", "Free France", "Poland", "Czechoslovakia", "United States"],
        adversaries: "Germany",
        victor: "e",
        battleType: ["Ground", "Naval", "Aerial"],
        description: "Operation Jubilee or the Dieppe Raid (19 August 1942) was an Allied amphibious attack on the German-occupied port of Dieppe, northern France in the Second World War. Over 6,050 infantry, predominantly Canadian, supported by a regiment of tanks, were put ashore from a naval force operating under protection of Royal Air Force (RAF) fighters."
    },
    {
        battle: "Battle of Stalingrad",
        coords: { lat: 48.7, lng: 44.516667 },
        startDate: "08/23/1942",
        endDate: "02/02/1943",
        allies: ["Soviet Russia"],
        adversaries: ["Germany", "Romania", "Kingdom of Italy", "Hungary", "Croatia"],
        victor: "a",
        battleType: ["Ground", "Aerial"],
        description: "In the Battle of Stalingrad (23 Aug 1942 – 2 Feb 1943), Germany and its allies fought the Soviet Union for control of the city of Stalingrad (now Volgograd) in Southern Russia. Marked by fierce close-quarters combat and direct assaults on civilians in air raids, it is one of the bloodiest battles in the history of warfare, with an estimated 2 million total casualties."
    },
    {
        battle: "Battle of the Eastern Solomons",
        coords: { lat: -6.830034, lng: 158.607856 },
        startDate: "08/24/1942",
        endDate: "08/25/1942",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: ["Naval","Aerial"],
        description: "The naval Battle of the Eastern Solomons (also known as the Battle of the Stewart Islands and, in Japanese sources, as the Second Battle of the Solomon Sea) was the third carrier battle of the Pacific campaign of World War II and the second major engagement fought between the United States Navy and the Imperial Japanese Navy during the Guadalcanal campaign."
    },
    {
        battle: "Battle of Milne Bay",
        coords: { lat: -10.366667, lng: 150.5 },
        startDate: "08/25/1942",
        endDate: "09/07/1942",
        allies: ["Australia", "United States"],
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Milne Bay, also known as Operation RE or the Battle of Rabi (ラビの戦い) by the Japanese, was a battle of the Pacific campaign of World War II. Japanese naval infantry troops, known as Kaigun Tokubetsu Rikusentai (Special Naval Landing Forces), with two small tanks attacked the Allied airfields at Milne Bay that had been established on the eastern tip of New Guinea."
    },
    {
        battle: "Battle of Buna–Gona",
        coords: { lat: -8.65, lng: 148.366667 },
        startDate: "11/16/1942",
        endDate: "01/22/1943",
        allies: ["Australia", "United States"],
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Buna–Gona was part of the New Guinea campaign in the Pacific Theatre during World War II. It followed the conclusion of the Kokoda Track campaign and lasted from 16 November 1942 until 22 January 1943. The battle was fought by Australian and United States forces against the Japanese beachheads at Buna, Sanananda and Gona."
    },
    {
        battle: "Battle of Wau",
        coords: { lat: -7.338889, lng: 146.716667 },
        startDate: "01/29/1943",
        endDate: "02/04/1943",
        allies: ["Australia", "United States"],
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Wau was a battle in the New Guinea campaign of World War II. Forces of the Empire of Japan sailed from Rabaul and crossed the Solomon Sea and, despite Allied air attacks, successfully reached Lae, where they disembarked. Japanese troops then advanced overland on Wau, an Australian base that potentially threatened the Japanese positions at Salamaua and Lae."
    },
    {
        battle: "Battle of the Bismarck Sea",
        coords: { lat: -7.25, lng: 148.25 },
        startDate: "03/02/1943",
        endDate: "03/04/1943",
        allies: ["Australia", "United States"],
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of the Bismarck Sea (2–4 March 1943) took place in the South West Pacific Area (SWPA) during World War II when aircraft of the U.S. Fifth Air Force and the Royal Australian Air Force (RAAF) attacked a Japanese convoy carrying troops to Lae, New Guinea. Most of the Japanese task force was destroyed, and Japanese troop losses were heavy."
    },
    {
        battle: "Salamaua–Lae campaign",
        coords: { lat: -7.033333, lng: 147.066667 },
        startDate: "04/22/1943",
        endDate: "09/16/1943",
        allies: ["Australia", "United States"],
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The Salamaua–Lae campaign was a series of actions in the New Guinea campaign of World War II. Australian and United States forces sought to capture two major Japanese bases, one in the town of Lae, and another one at Salamaua. The campaign to take the Salamaua and Lae area began after the successful defence of Wau in late January."
    },
    {
        battle: "Operation Cartwheel",
        coords: { lat: -7.525011, lng: 152.831193 },
        startDate: "06/30/1943",
        endDate: "03/20/1944",
        allies: ["Australia", "Netherlands", "New Zealand", "United States"],
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: ["Ground", "Naval", "Aerial"],
        description: "Operation Cartwheel was a major military operation for the Allies. Cartwheel was an operation aimed at neutralising the major Japanese base at Rabaul. The operation was directed by the Supreme Allied Commander in the South West Pacific Area, General Douglas MacArthur, whose forces had advanced along the northeast coast of New Guinea and occupied nearby islands."
    },
    {
        battle: "Battle of Cape Esperance",
        coords: { lat: -9.15, lng: 159.633333 },
        startDate: "10/11/1942",
        endDate: "10/12/1942",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Naval",
        description: "The Battle of Cape Esperance took place in the Pacific campaign of World War II between the Imperial Japanese Navy and United States Navy. The naval battle was the second of four major surface engagements during the Guadalcanal campaign and took place at the entrance to the strait between Savo Island and Guadalcanal in the Solomon Islands."
    },
    {
        battle: "Battle of the Santa Cruz Islands",
        coords: { lat: -11, lng: 166 },
        startDate: "10/25/1942",
        endDate: "10/27/1942",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: ["Naval", "Aerial"],
        description: "The Battle of the Santa Cruz Islands, sometimes referred to as the Battle of Santa Cruz or Third Battle of Solomon Sea, was the fourth aircraft carrier battle of the Pacific campaign of World War II. It was also the fourth major naval engagement fought between the United States Navy and the Imperial Japanese Navy during the strategically important Guadalcanal campaign."
    },
    {
        battle: "Operation Torch",
        coords: { lat: 35.085, lng: -2.029 },
        startDate: "11/08/1942",
        endDate: "05/13/1943",
        allies: ["United States", "United Kingdom", "British Raj", "Free France", "Canada", "Netherlands", "Australia"],
        adversaries: ["Vichy France", "Germany", "Kingdom of Italy"],
        victor: "a",
        battleType: ["Ground", "Naval"],
        description: "Operation Torchwas an Allied invasion of French North Africa. The French colonies in the area formally aligned with Germany but were of mixed loyalties. Reports indicated that they might support the Allies. American General Dwight D. Eisenhower planned a three-pronged attack on Casablanca (Western), Oran (Center) and Algiers (Eastern), then a rapid move on Tunis."
    },
    {
        battle: "Naval Battle of Guadalcanal",
        coords: { lat: -9.186111, lng: 159.895 },
        startDate: "11/12/1942",
        endDate: "11/15/1942",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: ["Naval", "Aerial"],
        description: "The Naval Battle of Guadalcanal took place from 12–15 November 1942, and was the decisive engagement in a series of naval battles between Allied (primarily American) and Imperial Japanese forces during the months-long Guadalcanal Campaign in the Solomon Islands during World War II. The action consisted of combined air and sea engagements over four days."
    },
    {
        battle: "Battle of Tassafaronga",
        coords: { lat: -9.389369, lng: 160.085886 },
        startDate: "11/30/1942",
        endDate: "11/30/1942",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Naval",
        description: "The Battle of Tassafaronga, sometimes referred to as the Fourth Battle of Savo Island or, in Japanese sources, as the Battle of Lunga Point (ルンガ沖夜戦), was a nighttime naval battle that took place between United States Navy and Imperial Japanese Navy warships during the Guadalcanal Campaign. The battle took place in Ironbottom Sound near the Tassafaronga area on Guadalcanal."
    },
    {
        battle: "Second Battle of Kharkov",
        coords: { lat: 48.9, lng: 37.016667 },
        startDate: "05/12/1942",
        endDate: "05/28/1942",
        allies: ["Soviet Union"],
        adversaries: ["Germany", "Romania", "Hungary", "Kingdom of Italy", "Slovak Republic", "Croatia"],
        victor: "e",
        battleType: ["Ground", "Aerial"],
        description: "The Second Battle of Kharkov was an Axis counter-offensive in the region around Kharkov against the Red Army Izium bridgehead offensive conducted on the Eastern Front. After a winter counter-offensive that drove German troops away from Moscow but depleted the Red Army's reserves, the Kharkov offensive was a new Soviet attempt to expand upon their strategic initiative."
    },
    {
        battle: "Battle of Madagascar",
        coords: { lat: -12.266667, lng: 49.283333 },
        startDate: "05/05/1942",
        endDate: "11/06/1942",
        allies: ["United Kingdom", "British Raj", "South Africa", "Australia", "Netherlands", "Poland"],
        adversaries: ["Vichy France", "Empire of Japan"],
        victor: "a",
        battleType: ["Ground", "Aerial", "Naval"],
        description: "The Battle of Madagascar was the British campaign to capture the Vichy French-controlled island Madagascar during World War II. The seizure of the island by the British was to deny Madagascar's ports to the Imperial Japanese Navy and to prevent the loss or impairment of the Allied shipping routes to India, Australia and Southeast Asia."
    },
    {
        battle: "Battle of Rennell Island",
        coords: { lat: -11.416667, lng: 160.933333 },
        startDate: "01/29/1943",
        endDate: "01/30/1943",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: ["Aerial", "Naval"],
        description: "The Battle of Rennell Island (Japanese: レンネル島沖海戦, Hepburn: Renneru-shima oki kaisen) took place on 29–30 January 1943. It was the last major naval engagement between the United States Navy and the Imperial Japanese Navy during the Guadalcanal Campaign of World War II. It occurred in the South Pacific between Rennell Island and Guadalcanal in the southern Solomon Islands."
    },
    {
        battle: "Third Battle of Kharkov",
        coords: { lat: 49.96, lng: 36.31 },
        startDate: "02/19/1943",
        endDate: "03/15/1943",
        allies: ["Soviet Union", "Czechoslovakia"],
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Third Battle of Kharkov was a series of battles on the Eastern Front of World War II, undertaken by the German Army Group South against the Red Army, around the city of Kharkov. Known to the German side as the Donets Campaign, and in the Soviet Union as the Donbas and Kharkov operations, the German counterstrike led to the recapture of the cities of Kharkov and Belgorod."
    },
    {
        battle: "Battle of Kasserine Pass",
        coords: { lat: 35.2596, lng: 8.7424 },
        startDate: "02/19/1943",
        endDate: "02/24/1943",
        allies: ["United States", "United Kingdom", "Free France"],
        adversaries: ["Germany", "Kingdom of Italy"],
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Kasserine Pass was a series of battles of the Tunisia Campaign of World War II that took place in February 1943. Covering Kasserine Pass, a 2-mile-wide (3.2 km) gap in the Grand Dorsal chain of the Atlas Mountains in west central Tunisia."
    },
    {
        battle: "Case White",
        coords: { lat: 43.6542, lng: 17.7625 },
        startDate: "01/20/1943",
        endDate: "03/15/1943",
        allies: "Yugoslav Partisans",
        adversaries: ["Germany", "Kingdom of Italy", "Croatia", "Chetniks"],
        victor: "a",
        battleType: "Ground",
        description: "Case White, also known as the Fourth Enemy Offensive, was a combined Axis strategic offensive launched against the Yugoslav Partisans throughout occupied Yugoslavia. It was one of the most significant confrontations of WWII in Yugoslavia. The Axis operation prompted the Partisan Supreme Command to enact its plans to drive toward eastern Herzegovina, Sandžak and Montenegro."
    },
    {
        battle: "Battle of the Komandorski Islands",
        coords: { lat: 53.098611, lng: 168.212778 },
        startDate: "03/27/1943",
        endDate: "03/27/1943",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Naval",
        description: "The Battle of the Komandorski Islands was a naval battle between American and Imperial Japanese forces which took place in the North Pacific, south of the Soviet Komandorski Islands. The battle was a daylight surface engagement in which air support played no role and in which the inferior American force escaped greater damage after the Japanese chose to withdraw."
    },
    {
        battle: "Battle of the Bismarck Sea",
        coords: { lat: -7.25, lng: 148.25 },
        startDate: "03/02/1943",
        endDate: "03/04/1943",
        allies: ["United States", "Australia"],
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: ["Aerial", "Naval"],
        description: "The Battle of the Bismarck Sea (2–4 March 1943) took place in the South West Pacific Area (SWPA) during World War II when aircraft of the U.S. Fifth Air Force and the Royal Australian Air Force (RAAF) attacked a Japanese convoy carrying troops to Lae, New Guinea. Most of the Japanese task force was destroyed, and Japanese troop losses were heavy."
    },
    {
        battle: "Battle of the Barents Sea",
        coords: { lat: 73.25, lng: 29 },
        startDate: "12/31/1942",
        endDate: "12/31/1942",
        allies: "United Kingdom",
        adversaries: "Germany",
        victor: "a",
        battleType: "Naval",
        description: "The Battle of the Barents Sea was between warships of the German Navy and British ships escorting a convoy. The action took place in the Barents Sea north of North Cape. The German raiders' failure to inflict significant losses on the convoy infuriated Hitler, who ordered that German naval strategy would henceforth concentrate on the U-boat fleet rather than surface ships."
    },
    {
        battle: "Battle of Attu",
        coords: { lat: 52.879075, lng: 173.156889 },
        startDate: "05/11/1943",
        endDate: "05/30/1943",
        allies: ["United States", "Canada"],
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Attu (codenamed Operation Landcrab), which took place on 11–30 May 1943, was a battle fought between forces of the United States, aided by Canadian reconnaissance and fighter-bomber support, and Japan on Attu Island off the coast of the Territory of Alaska as part of the Aleutian Islands Campaign during the American Theater and the Pacific Theater."
    },
    {
        battle: "Warsaw Ghetto Uprising",
        coords: { lat: 52.246111, lng: 20.995833 },
        startDate: "04/19/1943",
        endDate: "05/16/1943",
        allies: ["Jewish Resistance", "Polish Resistance"],
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Warsaw Ghetto Uprising was the 1943 act of Jewish resistance in the Warsaw Ghetto in German-occupied Poland during World War II to oppose Nazi Germany's final effort to transport the remaining ghetto population to Majdanek and Treblinka death camps."
    },
    {
        battle: "Case Black",
        coords: { lat: 43.346111, lng: 18.687778 },
        startDate: "05/15/1943",
        endDate: "06/16/1943",
        allies: "Yugoslav Partisans",
        adversaries:  "MVAC",
        victor: "inconclusive",
        battleType: "Ground",
        description: "Case Black  was a joint attack by the Axis taking place from 15 May to 16 June 1943, which aimed to destroy the main Yugoslav Partisan force, near the Sutjeska river in south-eastern Bosnia. The failure of the offensive marked a turning point for Yugoslavia during World War II. It was also the last major German-Italian joint operation against the partisans."
    },
    {
        battle: "Siege of Turjak",
        coords: { lat: 45.8767, lng: 14.6079 },
        startDate: "09/14/1943",
        endDate: "09/19/1943",
        allies: "Slovene Partisans",
        adversaries: "MVAC",
        victor: "a",
        battleType: "Siege",
        description: "The Siege of Turjak or Battle of Turjak was fought on 19 September 1943 at the Turjak Castle between the Slovene Partisans on one side and the Slovene former units of the Anti-Communist Volunteer Militia (MVAC) and Slovene Chetniks on the other. The MVAC became defunct with the end of Italian rule. The battle followed the Partisan victory at Battle of Grčarice."
    },
    {
        battle: "Battle of Kursk",
        coords: { lat: 51.716667, lng: 36.183333 },
        startDate: "06/05/1943",
        endDate: "08/23/1943",
        allies: "Soviet Union",
        adversaries: "Germany",
        victor: "a",
        battleType: ["Ground", "Aerial"],
        description: "The Battle of Kursk was a Second World War engagement between German and Soviet forces on the Eastern Front near Kursk. The battle began with the launch of the German offensive Operation Citadel on 5 July, which had the objective of pinching off the Kursk salient with attacks on the base of the salient from north and south simultaneously."
    },
    {
        battle: "Allied invasion of Sicily",
        coords: { lat: 37.5, lng: 14 },
        startDate: "07/09/1943",
        endDate: "08/17/1943",
        allies: ["United Kingdom", "British Raj", "United States", "Canada", "Free France", "Australia"],
        adversaries: ["Germany", "Kingdom of Italy"],
        victor: "a",
        battleType: ["Ground", "Aerial"],
        description: "The Allied invasion of Sicily, codenamed Operation Husky, was a major campaign of World War II, in which the Allies took the island of Sicily from the Axis powers (Fascist Italy and Nazi Germany). It began with a large amphibious and airborne operation, followed by a six-week land campaign, and initiated the Italian Campaign."
    },
    {
        battle: "Allied invasion of Italy",
        coords: { lat: 40.683333, lng: 14.766667 },
        startDate: "09/03/1943",
        endDate: "09/17/1943",
        allies: ["United Kingdom", "United States", "Canada"],
        adversaries: ["Germany", "Kingdom of Italy"],
        victor: "a",
        battleType: "Ground",
        description: "The Allied invasion of Italy was the Allied amphibious landing on mainland Italy that took place on 3 September 1943 during the early stages of the Italian campaign of World War II. The operation was undertaken by General Sir Harold Alexander's 15th Army Group and followed the successful Allied Invasion of Sicily."
    },
    {
        battle: "Dodecanese campaign",
        coords: { lat: 38, lng: 25 },
        startDate: "09/08/1943",
        endDate: "11/22/1943",
        allies: ["Kingdom of Italy", "United Kingdom"],
        adversaries: "Germany",
        victor: "e",
        battleType: ["Ground", "Naval"],
        description: "The Dodecanese campaign of World War II was an attempt by Allied forces to capture the Italian-held Dodecanese islands in the Aegean Sea following the surrender of Italy in September 1943, and use them as bases against the German-controlled Balkans."
    },
    {
        battle: "Battle of Kos",
        coords: { lat: 36.7909, lng: 27.0712 },
        startDate: "10/03/1943",
        endDate: "10/04/1943",
        allies: ["Kingdom of Italy", "United Kingdom"],
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Kos (Greek: Μάχη της Κω) was a brief battle in World War II between British/Italian and German forces for control of the Greek island of Kos, in the then Italian-held Dodecanese Islands of the Aegean Sea. The battle was precipitated by the Allied Armistice with Italy."
    },
    {
        battle: "Battle of Leros",
        coords: { lat: 37.131944, lng: 26.852778 },
        startDate: "09/26/1943",
        endDate: "11/16/1943",
        allies: ["Kingdom of Italy", "United Kingdom", "South Africa", "Greece"],
        adversaries: "Germany",
        victor: "e",
        battleType: ["Ground", "Naval", "Aerial"],
        description: "The Battle of Leros was the central event of the Dodecanese campaign of the Second World War, and is widely used as an alternate name for the whole campaign. After the Armistice of Cassibile the Italian garrison on the Greek island Leros was strengthened by British forces on 15 September 1943."
    },
    {
        battle: "Battle of Smolensk",
        coords: { lat: 54.783333, lng: 32.05 },
        startDate: "08/07/1943",
        endDate: "10/02/1943",
        allies: "Soviet Union",
        adversaries: "Germany",
        victor: "a",
        battleType: "Ground",
        description: "The second Battle of Smolensk was a Soviet strategic offensive operation conducted by the Red Army as part of the Summer-Autumn Campaign of 1943. Staged almost simultaneously with the Lower Dnieper Offensive, the offensive lasted two months and was led by General Andrei Yeremenko, commanding the Kalinin Front, and Vasily Sokolovsky, commanding the Western Front."
    },
    {
        battle: "Battle of Kiev",
        coords: { lat: 50.45, lng: 30.523333 },
        startDate: "11/03/1943",
        endDate: "11/22/1943",
        allies: ["Soviet Union", "Czechoslovakia"],
        adversaries: "Germany",
        victor: "a",
        battleType: "Ground",
        description: "The Second Battle of Kiev was a part of a much wider Soviet offensive in Ukraine known as the Battle of the Dnieper involving three strategic operations by the Soviet Red Army and one operational counterattack by the Wehrmacht, which took place between 3 November and 22 December 1943."
    },
    {
        battle: "Second Raid on Schweinfurt",
        coords: { lat: 50.05, lng: 10.233333 },
        startDate: "10/14/1943",
        endDate: "10/14/1943",
        allies: "United States",
        adversaries: "Germany",
        victor: "e",
        battleType: "Aerial",
        description: "The second Schweinfurt raid was a World War II air battle that took place on 14 October 1943, over Nazi Germany between forces of the United States 8th Air Force and German Luftwaffe fighter arm (Jagdwaffe). The American bombers conducted a strategic bombing raid on ball bearing factories to reduce production of these vital parts for all manner of war machines."
    },
    {
        battle: "Schweinfurt–Regensburg mission",
        coords: { lat: 50.05, lng: 10.233333 },
        startDate: "08/17/1943",
        endDate: "08/17/1943",
        allies: ["United States", "United Kingdom"],
        adversaries: "Germany",
        victor: "e",
        battleType: "Aerial",
        description: "The Schweinfurt–Regensburg mission was a strategic bombing mission carried out by bombers of the U.S. Army Air Forces. The mission was an ambitious plan to cripple the German aircraft industry; it was also known as the 'double-strike mission' because it entailed two large forces of bombers attacking separate targets in order to disperse fighter reaction by the Luftwaffe."
    },
    {
        battle: "Battle of Berlin",
        coords: { lat: 52.516667, lng: 13.416667 },
        startDate: "11/18/1943",
        endDate: "03/31/1944",
        allies: ["United Kingdom", "Canada", "Australia", "New Zealand", "Poland"],
        adversaries: "Germany",
        victor: "inconclusive",
        battleType: "Bombing",
        description: "The Battle of Berlin was a series of attacks on Berlin by RAF Bomber Command along with raids on other German cities to keep German defences dispersed. Air Chief Marshal Sir Arthur Harris, AOC-in-C Bomber Command, believed that 'We can wreck Berlin from end to end if the USAAF come in with us. It will cost us between 400 and 500 aircraft. It will cost Germany the war'."
    },
    {
        battle: "Battle of Tarawa",
        coords: { lat: 1.426944, lng: 172.975556 },
        startDate: "11/20/1943",
        endDate: "11/23/1943",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Tarawa was a battle in the Pacific Theater of World War II. It took place at the Tarawa Atoll in the Gilbert Islands, and was part of Operation Galvanic, the U.S. invasion of the Gilberts. Nearly 6,400 Japanese, Koreans, and Americans died in the fighting, mostly on and around the small island of Betio, in the extreme southwest of Tarawa Atoll."
    },
    {
        battle: "Battle of Makin",
        coords: { lat: 3.07, lng: 172.789 },
        startDate: "11/20/1943",
        endDate: "11/24/1943",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: ["Ground", "Naval"],
        description: "The Battle of Makin was an engagement of the Pacific campaign of World War II, fought from 20 to 24 November 1943, on Makin Atoll in the Gilbert Islands. On 10 December 1941, three days after the attack on Pearl Harbor, 300 Japanese troops plus laborers of the Gilberts Invasion Special Landing Force had arrived off Makin Atoll and occupied it without resistance."
    },
    {
        battle: "Bernhardt Line",
        coords: { lat: 41.4, lng: 13.983333 },
        startDate: "12/01/1943",
        endDate: "01/15/1944",
        allies: ["United Kingdom", "British Raj", "United States", "New Zealand", "Canada", "Free France"],
        adversaries: "Germany",
        victor: "a",
        battleType: "Ground",
        description: "The Bernhardt Line (Reinhard Line) was a German defensive line in Italy during the Italian Campaign of World War II. Having reached the Bernhardt Line at the start of December 1943, it took until mid-January 1944 for the U.S. Fifth Army to fight their way to the next line of defences, the Gustav Line. The line was defended by XIV Panzer Corps, part of the German Tenth Army."
    },
    {
        battle: "Moro River Campaign",
        coords: { lat: 42.3286, lng: 14.4246 },
        startDate: "12/04/1943",
        endDate: "01/04/1944",
        allies: ["United Kingdom", "British Raj", "Canada", "New Zealand"],
        adversaries: "Germany",
        victor: "a",
        battleType: "Ground",
        description: "The Moro River Campaign was an important battle of the Italian Campaign during the Second World War, fought between elements of the British Eighth Army and LXXVI Panzer Corps (LXXVI Panzerkorps) of the German 10th Army (10. Armee). Lasting from 4 December 1943 to 4 January 1944, the campaign occurred primarily in the vicinity of the Moro River in eastern Italy."
    },
    {
        battle: "Battle of Ortona",
        coords: { lat: 42.35, lng: 14.4 },
        startDate: "12/20/1943",
        endDate: "12/28/1943",
        allies: "Canada",
        adversaries: "Germany",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Ortona was a battle fought between two battalions of elite German Fallschirmjäger (paratroops) from the German 1st Parachute Division, and assaulting Canadian troops from the Canadian 1st Infantry Division under Major General Chris Vokes, most of whom were fresh recruits whose baptism of fire was during the Invasion of Sicily."
    },
    {
        battle: "Battle of Meiktila and Mandalay",
        coords: { lat: 22, lng: 96 },
        startDate: "01/10/1944",
        endDate: "03/20/1944",
        allies: ["United Kingdom", "British Raj", "United States"],
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The concurrent Battle of Meiktila and Battle of Mandalay were decisive engagements near the end of the Burma Campaign during World War II. Collectively, they are sometimes referred to as the Battle of Central Burma. Despite logistical difficulties, the Allies were able to deploy large armoured and mechanised forces in Central Burma, and also possessed air supremacy."
    },
    {
        battle: "Battle of Monte Cassino",
        coords: { lat: 41.483333, lng: 13.816667 },
        startDate: "01/17/1944",
        endDate: "05/18/1944",
        allies: ["United Kingdom", "British Raj", "United States", "Free France", "Poland", "Canada", "New Zealand", "South Africa", "Kingdom of Italy"],
        adversaries: "Germany",
        victor: "a",
        battleType: ["Ground", "Aerial"],
        description: "The Battle of Monte Cassino (also known as the Battle for Rome and the Battle for Cassino) was a costly series of four assaults by the Allies against the Winter Line in Italy held by Axis forces during the Italian Campaign of World War II. The intention was a breakthrough to Rome."
    },
    {
        battle: "Battle of Monte Castello",
        coords: { lat: 44.221806, lng: 10.954222 },
        startDate: "11/25/1944",
        endDate: "02/21/1945",
        allies: ["Brazil", "United States"],
        adversaries: "Germany",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Monte Castello (part of Operation Encore) was an engagement that took place from 25 November 1944 to 21 February 1945 during the Italian campaign of World War II. It was fought between the Allied forces advancing into northern Italy and the dug-in German defenders. The battle marked the Brazilian Expeditionary Force's entry into the land war in Europe."
    },
    {
        battle: "Battle of Anzio",
        coords: { lat: 41.443022, lng: 12.624979 },
        startDate: "01/22/1944",
        endDate: "06/05/1944",
        allies: ["United States", "Kingdom of Italy", "United Kingdom", "Canada"],
        adversaries: "Germany",
        victor: "a",
        battleType: ["Ground", "Aerial"],
        description: "The Battle of Anzio was a battle of the Italian Campaign of World War II that took place from January 22, 1944 (beginning with the Allied amphibious landing known as Operation Shingle) to June 5, 1944 (ending with the capture of Rome). The operation was opposed by German forces in the area of Anzio and Nettuno."
    },
    {
        battle: "Battle of Cisterna",
        coords: { lat: 41.4, lng: 13.98 },
        startDate: "01/30/1944",
        endDate: "02/02/1944",
        allies: "United States",
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Battle of Cisterna took place during World War II, on 30 January–2 February 1944, near Cisterna, Italy, as part of the Battle of Anzio, part of the Italian Campaign. The battle was a clear German victory which also had repercussions on the employment of U.S. Army Rangers that went beyond the immediate tactical and strategic results of the battle."
    },
    {
        battle: "Battle of Kwajalein",
        coords: { lat: 8.716667, lng: 167.733333 },
        startDate: "01/31/1944",
        endDate: "02/03/1944",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Kwajalein was fought as part of the Pacific campaign of World War II. It took place from 31 January – 3 February 1944, on Kwajalein Atoll in the Marshall Islands. Employing the hard-learned lessons of the Battle of Tarawa, the United States launched a successful twin assault on the main islands of Kwajalein in the south and Roi-Namur in the north."
    },
    {
        battle: "Battle of the Admin Box",
        coords: { lat: 20.93208, lng: 92.449349 },
        startDate: "02/05/1944",
        endDate: "02/23/1944",
        allies: ["United Kingdom", "British Raj"],
        adversaries: ["Empire of Japan", "Free India"],
        victor: "a",
        battleType: ["Ground", "Aerial"],
        description: "The Battle of the Admin Box took place on the southern front of the Burma Campaign in the South-East Asian Theatre of World War II. Japanese forces attempted a local counter-attack against an Allied offensive with the aim of drawing Allied reserves from the Central Front in Assam, where the Japanese were preparing their own major offensive."
    },
    {
        battle: "Battle of Eniwetok",
        coords: { lat: 11.465, lng: 162.189 },
        startDate: "02/17/1944",
        endDate: "02/23/1944",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: ["Ground", "Naval"],
        description: "The Battle of Eniwetok was a battle of the Pacific campaign, fought between 17 February 1944 and 23 February 1944, on Enewetok Atoll in the Marshall Islands. The invasion of Eniwetok followed the American success in the Battle of Kwajalein to the southeast. Capture of Eniwetok would provide an airfield and harbor to support attacks on the Mariana Islands to the northwest."
    },
    {
        battle: "Battle of Imphal",
        coords: { lat: 24.8167, lng: 93.95 },
        startDate: "03/08/1944",
        endDate: "07/03/1944",
        allies: ["United Kingdom", "British Raj"],
        adversaries: ["Empire of Japan", "Free India"],
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Imphal took place in the region around Imphal. Japanese armies attempted to destroy the Allied forces at Imphal and invade India, but were driven back into Burma with heavy losses. Together with the simultaneous Battle of Kohima on the road by which the encircled Allied forces at Imphal were relieved, the battle was the turning point of the Burma campaign."
    },
    {
        battle: "Battle of Kohima",
        coords: { lat: 25.66639, lng: 94.10035 },
        startDate: "04/04/1944",
        endDate: "06/22/1944",
        allies: ["United Kingdom", "British Raj", "Nepal"],
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Kohima (together with the intertwined Battle of Imphal) proved the turning point of the Japanese U-Go offensive into India in 1944 during the Second World War of 1939–1945. The battle took place in three stages from 4 April to 22 June 1944 around the town of Kohima, the capital of Nagaland in northeast India."
    },
    {
        battle: "Operation U-Go",
        coords: { lat: 24.810572, lng: 93.978050 },
        startDate: "03/01/1944",
        endDate: "06/28/1944",
        allies: ["United Kingdom", "British Raj"],
        adversaries: ["Empire of Japan", "Free India"],
        victor: "a",
        battleType: "Ground",
        description: "The U Go offensive was the Japanese offensive launched against forces of the British Empire in the northeast Indian regions of Manipur and the Naga Hills. Aimed at the Brahmaputra Valley, through the two towns of Imphal and Kohima, the offensive along with the overlapping Ha Go offensive was one of the last major Japanese offensives during the Second World War."
    },
    {
        battle: "Operation Ichi-Go",
        coords: { lat: 33.9, lng: 113.5 },
        startDate: "04/19/1944",
        endDate: "12/31/1944",
        allies: ["Republic of China", "United States"],
        adversaries: "Empire of Japan",
        victor: "e",
        battleType: "Ground",
        description: "Operation Ichi-Go (一号作戦 Ichi-gō Sakusen, lit. 'Operation Number One') was a campaign of a series of major battles between the Imperial Japanese Army forces and the National Revolutionary Army of the Republic of China, fought from April to December 1944. It consisted of three separate battles in the Chinese provinces of Henan, Hunan and Guangxi."
    },
    {
        battle: "Operation Rösselsprung",
        coords: { lat: 44.37, lng: 16.38 },
        startDate: "05/25/1944",
        endDate: "05/27/1944",
        allies: ["Yugoslav Partisans", "Balkan Air Force"],
        adversaries: ["Germany", "Independant State of Croatia", "Chetniks"],
        victor: "a",
        battleType: ["Ground", "Aerial"],
        description: "Operation Rösselsprung (German: Unternehmen Rösselsprung, Knight's move) was a combined airborne and ground assault by the German XV Mountain Corps and collaborationist forces on the Supreme Headquarters of the Yugoslav Partisans located in the Bosnian town of Drvar in the Independent State of Croatia during World War II. The operation was launched on 25 May 1944."
    },
    {
        battle: "Operation Overlord",
        coords: { lat: 49.169267, lng: -0.497358 },
        startDate: "06/06/1944",
        endDate: "08/30/1944",
        allies: ["United States", "United Kingdom", "Canada", "France", "Poland", "Australia", "New Zealand", "Belgium", "Czechoslovakia", "Greece", "Luxembourg", "Netherlands", "Norway"],
        adversaries: ["Germany", "Italian Social Republic"],
        victor: "a",
        battleType: ["Ground", "Aerial", "Bombing"],
        description: "Operation Overlord was the codename for the Battle of Normandy, the Allied operation that launched the successful invasion of German-occupied Western Europe during World War II. The operation was launched on 6 June 1944 with the Normandy landings. A 1,200-plane airborne assault preceded an amphibious assault involving more than 5,000 vessels."
    },
    {
        battle: "Battle of Saipan",
        coords: { lat: 15.183333, lng: 145.75 },
        startDate: "06/15/1944",
        endDate: "07/09/1944",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Saipan (Operation Forager) was a battle of the Pacific campaign of World War II, fought on the island of Saipan in the Mariana Islands from 15 June to 9 July 1944. It has been referred to as the 'Pacific D-Day' with the invasion fleet departing Pearl Harbor on 5 June 1944, the day before Operation Overlord in Europe was launched, and launching nine days after."
    },
    {
        battle: "Second Battle of Guam",
        coords: { lat: 13.36, lng: 144.65 },
        startDate: "07/21/1944",
        endDate: "08/10/1944",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The Second Battle of Guam (21 July–10 August 1944) was the American recapture of the Japanese-held island of Guam, a U.S. territory in the Mariana Islands captured by the Japanese from the U.S. in the 1941 First Battle of Guam during the Pacific campaign of World War II."
    },
    {
        battle: "Battle of Tinian",
        coords: { lat: 15, lng: 145.633333 },
        startDate: "07/24/1944",
        endDate: "08/01/1944",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: "Ground",
        description: "The Battle of Tinian was a battle of the Pacific campaign of World War II, fought on the island of Tinian in the Mariana Islands from 24 July until 1 August 1944. The 8,000-man Japanese garrison was eliminated, and the island joined Saipan and Guam as a base for the Twentieth Air Force."
    },
    {
        battle: "Operation Bagration",
        coords: { lat: 53, lng: 27 },
        startDate: "06/23/1944",
        endDate: "08/19/1944",
        allies: ["Soviet Union", "Poland"],
        adversaries: ["Germany", "Hungary", "Romania"],
        victor: "a",
        battleType: ["Ground", "Aerial"],
        description: "Operation Bagration was the codename for the 1944 Soviet Belorussian Strategic Offensive Operation a military campaign fought between 23 June and 19 August 1944 in Soviet Byelorussia in the Eastern Front of World War II. The Soviet Union destroyed 28 of 34 divisions of Army Group Centre and completely shattered the German front line."
    },
    {
        battle: "Battle of the Philippine Sea",
        coords: { lat: 20, lng: 130 },
        startDate: "06/19/1944",
        endDate: "06/20/1944",
        allies: "United States",
        adversaries: "Empire of Japan",
        victor: "a",
        battleType: ["Aerial", "Naval"],
        description: "The Battle of the Philippine Sea was a major naval battle that eliminated the Imperial Japanese Navy's ability to conduct large-scale carrier actions. It took place during the United States' amphibious invasion of the Mariana Islands during the Pacific War. The battle was the last of five major 'carrier-versus-carrier' engagements between American and Japanese naval forces."
    },
    {
        battle: "Battle of Tali-Ihantala",
        coords: { lat: 60.766667, lng: 28.883333 },
        startDate: "06/25/1944",
        endDate: "07/09/1944",
        allies: "Soviet Union",
        adversaries: ["Finland", "Germany"],
        victor: "e",
        battleType: ["Ground", "Aerial"],
        description: "The Battle of Tali-Ihantala (June 25 to July 9, 1944) was part of the Finnish-Soviet Continuation War (1941–1944), which occurred during World War II. The battle was fought between Finnish forces—using war materiel provided by Germany—and Soviet forces. To date, it is the largest battle in the history of the Nordic countries."
    },
    {
        battle: "Warsaw Uprising",
        coords: { lat: 52.23, lng: 21.010833 },
        startDate: "08/01/1944",
        endDate: "10/02/1944",
        allies: "Polish Underground State",
        adversaries: "Germany",
        victor: "e",
        battleType: "Ground",
        description: "The Warsaw Uprising was a major World War II operation, in the summer of 1944, by the Polish underground resistance, led by the Polish resistance Home Army (Polish: Armia Krajowa), to liberate Warsaw from German occupation. The uprising was timed to coincide with the retreat of the German forces from Poland ahead of the Soviet advance."
    },
];

$("#day").click(function () {
    $("#slider").attr("step", dayStep);
});

$("#week").click(function () {
    $("#slider").attr("step", weekStep);
});

$("#month").click(function () {
    $("#slider").attr("step", monthStep);
});

$("#tmonth").click(function () {
    $("#slider").attr("step", tmonthStep);
});

$("#smonth").click(function () {
    $("#slider").attr("step", smonthStep);
});

$("#slider").click(function() {
    sliderMapChange();
});

$(document).ready(sliderMapChange());

function sliderMapChange() {
    let sliderDif = parseInt(slider.value);
    let dateShown = (1749252879000 - sliderDif) * (-1);
    console.log(dateShown);
    let longDate = new Date(dateShown);
    let longDateStr = JSON.stringify(longDate);
    let shortDate = longDateStr.slice(1, 11);
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
    } else if ($("#slider").attr("step") == tmonthStep) {
        for (i = 0; i < wws.length; i++) {
            let startMsec = Date.parse(wws[i].startDate) - 3942000000;
            let endMsec = Date.parse(wws[i].endDate) + 3942000000;
            console.log("3monthly")
            if (dateShown >= startMsec && dateShown <= endMsec) {
                console.log(wws[i].battle);
                locations.push(wws[i].coords);
            }
        }
    } else {
        for (i = 0; i < wws.length; i++) {
            let startMsec = Date.parse(wws[i].startDate) - 7964545823;
            let endMsec = Date.parse(wws[i].endDate) + 7964545823;
            console.log("6monthly")
            if (dateShown >= startMsec && dateShown <= endMsec) {
                console.log(wws[i].battle);
                locations.push(wws[i].coords);
            }
        }
    }

    initMap();

    locations = [];
};

function setMarkers() {
    let latv = parseFloat(document.getElementById("latitude").value, 10);
    let lngv = parseFloat(document.getElementById("longitude").value, 10);
    console.log(latv, lngv);
    locations.push({ lat: latv, lng: lngv });
    console.log(locations);
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
                stylers: [{ color: "#b9d3c2" }],
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#92998d" }],
            },
        ],
        { name: "War Style" }
    );

    let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 2.3,
        center: {
            lat: 20.047867,
            lng: 12.898272
        },
        mapTypeControlOptions: {
            mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "styled_map"],
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        },
    });
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

    // const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // const image = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
    const image = {
        url:
            "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(20, 32),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32),
    };
    // Shapes define the clickable region of the icon. The type defines an HTML
    // <area> element 'poly' which traces out a polygon as a series of X,Y points.
    // The final coordinate closes the poly by connecting to the first coordinate.
    const shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: "poly",
    };

    let markers = locations.map(function (location, i) {

        const startDate = wws.find(x => x.coords === location).startDate;
        const endDate = wws.find(x => x.coords === location).endDate;
        const description = wws.find(x => x.coords === location).description;
        const allies = wws.find(x => x.coords === location).allies;
        const adversaries = wws.find(x => x.coords === location).adversaries;
        const battleType = wws.find(x => x.coords === location).battleType;
        const battleTitle = wws.find(x => x.coords === location).battle;
        const infoContent = battleTitle.toUpperCase();

        const infowindow = new google.maps.InfoWindow({
            content: infoContent,
        });

        const marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            position: location,
            icon: image,
            shape: shape,
            map,
        });

        marker.addListener("click", () => {
            infowindow.open(map, marker);
            map.setZoom(9);
            map.setCenter(marker.getPosition())
            battleInfoDiv(battleTitle, startDate, endDate, description, allies, adversaries, battleType);
        });

        return marker;
    });

    new MarkerClusterer(map, markers, {
        gridSize: 0.1,
        imagePath:
            "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    });
}

function battleInfoDiv(battleTitle, startDate, endDate, description, allies, adversaries, battleType) {
    $("#battleInfoBox").html(
        "<h1>"+battleTitle+"</h1>" +
        "<hr>" +
        "<p>This battle started in "+startDate+".</p>" +
        "<p>This battle ended in "+endDate+".</p>" +
        "<p>"+description+"</p>" +
        "<p>It was fought between "+allies+" and "+adversaries+".</p>" +
        "<p>It was "+battleType+" warfare.</p>"
        );
}