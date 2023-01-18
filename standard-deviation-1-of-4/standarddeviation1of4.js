$(document).ready(function(){

d3.slider = function module() {
  "use strict";

  var div, min = 0, max = 100, svg, svgGroup, value, classPrefix, axis,
  height=40, rect,
  rectHeight = 12,
  tickSize = 6,
  margin = {top: 25, right: 25, bottom: 15, left: 25},
  ticks = 0, tickValues, scale, tickFormat, dragger, width,
  range = false,
  callbackFn, stepValues, focus;

  function slider(selection) {
    selection.each(function() {
      div = d3.select(this).classed('d3slider', true);
      width = parseInt(div.style("width"), 10)-(margin.left
                                                + margin.right);

      value = value || min;
      scale = d3.scale.linear().domain([min, max]).range([0, width])
      .clamp(true);

      // SVG
      svg = div.append("svg")
      .attr("class", "d3slider-axis")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left +
            "," + margin.top + ")");

      // Range rect
      svg.append("rect")
      .attr("class", "d3slider-rect-range")
      .attr("width", width)
      .attr("height", rectHeight);

      // Range rect
      if (range) {
        svg.append("rect")
        .attr("class", "d3slider-rect-value")
        .attr("width", scale(value))
        .attr("height", rectHeight);
      }

      // Axis
      var axis = d3.svg.axis()
      .scale(scale)
      .orient("bottom");

      if (ticks != 0) {
        axis.ticks(ticks);
        axis.tickSize(tickSize);
      } else if (tickValues) {
        axis.tickValues(tickValues);
        axis.tickSize(tickSize);
      } else {
        axis.ticks(0);
        axis.tickSize(0);
      }
      if (tickFormat) {
        axis.tickFormat(tickFormat);
      }

      svg.append("g")
      .attr("transform", "translate(0," + rectHeight + ")")
      .call(axis)
      //.selectAll(".tick")
      //.data(tickValues, function(d) { return d; })
      //.exit()
      //.classed("minor", true);

      var values = [value];
      dragger = svg.selectAll(".dragger")
      .data(values)
      .enter()
      .append("g")
      .attr("class", "dragger")
      .attr("transform", function(d) {
        return "translate(" + scale(d) + ")";
      })

      var displayValue = null;
      if (tickFormat) {
        displayValue = tickFormat(value);
      } else {
        displayValue = d3.format(",.0f")(value);
      }

      dragger.append("text")
      .attr("x", 0)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .attr("class", "draggertext")
      .text(displayValue);

      dragger.append("circle")
      .attr("class", "dragger-outer")
      .attr("r", 10)
      .attr("transform", function(d) {
        return "translate(0,6)";
      });

      dragger.append("circle")
      .attr("class", "dragger-inner")
      .attr("r", 4)
      .attr("transform", function(d) {
        return "translate(0,6)";
      });


      // Enable dragger drag
      var dragBehaviour = d3.behavior.drag();
      dragBehaviour.on("drag", slider.drag);
      dragger.call(dragBehaviour);

      // Move dragger on click
      svg.on("click", slider.click);

    });
  }

  slider.draggerTranslateFn = function() {
    return function(d) {
      return "translate(" + scale(d) + ")";
    }
  }

  slider.click = function() {
    var pos = d3.event.offsetX || d3.event.layerX;
    slider.move(pos);
  }

  slider.drag = function() {
    var pos = d3.event.x;
    slider.move(pos+margin.left);
  }

  slider.move = function(pos) {
    var l,u;
    var newValue = scale.invert(pos - margin.left);
    // find tick values that are closest to newValue
    // lower bound
    if (stepValues != undefined) {
      l = stepValues.reduce(function(p, c, i, arr){
        if (c < newValue) {
          return c;
        } else {
          return p;
        }
      });

      // upper bound
      if (stepValues.indexOf(l) < stepValues.length-1) {
        u = stepValues[stepValues.indexOf(l) + 1];
      } else {
        u = l;
      }
      // set values
      var oldValue = value;
      value = ((newValue-l) <= (u-newValue)) ? l : u;
    } else {
      var oldValue = value;
      value = newValue;
    }
    var values = [value];

    // Move dragger
    svg.selectAll(".dragger").data(values)
    .attr("transform", function(d) {
      return "translate(" + scale(d) + ")";
    });

    var displayValue = null;
    if (tickFormat) {
      displayValue = tickFormat(value);
    } else {
      displayValue = d3.format(",.0f")(value);
    }
    svg.selectAll(".dragger").select("text")
    .text(displayValue);

    if (range) {
      svg.selectAll(".d3slider-rect-value")
      .attr("width", scale(value));
    }

    if (callbackFn) {
      callbackFn(slider);
    }
  }

  // Getter/setter functions
  slider.min = function(_) {
    if (!arguments.length) return min;
    min = _;
    return slider;
  };

  slider.max = function(_) {
    if (!arguments.length) return max;
    max = _;
    return slider;
  };

  slider.classPrefix = function(_) {
    if (!arguments.length) return classPrefix;
    classPrefix = _;
    return slider;
  }

  slider.tickValues = function(_) {
    if (!arguments.length) return tickValues;
    tickValues = _;
    return slider;
  }

  slider.ticks = function(_) {
    if (!arguments.length) return ticks;
    ticks = _;
    return slider;
  }

  slider.stepValues = function(_) {
    if (!arguments.length) return stepValues;
    stepValues = _;
    return slider;
  }

  slider.tickFormat = function(_) {
    if (!arguments.length) return tickFormat;
    tickFormat = _;
    return slider;
  }

  slider.value = function(_) {
    if (!arguments.length) return value;
    value = _;
    return slider;
  }

  slider.showRange = function(_) {
    if (!arguments.length) return range;
    range = _;
    return slider;
  }

  slider.callback = function(_) {
    if (!arguments.length) return callbackFn;
    callbackFn = _;
    return slider;
  }

  slider.setValue = function(newValue) {
    var pos = scale(newValue) + margin.left;
    slider.move(pos);
  }

  slider.mousemove = function() {
    var pos = d3.mouse(this)[0];
    var val = slider.getNearest(scale.invert(pos), stepValues);
    focus.attr("transform", "translate(" + scale(val) + ",0)");
    focus.selectAll("text").text(val);
  }

  slider.getNearest = function(val, arr) {
    var l = arr.reduce(function(p, c, i, a){
      if (c < val) {
        return c;
      } else {
        return p;
      }
    });
    var u = arr[arr.indexOf(l)+1];
    var nearest = ((value-l) <= (u-value)) ? l : u;
    return nearest;
  }

  slider.destroy = function() {
    div.selectAll('svg').remove();
    return slider;
  }

  return slider;

};




//This is the new version
var data = [];

//set bounds - CONSTANTS
var width = 400,
	height = 300,
	colMax = 10,
	margin = {top: 20, right: 25, bottom: 30, left: 25},
	xDomain = [0, 20],
	xRange = [0, width],
	yDomain = [0, colMax+3],
	yRange = [height, 0];

//create scales
x = d3.scale.linear().domain(xDomain).range(xRange);
y = d3.scale.linear().domain(yDomain).range(yRange);

//Create canvas
var div = d3.select('#applet');

//reset button
var reset = div.append('button')
				.style("float", "left")
				.style("clear", "both")
				.text("Reset")
				.on("click", function(){
					update([]);
				});

var svg = div.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.style("float", "left")
			.style("clear", "both")
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr("class", "canvas");

// add axis:
function axis(svg, x, y, xMin, xMax, stepSize){
	var g = svg.append('g')
				.attr('class', 'axis');

	var line = g.append('line')
				.attr('x1', x(xMin))
				.attr('x2', x(xMax))
				.attr('y1', y(-1))
				.attr('y2', y(-1))
				.attr('stroke-width', 1)
				.attr('stroke', 'black');

	var nTabs = (xMax - xMin) / stepSize + 1;
	for (var i = 0; i < nTabs; i++){
		xVal = xMin + i * stepSize;
		curr = g.append('g')
				.attr('class', 'tab')
				.attr('transform', 'translate(' + x(xVal) + ')');
		curr.append('line')
				.attr('x1', 0)
				.attr('x2', 0)
				.attr('y1', y(-1))
				.attr('y2', y(-0.5))
				.attr('stroke-width', 1)
				.attr('stroke', 'black');

		curr.append('text')
			.attr('y', y(-2))
			.attr('text-anchor', 'middle')
			.text(xVal);

	}
}

axis(svg, x, y, 0, 20, 1);

//Controls:

// slider
var sliderDiv = div.append("div")
					.attr("id", "slider");

var slider = d3.slider();

slider.min(0)
		.max(20)
		.ticks(20)
		.showRange(true)
		.value(10)
		.stepValues(d3.range(0, 20 + 1, 1));


sliderDiv.call(slider);

// +/- buttons
var buttonsDiv = div.append("div")
					.attr("id", "buttons");

var plusButton = buttonsDiv.append("button")
					.style("float", "left")
					.text("+")
					.on("click", function(){
						increment(slider.value(), +1);
					})
var minusButton = buttonsDiv.append("button")
					.style("float", "right")
					.text("-")
					.on("click", function(){
						increment(slider.value(), -1);
					});

//Functionality:
function increment(curr, add){
	//if positive:
	//increment if its under 10
	if (add > 0){
		var count = 0;
		for (var i = 0; i < data.length; i++){
			if (data[i] == curr){
				count++;
			}
		}
		if (count < colMax){
			data.push(curr);
		}
	} else {
		var index = data.indexOf(curr);
		if (index > -1){
			data.splice(index, 1);
		}
	}
	update(data);
}


function update(values){
	data = values;
	plot = histogramize(data);

	svg.selectAll(".values").remove();
	svg.selectAll(".bar").remove();
	svg.selectAll(".mean").remove();


	if (data.length > 1){
		//clear the dot plot

		var g = svg.append("g")
					.attr("class", "values");
		var m = svg.append("g")
					.attr("class", "mean");

		var mean = d3.mean(data) || 0;

		//create g to work in
		m.attr("transform", "translate(" + x(mean) + ")");

		//compute average distance from mean
		var dm = [];
		for(var i = 0; i < data.length; i++){
			dm.push(Math.abs(mean - data[i]));
		}
		var ADM = d3.mean(dm);

		var min = d3.min(data),
			max = d3.max(data);

		var plusADM = mean + ADM;
		var minusADM = mean - ADM;

		//Add features indicating these values
		var h1 = y(4),
			h2 = y(6);

		//add the grey box between +/- ADM
		p = "";
		p += Math.floor(x(minusADM)) + "," + Math.floor(h1);
		p += " " + Math.floor(x(minusADM)) + "," + Math.floor(h2);
		p += " " + Math.floor(x(plusADM)) + "," + Math.floor(h2);
		p += " " + Math.floor(x(plusADM)) + "," + Math.floor(h1);

		g.append("polygon")
			.attr("points", p)
			.style("fill", "grey")
			.style("stroke", "none")
			.attr("id", "mean minus adm to mean plus adm");

		//Add the line between min and max
		// svg.append('g')
			// .attr('class', 'values')
		g.append("line")
			.attr("x1", x(min))
			.attr("x2", x(max))
			.attr("y1", h1)
			.attr("y2", h1)
			.style("stroke-width", 3)
			.style("stroke", "green")
			.attr("id", "min_to_max");

		//Add mean line
		m.append("line")
			.attr("x1", 0)
			.attr("x2", 0)
			.attr("y1", y(0))
			.attr("y2", y(10))
			.style("stroke-width", 2)
			.style("stroke", "blue")
			.attr("id", "mean");

    var safety = 2;
		meanLabel = m.append("text")
			.attr("x", 0)
			.attr("y", y(12))
			.attr("fill", "blue")
			.attr("text-anchor", (mean > safety ? (mean < 20 - safety ? "middle":"end"): "start"))
			.attr("font-size", 20)
			.text("Mean = " + mean.toFixed(2));

		admLabel = m.append("text")
			.attr("x", 0)
			.attr("y", y(10))
			.attr("fill", "red")
      .attr("text-anchor", (mean > safety ? (mean < 20 - safety ? "middle":"end"): "start"))
			.attr("font-size", 20)
			.text("ADM = " + ADM.toFixed(2));

	}

	svg.selectAll('.bar').remove();

	var bar = svg.selectAll(".bar")
				.data(plot)
				.enter().append("g")
				.attr("class", "bar");
	var dots = bar.selectAll("circle")
				.data(function(d){
					return d3.range(0, d);
				})
				.enter()
				.append("circle")
				.attr("cx", function(d, i, j) {
		      		return x(j);
		      	})
		      	.attr("cy", function(d, i, j) {
		      		return y(d);
		      	})
		      	.attr("r", 4)
		      	.attr("fill", "black");
}

function histogramize(values){
	var result = new Array(21);
	for (var i = 0; i < result.length; i++){
		result[i] = 0;
	}
	for (var j = 0; j < values.length; j++){
		result[values[j]]++;
	}
	return result;
}

});
