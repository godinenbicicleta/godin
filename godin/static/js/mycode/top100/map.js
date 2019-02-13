//LineChart Class
class MapChart {
    constructor(_parentElement) {
        this.parentElement = _parentElement;
        this.formatDate = d3.timeParse("%Y");

    
        this.initVis();
        
    }

    initVis() {
        let vis = this;
        vis.svg = d3.select(vis.parentElement)
            .select("svg").attr("pointer-events", "auto");
        vis.gc = vis.svg.append("g");
        vis.g = vis.svg.append("g");

        //transform map points to d3 paths
        vis.transform = d3.geoTransform({ point: projectPoint }),
            vis.path = d3.geoPath().projection(vis.transform);

        //Create a tooltip, hidden at the start
        vis.tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip");

        //Create info div, hidden at start
        vis.infoDiv = d3.select("#vis-canvas")
            .append("div")
            .attr("class", "info-div");

        

        //Position of the tooltip relative to the cursor
        vis.tooltipOffset = { x: 5, y: -25 };
        

            vis.wrangleData();
        }

        wrangleData() {
            let vis = this;
            vis.yearStart = vis.formatDate(document.getElementById("dateLabel1").innerText);;
            vis.yearEnd = vis.formatDate(document.getElementById("dateLabel2").innerText);;
            vis.data = formattedData.features.filter(d => 
                { return (
                        d.geometry && 
                        (+vis.formatDate(d.properties.year)<= +vis.yearEnd)
                        && (+vis.formatDate(d.properties.year)>= +vis.yearStart)); 
                
                }
            );

            if(filterName){
                vis.data = vis.data.filter(d=>{
                    return d.properties.name ==filterName;
                });
            }
            if(filterCat){
                vis.data = vis.data.filter(d=>d.properties.cat.includes(filterCat));

            }

            vis.updateVis();
        }

        updateVis() {
            let vis = this;

            //JOIN NEW DATA with old elements 

            vis.comp = vis.g.selectAll("path")
                .data(vis.data,
                    d => d.properties.name); //add key

            //exit old elements not present in new data
            vis.comp.exit()
                .remove();

            //Enter new elements

            vis.comp.enter()
                .append("path")
                .attr("class", "points")
                .style("fill-opacity", 0.7)
                .on("click", showTooltip)
                //.on("mousemove", moveTooltip)
                //.on("mouseout", hideTooltip)
                //UPDATE old elements present in new data
                .merge(vis.comp)
                .attr("d", vis.path);

            function showTooltip(d) {
                //moveTooltip();
                //vis.tooltip
                  //  .html(`<p>${d.properties.name}</p>`)
                    //.transition()
                   // .duration(500)
                   // .style("display", "flex");

                    /*
    name: p.name , website: p.website ,
    category: p.category, "location": p.location,
    date:p.fecha, info:p.info,
     employees:p.employees, tech:p.tech, companies_partner:p.companies_partner,
      problem_to_solve:p.problem_to_solve,
     value_ideal_customer:p.value_ideal_customer,
      "status":p.status, year:+p.year_,
     cat:p.cat.split(","),cx:c_x, cy:c_y,"id":i
                    */

               

                vis.infoDiv
                    .html(`
                    <span id ="close-info" class="close"></span>
                    <div style="display:grid;grid-template-columns: 1fr 1fr;justify-content:center;align-items: center;align-content:center;margin-bottom:5px;">
                    <div style="display:flex;justify-content:center;">
                    <p class="info-div-name" >${d.properties.name}</p>
                    </div>
                    <div style="margin-right:2px;">
                    <p>${d.properties["location"]}</p>
                    <p >${d.properties.date}</p>
                    <p ><span class="label-info-div"></span>${d.properties.employees} employees</p>

                    <p ><a href=${d.properties.website} target="_blank">${d.properties.website}</a></p>
                    </div>
                    </div>
                    <p style="margin-bottom:5px;"><span class="label-info-div">Categories:</span>${d.properties.category}</p>
                    <p style="margin-bottom:5px;"><span class="label-info-div">Tech: </span>${d.properties.tech}</p>
                    <p style="margin-bottom:5px;"><span class="label-info-div">Status: </span>${d.properties.status}</p>
                    `)
                    .transition()
                    .duration(500)
                    .style("display", "flex");
                
                document.getElementById("close-info").addEventListener("click",
                    function(){
                      vis.infoDiv.style("display", "none");
                    })
            }
            function moveTooltip() {
                vis.tooltip.style("top", (d3.event.pageY + vis.tooltipOffset.y) + "px")
                    .style("left", (d3.event.pageX + vis.tooltipOffset.x) + "px");
            }
            function hideTooltip() {
                vis.tooltip.transition().duration(200)
                    .style("display", "none");
            }




        }
    }

function projectPoint(x, y) {
    let point = map.latLngToLayerPoint(new L.LatLng(y, x));

    this.stream.point(point.x, point.y);
}