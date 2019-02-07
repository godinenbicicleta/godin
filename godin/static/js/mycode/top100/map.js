//LineChart Class
class MapChart {
    constructor(_parentElement) {
        this.parentElement = _parentElement;
        this.formatDate = d3.timeFormat("%Y");
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

        //Position of the tooltip relative to the cursor
        vis.tooltipOffset = { x: 5, y: -25 };
        

            vis.wrangleData();
        }

        wrangleData() {
            let vis = this;
            vis.yearStart = vis.formatDate(document.getElementById("dateLabel1").innerText);;
            vis.yearEnd = vis.formatDate(document.getElementById("dateLabel2").innerText);;
            vis.data = formattedData.features.filter(d => 
                { return d.geometry; }).filter(d=>{

                return (+vis.formatDate(d.properties.year)<= +vis.yearEnd 
                & +vis.formatDate(d.properties.year)>= +vis.yearStart);}
            );

            vis.updateVis();
        }

        updateVis() {
            let vis = this;

            //JOIN NEW DATA with old elements 

            vis.comp = vis.g.selectAll("path")
                .data(vis.data,
                    d => d.properties.id); //add key

            //exit old elements not present in new data
            vis.comp.exit()
                .remove();

            //Enter new elements

            vis.comp.enter()
                .append("path")
                .attr("class", "points")
                .style("fill-opacity", 0.7)
                .on("click", showTooltip)
                .on("mousemove", moveTooltip)
                .on("mouseout", hideTooltip)
                //UPDATE old elements present in new data
                .merge(vis.comp)
                .attr("d", vis.path);

            function showTooltip(d) {
                moveTooltip();
                vis.tooltip.style("color", "black")
                    .html(`<p>${d.properties.name}</p>`)
                    .transition()
                    .duration(500)
                    .style("display", "flex");
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