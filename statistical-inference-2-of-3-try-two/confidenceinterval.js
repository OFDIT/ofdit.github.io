

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
  //var randNumb = (((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3)/2+0.6;
  //return randNumb;
}




$(document).ready(function(){
var textbox = d3.select("#textbox");
var axis = d3.select("#axis")
  .attr('width',600)
  .attr('height',100)
  .attr('style','background: lightblue');

width = 550;
  var scaleX = d3.scale.linear()
    .range([50,width])
    .domain([0,1]);

  var xAxis = d3.svg.axis()
                  .scale(scaleX)
                  .orient("bottom");

axis.append("g")
    .attr("class","axis")
    .attr('transform', 'translate(0,' + 50 + ')')
    .call(xAxis);

var intervalRect = axis.append("rect").style("fill", "green");
var sampleCircle = axis.append("circle").attr("cx", 350).attr("cy", 50).attr("r", 5).style("fill", "blue");
var upperCircle = axis.append("circle").attr("cx", 350).attr("cy", 50).attr("r", 5).style("fill", "green");
var lowerCircle = axis.append("circle").attr("cx", 350).attr("cy", 50).attr("r", 5).style("fill", "green");
axis.append("circle").attr("cx", 350).attr("cy", 50).attr("r", 5).style("fill", "black");
var lowertext = axis.append("text");
var sampletext = axis.append("text");
var uppertext = axis.append("text");


var button = d3.select("#samplebutton")
button.on("click",function(){
  var randNumb = normal_random(.6,.049*.049);
  randNumb = randNumb.toFixed([2]);
  var confidenceInterval = d3.select("#confidenceInterval");
  var sampleProportion = d3.select("#sampleProportion");
  var upperLimit = d3.select("#upperLimit");
  var lowerLimit = d3.select("#lowerLimit");

  confidenceInterval.attr("display","block");
  upperLimit.attr("display","block");
  sampleProportion.attr("display","block");
  lowerLimit.attr("display","block");
  d3.select("#rect1").attr("display","block");
  d3.select("#rect2").attr("display","block");
  d3.select("#text1").attr("display","block");
  d3.select("#text2").attr("display","block");
  d3.select("#text3").attr("display","block");
  d3.select("#text4").attr("display","block");
  d3.select("#yrect1").attr("display","block");
  d3.select("#yrect2").attr("display","block");
  d3.select("#yrect3").attr("display","block");
  d3.select("#yrect4").attr("display","block");
  d3.select("#yrect5").attr("display","block");
  d3.select("#text10").attr("display","block");

  var randNumb2 = parseFloat(randNumb)+2.0*0.049;
  var upperNumb = randNumb2;
  var lowerNumb = randNumb-2.0*0.049;

  var lowerNumbString = lowerNumb.toFixed([2]).toString();
  var randNumbtxt = randNumb.toString();

  sampleProportion.text("Sample Proportion = " + d3.select("#phat").text() + " = " + randNumbtxt);
  //sampleProportion.text("Sample Proportion = " + d3.select("#phat").text() + " = " + randNumbtxt);
  lowerLimit.text("lower limit = " + randNumb + "-2.0*0.049 = " + lowerNumbString);
  upperLimit.text("upper limit = " + randNumb + "+2.0*0.049 = " + upperNumb.toFixed([2]));


  sampleCircle.attr("cx",50+randNumb*500);
  intervalRect.attr("x",randNumb*500).attr("y",48).attr("height",4).attr("width",100);
  upperCircle.attr("cx",100+randNumb*500);
  lowerCircle.attr("cx",randNumb*500);

  lowertext.attr("x",randNumb*500-15).attr("y",38).text(lowerNumb.toFixed([2])).style("fill","black");
  sampletext.attr("x",randNumb*500+25).attr("y",38).text(d3.select("#phat").text() + " = " + randNumb).style("fill","blue");
  uppertext.attr("x",randNumb*500+90).attr("y",38).text(upperNumb.toFixed([2])).style("fill","black");

  var yrect2 = d3.select("#yrect2");
  var yrect3 = d3.select("#yrect3");
  var yrect4 = d3.select("#yrect4");
  var yrect5 = d3.select("#yrect5");

  if(randNumb < 0.5 || randNumb > 0.7){
    intervalRect.style("fill","orange");
    upperCircle.style("fill","orange");
    lowerCircle.style("fill","orange");
    yrect2.style("fill","orange");
    //yrect3.style("fill","orange");
    yrect4.style("fill","orange");
    //yrect5.style("fill","orange");
  }
  else{
    intervalRect.style("fill","green");
    upperCircle.style("fill","green");
    lowerCircle.style("fill","green");
    yrect2.style("fill","lightgreen");
    //yrect3.style("fill","lightgreen");
    yrect4.style("fill","lightgreen");
    //yrect5.style("fill","lightgreen");
  }
})


})


//ignore this
/*<p align="center"> Population: PT college students </p>
<p style="color:darkblue" align="center"> Percent female: p=0.60 </p>
<p id="sampleProportion" align="center">Sample Proportion = p = N/A </p>
<p style="color:darkblue" align="center"> Sampling distribution: approx.normal </p>
<p align="center"> mean=.60 sd = &radic;(.60)(1-.60)/100 = 0.049</p>
<p style="color:darkblue" id="ConfidenceInterval" align="center"> 95% Confidence Interval (z* =2.0) </p>
<p id="lowerLimit" align="center">lower limit = N/A-2.0*0.049 = N/A </p>
<p style="color:darkblue" id="upperLimit" align="center">upper limit = N/A+2.0*0.049 = N/A</p>
<p align="center">  margin of error = 2.0(0.049) = .098*/
