$(document).ready(function(){

	var margin = {left: 10, right: 20, top: 10, bottom: 75},
    	width = 400
    	height = 300;

   	var svg = d3.select("svg.graph")
   				.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("class", "graph")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var graph = svg.append("g");

    var min = 0,
    	max = 20,
    	mean = (min + max)/2,
    	N = 500,
    	binWidth = (max-min)/N;

    var SD = 1;

   	var xScale = d3.scale.linear().domain([min, max]).range([margin.left, width - margin.right]),
      	yScale = d3.scale.linear().domain([0, p(mean, SD)]).range([height, margin.top]);
    getAxis(svg, xScale);

	document.getElementById("StandardDeviation").value = "4";
   	d3.select("#StandardDeviation").on("input", function() {
  		var SD = +this.value;
  		update(graph, SD, xScale, yScale, N, binWidth);
		});

   	var line = d3.svg.line()
                 .x( function(point) { return point.lx; })
                 .y( function(point) { return point.ly; });

    update(graph, 4, xScale, yScale, N, binWidth);

	function addLabel(svg, x, y, text){

		// alert('foo');
		svg.append("text")
			.attr("x", x)
			.attr("y", y)
			.attr("text-anchor", "middle")
			.style("fill", "black")
			.text(text);
    }

	function update(svg, SD, xScale, yScale, N, binWidth){
		var probs = getProbabilities(binWidth, N, SD);
		updateText(SD);
		svg.selectAll("*").remove();
		renderCurve(svg, probs, xScale, yScale, min, binWidth, "#AF851A");
		renderSDEffects(svg, probs, SD, xScale, yScale, N, binWidth);
    	addLabel(svg, xScale(mean), yScale(d3.max(probs)/2), ".68");
	}

	function updateText(SD){
		d3.select(".vals").text("Normal curve: Î¼ = " + mean + " and Ïƒ = " + SD);
		d3.select('#curr').text(SD);

	}

	function renderCurve(svg, data, xScale, yScale, min, binWidth, color){
		var area = d3.svg.area()
		    .x(function(d, i) { return xScale(min + i * binWidth); })
		    .y0(height)
		    .y1(function(d) { return yScale(d); });

	    svg.append("path")
	    .datum(data)
	    .attr("class", "area")
	    .attr("d", area)
	    .style("fill", color)
	    .style("stroke", "black")
	    .style("stroke-width", 1);
	}

	function arrowUp(g, x, y1, y2){
		g.append('line')
			.attr('x1', x)
			.attr('x2', x)
			.attr('y1', y1)
			.attr('y2', y2)
			.style('stroke', 'grey');

		// add the arrowhead
		g.append('line')
			.attr('x1', x-5)
			.attr('x2', x)
			.attr('y1', y1+10)
			.attr('y2', y1)
			.style('stroke', 'grey');

		g.append('line')
			.attr('x1', x+5)
			.attr('x2', x)
			.attr('y1', y1+10)
			.attr('y2', y1)
			.style('stroke', 'grey');
	}

	function renderSDEffects(svg, data, SD, xScale, yScale, N, binWidth){
		var a = mean - SD,
			b = mean + SD,
			hash = (N/(max-min));

		var aIndex = Math.floor(a * hash),
			bIndex = Math.floor(b * hash);

		var arr = data.slice(aIndex, bIndex);
		renderCurve(svg, arr, xScale, yScale, a, binWidth, "#BF55EC");

		var label = svg.append('g').attr('id', 'label');


		addLabel(label, xScale(a), height + (margin.bottom)*0.9, "Î¼ - Ïƒ");
		arrowUp(label,  xScale(a), height + (margin.bottom)*0.3, height + (margin.bottom)*0.75)

	    addLabel(label, xScale(b), height + (margin.bottom)*0.9, "Î¼ + Ïƒ");
		arrowUp(label,  xScale(b), height + (margin.bottom)*0.3, height + (margin.bottom)*0.75)


	    addLabel(label, xScale(mean), height + (margin.bottom)*0.7, "Î¼");
	    arrowUp(label,  xScale(mean), height + (margin.bottom)*0.3, height + (margin.bottom)*0.55)


	}

	function addArrow(svg, arrow){

		var line = d3.svg.line()
		                 .x( function(point) { return point.lx; })
		                 .y( function(point) { return point.ly; });

		var path = svg.append("path")
					.data([arrow])
		    		.attr("class", "arrow")
			    	.style("marker-end", "url(#arrow)")
		    		.attr("d", lineData);

		 var totalLength = path.node().getTotalLength();
}

function lineData(d){
    var points = [
        {lx: d.source.x, ly: d.source.y},
        {lx: d.target.x, ly: d.target.y}
    ];
    return line(points);
}

	function lineData(d){
	    var points = [
	        {lx: d.source.x, ly: d.source.y},
	        {lx: d.target.x, ly: d.target.y}
	    ];
	    return line(points);
	}

	function getProbabilities(binWidth, N, SD){
		var probs = [];
		for(var i = 0; i < N; i++){
			probs.push(p(min + i * binWidth, SD));
		}
		return probs;
	}

	function p(x, SD){
	      	var x1 = (x*100 + 10)/100,
	        x2 = (x*100 -10)/100;
	      return (cdf(x1, SD) - cdf(x2, SD));
	}

  	function cdf(x, SD) {
  		//
    	return 0.5 * (1 + erf((x - mean) / ((Math.sqrt(2) * SD))));
  	}

	function erf(x) {
	    // save the sign of x
	    var sign = (x >= 0) ? 1 : -1;
	    x = Math.abs(x);

	    // constants
	    var a1 =  0.254829592;
	    var a2 = -0.284496736;
	    var a3 =  1.421413741;
	    var a4 = -1.453152027;
	    var a5 =  1.061405429;
	    var p  =  0.3275911;

	    // A&S formula 7.1.26
	    var t = 1.0/(1.0 + p*x);
	    var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
	    return sign * y; // erf(-x) = -erf(x);
	}

   	function getAxis(graph, scale){
        xAxis = d3.svg.axis()
          .scale(scale)
          .orient('bottom');

        graph.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
  	}

})
