// We are grabbing this debouncing function from http://www.paulirish.com/2009/throttled-smartresize-jquery-event-handler/
// We want to ensure that if the user resizes the window, we resize our graph accordingly, but rerendering on every resize event
// will crush the browser. We use this debounce function to ensure that we only rerender, at most, every 100ms.
//
(function($,sr){

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          };

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100);
      };
  }
  // smartresize
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');


$(function() {

  //Setting up size parameters
   var margin = {left: 10, right: 20, top: 10, bottom: 30},
      width = 400 + margin.left + margin.right,
      height = 300 + margin.top + margin.bottom;

  //Grabbing a reference to the applet svg and adding gs for the frequency histogram and probability curve
    var svg = d3.select("svg.graph")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("class", "graph")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var bars = svg.append("g").attr("class", "bars"),
        curve = svg.append("g").attr("class", "curve").attr('pointer-events', 'none');


  //Setting up global variable that will be used throughout
  var min = 6,
      max = 16
      mean = (min+max)/2,
      variance = 2,
      sigma = Math.sqrt(variance),
      N = 50000,
      precision = 4;

  var binWidth = 0.5,
      showCurve = false;

  //setting up empty data array
  var   data = [];
  getData(); //populate data


  //set up scales
  var xScale = d3.scale.linear().domain([min, max]).range([margin.left, width - margin.right]),
      yScale = d3.scale.linear().range([height, margin.top+3]);

  //Set up x axis
  // var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

  getAxis(svg, xScale);

  //tabulate data into frequency array based on bins (update function)
  var freqs = updateFrequencies(binWidth);
  updateProbabilities(binWidth);

  updateYScale(yScale, freqs);
  renderFrequencies(bars, freqs, xScale, yScale);
  // renderProbabilities(curve, xScale, yScale);

  d3.selectAll("button.binWidth")
    .on("click", function(){
      binWidth = parseFloat(d3.select(this).attr("data-value"));
      freqs = updateFrequencies(binWidth);
      updateProbabilities(binWidth);
      updateYScale(yScale, freqs);
      renderFrequencies(bars, freqs, xScale, yScale);
      if(showCurve){renderProbabilities(curve, xScale, yScale);}
  });

  d3.select("#show-grades")
    .on("click", function(){
      showCurve = showCurve ? false : true;
      if(showCurve){
          renderProbabilities(curve, xScale, yScale);
        }else{
          curve.selectAll("*").remove();
        }
    });

  function getAxis(graph, scale){
        xAxis = d3.svg.axis()
          .scale(scale)
          .orient('bottom');

        graph.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
        graph.selectAll("path").style("opacity", 0.5);
  }

  function renderFrequencies(svg, freqs, xScale, yScale){
    svg.selectAll("rect").remove();
    var barWidth = (width - margin.left - margin.right)/freqs.length,
        y0 = yScale(0);
    svg.selectAll("rect")
        .data(freqs)
        .enter()
        .append("rect")
          .attr("x", function(d, i){return xScale(min + i * binWidth);})
          .attr("width", barWidth)
          .attr("y", function(d){return yScale(d);})
          .attr("height", function(d){return (y0 - yScale(d))})
          .style("fill", "aqua")
          .style("stroke", "black")
          .style("stroke-width", 1)
          .style("opacity", 0.5)
          .on("mouseover", function(d){
                var bar = d3.select(this)
                bar.style("stroke-width", 3)
                  .style("stroke", "grey");

                svg.append("text")
                  .attr("class", "label")
                  .attr("x", bar.attr("x"))
                  .attr("y", bar.attr("y")-2)
                  .attr("fill", "black")
                  .text(d.toPrecision(5));
                })
          .on("mouseleave", function(d){
                d3.select(this)
                  .style("stroke-width", 1)
                  .style("stroke", "black");

                svg.selectAll("text.label").remove();
                });
  }

  function renderProbabilities(svg, xScale, yScale){
    svg.selectAll("*").remove();

    var line = d3.svg.line()
                .x(function(d) {
                    return xScale(d.q);
                })
                .y(function(d) {
                    return yScale(d.p);
                });

    svg.append("path")
    .datum(data)
    .attr("class", "curve")
    .attr("d", line)
    .style("stroke", "blue")
    .style("stroke-width", "2")
    .style("fill-opacity", "0")
    .style("stroke-opacity", "1");
  }

  function updateYScale(yScale, freqs){
    var pMax = d3.max(data, function(d){return d.p}),
        fMax = d3.max(freqs),
        ttlMax = (pMax > fMax) ? pMax : fMax;

    yScale.domain([0, ttlMax]);
  }

  /*Creates an array of bins with value according to the
  actual frequency of data in each bin as a fraction of the total*/
  function updateFrequencies(binWidth){
    var bins = (max - min + 1)/binWidth;
    var table = Array(bins).fill(0);
    for(var i = 0; i < data.length; i++){
      table[(Math.floor(((data[i].q - min) / binWidth))||0)]++;
    }
    return standardize(table);
  }

  //cdf and erf function courtesy of:
  //http://stackoverflow.com/questions/14846767/std-normal-cdf-normal-cdf-or-error-function
  function cdf(x) {

    return 0.5 * (1 + erf((x - mean) / (Math.sqrt(2 * variance))));
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

  //Turns each frequency in a frequency table into a fraction with a total of 1
  function standardize(table){
    var total = d3.sum(table);
    return table.map(function(d){
      return (d / total);
    });
  }

  function probability(x, binWidth){
    binWidth = binWidth * 50;
      var x1 = (x*100 + binWidth)/100,
          x2 = (x*100 - binWidth)/100;
      return (cdf(x1) - cdf(x2));
  }

  function updateProbabilities(binWidth){
    for(var i = 0; i < data.length; i++){
      d = data[i];
      q = d.q;
      data[i].p = probability(q, binWidth);
    }
  }

  //returns a normal distribution  of N data based on global mean, min, max and variance
  // For i in range min to max:
    // for j in range 0 to prob(i) * N
    // push i
  function getData(){
    //This one is what the instructors want
    for(var i = min; i <= max; i+=0.01){
      pi = probability(i, 0.01);
      ni = Math.floor(pi * N);
      for (var j = 0; j < ni; j++){
        data.push({q: i});
      }
    }
    //this version of the loop actually generates a distribution
    // for(var i = 0; i < N; i++){
    //   data.push({q: normalInRange()}); //fix this
    // }
    return data.sort(function(a, b){return a.q-b.q});
  }

  function normalInRange(){
    var r;
    do{
      r = normal();
    }while (r > max || r < min);
      return r.toPrecision(precision);
  }

  function normal() {
    var V1, V2, S;
    do {
      var U1 = Math.random();
      var U2 = Math.random();
      V1 = 2 * U1 - 1;
      V2 = 2 * U2 - 1;
      S = V1 * V1 + V2 * V2;
    } while (S > 1);
    X = Math.sqrt(-2 * Math.log(S) / S) * V1;
    X = mean + Math.sqrt(variance) * X;
    return X;
  }

});
