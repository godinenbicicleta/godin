//LineChart Class
class CircChart{
  constructor(_parentElement){
    this.parentElement = _parentElement;
    this.initVis();
    this.line = d3.line()
      .x(d=>d.x)
      .y(d=>d.y);
    this.shuffle=false;
    this.t = d3.transition()
    .ease(d3.easeLinear)
    .duration(200);
  }

  initVis(){
    
    let vis = this;
    vis.diameter = diameter_;
    vis.radius = radius_;

    vis.svg = d3.select(vis.parentElement).append("svg")
      .attr("width", vis.diameter)
      .attr("height", vis.diameter)
      .call(responsivefy);
    
    vis.g = vis.svg.append("g")
      .attr("transform",`translate(${vis.radius},${vis.radius})`);
    
    //time parse for x-scale
    vis.parseTime = d3.timeParse("%d/%m/%Y");

    vis.firstDate  = vis.parseTime("12/05/2013");
    vis.lastDate = vis.parseTime("31/10/2017");

    //Line path generator

    vis.circles = vis.g.selectAll('circle')
      .data(formattedData.features, d=>d.properties.id)
      .enter().append('circle')
      .attr("class", "low-circle")
      .attr('r', d=>{return 5;})
      .attr('cx', d=>d.properties.cx)
      .attr('cy',d=>d.properties.cy)

    vis.texts = vis.g.selectAll('text')
        .data(formattedData.features, d=>d.properties.id)
        .enter()
        .append("text")
        .attr("class", "node-label-low")
        .attr("dy", "0.31em")
        .attr("text-anchor", function(d){
          let angle = d.properties.id/numNodes*2*Math.PI;
          if(angle>3*Math.PI/2||angle<Math.PI/2){
            return "start";}
          else{return "end";}
        })
        .attr("transform",function(d){
          let angle = d.properties.id/numNodes*360;
          let res = `rotate(${angle})translate(${vis.radius*.6+8})`
          if(angle>270 || angle <90){
            return res;}
          else{return res+"rotate(180)";}})
        .text(function(d) { 
          let texto = d.properties.name;
          texto = texto.toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');

          if(texto.length>15){
            return (texto.slice(0,20)+"...");
          }
          return texto; }
        );
/*
{ console.log(d.properties.id/numNodes*2*Math.PI);return
   (d.properties.id/numNodes*2*Math.PI) <
   Math.PI/2 ? "start" : "end"; })
*/ 
    vis.wrangleData();
    }
  
  wrangleData(){
    let vis = this;

    vis.cat = categorySelected;
    
    vis.pathData = []

    if(this.shuffle){
      idArray = shuffleArray(idArray);
    }

    formattedData.features.map((d,i)=>{
      d.properties.id=idArray[i];
      if(d.properties.cat.includes(vis.cat)){
        vis.pathData.push([{
          x:vis.radius*.6 * Math.cos((d.properties.id / (numNodes)) * 2 * Math.PI),
          y:vis.radius*.6 * Math.sin((d.properties.id / (numNodes)) * 2 * Math.PI)
        },{x:0,y:0}])
      }

      return d
    })


    vis.updateVis();
    }

  updateVis(){
    let vis = this;

    if(this.shuffle){
      vis.circles.data(formattedData.features)
        .exit()
        .remove();

      vis.circles.enter()
        .merge(vis.circles)
        //.transition(vis.t)
          .attr('cx', d=>{
            return vis.radius*.6 * Math.cos((d.properties.id / (numNodes)) * 2 * Math.PI);
          })
          .attr('cy', d=>{
            return vis.radius*.6 * Math.sin((d.properties.id / (numNodes)) * 2 * Math.PI);
          });

      vis.texts.data(formattedData.features)
        .exit()
        .remove();

      vis.texts.enter()
        .merge(vis.texts)
        //.transition(vis.t)
        .attr("text-anchor", function(d){
          let angle = d.properties.id/numNodes*2*Math.PI;
          if(angle>3*Math.PI/2||angle<Math.PI/2){
            return "start";}
          else{return "end";}
        })
        .attr("transform",function(d){
          let angle = d.properties.id/numNodes*360;
          let res = `rotate(${angle})translate(${vis.radius*.6+8})`
          if(angle>270 || angle <90){
            return res;}
          else{return res+"rotate(180)";}})
        .text(function(d) { 
          let texto = d.properties.name;
          texto = texto.toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');

          if(texto.length>15){
            return (texto.slice(0,20)+"...");
          }
          return texto; }
        );
          

    }

    vis.circles
      .attr("class", function(d){
        if(d.properties.cat.includes(vis.cat)){
          return "circle-high";}
        else{return "circle-low";}
      })
      vis.texts
      .attr("class", function(d){
        if(d.properties.cat.includes(vis.cat)){
          return "node-label-high";}
        else{return "node-label-low";}
      });


    


    //JOIN NEW DATA with old elements 
    vis.lines =  vis.g.selectAll("path")
      .data(vis.pathData, d=>d.id);//ADD KEY
    //exit old elements not present in new data
    vis.lines.exit()
      .remove();
    //Enter new elements

    vis.lines.enter()
      .append("path")
      .attr("fill", "none" )
      .attr("class", "cat-line")
      .attr("stroke-width", "3px")
        //.attr("fill", d=> {return color(d[value]);})
        //UPDATE old elements present in new data
        .merge(vis.lines)
        //.transition(t)
        .transition(vis.t)

        .attr("d", d => vis.line(d) );
  
}
}