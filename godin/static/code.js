var displayW = document.getElementById("vis-container").clientWidth,
    displayH = document.getElementById("vis-container").clientHeight;

//Initial map object with CARTO tile
var map = new L.Map("map").setView([10,0],2)
  .addLayer(new L.TileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom:18}
		));
L.svg({clickable:true}).addTo(map);

//get an svg to draw our points
var svg = d3.select("#map").select("svg").attr("pointer-events", "auto")
  gc = svg.append("g");
  g = svg.append("g")


//transform map points to d3 paths
var transform = d3.geoTransform({point: projectPoint}),
  path = d3.geoPath().projection(transform);

//transform coordinates to points in leaflet
function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
}


function main(data){
  drawFeatures(toPoints(data));
  d3.json(`${STATIC_PATH}paises-topo-simplify.json`).then(drawCountries);
}


// tooltip vars and functions
//create info box to show company details
var infoDiv = d3.select("#info")
  .append("div")
  .attr("class", "info-box")


//Create a tooltip, hidden at the start
var tooltip = d3.select("body")
  .append("div")
  .attr("class","tooltip");

//Position of the tooltip relative to the cursor
var tooltipOffset = {x: 5, y: -25};

//Move the tooltip to track the mouse
function moveTooltip() {
    tooltip.style("top",(d3.event.pageY+tooltipOffset.y)+"px")
      .style("left",(d3.event.pageX+tooltipOffset.x)+"px");
}

function hideTooltip() {
  tooltip.transition().duration(200)
  .style("display","none");
}

function showTooltip(d) {
  moveTooltip();
  tooltip.style("color","black")
    .transition()
    .duration(500)
    .text(d.properties.name)
    .style("display","flex");

  infoDiv.selectAll("p").remove();

  infoDiv.selectAll("p").data([d.properties.name, d.properties.location, d.properties.website]).enter().append("p")
    .style("color","var(--darkblue)")
    .transition()
    .duration(500)
    .text(k=> {
      return k;
      })
    .style("display","flex");
}



//load data and draw map
d3.csv(`${STATIC_PATH}data.csv`).then(main);

function drawFeatures(data){

  var featureElement = g.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("class","points")
    .on("click",showTooltip)
    .on("mousemove",moveTooltip)
    .on("mouseout",hideTooltip);

    map.on("moveend", update);

    update();

    d3.select("#show-points").on("change", update);
    
    function update(){
      //update polygons
      featureElement.attr("d", path).style("fill-opacity", 0.7)
        .classed("points", k=>{
        if(k.properties.year<+d3.select(".label").text()){
        return true;
        }
        else{
          return false;
        }}
        
        )
        .classed("nopoints",
        k=>{
        if(k.properties.year<+d3.select(".label").text()){
        return false;
        }
        else{
          return true;
        }
        }
        );

      //if box checked, change polygons style
      if(!d3.select("#show-points").property("checked")){
        featureElement.classed("nopoints", true).classed("points", false);
        }
      }
}


function drawCountries(data){
  let = geoData = topojson.feature(data, data.objects.paises).features;

  let featureElement = gc.selectAll("path")
    .data(geoData)
    .enter()
    .append("path")
    .attr("class","country")


    map.on("moveend", update);

    update();

    d3.select("#show-cloropleth").on("change", update);
    
    function update(){
      //update polygons
      featureElement.attr("d", path)
        .style("fill-opacity", 0.5)
        .classed("countries", true)
        .classed("nopoints",false);

      //if box unchecked, change polygons style
      if(!d3.select("#show-cloropleth").property("checked")){
        featureElement.classed("nopoints", true).classed("countries", false);
        }
      }
  }

function toPoints(data){
    let geoms = [];

    for(let p of data){
      if (p.x){
        geoms.push({
            type: "Feature", properties:{
              name: p.name , website: p.website , category: p.category, "location": p.location,  date:p.fecha, info:p.info,
       employees:p.employees, tech:p.tech, companies_partner:p.companies_partner, problem_to_solve:p.problem_to_solve,
       value_ideal_customer:p.value_ideal_customer, "status":p.status, year:p.year_
            },
            geometry:{type:"Point",coordinates:[+p.x,+p.y]}
          });
        }
      }

         return {type:"FeatureCollection", features:geoms};
    }


//slider
var formatDateIntoYear = d3.timeFormat("%Y");
var formatDate = d3.timeFormat("%Y");

var startDate = new Date("1790"),
    endDate = new Date("2021");

var margin = {top:0, right:25, bottom:0, left:25}
  width = d3.min([970, displayW-50]),
  height=100;

var svg = d3.select("#slider")
    .append("svg")
    .attr("class", "slider")
    .attr("height", height)
    .attr("width", width)
    .call(responsivefy);   //https://brendansudol.com/writing/responsive-d3
   //class to make it responsive

var x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, width])
    .clamp(true);

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() { hue(x.invert(d3.event.x)); }));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
    .data(x.ticks(10))
    .enter()
    .append("text")
    .attr("x", x)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function(d) { return d.getFullYear() ; });

var label = slider.append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(formatDate(endDate))
    .attr("x",x(endDate))
    .attr("transform", "translate(0," + (-15) + ")")

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9)
    .attr("cx", x(endDate));

function hue(h) {
  handle.attr("cx", x(h));
  label
    .attr("x", x(h))
    .text(formatDate(h));


  arr1 =  d3.selectAll("path.nopoints");
  arr2 =  d3.selectAll("path.points");

for (k of [arr1,arr2]){
  k.classed("nopoints", d=>{
    if(d.properties.year<(h.getFullYear())){
      return false;
      console.log("nopoints");
      }
    else{
      return true;
      }
    }).classed("points",  d=>{
    if(d.properties.year <(h.getFullYear())){
      return true;
      }
    else{
      return false;
      }
    });}


}

// got the code from https://brendansudol.com/writing/responsive-d3
function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

    // to register multiple listeners for same event type,
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on("resize." + container.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
}
