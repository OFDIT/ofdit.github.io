$(document).ready(function(){
//------ Set up graph --------
  RECT_WIDTH = 5;
  Y_MAX = 500;
  BOX_START = 200;
  BOX_HEIGHT = 15;

  var margin = {top: 20, right: 15, bottom: 60, left: 60}
    , width = 350 - margin.left - margin.right
    , height = 250 - margin.top - margin.bottom;

  var x = d3.scale.linear()
            .domain([-1, 1])
            .range([ 0, width ]);

  var y = d3.scale.linear()
          .domain([-200, Y_MAX])
          .range([ height, 0 ]);

  var chart = d3.select('#graph')
    .append('svg:svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .attr('class', 'chart')
    .attr('id', 'chart')

  var main = chart.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'main')
    .attr('id', 'main')

  // draw the x axis
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

  main.append('g')
    .attr('transform', 'translate(0,' + y(0) + ')')
    .attr('class', 'main axis date')
    .call(xAxis);

  // draw the y axis
  var yAxis = d3.svg.axis()
    .scale(y)
    .tickValues([0, 100, 200, 300, 400, 500])
    .orient('left');

  main.append('g')
    .attr('transform', 'translate(' + x(-0.3) + ',0)')
    .attr('class', 'main axis date')
    .call(yAxis);

  var g = main.append("svg:g")
                .attr('id', 'graph-body');

  var drawRect = function(x_val, y_val) {
    var converted_height = y(0) - y(y_val);
    g.append('rect')
      .attr("x", x(x_val) - RECT_WIDTH/2)
      .attr("y", y(y_val))
      .attr("height", converted_height)
      .attr("width", RECT_WIDTH)
      .attr('fill', 'green')
      .attr('class','bar');
  }

  var drawDashedLine = function(x_val, isMean) {
    g.append('line')
      .attr('class', 'd3-dp-line')
      .attr('x1', x(x_val))
      .attr('y1', y(Y_MAX))
      .attr('x2', x(x_val))
      .attr('y2',isMean ? y(0 - BOX_HEIGHT * 2) : y(0))
      .attr('class', 'dashed-line')
      .attr('stroke','black')
      .style('stroke-dasharray', ('3','3'));
  }

var drawSDBoxes = function(mean, sd) {
  for (var sd_distance = -2; sd_distance < 2; sd_distance++) {
    var color = '#DEF0FF';
    if (sd_distance == -2 || sd_distance == 1) {
      color = 'yellow';
    }
    g.append('rect')
      .attr("x", x(mean + sd * sd_distance))
      .attr("y", y(0 - BOX_HEIGHT - 100))
      .attr("height", BOX_HEIGHT)
      .attr("width", x(mean + sd * (sd_distance+1)) - x(mean + sd * sd_distance))
      .attr('fill', color)
      .attr('class', 'sd-box')
      .style('stroke', 'black');
  }
}

var updateObservedDiff = function(diff) {
  var equation_text = 'p&#x0302;<sub>1</sub>-p&#x0302;<sub>2</sub> = ';
  $('#diff-eqtn').html(equation_text + diff);
  $('#diff-eqtn').offset({left:x(diff) + 15, top:370});
  $('#diff-line').remove();
  g.append('line')
    .attr('class', 'd3-dp-line')
    .attr('x1', x(diff))
    .attr('y1', y(Y_MAX))
    .attr('x2', x(diff))
    .attr('y2', y(0 - BOX_HEIGHT - 100) + BOX_HEIGHT)
    .attr('stroke','red')
    .attr('id', 'diff-line');
}

//------End Set Up Graph----------


  pValueForSample = function(sample) {
    var numYes = 0;
    for (var i = 0; i < sample.length; i++) {
      if (sample[i]) {
        numYes++;
      }
    }
    return numYes/sample.length;
  }

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

  sampleDiff = function(p1, n1, p2, n2) {
    samp1 = drawRandomSample(p1, n1);
    samp2 = drawRandomSample(p2, n2);
    p1 = pValueForSample(samp1);
    p2 = pValueForSample(samp2);
    return p1 - p2;
  };

  var roundTo2Places = function(num) {
    return parseFloat(num.toFixed(2));
  }

  var mean = function(counts) {
    var sum = 0;
    var total_counts = 0;
    for (var num in counts) {
      sum += num * counts[num];
      total_counts += counts[num];
    }
    return sum/total_counts;
  }

  var sd = function(counts) {
    var squared_sum = 0;
    var mean_val = mean(counts);
    var total_counts = 0;
    for (var num in counts) {
      squared_sum += Math.pow(num - mean_val, 2) * counts[num];
      total_counts += counts[num];
    }
    return Math.pow(squared_sum/total_counts, 0.5);
  }

  var reset = function() {
    $('.bar').remove();
    $('.dashed-line').remove();
    $('.sd-box').remove();
    $('#mean-val').text('mean =');
    $('#diff-eqtn').hide();
    $('#main').hide();
    $('#mean-val').hide();
  }

  $('#draw').click(function() {
    reset();
    var counts = {};
    $('#diff-eqtn').show();
    $('#main').show();
    $('#mean-val').show();
    updateObservedDiff($('#actual-diff-slider').val());
    var n1 = $('#n1-slider').val();
    var p1 = $('#p1-slider').val();
    var n2 = $('#n2-slider').val();
    var p2 = $('#p2-slider').val();
    for (var i = 0; i < 5000; i++) {
      var diff = roundTo2Places(sampleDiff(p1, n1, p2, n2));
      if (!(diff in counts)) {
        counts[diff] = 0;
      }
      counts[diff]++;
    }
    for (var diff in counts) {
      drawRect(diff, counts[diff]);
    }
    var standard_deviation = sd(counts);
    var mean_val = mean(counts);
    $('#mean-val').text('mean = ' + mean_val.toFixed(3));
    drawDashedLine(mean_val, true);
    drawDashedLine(mean_val - standard_deviation, false);
    drawDashedLine(mean_val + standard_deviation, false);
    drawDashedLine(mean_val - 2*standard_deviation, false);
    drawDashedLine(mean_val + 2*standard_deviation, false);
    drawSDBoxes(mean_val, standard_deviation);
  });

  $('#reset').click(function() {
    reset();
  })

// Slider Code
  $('#n1-val').text($('#n1-slider').val());
  $('#p1-val').text(parseFloat($('#p1-slider').val()).toFixed(2));

  $('#n2-val').text($('#n2-slider').val());
  $('#p2-val').text(parseFloat($('#p2-slider').val()).toFixed(2));
  $('#actual-diff-val').text($('#actual-diff-slider').val());


  $('#n1-slider').on('input', function() {
    $('#n1-val').text(this.value);
  });

  $('#p1-slider').on('input', function() {
    $('#p1-val').text(parseFloat(this.value).toFixed(2));
  });

  $('#n2-slider').on('input', function() {
    $('#n2-val').text(this.value);
  });

  $('#p2-slider').on('input', function() {
    $('#p2-val').text(parseFloat(this.value).toFixed(2));
  });

  $('#actual-diff-slider').on('input', function() {
    $('#actual-diff-val').text(parseFloat(this.value).toFixed(2));
    updateObservedDiff(this.value);
  });

  reset();

});
