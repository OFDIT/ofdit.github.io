function normal_random(mean, variance) {
  if (mean == undefined)
    mean = 0.0;
  if (variance == undefined)
    variance = 1.0;
  var V1, V2, S;
  do {
    var U1 = Math.random();
    var U2 = Math.random();
    V1 = 2 * U1 - 1;
    V2 = 2 * U2 - 1;
    S = V1 * V1 + V2 * V2;
  } while (S > 1);

  X = Math.sqrt(-2 * Math.log(S) / S) * V1;
//Y = Math.sqrt(-2 * Math.log(S) / S) * V2;
  X = mean + Math.sqrt(variance) * X;
//Y = mean + Math.sqrt(variance) * Y ;
  return X;
}


$(document).ready(function(){
var axis = d3.select("#axis")
  .attr('width',600)
  .attr('height',100)
  .attr('style','background: lightblue');

var sample = d3.select("#sample")
  .attr('width',170)
  .attr('height',100)
  .attr('style','background: lightgrey');

 var averagesvg = d3.select("#average")
  .attr('width',210)
  .attr('height',60)

var samplearr = [];
var sample1 = sample.append("text").attr("y",20).attr("x",20); samplearr.push(sample1);
var sample2 = sample.append("text").attr("y",20).attr("x",70); samplearr.push(sample2);
var sample3 = sample.append("text").attr("y",20).attr("x",120); samplearr.push(sample3);
var sample4 = sample.append("text").attr("y",50).attr("x",20); samplearr.push(sample4);
var sample5 = sample.append("text").attr("y",50).attr("x",70); samplearr.push(sample5);
var sample6 = sample.append("text").attr("y",50).attr("x",120); samplearr.push(sample6);
var sample7 = sample.append("text").attr("y",80).attr("x",20); samplearr.push(sample7);
var sample8 = sample.append("text").attr("y",80).attr("x",70); samplearr.push(sample8);
var sample9 = sample.append("text").attr("y",80).attr("x",120); samplearr.push(sample9);

var marker = axis.append("text").attr("y",85).attr("class","marker");


width = 550;
  var scaleX = d3.scale.linear()
    .range([50,width])
    .domain([3000,4000]);

  var xAxis = d3.svg.axis()
                  .scale(scaleX)
                  .orient("bottom");

axis.append("g")
    .attr("class","axis")
    .attr('transform', 'translate(0,' + 50 + ')')
    .call(xAxis);

axis.append("text")
    .attr("x","230")
    .attr("y","20")
    .text("Sampling Distribution")


var averagetext = averagesvg.append("text").attr("x",10).attr("y",30).text("Sample statistic: " + d3.select("#xbar").text() + " = ");


var counter = 0;
var sampleMeans = d3.select("#sampleMeans");
var counter2=0;

var button = d3.select("#samplebutton")
	button.on("click",function(){
		if(counter2<16){
			var average = 0;
			for(var i = 0; i < 9; i++){
				var randNumb = normal_random(3500,410*410);
				samplearr[counter].text(randNumb.toFixed([0]));
				counter++;
				average = average+randNumb;
			}
			var average= average/9;
			averagetext.text("Sample statistic: " + d3.select("#xbar").text() + " = " + average.toFixed([0]));
			counter = 0;

			axis.append("circle").attr("cx", 50+500*(average-3000)/(1000)).attr("cy", 50).attr("r", 5).style("fill", "black");
			marker.attr("x",46.5+500*(average-3000)/(1000)).text("^");
      if(counter2 != 0){
        sampleMeans.text(sampleMeans.text()+ ", ");
      }
			sampleMeans.text(sampleMeans.text()+average.toFixed([0]));
			counter2++;
		}

	})

var reset = d3.select("#resetbutton")
	reset.on("click",function(){
		d3.select("#axis").selectAll("circle").remove();
		marker.text(" ");
		for(var j=0; j<9; j++){
			samplearr[j].text(" ");
		}
		averagetext.text("Sample statistic: " + d3.select("#xbar").text() + " = ");
		sampleMeans.text("Sample Means: ");
		counter2 = 0;



	})

})
