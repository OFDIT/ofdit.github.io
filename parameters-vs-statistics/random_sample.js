$(document).ready(function(){
  SAMPLE_SIZE = 8;
  NUM_STUDENTS = 250;
  PORTION_FIN_AID = 0.60;
  FIN_AID_STUDENTS = Math.floor(NUM_STUDENTS * PORTION_FIN_AID);
  shuffle = function(arr){
    for(var j, x, i = arr.length; i; j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    return arr;
  };

  generateTable = function(students, div) {
    var students_table = $(document.createElement('table'));
    var id = students.length == SAMPLE_SIZE ? 'sample-table' : 'population-table';
    students_table.attr('id', id)
    students_table.addClass('table');
    students_table.addClass('student-table');
    students_table.css('width', 'auto')
    var header = $(document.createElement('th'));
    header.addClass('student-header');
    header.attr('colspan', '2');
    var id_head = $(document.createElement('td'));
    var fin_aid_head = $(document.createElement('td'));
    id_head.html('&nbsp&nbsp&nbsp&nbspStudent&nbsp&nbsp&nbsp&nbsp');
    fin_aid_head.html('Aid?&nbsp');
    header.append(id_head);
    header.append(fin_aid_head);
    students_table.append(header);
    var keys = Object.keys(students);

    for (var i = 0; i < keys.length; i++) {
      var student_num = parseInt(keys[i])+1;
      var tr = $(document.createElement('tr'));
      var id_cell = $(document.createElement('td'));
      var fin_aid_cell = $(document.createElement('td'));
      id_cell.text(student_num);
      fin_aid_cell.text(students[student_num-1] ? 'Yes' : 'No');
      tr.append(id_cell);
      tr.append(fin_aid_cell);
      tr.attr('id', 'student_' + student_num);
      students_table.append(tr);
    }
    div.html(students_table)
  };

  drawRandomSample = function(students) {
    var sample = {};
    for (var i = 0; i < SAMPLE_SIZE; i++) {
      var id_num;
      do {
        id_num = Math.floor(Math.random() * NUM_STUDENTS);
      } while(id_num in sample);
      sample[id_num] = students[id_num];
      $('#student_' + (id_num+1)).addClass('selected-row');
    }
    return sample;
  };

  updateStatistics = function(sample) {
    var keys = Object.keys(sample);
    var numYes = 0;
    for (var i = 0; i < keys.length; i++) {
      var hasFinAid = sample[keys[i]];
      if (hasFinAid) {
        numYes++;
      }
    }
    var p = numYes/keys.length;
    $('#portion').html('$$\\hat{p}=\\frac{' + numYes + '}{' + keys.length + '}=' + p.toFixed(2) + '$$');
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,'portion']);
    $('#num-yes').text('Yes = ' + numYes);
    // MathJax.Hub.Queue(["Typeset",MathJax.Hub,'num-yes']);
    return p;
  };

  drawAndLoadSample = function() {
    $('#sample').show();
    $('#statistics').show();
    generateTable(students, $('#population-table-container'));
    var sample = drawRandomSample(students);
    generateTable(sample, $('#sample-table-container'));
    var p = updateStatistics(sample);
    $($('#sample-table-container').children('table')[0]).addClass('sample-students')
    samplePortions.push(p);
    if (samplePortions.length <= 20) {
      $('#sample-portions1').append(p.toFixed(2) + '<br/>')
    } else if (samplePortions.length <= 40) {
      $('#sample-portions2').append(p.toFixed(2) + '<br/>')
    } else if (samplePortions.length <= 60) {
      $('#sample-portions3').append(p.toFixed(2) + '<br/>')
    }
  };

  $('#redraw').click(function() {
    drawAndLoadSample();
  });
  $('#reset').click(function() {
    $('#sample').hide();
    $('#statistics').hide();
    $('#sample-portions1').html('');
    $('#sample-portions2').html('');
    $('#sample-portions3').html('');
  });

  var students = [];
  var samplePortions = [];
  for (var i = 0; i < NUM_STUDENTS; i++) {
    if (i < FIN_AID_STUDENTS) {
      students.push(true);
    } else {
      students.push(false);
    }
  }
  shuffle(students)
  generateTable(students, $('#population-table-container'));
  $('#sample').hide();
  $('#statistics').hide();

});
