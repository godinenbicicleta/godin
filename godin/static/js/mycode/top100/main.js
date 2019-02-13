/*
d3+leaflet: https://bost.ocks.org/mike/leaflet/
tooltip: https://gist.github.com/siyafrica/5807455bae654ffe89a0
resposive svg: https://brendansudol.com/writing/responsive-d3
slider:https://bl.ocks.org/mbostock/6452972
*/




//global variables
let formattedData;
let circChart;
let numNodes;
let radius_ = 360;
let diameter_ = radius_ * 2;
let categorySelected;
let keyDown = false;
let imputed = false;

let filterCat = "";
let divi;
let names = [];
let idArray = [];
let filterName = "";
let displayW = document.getElementById("vis-container").clientWidth;
let displayH = document.getElementById("vis-container").clientHeight;

//initialize map
let map = new L.Map("map").setView([10, 0], 2)
  .addLayer(new L.TileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 18
    }
  ));

L.svg({ clickable: true }).addTo(map);



//---cat-selector--//
let lilis = d3.selectAll("ul li li");
lilis.on("click", function () {
  categorySelected = this.getAttribute("value");
  circChart.wrangleData();

  divi.html(this.innerHTML)
    .style("text-align", "right")
    .style("color", "var(--high)");
});

//filter name dropdown
document.getElementById("myInput").addEventListener("click", function (e) {
  autocompleteName.clicked = true;
  autocompleteName.wrangleData(e);
 
});
document.getElementById("myInput").addEventListener("input", function (e) {
  autocompleteName.clicked = true;
  autocompleteName.currentFocus = -1;
  autocompleteName.wrangleData(e);
});

document.getElementById("myInput").addEventListener("keydown", function (e) {
  autocompleteName.clicked = false;
  keyDown = true;
  autocompleteName.wrangleData(e);
  keyDown = false;
});


document.addEventListener("click", function (e) {
  autocompleteName.closeAllLists(e.target);

});


document.addEventListener("keydown", function (e) {
  if (e.key == "Escape") {
    autocompleteName.closeAllLists(document.body);
    //mapChart.infoDiv.style("display", "none");
  }
});


//filter cat dropdown


document.getElementById("myInput2").addEventListener("click", function (e) {
  autocompleteCat.clicked = true;
  autocompleteCat.wrangleData(e);
 
});
document.getElementById("myInput2").addEventListener("input", function (e) {
  autocompleteCat.clicked = true;
  autocompleteCat.currentFocus = -1;
  autocompleteCat.wrangleData(e);
});

document.getElementById("myInput2").addEventListener("keydown", function (e) {
  autocompleteCat.clicked = false;
  keyDown = true;
  autocompleteCat.wrangleData(e);
  keyDown = false;
});




//filter by name of company
document.getElementById("filter-name").addEventListener("click", function () {
  filterName = document.getElementById("myInput").value;
  mapChart.wrangleData();
});

document.getElementById("reset-filter-name").addEventListener("click", function () {
  filterName = "";
  mapChart.wrangleData();
  document.getElementById("myInput").value = null;
});


//filter by category
document.getElementById("filter-category").addEventListener("click", function () {
  filterCat = catMap[document.getElementById("myInput2").value];
  mapChart.wrangleData();
});

document.getElementById("reset-filter-category").addEventListener("click", function () {
  filterCat = "";
  mapChart.wrangleData();
  document.getElementById("myInput2").value = null;
});





//clear category selection
document.getElementById("clear-cat").addEventListener("click",
  function () {
    categorySelected = "None";
    circChart.wrangleData();
    divi.html("")
  })



// random shuffle
document.getElementById("random-shuffle").addEventListener("click",
  function () {

    circChart.shuffle = true;
    circChart.wrangleData();

    circChart.shuffle = false;

  })


//------- date slider ------//

function sliderEnded(h) {
  mapChart.wrangleData();
}

function sliderStarted(h) {
  mapChart.wrangleData();
}

// constructor(_parentElement, _startDate, _endDate){
dateSlider = new DateSlider("#date-slider");

//

//load data
d3.csv(`${STATIC_PATH}/data/geoawesomeness.csv`)
  .then(main)
  .catch(error => console.log(error));

//main function
function main(data) {



  formattedData = toPoints(data);
  autocompleteName = new AutoComplete("myInput", "name");
  autocompleteCat = new AutoComplete("myInput2", "cat");
  mapChart = new MapChart("#map");

  map.on("moveend", update);

  function update() {
    mapChart.wrangleData();

  }

  circChart = new CircChart("#chart-area");
  divi = d3.select(".shuffle-selector")
    .append("div")
    .style("max-width", "200px");
}

function toPoints(data) {
  let radius = radius_;
  let geoms = [];
  let c_y;
  let c_x;
  let i = 0;
  numNodes = data.length;

  for (let p of data) {
    names.push(p.name);
    idArray.push(i);
    angle = (i / (numNodes)) * 2 * Math.PI;

    c_x = (radius * .6 * Math.cos(angle));
    c_y = (radius * .6 * Math.sin(angle));

    if (p.x) {
      geoms.push({
        type: "Feature", properties: {
          name: p.name, website: p.website, category: p.category, "location": p.location, date: p.fecha, info: p.info,
          employees: p.employees, tech: p.tech, companies_partner: p.companies_partner, problem_to_solve: p.problem_to_solve,
          value_ideal_customer: p.value_ideal_customer, "status": p.status, year: +p.year_,
          cat: p.cat.split(","), cx: c_x, cy: c_y, "id": i
        },
        geometry: { type: "Point", coordinates: [+p.x, +p.y] }
      });
      i += 1;
    }
    else {
      geoms.push({
        type: "Feature", properties: {
          name: p.name, website: p.website, category: p.category, "location": p.location, date: p.fecha, info: p.info,
          employees: p.employees, tech: p.tech, companies_partner: p.companies_partner, problem_to_solve: p.problem_to_solve,
          value_ideal_customer: p.value_ideal_customer, "status": p.status, year: +p.year_,
          cat: p.cat.split(","), cx: c_x, cy: c_y, "id": i
        }
      });
      i += 1;

    }

  }

  return { type: "FeatureCollection", features: geoms };
}





let catArray = ["3d technology",
  "3d visualization",
  "Activation",
  "Agriculture",
  "Apps",
  "Architecture",
  "Asset tracking",
  "Augmented reality",
  "Autonomous driving",
  "Blockchain",
  "Centimeter-accurate",
  "gnss",
  "sensors for autonomous vehicles",
  "Climate risk",
  "management",
  "(for cities and supply chains)",
  "Commodity risk monitoring",
  "Computer vision",
  "Construction",
  "Decentralization",
  "Developer tools for the mobility",
  "market",
  "Drones",
  "Engineering software",
  "Gis",
  "Gis software development",
  "Human geography",
  "Indoor mapping",
  "Infrastructure",
  "Insurance",
  "underwriting/catastrophe modeling/flood certification",
  "Internet of things",
  "Location data analytics",
  "Location intelligence",
  "Location-based marketing",
  "Map provider",
  "Mapping",
  "Maps",
  "Mobility",
  "Monitoring and evaluation",
  "Navigation",
  "Photogrammetry",
  "Prioritized deforestation alerts",
  "Remote sensing",
  "Spatial data infrastructure",
  "Surveying",
  "Telco infrastructure planning",
  "Telecommunication",
  "Telecommunications",
  "Transportation",
  "Urban planning"]



let catMap = { "3d technology": "3d technology", "3d visualization": "3d visualization", "Activation": "activation", "Agriculture": "agriculture", "Apps": "apps", "Architecture": "architecture", "Asset tracking": "asset tracking", "Augmented reality": "augmented reality", "Autonomous driving": "autonomous driving", "Blockchain": "blockchain", "Centimeter-accurate gnss sensors for autonomous vehicles": "centimeter-accurate gnss sensors for autonomous vehicles", "Climate risk management (for cities and supply chains)": "climate risk management (for cities and supply chains)", "Commodity risk monitoring": "commodity risk monitoring", "Computer vision": "computer vision", "Construction": "construction", "Decentralization": "decentralization", "Developer tools for the mobility market": "developer tools for the mobility market", "Drone": "drone", "Drones": "drones", "Engineering software": "engineering software", "Gis": "gis", "Gis software development": "gis software development", "Human geography": "human geography", "Indoor mapping": "indoor mapping", "Infrastructure": "infrastructure", "Insurance underwriting/catastrophe modeling/flood certification": "insurance underwriting/catastrophe modeling/flood certification", "Internet of things": "internet of things", "Location data analytics": "location data analytics", "Location intelligence": "location intelligence", "Location-based marketing": "location-based marketing", "Map provider": "map provider", "Mapping": "mapping", "Maps": "maps", "Mobility": "mobility", "Monitoring and evaluation": "monitoring and evaluation", "Navigation": "navigation", "Photogrammetry": "photogrammetry", "Prioritized deforestation alerts": "prioritized deforestation alerts", "Remote sensing": "remote sensing", "Spatial data infrastructure": "spatial data infrastructure", "Surveying": "surveying", "Telco infrastructure planning": "telco infrastructure planning", "Telecommunication": "telecommunication", "Telecommunications": "telecommunications", "Transportation": "transportation", "Urban planning": "urban planning" }