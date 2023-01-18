$(document).ready(function(){

  RECT_WIDTH = 5
  RECT_HEIGHT = 20
  DOT_RADIUS = 3;
  SAMPLE_1_SIZE = 64;
  SAMPLE_2_SIZE = 100;
  POP_1_P = 0.26;
  POP_2_P = 0.10;
  PADDING = 2;
  CANVAS_1_LENGTH = (DOT_RADIUS * 2 + PADDING) * 8 + PADDING;
  CANVAS_2_LENGTH = (DOT_RADIUS * 2 + PADDING) * 10 + PADDING;
  FIN_AID_COLOR = '#FF0000';
  NO_FIN_AID_COLOR = '#0000FF';



// *********** Set up Axis ***********

  var points = [];
  var drawLine = function(x1, y1, x2, y2, id, color) {
    g.append("line")
      .attr('id', id)
      .attr("x1", x(x1))
      .attr("y1", y(y1))
      .attr("x2", x(x2))
      .attr("y2", y(y2))
      .attr("stroke-width", 2)
      .attr("stroke", color)
  }

  var margin = {top: 20, right: 15, bottom: 40, left: 15}
  var width = 300 - margin.left - margin.right;
  var height = 100 - margin.top - margin.bottom;

  var x = d3.scale.linear()
            .domain([0, 0.5])
            .range([ 0, width ]);

  var y = d3.scale.linear()
          .domain([0,25])
          .range([ height, 0 ]);

  var chart = d3.select('#content')
    .append('svg:svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .attr('class', 'chart')
    .attr('id', 'chart')

  var main = chart.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width)
    .attr('class', 'main')
    .attr('id', 'main')

  // draw the x axis
  var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(5)
    .orient('bottom');

  main.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'main axis date')
    .call(xAxis);

  var g = main.append("svg:g")
                .attr('id', 'graph-body');


  var updatePoints = function() {
    $('.point').remove();
    var counts = {};
    $.each(points, function(index, point) {
      if (!counts[point]) {
        counts[point] = 0;
      }
      var yVal = counts[point] * 5 + 10;
      g.append('circle')
          .attr("cx", x(point))
          .attr("cy", y(yVal))
          .attr("r", 4)
          .attr('fill', 'steelblue')
          .attr('class','point');
      counts[point]++;
    });
  }

  var addPoint = function(x_val) {
    points.push(x_val);
    $('#pointer').remove();
    g.append('text')
        .text('\u2191')
        .attr('x', x(x_val)-5)
        .attr('y', y(-25))
        .attr('font-size', '20px')
        .attr('id', 'pointer')
        .attr('fill', 'black');

    updatePoints();
  }


// *******************************

  shuffle = function(arr){
    for(var j, x, i = arr.length; i; j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    return arr;
  };

  $('#sample1').attr('width', CANVAS_1_LENGTH);
  $('#sample1').attr('height', CANVAS_1_LENGTH);
  $('#sample2').attr('width', CANVAS_2_LENGTH);
  $('#sample2').attr('height', CANVAS_2_LENGTH);

  drawRandomSample = function(portion, sample_size) {
    sample = []
    for (var i = 0; i < sample_size; i++) {
      if (Math.random() > portion) {
        sample.push(false);
      } else {
        sample.push(true);
      }
    }
    return sample;
  };


  drawSamplesFromEachPop = function(pop1, pop2) {
    samp1 = drawRandomSample(POP_1_P, SAMPLE_1_SIZE);
    samp2 = drawRandomSample(POP_2_P, SAMPLE_2_SIZE);
    p1 = pValueForSample(samp1);
    p2 = pValueForSample(samp2);
    popDiff = p1 - p2;
  };

  updateStatistics = function(sampleDiv, sample) {
    var numYes = 0;
    for (var i = 0; i < sample.length; i++) {
      var hasFinAid = sample[i];
      if (hasFinAid) {
        numYes++;
      }
    }
    var p = numYes/sample.length;
    var sampleNum = sampleDiv[sampleDiv.length - 1];
    $('#' + sampleDiv).html('$$\\hat{p_{' + sampleNum + '}}=\\frac{' + numYes + '}{' + sample.length + '}=' + p.toFixed(3) + '$$');
    $('#s' + sampleNum + '-yes').text('=' + numYes);
    $('#s' + sampleNum + '-no').text('=' + (sample.length-numYes));
    return p;
  };

  drawPopulationDots = function(canvas_id, population) {
    var ctx = document.getElementById(canvas_id).getContext("2d");
    var chart_length = Math.pow(population.length, 0.5);
    for (var row = 0; row < chart_length; row++) {
      for (var col = 0; col < chart_length; col++) {
        var studentNum = row * chart_length + col;
        ctx.beginPath();
        if (population[studentNum]) {
          ctx.fillStyle = FIN_AID_COLOR;
        } else {
          ctx.fillStyle = NO_FIN_AID_COLOR;
        }
        var x = (PADDING + DOT_RADIUS*2) * col + DOT_RADIUS + PADDING;
        var y = (PADDING + DOT_RADIUS*2) * row + DOT_RADIUS + PADDING;
        ctx.arc(x,y, DOT_RADIUS, 0, 2 * Math.PI, true);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
      }
    }
  }

  clearCanvas = function(canvas_id) {
    var canvas = document.getElementById(canvas_id);
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  roundTo2Places = function(num) {
    return parseFloat(num.toFixed(2));
  }

  drawSamples = function() {
    $('#stat-text').show();
    $('#sample-size1').hide();
    $('#sample-size2').hide();
    $('.sample-info').show();
    $('.sample-size').hide();
    $('#difference').show();
    $('.yes-no').show();
    $('.count').show();
    $('#population-arrow1').show();
    $('#population-arrow2').show();
    sample1 = drawRandomSample(POP_1_P, SAMPLE_1_SIZE);
    sample2 = drawRandomSample(POP_2_P, SAMPLE_2_SIZE);
    p1 = updateStatistics('pval-sample1', sample1);
    p2 = updateStatistics('pval-sample2', sample2);
    drawPopulationDots('sample1', sample1);
    drawPopulationDots('sample2', sample2);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,'pval-sample1']);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,'pval-sample2']);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,'difference']);

    var diff = p1 - p2;
    $('#difference').text('$$\\hat{p_{1}} - \\hat{p_{2}} = ' + diff.toFixed(3) + '$$')
    addPoint(roundTo2Places(diff));
  }


  $('#draw').click(function() {
    drawSamples();
  });

  $('#reset').click(function() {
    points = [];
    $('#stat-text').hide();
    $('.sample-info').hide();
    $('#difference').hide();
    $('.yes-no').hide();
    $('.count').hide();
    $('#population-arrow1').hide();
    $('#population-arrow2').hide();
    $('#sample-size1').show();
    $('#sample-size2').show();
    clearCanvas('sample1');
    clearCanvas('sample2');
    g.selectAll("*").remove();
  });
  $('#stat-text').hide();
  $('#population-arrow1').hide();
  $('#population-arrow2').hide();
  $('.sample-info').hide();
  $('#difference').hide();
  $('.yes-no').hide();

});
