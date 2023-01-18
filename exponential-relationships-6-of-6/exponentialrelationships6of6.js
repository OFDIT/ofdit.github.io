$(function() {
  // Our SVG container will be 320x320, with 30px of padding on each side for text
  //
  var w = 320;
  var h = 320;
  var padding = 30,
      xMax = 250,
      yMax = 12;

  // All of our grids are from 0.0 to 50.0, and the range is contained excluding the padding to ensure that our
  // grid lines aren't drawn to the edge of the SVG
  //
  var xScale = d3.scale.linear()
    .domain([0.0, xMax])
    .range([padding, w - padding]);

  var yScale = d3.scale.linear()
    .domain([0.0, yMax])
    .range([h - padding, padding]);

  // Define our axises
  //
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(5)
    .tickSize(-h, 0, 0); //Set rough # of ticks

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(5)
    .tickSize(-w, 0, 0);

  var drawGrid = function() {
    // First, we set the default properties for our SVG element, which is contained in the HTML.
    //
    var svg = d3.select("svg")
      .attr("width", w)
      .attr("height", h)

    // Render our axises into the SVG
    //
    svg.append("g")
      .attr("class", "axis") //assign "axis" class
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis);

    // We're putting these 10 pixels in, instead of flush to the left edge of the SVG.
    //
    svg.append("g")
      .attr("class", "axis") //assign "axis" class
      .attr("transform", "translate(15,0)")
      .call(yAxis);

    // Next we render our grid lines:
    //
    var numberOfTicks = 5;
    var yAxisGrid = yAxis.ticks(numberOfTicks)
      .tickSize(w - (padding * 2), 0)
      .tickFormat('')
      .orient("right");

    var xAxisGrid = xAxis.ticks(numberOfTicks)
      .tickSize(-h + (padding * 2), 0)
      .tickFormat('')
      .orient("top");

    svg.append("g")
      .classed('y', true)
      .classed('grid', true)
      .attr('transform', 'translate(' + padding + ', 0)')
      .call(yAxisGrid);

    svg.append("g")
      .classed('x', true)
      .classed('grid', true)
      .attr('transform', 'translate(0, ' + padding + ')')
      .call(xAxisGrid);

    // Lastly, we add some text around the edges of our grid:
    //
    svg.append('text')
      .attr('x', xScale(220))
      .attr('y', h - 10)
      .text('feet')
      .attr('fill', 'black')

    svg.append('text')
      .attr('x', 1)
      .attr('y', 20)
      .text('lumens')
      .attr('fill', 'black')

    // This is for our header of text, we add a few tspans that we can identify by class
    // and modify whenever the sliders change
    //
    var text = svg.append('text')
      .attr('x', 82)
      .attr('y', 20)
      .text('Y = ')
      .attr('font-size', 14)
      .attr('color', 'black')

    text.append('tspan')
      // .text('0')
      .classed('intercept', true)
      .attr('fill', 'red')

    text.append('tspan')
      .text(' * ')

    text.append('tspan')
      // .text('72')
      .attr('fill', 'blue')
      .classed('growth-factor', true)

    text.append('tspan')
      .text("X")
      .attr('y', 15)
      .attr('font-size', 10)
  }

  // This helper function gives us the Y pixel point for the line at any point along the X axis.
  //
  var yPosAtXVal = function(x, C, b) {
    // We need to determine the percent point that our line should start and end on the y axis.
    // This simplifies the process of finding the pixel points that our line will be rendered
    // between.
    //
    var yEndPercent = ((C * Math.pow(b, x))/yMax).toPrecision(3);

        // yEndPercent = 1;

    // var yEndPercent = ((parseFloat($('#intercept').val()) + (parseFloat($('#growth-factor').val()) * x))/5);
    // The paddings make this all a bit grosser than it needs to be, and since we're rendering from the
    // top down (and our graph is drawn from the bottom up), we need to subtract the value from the
    // height.
    //
    return (h - (yEndPercent * (h - (padding * 2)) + padding)).toPrecision(3);
  }

  var drawLine = function() {
    var svg = d3.select('svg');

    // Remove the previous line group, if it exists, and rerender a new one to populate with the new
    // line:
    //
    svg.selectAll('g.line').remove('*');
    var svgContainer = svg.append('g')
      .attr('class', 'line');

    // First we draw our actual line:
    //
    var C = parseFloat($('#intercept').val()).toPrecision(3),
        b = parseFloat($('#growth-factor').val()).toPrecision(3);

    var points = d3.range(0, xMax + 1)
                  .map(function(d){
                  return{x: xScale(d), y: yPosAtXVal(d, C, b)}});

    var d = "M " + xScale(0) + ", " + yPosAtXVal(0, C, b);
    for(var i = 0; i < points.length; i++){
      // if(points[i].y > 0){
        d += " L" + points[i].x + ", " + points[i].y;
      // }
    }

    svgContainer.append('path')
      .attr("d", d)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 3);

    svg.selectAll('tspan.intercept').text($('#intercept').val());
    svg.selectAll('tspan.growth-factor').text($('#growth-factor').val());
  }

  var drawDots = function(){
    // var C = 6,
    //     b = 1.035;

    var data = [[0,   10],
                [5,   9.6],
                [8,   9.2],
                [10,    9.2],
                [12,    9.1],
                [14,    8.8],
                [18,    8.65],
                [25,    8.18],
                [40,    7.1],
                [50,    7.1],
                [55,    6.7],
                [60,    6.1],
                [65,    5.5],
                [70,    5.2],
                [80,    4.9],
                [90,    4.7],
                [100,   4.4],
                [140,   3.1],
                [180,   2.8],
                [195,  1.6],
                [210,   1.5]];

    for(var i = 0; i < data.length; i++){
      var c = data[i];
      // console.log(c.x + " " + c.y);
      svgContainer.append('circle')
                  .attr("cx", xScale(c[0]))
                  .attr("cy", yScale(c[1]))
                  .attr("r", 3)
                  .attr("fill", "red");
    }

  }

    var svg = d3.select('svg');
    var svgContainer = svg.append('g')
                  .attr('class', 'dots');

  function updateLabel(input, name, color){
    d3.select(input.parentNode)
      .select('label')
      .text(name + " = " + input.value)
      .style('color', color);
    drawLine();
  }

  // Initially render our grid, and our line:
  //
  drawGrid();
  drawDots();
  drawLine();

  updateLabel(d3.select('#intercept').node(), 'C', 'red');
  updateLabel(d3.select('#growth-factor').node(), 'b', 'blue');

  // No matter which of our slides changes, we want to call the drawLine element and rerender our line.
  //
  // $('#intercept,#growth-factor').on('input', drawLine);

  d3.select('#intercept').on('input', function(){
    updateLabel(this, 'C', 'red');
    drawLine();
  });

  d3.select('#growth-factor').on('input', function(){
    updateLabel(this, 'B', 'blue');
    drawLine();
  });
});
