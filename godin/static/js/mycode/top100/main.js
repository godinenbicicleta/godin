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

let filterCat="";
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
  autocomplete(document.getElementById("myInput"), names, true);
  autocomplete(document.getElementById("myInput2"), catArray, false);
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



function autocomplete(inp, arr, boli) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a, b, i, val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    //if (!val) { return false;}
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || !val) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });

  inp.addEventListener("click", function (e) {
    var a, b, i, val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");

    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*create a DIV element for each matching element:*/
      b = document.createElement("DIV");
      /*make the matching letters bold:*/
      b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
      b.innerHTML += arr[i].substr(val.length);
      /*insert a input field that will hold the current array item's value:*/
      b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
      /*execute a function when someone clicks on the item value (DIV element):*/
      b.addEventListener("click", function (e) {
        /*insert the value for the autocomplete text field:*/
        inp.value = this.getElementsByTagName("input")[0].value;
        /*close the list of autocompleted values,
        (or any other open lists of autocompleted values:*/
        closeAllLists();
      });
      a.appendChild(b);

    }
  });

  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.key == "ArrowDown") {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.key == "ArrowUp") { //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.key == "Enter") {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {

      if (elmnt != x[i] && (
        elmnt != inp && elmnt != document.getElementById("myInput2")
        )
        ) {
        x[i].parentNode.removeChild(x[i]);

      }
    }
  }
  /*execute a function when someone clicks in the document:*/

  if (boli) {
    document.addEventListener("click", function (e) {
      closeAllLists(e.target);

    });

    document.addEventListener("keydown", function (e) {
      if (e.key == "Escape") {
        closeAllLists(document.body);
      }
    });
  }
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



  let catMap = {"3d technology": "3d technology", "3d visualization": "3d visualization", "Activation": "activation", "Agriculture": "agriculture", "Apps": "apps", "Architecture": "architecture", "Asset tracking": "asset tracking", "Augmented reality": "augmented reality", "Autonomous driving": "autonomous driving", "Blockchain": "blockchain", "Centimeter-accurate gnss sensors for autonomous vehicles": "centimeter-accurate gnss sensors for autonomous vehicles", "Climate risk management (for cities and supply chains)": "climate risk management (for cities and supply chains)", "Commodity risk monitoring": "commodity risk monitoring", "Computer vision": "computer vision", "Construction": "construction", "Decentralization": "decentralization", "Developer tools for the mobility market": "developer tools for the mobility market", "Drone": "drone", "Drones": "drones", "Engineering software": "engineering software", "Gis": "gis", "Gis software development": "gis software development", "Human geography": "human geography", "Indoor mapping": "indoor mapping", "Infrastructure": "infrastructure", "Insurance underwriting/catastrophe modeling/flood certification": "insurance underwriting/catastrophe modeling/flood certification", "Internet of things": "internet of things", "Location data analytics": "location data analytics", "Location intelligence": "location intelligence", "Location-based marketing": "location-based marketing", "Map provider": "map provider", "Mapping": "mapping", "Maps": "maps", "Mobility": "mobility", "Monitoring and evaluation": "monitoring and evaluation", "Navigation": "navigation", "Photogrammetry": "photogrammetry", "Prioritized deforestation alerts": "prioritized deforestation alerts", "Remote sensing": "remote sensing", "Spatial data infrastructure": "spatial data infrastructure", "Surveying": "surveying", "Telco infrastructure planning": "telco infrastructure planning", "Telecommunication": "telecommunication", "Telecommunications": "telecommunications", "Transportation": "transportation", "Urban planning": "urban planning"}