$(document).ready(function(){

    //for dynamic ordering
    d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };


    var margin = {left: 0, right: 10, top: 10, bottom: 35},
            width = 400,
            height = 150;

    var bins = 1000;

    var svg = d3.select("svg.Graph")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "graph")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var curve = svg.append("g").attr("class", "curve"),
         flags = svg.append("g").attr("class", "flags"),
        axis = svg.append("g").attr("class", "axis");

    var shade = svg.append("g").attr("class", "shade");
        flags.moveToFront();

    //get curve
    var mean = 0, SD = 1,
        min = mean - (5 * SD),
        max = mean + (5 * SD),
        binWidth = (max - min)/bins;

    var xScale = d3.scale.linear()
                .domain([min, max])
                .range([margin.left, width - margin.right]),

        xInverse = d3.scale.linear()
                .domain([margin.left, width - margin.right])
                .range([min, max]),

        yScale = d3.scale.linear()
                .domain([0, p(mean, mean, SD)])
                .range([height, margin.top]),

        yInverse = d3.scale.linear()
                .domain([height, margin.top])
                .range([0, p(mean, mean, SD)]);

    getAxis(xScale);

    var data = getProbabilities(mean, SD, min, bins, binWidth);
    renderCurve(curve, data, "#DEF0FF", "curve");

    // create the flags with label on one side
    ax = mean - SD,

    a = createFlag(ax, "a");

    var aDrag = d3.behavior.drag();
    aDrag.on("drag", function(){
        var change = (d3.event.dx);
        var oldX = xScale(ax);
        var newX = oldX + change;
        newAX = xInverse(newX);
        if (newAX >= min && newAX <= max){
            ax = newAX;
            update();
        }
    });


    a.call(aDrag);

    flags.append("text")
      .attr("id", "between")
      .attr("x", xScale(mean))
      .attr("y", yScale(0.03))
      .attr("text-anchor", "middle")
      .attr("fill", "black");


    function createFlag(x, id){
        f = flags.append("g")
                .attr("class", "flag")
                .attr("id", id)
                .attr("transform", "translate(" + xScale(x) + ")")

        f.append("line")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", yScale(0))
            .attr("y2", yScale(0.08))
            .attr("stroke", "black")
            .attr("stroke-width", 3);

      f.append("text")
        .attr("id", "arrow")
        .attr("y", yScale(0) + 12)
        .attr("text-anchor", "left")
        .attr("fill", "black");
        return f;
    }


    //add an update function

    function setLeft(x) {
        shade.selectAll("*").remove();
        d3.select("#a.flag").attr("transform", "translate(" + xScale(x) + ")");

        $('#z-val')
            .attr("text-anchor", "end")
            .text("Test statistic: Z = " + x.toFixed(2));

        d3.selectAll("#a.flag").select("#arrow")
          .attr("text-anchor", "end")
          .attr("x", 7)
          .html('&#x25B2;');

        flags.select("#between")
            .text("");

        leftCurve = inRange(data, min, x);
        renderCurve(shade, leftCurve, "green", "what?");
    }

    function update(){
        var x1 = parseFloat($('#x1-slider').val());
        var n1 = parseFloat($('#n1-slider').val());
        var x2 = parseFloat($('#x2-slider').val());
        var n2 = parseFloat($('#n2-slider').val());
        var pbar = (x1+x2)/(n1+n2);
        var pdiff = x1/n1 - x2/n2;
        var se_val = Math.pow((pbar * (1-pbar)/n1)+(pbar * (1-pbar)/n2), 0.5);
        var z_val = pdiff/se_val;
        setLeft(z_val);
        var prob = cdf(z_val, mean,SD)-cdf(min,mean,SD)
        var prob_str = '-0.000' == prob.toFixed(3) ? '0.000' : prob.toFixed(3);
        console.log(prob);
        $('#z-scores').html('The green area to the left of the Z value = ' + prob_str + '<br>'
            + 'The blue area to the right of the Z value = ' + (1-prob).toFixed(3));
        //set up outer curves

    }

    function inRange(data, x, y){
      result = [];
      for(var i = 0; i < data.length; i++){
        d = data[i];
        if (d.q >= x && d.q <= y){
          result.push(d);
        }
      }

      return result;
    }

    function getProbabilities(mean, SD, min, bins, binWidth){
        var probs = [];
        for(var i = 0; i < bins; i++){
            var q = min + i * binWidth;
            probs.push({q: q, p: p(q, mean, SD)});
        }
        return probs;
    }

    function getAxis(scale){
        axis.selectAll("*").remove();

        var xAxis = d3.svg.axis()
          .scale(scale)
          .orient('bottom');

        axis.attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
    }

    function renderCurve(svg, data, color, name){
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

    //the maths:

    function p(val, mean, SD){
            var x1 = (val*100 + 10)/100,
            x2 = (val*100 -10)/100;
          return (cdf(x1, mean, SD) - cdf(x2, mean, SD));
    }

    function cdf(val, mean, SD) {
        //
        return 0.5 * (1 + erf((val - mean) / ((Math.sqrt(2) * SD))));
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

    function latexFraction(s1, s2) {
        return '\\frac{' + s1 + '}{' + s2 + '}';
    }

    function latexColor(str, color) {
        return '{\\color{' + color + '} ' + str + '}';
    }

    function generateInnerHtml(x1, n1, x2, n2) {
        var pbar = (x1+x2)/(n1+n2);
        var green_pbar = latexColor(pbar.toFixed(3), 'green');
        var pdiff = x1/n1 - x2/n2;
        var red_pdiff = latexColor(pdiff.toFixed(3), 'red');
        var se_val = Math.pow((pbar * (1-pbar)/n1)+(pbar * (1-pbar)/n2), 0.5);
        var blue_se = latexColor(se_val.toFixed(3), 'blue');
        var z_val = pdiff/se_val;

        var pval_diff = '$$\\hat{p}_{1}-\\hat{p}_{2}=' + latexFraction(x1, n1) + '-' + latexFraction(x2, n2) + '=' + red_pdiff + '$$';
        var pval_sum = '$$\\bar{p}=' + latexFraction(x1.toString() + '+' + x2.toString(), n1.toString() + '+'+ n2.toString()) + '=' + green_pbar + '$$';
        var se = '$$SE=\\sqrt{' + latexFraction(green_pbar + '(1-' + green_pbar + ')', n1) + '+' + latexFraction(green_pbar + '(1-' + green_pbar + ')', n2) + '}\\approx ' + blue_se +'$$';
        var z = '$$Z=' + latexFraction(red_pdiff, blue_se) + '=' + '\\mathbf{' + z_val.toFixed(3) + '}' + '$$';
        return pval_diff + pval_sum + se + z;
    }

    function updateTestStatistics() {
        var x1 = parseFloat($('#x1-slider').val());
        var n1 = parseFloat($('#n1-slider').val());
        var x2 = parseFloat($('#x2-slider').val());
        var n2 = parseFloat($('#n2-slider').val());
        $('#test-statistic').html(generateInnerHtml(x1, n1, x2, n2));
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,'test-statistic']);
    }

    function reset() {
        var default_n = 250;
        var default_x = 126;
        $('#test-statistic').hide();
        $('#graph-container').hide();
        $('#test-stat-cal').attr('checked', false);
        $('#x1-val').text(default_x);
        $('#x2-val').text(default_x);
        $('#n1-val').text(default_n);
        $('#n2-val').text(default_n);
        $('#x1-slider').val(default_x);
        $('#x2-slider').val(default_x);
        $('#n1-slider').val(default_n);
        $('#n2-slider').val(default_n);
    }

//slider

// Slider Code
  $('#n1-val').text($('#n1-slider').val());
  $('#x1-val').text($('#x1-slider').val());

  $('#n2-val').text($('#n2-slider').val());
  $('#x2-val').text($('#x2-slider').val());
  $('#actual-diff-val').text($('#actual-diff-slider').val());


  $('#n1-slider').on('input', function() {
    $('#n1-val').text(this.value);
    var x_val = parseFloat($('#x1-slider').val());
    if (x_val > parseFloat(this.value)) {
        x_val = this.value;
    }
    $('#x1-slider').attr('max', this.value)
    $('#x1-val').text(x_val);
    $('#x1-slider').val(x_val);
  });

  $('#x1-slider').on('input', function() {
    $('#x1-val').text(this.value);
  });

  $('#n2-slider').on('input', function() {
    $('#n2-val').text(this.value);
    var x_val = parseFloat($('#x2-slider').val());
    if (x_val > parseFloat(this.value)) {
        x_val = this.value;
    }
    $('#x2-slider').attr('max', this.value)
    $('#x2-val').text(x_val);
    $('#x2-slider').val(x_val);
  });

  $('#x2-slider').on('input', function() {
    $('#x2-val').text(this.value);
  });

  $('#find-stat').click(function() {
    if (!$('#test-stat-cal').is(':checked')) {
        $('#graph-container').show();
    }
    update();
    updateTestStatistics();
  });

  $('#reset').click(function() {
    reset();
  });

  $('#test-stat-cal').click(function() {
    if ($(this).is(':checked')) {
        $('#graph-container').hide();
        $('#test-statistic').show();
    } else {
        $('#graph-container').show();
        $('#test-statistic').hide();
    }
  });

  reset();

});
