class DateSlider{
  constructor(_parentElement){
    this.parentElement = _parentElement;
    this.formatDateIntoYear = d3.timeFormat("%Y");
    this.formatDate = d3.timeParse("%Y");
    this.startDate = new Date("1790"),
    this.endDate = new Date("2021");
    this.initVis();

    }

  initVis(){
    let vis = this;
    vis.width = d3.min([970, displayW-50]);
    vis.margin = {top:10, left:30, right:30, bottom:10};

    vis.sh = 50;
    vis.sw = vis.width-vis.margin.right-vis.margin.left;

    vis.tScale = d3.scaleTime()
        .domain([vis.startDate, vis.endDate])
        .range([0, vis.sw])
        .clamp(true);

    vis.svg = d3.select(vis.parentElement)
      .append("svg")
      .attr("class","slider")
      .attr("height",vis.sh)
      .attr("width",vis.width)
      .call(responsivefy);

    vis.slider = vis.svg.append("g")
      .attr("class", "slider")
      .attr("transform", `translate(${vis.margin.left},${vis.sh/2})`);

    vis.slider.append("line")
      .attr("class", "track")
      .attr("x1", vis.tScale.range()[0])
      .attr("x2", vis.tScale.range()[1]);

    vis.overLine = vis.slider.append("line")
      .attr("class", "track-range")
      .attr("x1", vis.tScale.range()[0])
      .attr("x2", vis.tScale.range()[1]);
      
    vis.handleStart = vis.slider.insert("circle", ".track-overlay")
      .attr("class", "handle")
      .attr("r", 9)
      .attr("cx", vis.tScale(vis.startDate))
      .call(d3.drag()
        .on("start.interrupt", function(){vis.handleStart.interrupt();})
        .on("start drag", function(){hueStart(vis.tScale.invert(d3.event.x));})  
      );

    vis.handleEnd = vis.slider.insert("circle", ".track-overlay")
      .attr("class", "handle")
      .attr("r", 9)
      .attr("cx", vis.tScale(vis.endDate))
      .call(d3.drag()
        .on("start.interrupt", function(){vis.handleEnd.interrupt();})
        .on("start drag", function(){hueEnd(vis.tScale.invert(d3.event.x));})  
      );

    function hueStart(h){
        vis.handleStart.attr("cx", vis.tScale(h));

        vis.overLine.attr("x1", vis.tScale(h));
        document.getElementById("dateLabel1").innerText = vis.formatDateIntoYear(h);
        sliderStarted();
      }
    function hueEnd(h){
        vis.handleEnd.attr("cx", vis.tScale(h));
        vis.overLine.attr("x2", vis.tScale(h));
        document.getElementById("dateLabel2").innerText = vis.formatDateIntoYear(h);
        sliderEnded();
      }

    }
  }
