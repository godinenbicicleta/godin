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
let diameter_ = radius_*2;
let categorySelected;
let divi;
let idArray = [];
let displayW = document.getElementById("vis-container").clientWidth;
let displayH = document.getElementById("vis-container").clientHeight;

//initialize map
let map = new L.Map("map").setView([10,0],2)
  .addLayer(new L.TileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom:18}
    ));
  
L.svg({clickable:true}).addTo(map);



//---cat-selector--//
let lilis = d3.selectAll("ul li li");
lilis.on("click", function(){
categorySelected=this.getAttribute("value");
circChart.wrangleData();

  divi.html(this.innerHTML)
  .style("text-align","right")
  .style("color", "var(--high)");
});


//clear category selection
document.getElementById("clear-cat").addEventListener("click",
function(){
  categorySelected="None";
  circChart.wrangleData();
  divi.html("")
})

// random shuffle
document.getElementById("random-shuffle").addEventListener("click",
function(){

  circChart.shuffle = true;
  circChart.wrangleData();

  circChart.shuffle=false;

})


//------- date slider ------//

function sliderEnded(h){
  mapChart.wrangleData();
  }

function sliderStarted(h){
  mapChart.wrangleData();
  }

// constructor(_parentElement, _startDate, _endDate){
dateSlider = new DateSlider("#date-slider");

//

//load data
d3.csv(`${STATIC_PATH}/data/geoawesomeness.csv`)
  .then(main)
  .catch(error=>console.log(error));

//main function
function main(data){
  
  
  
  formattedData = toPoints(data);
  mapChart = new MapChart("#map");
  
  map.on("moveend", update);

  function update(){
    mapChart.wrangleData();
    
  }

  circChart = new CircChart("#chart-area");
  divi =d3.select(".shuffle-selector")
  .append("div")
  .style("max-width","200px");
}

function toPoints(data){
  let radius=radius_;
  let geoms = [];
  let c_y;
  let c_x;
  let i=0;
  numNodes = data.length;

  for(let p of data){
    idArray.push(i);
    angle = (i / (numNodes)) * 2 * Math.PI; 
                                           
    c_x = (radius*.6 * Math.cos(angle)); 
    c_y = (radius*.6* Math.sin(angle)); 
    
    if (p.x){
      geoms.push({
          type: "Feature", properties:{
            name: p.name , website: p.website , category: p.category, "location": p.location,  date:p.fecha, info:p.info,
     employees:p.employees, tech:p.tech, companies_partner:p.companies_partner, problem_to_solve:p.problem_to_solve,
     value_ideal_customer:p.value_ideal_customer, "status":p.status, year:+p.year_,
     cat:p.cat.split(","),cx:c_x, cy:c_y,"id":i
          },
          geometry:{type:"Point",coordinates:[+p.x,+p.y]}
        });
        i+=1;
      }
    else{
       geoms.push({
           type: "Feature", properties:{
             name: p.name , website: p.website , category: p.category, "location": p.location,  date:p.fecha, info:p.info,
      employees:p.employees, tech:p.tech, companies_partner:p.companies_partner, problem_to_solve:p.problem_to_solve,
      value_ideal_customer:p.value_ideal_customer, "status":p.status, year:+p.year_,
      cat:p.cat.split(","),cx:c_x, cy:c_y,"id":i
           }
         });
         i+=1;

    }
    
    }

       return {type:"FeatureCollection", features:geoms};
}