


$(document).ready(function(){
	var slider = d3.select("#slider");
	var slider2 = d3.select("#slider2");
	var df = document.getElementById("tbox").value;

	d3.select("#df").text("df = " + df);

	function LogGamma(Z) {
	with (Math) {
		var S=1+76.18009173/Z-86.50532033/(Z+1)+24.01409822/(Z+2)-1.231739516/(Z+3)+.00120858003/(Z+4)-.00000536382/(Z+5);
		var LG= (Z-.5)*log(Z+4.5)-(Z+4.5)+log(S*2.50662827465);
	}
	return LG
}

function Betinc(X,A,B) {
	var A0=0;
	var B0=1;
	var A1=1;
	var B1=1;
	var M9=0;
	var A2=0;
	var C9;
	while (Math.abs((A1-A2)/A1)>.00001) {
		A2=A1;
		C9=-(A+M9)*(A+B+M9)*X/(A+2*M9)/(A+2*M9+1);
		A0=A1+C9*A0;
		B0=B1+C9*B0;
		M9=M9+1;
		C9=M9*(B-M9)*X/(A+2*M9-1)/(A+2*M9);
		A1=A0+C9*A1;
		B1=B0+C9*B1;
		A0=A0/B1;
		B0=B0/B1;
		A1=A1/B1;
		B1=1;
	}
	return A1/A
}

function compute(X_input,df_input) {
    X=eval(X_input)
    df=eval(df_input)
    with (Math) {
		if (df<=0) {
			alert("Degrees of freedom must be positive")
		} else {
			A=df/2;
			S=A+.5;
			Z=df/(df+X*X);
			BT=exp(LogGamma(S)-LogGamma(.5)-LogGamma(A)+A*log(Z)+.5*log(1-Z));
			if (Z<(A+1)/(S+2)) {
				betacdf=BT*Betinc(Z,A,.5)
			} else {
				betacdf=1-BT*Betinc(1-Z,.5,A)
			}
			if (X<0) {
				tcdf=betacdf/2
			} else {
				tcdf=1-betacdf/2
			}
		}
		tcdf=round(tcdf*100000)/100000;
	}
    return tcdf;
}



	var margin = {left: 20, right: 20, top: 10, bottom: 75},
    	width = 500,
    	height = 200;

    var bins = 1000;

    var svg = d3.select("svg.Graph")
			.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "graph")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var graph = svg.append("g").attr("class", "curve"),
    	flags = svg.append("g").attr("class", "flags"),
       	axis = svg.append("g").attr("class", "axis");
       	axislabel = svg.append("text").text("t value").attr("x",(width)/2-30)
       		.attr("y",height + margin.top+margin.bottom/2);
       	graph2 = svg.append("g").attr("class", "curve");

    var controls = d3.select(".Controls"),
    	meanControl = controls.select("#mean"),
    	SDControl = controls.select("#sd"),
    	updateControl = controls.select("#update");
    updateControl.on("click", function(){
    	var mean = parseFloat(meanControl.property("value")),
    		SD 	 = parseFloat(SDControl.property("value"));
    	update(graph, axis, mean, SD);

    });

    var twoTail = true;

    var checkBox = controls.select("input[type='checkbox']")
    				.property('checked', true)
    				.on("click", function(){
    					twoTail = checkBox.property("checked");
    					if(twoTail){

    						$("#update").trigger( "click" );
    					}
    				});



    var mean = 0, SD = 1;

    //update2(graph2, axis, mean, SD);
    update(graph, axis, mean, SD);
    update2(graph2, axis, mean, SD);

    function update2(graph, axis, mean, SD){
   		graph2.selectAll("*").remove();
   		var N = bins,
   			min = mean - (6 * SD),
   			max = mean + (6 * SD);


   		var binWidth = (max - min)/N;

   		var data = getProbabilities2(mean, SD, min, bins, binWidth);

   		var x = d3.scale.linear()
					.domain([min, max])
					.range([margin.left, width - margin.right]),

		y = d3.scale.linear()
				.domain([0, p(mean, mean, SD)])
				.range([height, margin.top]);

		getAxis(x);

		renderCurve(graph2, data, x, y, binWidth, "none", "curve");
   	}


   	function update(graph, axis, mean, SD){
   		graph.selectAll("*").remove();
   		var N = bins,
   			min = mean - (6 * SD),
   			max = mean + (6 * SD);


   		var binWidth = (max - min)/N;

   		var data = getProbabilities(mean, SD, min, bins, binWidth);

   		var x = d3.scale.linear()
					.domain([min, max])
					.range([margin.left, width - margin.right]),

		y = d3.scale.linear()
				.domain([0, p(mean, mean, SD)])
				.range([height, margin.top]);

		getAxis(x);

		renderCurve(graph, data, x, y, binWidth, "blue", "curve");

		addFlags(graph, data, x, y, mean, SD, min, max, binWidth);
   	}

	function addFlags(graph, data, xScale, yScale, mean, SD, binWidth){
		var flags = graph.append("g").attr("class", "flags");

		var lFlag = getFlag(flags, xScale, mean, SD, "left");
			//rFlag = getFlag(flags, xScale, mean, SD, "right");

		addFunctionality(lFlag, data, flags, xScale, yScale, mean, SD, "left", binWidth);
		//addFunctionality(rFlag, data, flags, xScale, yScale, mean, SD, "right", binWidth);

	}

	function addFunctionality(flag, data, graph, xScale, yScale, mean, SD, side, binWidth){

		var max = mean + 6 * SD,
			min = mean - 6 * SD;

		var maxX = xScale(max),
			minX = xScale(min);

		//var otherFlag = graph.select("#" + ((side == "left") ? "right":"left") + ".flag");

		var drag = d3.behavior.drag();

		var enter2 = d3.select("#enter2");
		 enter2.on("click",function(){
  			zbox = document.getElementById("zbox").value;
  			var change = 250+zbox*460/12;
			var thisFlag = d3.select(this);
			move2(flag, change, minX, maxX);
			updatePositionText2(flag, zbox);
            updateSegments(graph, data, xScale, yScale, mean, SD, min, max, binWidth);
  			});

		drag.on("drag", function() {
			var change = d3.event.dx;
			var thisFlag = d3.select(this);
			move(thisFlag, change, minX, maxX);
			updatePositionText(thisFlag, xScale);
			updateSegments(graph, data, xScale, yScale, mean, SD, min, max, binWidth);


		});

		flag.call(drag);

		addXLabel(flag, side, xScale);
		updateSegments(graph, data, xScale, yScale, mean, SD, min, max, binWidth);


		//updateSegments(graph, data, xScale, yScale, mean, SD, min, max, binWidth);
		var leftFlag = graph.select("#left.flag"),
			left = getX(leftFlag, xScale),
		   	left = left.toPrecision(4);

			d3.select("#cdf").text("The area to the left of the t value is: " + compute(left,df).toFixed([4]));
			d3.select("#r-cdf").text("The area to the right of the t value is: " + (1-compute(left,df)).toFixed([4]));

	}

	function move(flag, change, min, max){
		flag.attr("transform", function(d){
            	d.x += change;
	            if(d.x > max) d.x = max;
	            if(d.x < min) d.x = min;
                return "translate(" + [ d.x,0 ] + ")"
            });
    }

    function move2(flag, change, min, max){
		flag.attr("transform", function(d){
            	d.x = change;
	            if(d.x > max) d.x = max;
	            if(d.x < min) d.x = min;
                return "translate(" + [ d.x,0 ] + ")"
            });
    }

    function updateSegments(graph, data, xScale, yScale, mean, SD, min, max, binWidth){

    	graph.selectAll("text.percentile").remove();
    	var leftFlag = graph.select("#left.flag"),
    		//rightFlag = graph.select("#right.flag");

    	left = getX(leftFlag, xScale);
    		//right = getX(rightFlag, xScale);

    	var hash = (bins/(max-min));
    	var leftIndex = Math.floor((left-min) * hash);
		graph.selectAll(".faded").remove();
		var fadeColor = "lightcyan";

    		var arr = data.slice(Math.floor((left-left) * hash), leftIndex);
    		renderCurve(graph, arr, xScale, yScale, binWidth, fadeColor, "faded");

    		showPercentile(leftFlag, left, "left", mean, SD, min, max);
    		//showPercentile(rightFlag, right, "right", mean, SD, min, max);

    }

    function showPercentile(flag, pos, side, mean, SD, min, max){
    	pos = pos.toPrecision(4);
    		df = document.getElementById("tbox").value;
			d3.select("#cdf").text("The area to the left of the t value is: " + compute(pos,df).toFixed([4]));
			d3.select("#r-cdf").text("The area to the right of the t value is: " + (1-compute(pos,df)).toFixed([4]));
    }

	function getFlag(graph, xScale, mean, SD, side){
		var x;

		if(side == "right"){
			x = xScale(mean + SD);
		}else if (side == "left"){
			x = xScale(mean - SD);
		}else{
			alert("error: flag given invalid input");
		}

		var y = 0;
		var flag = graph.append("g")
						.attr("class", "flag")
						.attr("id", side)
						.data([ {"x":x} ])
						.attr("transform", "translate(" + x + "," + y + ")");
		renderFlag(flag, side);
		return flag;
	}

	function updatePositionText(elem, xScale){
		var scaledX = getX(elem, xScale).toPrecision(4);
		elem.select("text.x").text("t value: " + scaledX);
	}

	function updatePositionText2(elem, xScale){
		//var scaledX = getX(elem, xScale).toPrecision(4);
		elem.select("text.x").text("t-value: " + xScale);
	}

	function getX(elem, xScale){
		var reverseScale = d3.scale.linear()
					.domain(xScale.range())
					.range(xScale.domain());
		var pureX = d3.transform(elem.attr("transform")).translate[0];
		return parseFloat((reverseScale(pureX)));
	}

	function addXLabel(flag, side, xScale){
		flag.append("text")
			.attr("class", "x")
			.attr("y", 5)
			.attr("x", ((side == "left") ? (-10) : (10)))
			.attr("fill", "black")
			.attr("text-anchor", ((side == "left") ? "end" : "start"));

		updatePositionText(flag, xScale);
	}

	function renderFlag(g, side){
		var flagWidth = 5;
		var color = ((side == "left") ? "orange" : "orange");
		var flag = g.append("circle")
					.attr("cx", 0)
					.attr("cy", 0)
					.attr("r", flagWidth)
					.style("fill", color),
			pole = g.append("line")
					.attr("y1",height)
					.attr("y2",0)
					.style("stroke", color)
					.style("stroke-width", 2);
	}


	function renderCurve(svg, data, xScale, yScale, binWidth, color, name){
		var area = d3.svg.area()
		    .x(function(d) { return xScale(d.q); })
		    .y0(height)
		    .y1(function(d) { return yScale(d.p); });

	    svg.append("path")
	    .datum(data)
	    .attr("class", "area")
	    .attr("class", name)
	    .attr("d", area)
	    .style("fill", color)
	    .style("stroke", "black")
	    .style("stroke-width", 1);
	}

	function getProbabilities2(mean, SD, min, bins, binWidth){
		var probs = [];
		for(var i = 0; i < bins; i++){
			var q = min + i * binWidth;
			probs.push({q: q, p: p2(q, mean, SD)});
		}
		return probs;
	}

	function p2(val, mean, SD){
	      	var x1 = (val*100 + 10)/100,
	        x2 = (val*100 -10)/100;
	      return (cdf2(x1, mean, SD) - cdf2(x2, mean, SD));
	}

  	function cdf2(val, mean, SD) {

    	return compute(val,1000);
  	}

	function getProbabilities(mean, SD, min, bins, binWidth){
		var probs = [];
		for(var i = 0; i < bins; i++){
			var q = min + i * binWidth;
			probs.push({q: q, p: p(q, mean, SD)});
		}
		return probs;
	}

	function p(val, mean, SD){
	      	var x1 = (val*100 + 10)/100,
	        x2 = (val*100 -10)/100;
	      return (cdf(x1, mean, SD) - cdf(x2, mean, SD));
	}

  	function cdf(val, mean, SD) {

    	return compute(val,df);
  	}

	function erf(val) {
	    // save the sign of x
	    var sign = (val >= 0) ? 1 : -1;
	    val = Math.abs(val);

	    // constants
	    var a1 =  0.254829592;
	    var a2 = -0.284496736;
	    var a3 =  1.421413741;
	    var a4 = -1.453152027;
	    var a5 =  1.061405429;
	    var p  =  0.3275911;

	    // A&S formula 7.1.26
	    var t = 1.0/(1.0 + p*val);
	    var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-val * val);
	    return sign * y; // erf(-x) = -erf(x);
	}

   	function getAxis(scale){

   		axis.selectAll("*").remove();

        xAxis = d3.svg.axis()
          .scale(scale)
          .orient('bottom');

        axis.attr("class", "x axis")
        	.attr("transform", "translate(0," + height + ")")
        	.call(xAxis);
  	}












  	var button = d3.select("#enter");
  button.on("click",function(){
			$("#graph").empty();
			df = document.getElementById("tbox").value;
			d3.select("#df").text("df = " + df);

		var margin = {left: 20, right: 20, top: 10, bottom: 75},
    	width = 500,
    	height = 200;

    var bins = 1000;

    var svg = d3.select("svg.Graph")
			.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "graph")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var graph = svg.append("g").attr("class", "curve"),
    	flags = svg.append("g").attr("class", "flags"),
       	axis = svg.append("g").attr("class", "axis");
       	axislabel = svg.append("text").text("t value").attr("x",(width)/2-30)
       		.attr("y",height + margin.top+margin.bottom/2);
       	graph2 = svg.append("g").attr("class", "curve");

    var controls = d3.select(".Controls"),
    	meanControl = controls.select("#mean"),
    	SDControl = controls.select("#sd"),
    	updateControl = controls.select("#update");
    updateControl.on("click", function(){
    	var mean = parseFloat(meanControl.property("value")),
    		SD 	 = parseFloat(SDControl.property("value"));
    	update(graph, axis, mean, SD);

    });

    var twoTail = true;

    var checkBox = controls.select("input[type='checkbox']")
    				.property('checked', true)
    				.on("click", function(){
    					twoTail = checkBox.property("checked");
    					if(twoTail){

    						$("#update").trigger( "click" );
    					}
    				});



    var mean = 0, SD = 1;

    //update2(graph2, axis, mean, SD);
    update(graph, axis, mean, SD);
    update2(graph2, axis, mean, SD);

    function update2(graph, axis, mean, SD){
   		graph2.selectAll("*").remove();
   		var N = bins,
   			min = mean - (6 * SD),
   			max = mean + (6 * SD);


   		var binWidth = (max - min)/N;

   		var data = getProbabilities2(mean, SD, min, bins, binWidth);

   		var x = d3.scale.linear()
					.domain([min, max])
					.range([margin.left, width - margin.right]),

		y = d3.scale.linear()
				.domain([0, p(mean, mean, SD)])
				.range([height, margin.top]);

		getAxis(x);

		renderCurve(graph2, data, x, y, binWidth, "none", "curve");
   	}


   	function update(graph, axis, mean, SD){
   		graph.selectAll("*").remove();
   		var N = bins,
   			min = mean - (6 * SD),
   			max = mean + (6 * SD);


   		var binWidth = (max - min)/N;

   		var data = getProbabilities(mean, SD, min, bins, binWidth);

   		var x = d3.scale.linear()
					.domain([min, max])
					.range([margin.left, width - margin.right]),

		y = d3.scale.linear()
				.domain([0, p(mean, mean, SD)])
				.range([height, margin.top]);

		getAxis(x);

		renderCurve(graph, data, x, y, binWidth, "blue", "curve");

		addFlags(graph, data, x, y, mean, SD, min, max, binWidth);
   	}

	function addFlags(graph, data, xScale, yScale, mean, SD, binWidth){
		var flags = graph.append("g").attr("class", "flags");

		var lFlag = getFlag(flags, xScale, mean, SD, "left");
			//rFlag = getFlag(flags, xScale, mean, SD, "right");

		addFunctionality(lFlag, data, flags, xScale, yScale, mean, SD, "left", binWidth);
		//addFunctionality(rFlag, data, flags, xScale, yScale, mean, SD, "right", binWidth);

	}

	function addFunctionality(flag, data, graph, xScale, yScale, mean, SD, side, binWidth){

		var max = mean + 6 * SD,
			min = mean - 6 * SD;

		var maxX = xScale(max),
			minX = xScale(min);

		//var otherFlag = graph.select("#" + ((side == "left") ? "right":"left") + ".flag");

		var drag = d3.behavior.drag();

		var enter2 = d3.select("#enter2");
		 enter2.on("click",function(){
  			zbox = document.getElementById("zbox").value;
  			var change = 250+zbox*460/12;
			var thisFlag = d3.select(this);
			move2(flag, change, minX, maxX);
			updatePositionText2(flag, zbox);
            updateSegments(graph, data, xScale, yScale, mean, SD, min, max, binWidth);
  			});

		drag.on("drag", function() {
			var change = d3.event.dx;
			var thisFlag = d3.select(this);
			move(thisFlag, change, minX, maxX);
			updatePositionText(thisFlag, xScale);
			updateSegments(graph, data, xScale, yScale, mean, SD, min, max, binWidth);


		});

		flag.call(drag);

		addXLabel(flag, side, xScale);
		updateSegments(graph, data, xScale, yScale, mean, SD, min, max, binWidth);


		//updateSegments(graph, data, xScale, yScale, mean, SD, min, max, binWidth);
		var leftFlag = graph.select("#left.flag"),
			left = getX(leftFlag, xScale),
		   	left = left.toPrecision(4);

			d3.select("#cdf").text("The area to the left of the t value is: " + compute(left,df).toFixed([4]));
			d3.select("#r-cdf").text("The area to the right of the t value is: " + (1-compute(left,df)).toFixed([4]));

	}

	function move(flag, change, min, max){
		flag.attr("transform", function(d){
            	d.x += change;
	            if(d.x > max) d.x = max;
	            if(d.x < min) d.x = min;
                return "translate(" + [ d.x,0 ] + ")"
            });
    }

    function move2(flag, change, min, max){
		flag.attr("transform", function(d){
            	d.x = change;
	            if(d.x > max) d.x = max;
	            if(d.x < min) d.x = min;
                return "translate(" + [ d.x,0 ] + ")"
            });
    }

    function updateSegments(graph, data, xScale, yScale, mean, SD, min, max, binWidth){

    	graph.selectAll("text.percentile").remove();
    	var leftFlag = graph.select("#left.flag"),
    		//rightFlag = graph.select("#right.flag");

    	left = getX(leftFlag, xScale);
    		//right = getX(rightFlag, xScale);

    	var hash = (bins/(max-min));
    	var leftIndex = Math.floor((left-min) * hash);
		graph.selectAll(".faded").remove();
		var fadeColor = "lightcyan";

    		var arr = data.slice(Math.floor((left-left) * hash), leftIndex);
    		renderCurve(graph, arr, xScale, yScale, binWidth, fadeColor, "faded");

    		showPercentile(leftFlag, left, "left", mean, SD, min, max);
    		//showPercentile(rightFlag, right, "right", mean, SD, min, max);

    }

    function showPercentile(flag, pos, side, mean, SD, min, max){
    	pos = pos.toPrecision(4);
    		df = document.getElementById("tbox").value;
			d3.select("#cdf").text("The area to the left of the t value is: " + compute(pos,df).toFixed([4]));
			d3.select("#r-cdf").text("The area to the right of the t value is: " + (1-compute(pos,df)).toFixed([4]));
    }

	function getFlag(graph, xScale, mean, SD, side){
		var x;

		if(side == "right"){
			x = xScale(mean + SD);
		}else if (side == "left"){
			x = xScale(mean - SD);
		}else{
			alert("error: flag given invalid input");
		}

		var y = 0;
		var flag = graph.append("g")
						.attr("class", "flag")
						.attr("id", side)
						.data([ {"x":x} ])
						.attr("transform", "translate(" + x + "," + y + ")");
		renderFlag(flag, side);
		return flag;
	}

	function updatePositionText(elem, xScale){
		var scaledX = getX(elem, xScale).toPrecision(4);
		elem.select("text.x").text("t value: " + scaledX);
	}

	function updatePositionText2(elem, xScale){
		//var scaledX = getX(elem, xScale).toPrecision(4);
		elem.select("text.x").text("t-value: " + xScale);
	}

	function getX(elem, xScale){
		var reverseScale = d3.scale.linear()
					.domain(xScale.range())
					.range(xScale.domain());
		var pureX = d3.transform(elem.attr("transform")).translate[0];
		return parseFloat((reverseScale(pureX)));
	}

	function addXLabel(flag, side, xScale){
		flag.append("text")
			.attr("class", "x")
			.attr("y", 5)
			.attr("x", ((side == "left") ? (-10) : (10)))
			.attr("fill", "black")
			.attr("text-anchor", ((side == "left") ? "end" : "start"));

		updatePositionText(flag, xScale);
	}

	function renderFlag(g, side){
		var flagWidth = 5;
		var color = ((side == "left") ? "orange" : "orange");
		var flag = g.append("circle")
					.attr("cx", 0)
					.attr("cy", 0)
					.attr("r", flagWidth)
					.style("fill", color),
			pole = g.append("line")
					.attr("y1",height)
					.attr("y2",0)
					.style("stroke", color)
					.style("stroke-width", 2);
	}


	function renderCurve(svg, data, xScale, yScale, binWidth, color, name){
		var area = d3.svg.area()
		    .x(function(d) { return xScale(d.q); })
		    .y0(height)
		    .y1(function(d) { return yScale(d.p); });

	    svg.append("path")
	    .datum(data)
	    .attr("class", "area")
	    .attr("class", name)
	    .attr("d", area)
	    .style("fill", color)
	    .style("stroke", "black")
	    .style("stroke-width", 1);
	}

	function getProbabilities2(mean, SD, min, bins, binWidth){
		var probs = [];
		for(var i = 0; i < bins; i++){
			var q = min + i * binWidth;
			probs.push({q: q, p: p2(q, mean, SD)});
		}
		return probs;
	}

	function p2(val, mean, SD){
	      	var x1 = (val*100 + 10)/100,
	        x2 = (val*100 -10)/100;
	      return (cdf2(x1, mean, SD) - cdf2(x2, mean, SD));
	}

  	function cdf2(val, mean, SD) {

    	return compute(val,1000);
  	}

	function getProbabilities(mean, SD, min, bins, binWidth){
		var probs = [];
		for(var i = 0; i < bins; i++){
			var q = min + i * binWidth;
			probs.push({q: q, p: p(q, mean, SD)});
		}
		return probs;
	}

	function p(val, mean, SD){
	      	var x1 = (val*100 + 10)/100,
	        x2 = (val*100 -10)/100;
	      return (cdf(x1, mean, SD) - cdf(x2, mean, SD));
	}

  	function cdf(val, mean, SD) {

    	return compute(val,df);
  	}

	function erf(val) {
	    // save the sign of x
	    var sign = (val >= 0) ? 1 : -1;
	    val = Math.abs(val);

	    // constants
	    var a1 =  0.254829592;
	    var a2 = -0.284496736;
	    var a3 =  1.421413741;
	    var a4 = -1.453152027;
	    var a5 =  1.061405429;
	    var p  =  0.3275911;

	    // A&S formula 7.1.26
	    var t = 1.0/(1.0 + p*val);
	    var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-val * val);
	    return sign * y; // erf(-x) = -erf(x);
	}

   	function getAxis(scale){

   		axis.selectAll("*").remove();

        xAxis = d3.svg.axis()
          .scale(scale)
          .orient('bottom');

        axis.attr("class", "x axis")
        	.attr("transform", "translate(0," + height + ")")
        	.call(xAxis);
  	}
});


});
