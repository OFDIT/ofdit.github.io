$(document).ready(function(){


	//Set up global variables
	var width = 400,
		height = 175,
		height2 = 600,
		colMax = 10,
		margin = {top: 5, right: 25, bottom: 30, left: 25},

		xDomain = [0, 20],
		xRange = [0, width],

		yDomain = [0, colMax+3],
		yRange = [height, 0];

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

	//Functions for creating the dotplot
	function createCanvas(div, width, height, margin){
		var svg = div.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.style("float", "left")
			.style("clear", "both")
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr("class", "canvas");
		return svg;
	}

	function histogramize(data){
		var result = new Array(21);
		for (var i = 0; i < result.length; i++){
			result[i] = 0;
		}
		for (var j = 0; j < data.length; j++){
			result[data[j]]++;
		}
		return result;
	}

	function plotDots(svg, data, x, y){
		var plot = histogramize(data);

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

	function addValues(svg, data, x, y){

		//get min, max, mean and average distance from mean
		var min = d3.min(data),
			max = d3.max(data);

		var mean = d3.mean(data);

		var SD = d3.deviation(data)

		//Now display these values on the plot

		var m = svg.append("g")
					.attr("class", "mean")
					.attr("transform", "translate(" + x(mean) + ")");
		var g = svg.append("g")
					.attr("class", "values");

		minusSD = mean - SD;
		plusSD = mean + SD;

		var h1 = y(4),
			h2 = y(6);

		//add the grey box between +/- ADM
		p = "";
		p += Math.floor(x(minusSD)) + "," + Math.floor(h1);
		p += " " + Math.floor(x(minusSD)) + "," + Math.floor(h2);
		p += " " + Math.floor(x(plusSD)) + "," + Math.floor(h2);
		p += " " + Math.floor(x(plusSD)) + "," + Math.floor(h1);

		g.append("polygon")
			.attr("points", p)
			.style("fill", "grey")
			.style("stroke", "none")
			.attr("id", "mean minus adm to mean plus adm");

		//Add the line between min and max
		g.append('g')
			.attr('class', 'values')
			.append("line")
			.attr("x1", x(min))
			.attr("x2", x(max))
			.attr("y1", h1)
			.attr("y2", h1)
			.style("stroke-width", 2)
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

		var textAnchor;
		textAnchor = (mean >= 2) ? "middle" : "start";
		textAnchor = (mean <= 18) ? textAnchor : "end";
		m.append("text")
			.attr("x", 0)
			.attr("y", y(12))
			.attr("fill", "blue")
			.attr("text-anchor", textAnchor)
			.attr("font-size", 20)
			.text("Mean = " + mean.toFixed(2));

		m.append("text")
			.attr("x", 0)
			.attr("y", y(10))
			.attr("fill", "red")
			.attr("text-anchor", textAnchor)
			.attr("font-size", 20)
			.text("SD = " + SD.toFixed(2));
	}

	function update(svg, data, x, y){
		//clear
		svg.selectAll('.values').remove();
		svg.selectAll('.bar').remove();
		svg.selectAll(".mean").remove();


		if (data.length > 1){
			addValues(svg, data, x, y);
		}
		plotDots(svg, data, x, y);
		return data;
	}

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
		data = update(svg, data, x, y);
	}


	//Global stuff

	// Create scales
	x = d3.scale.linear().domain(xDomain).range(xRange);
	y = d3.scale.linear().domain(yDomain).range(yRange);

	//Set up target dotplot
	var targetDiv = d3.select("#target"),
		targetData = [6,8,12,14,15,15],
		targetSVG = createCanvas(targetDiv, width, height, margin);
		plotDots(targetSVG, targetData, x, y);

	axis(targetSVG, x, y, xDomain[0], xDomain[1], 1);

	//Add labels for mean and standard deviation of target plot:
	targetSVG.append("text")
				.attr("class", "target-mean")
				.attr("x", x(15))
				.attr("y", y(11))
				.attr("font-size", 20)
				.text("Mean = 11.67");

	targetSVG.append("text")
				.attr("class", "target-standard-deviation")
				.attr("x", x(15))
				.attr("y", y(9))
				.attr("font-size", 20)
				.text("SD = 3.83");

	//Set up main dotplot
	var div = d3.select("#applet"),
		data = [],
		svg = createCanvas(div, width, height, margin);
		data = update(svg, data, x, y);

	axis(svg, x, y, xDomain[0], xDomain[1], 1);


	// Set up controls:

	//reset button:
	d3.select("#reset").style("float", "left")
		.style("clear", "both")
		.text("Reset")
		.on("click", function(){
			data = update(svg, [], x, y);
		});

	//slider

var sliderDiv = div.append("div")
					.attr("id", "slider")
					.attr("position", "fixed")
					.attr("left", "100px");

var slider = d3.slider();

slider.min(xDomain[0])
		.max(xDomain[1])
		.ticks(xDomain[1] - xDomain[0])
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
});
