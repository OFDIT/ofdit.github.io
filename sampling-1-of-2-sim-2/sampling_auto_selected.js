
$(document).ready(function(){
//creates a variable for each circle
var circle1 = d3.select("#circle1")
var circle2 = d3.select("#circle2")
var circle3 = d3.select("#circle3")
var circle4 = d3.select("#circle4")
var circle5 = d3.select("#circle5")
var circle6 = d3.select("#circle6")
var circle7 = d3.select("#circle7")
var circle8 = d3.select("#circle8")
var circle9 = d3.select("#circle9")
var circle10 = d3.select("#circle10")
var circle11 = d3.select("#circle11")
var circle12 = d3.select("#circle12")
var circle13 = d3.select("#circle13")
var circle14 = d3.select("#circle14")
var circle15 = d3.select("#circle15")
var circle16 = d3.select("#circle16")
var circle17 = d3.select("#circle17")
var circle18 = d3.select("#circle18")
var circle19 = d3.select("#circle19")
var circle20 = d3.select("#circle20")
var circle21 = d3.select("#circle21")
var circle22 = d3.select("#circle22")
var circle23 = d3.select("#circle23")
var circle24 = d3.select("#circle24")
var circle25 = d3.select("#circle25")
var circle26 = d3.select("#circle26")
var circle27 = d3.select("#circle27")
var circle28 = d3.select("#circle28")
var circle29 = d3.select("#circle29")
var circle30 = d3.select("#circle30")
var circle31 = d3.select("#circle31")
var circle32 = d3.select("#circle32")
var circle33 = d3.select("#circle33")
var circle34 = d3.select("#circle34")
var circle35 = d3.select("#circle35")
var circle36 = d3.select("#circle36")
var circle37 = d3.select("#circle37")
var circle38 = d3.select("#circle38")
var circle39 = d3.select("#circle39")
var circle40 = d3.select("#circle40")
var circle41 = d3.select("#circle41")
var circle42 = d3.select("#circle42")
var circle43 = d3.select("#circle43")
var circle44 = d3.select("#circle44")
var circle45 = d3.select("#circle45")
var circle46 = d3.select("#circle46")
var circle47 = d3.select("#circle47")
var circle48 = d3.select("#circle48")
var circle49 = d3.select("#circle49")
var circle50 = d3.select("#circle50")
var circle51 = d3.select("#circle51")
var circle52 = d3.select("#circle52")
var circle53 = d3.select("#circle53")
var circle54 = d3.select("#circle54")
var circle55 = d3.select("#circle55")
var circle56 = d3.select("#circle56")
var circle57 = d3.select("#circle57")
var circle58 = d3.select("#circle58")
var circle59 = d3.select("#circle59")
var circle60 = d3.select("#circle60")


var button = d3.select("#samplebutton")
//generates a random sample when button is clicked
button.on("click",function(){
	var allCircles = d3.selectAll("circle");
	allCircles.style("fill","purple");
	var randarray = [];
	var randInt;
	for(var i = 0; i < 5; i++){
  		randInt = Math.floor(Math.random()*60+1);
  		while(randarray.indexOf(randInt) != -1){
  			randInt = Math.floor(Math.random()*60+1);
  		}
  		randarray.push(randInt);
	}

	var radiusarray = [];
	for(var j = 0; j < 5; j++){
		  switch(randarray[j]){
		  	case 1: circle1.style("fill","orange"); radiusarray.push(circle1.attr("r")); break;
		  	case 2: circle2.style("fill","orange"); radiusarray.push(circle2.attr("r")); break;
		  	case 3: circle3.style("fill","orange"); radiusarray.push(circle3.attr("r"));break;
		  	case 4: circle4.style("fill","orange"); radiusarray.push(circle4.attr("r"));break;
		  	case 5: circle5.style("fill","orange"); radiusarray.push(circle5.attr("r"));break;
		  	case 6: circle6.style("fill","orange"); radiusarray.push(circle6.attr("r"));break;
		  	case 7: circle7.style("fill","orange"); radiusarray.push(circle7.attr("r"));break;
		  	case 8: circle8.style("fill","orange"); radiusarray.push(circle8.attr("r"));break;
		  	case 9: circle9.style("fill","orange"); radiusarray.push(circle9.attr("r"));break;
		  	case 10: circle10.style("fill","orange"); radiusarray.push(circle10.attr("r"));break;
		  	case 11: circle11.style("fill","orange"); radiusarray.push(circle11.attr("r"));break;
		  	case 12: circle12.style("fill","orange"); radiusarray.push(circle12.attr("r"));break;
		  	case 13: circle13.style("fill","orange"); radiusarray.push(circle13.attr("r"));break;
		  	case 14: circle14.style("fill","orange"); radiusarray.push(circle14.attr("r"));break;
		  	case 15: circle15.style("fill","orange"); radiusarray.push(circle15.attr("r"));break;
		  	case 16: circle16.style("fill","orange"); radiusarray.push(circle16.attr("r"));break;
		  	case 17: circle17.style("fill","orange"); radiusarray.push(circle17.attr("r"));break;
		  	case 18: circle18.style("fill","orange"); radiusarray.push(circle18.attr("r"));break;
		  	case 19: circle19.style("fill","orange"); radiusarray.push(circle19.attr("r"));break;
		  	case 20: circle20.style("fill","orange"); radiusarray.push(circle20.attr("r"));break;
		  	case 21: circle21.style("fill","orange"); radiusarray.push(circle21.attr("r"));break;
		  	case 22: circle22.style("fill","orange"); radiusarray.push(circle22.attr("r"));break;
		  	case 23: circle23.style("fill","orange"); radiusarray.push(circle23.attr("r"));break;
		  	case 24: circle24.style("fill","orange"); radiusarray.push(circle24.attr("r"));break;
		  	case 25: circle25.style("fill","orange"); radiusarray.push(circle25.attr("r"));break;
		  	case 26: circle26.style("fill","orange"); radiusarray.push(circle26.attr("r"));break;
		  	case 27: circle27.style("fill","orange"); radiusarray.push(circle27.attr("r"));break;
		  	case 28: circle28.style("fill","orange"); radiusarray.push(circle28.attr("r"));break;
		  	case 29: circle29.style("fill","orange"); radiusarray.push(circle29.attr("r"));break;
		  	case 30: circle30.style("fill","orange"); radiusarray.push(circle30.attr("r"));break;
		  	case 31: circle31.style("fill","orange"); radiusarray.push(circle31.attr("r")); break;
		  	case 32: circle32.style("fill","orange"); radiusarray.push(circle32.attr("r")); break;
		  	case 33: circle33.style("fill","orange"); radiusarray.push(circle33.attr("r"));break;
		  	case 34: circle34.style("fill","orange"); radiusarray.push(circle34.attr("r"));break;
		  	case 35: circle35.style("fill","orange"); radiusarray.push(circle35.attr("r"));break;
		  	case 36: circle36.style("fill","orange"); radiusarray.push(circle36.attr("r"));break;
		  	case 37: circle37.style("fill","orange"); radiusarray.push(circle37.attr("r"));break;
		  	case 38: circle38.style("fill","orange"); radiusarray.push(circle38.attr("r"));break;
		  	case 39: circle39.style("fill","orange"); radiusarray.push(circle39.attr("r"));break;
		  	case 40: circle40.style("fill","orange"); radiusarray.push(circle40.attr("r"));break;
		  	case 41: circle41.style("fill","orange"); radiusarray.push(circle41.attr("r"));break;
		  	case 42: circle42.style("fill","orange"); radiusarray.push(circle42.attr("r"));break;
		  	case 43: circle43.style("fill","orange"); radiusarray.push(circle43.attr("r"));break;
		  	case 44: circle44.style("fill","orange"); radiusarray.push(circle44.attr("r"));break;
		  	case 45: circle45.style("fill","orange"); radiusarray.push(circle45.attr("r"));break;
		  	case 46: circle46.style("fill","orange"); radiusarray.push(circle46.attr("r"));break;
		  	case 47: circle47.style("fill","orange"); radiusarray.push(circle47.attr("r"));break;
		  	case 48: circle48.style("fill","orange"); radiusarray.push(circle48.attr("r"));break;
		  	case 49: circle49.style("fill","orange"); radiusarray.push(circle49.attr("r"));break;
		  	case 50: circle50.style("fill","orange"); radiusarray.push(circle50.attr("r"));break;
		  	case 51: circle51.style("fill","orange"); radiusarray.push(circle51.attr("r"));break;
		  	case 52: circle52.style("fill","orange"); radiusarray.push(circle52.attr("r"));break;
		  	case 53: circle53.style("fill","orange"); radiusarray.push(circle53.attr("r"));break;
		  	case 54: circle54.style("fill","orange"); radiusarray.push(circle54.attr("r"));break;
		  	case 55: circle55.style("fill","orange"); radiusarray.push(circle55.attr("r"));break;
		  	case 56: circle56.style("fill","orange"); radiusarray.push(circle56.attr("r"));break;
		  	case 57: circle57.style("fill","orange"); radiusarray.push(circle57.attr("r"));break;
		  	case 58: circle58.style("fill","orange"); radiusarray.push(circle58.attr("r"));break;
		  	case 59: circle59.style("fill","orange"); radiusarray.push(circle59.attr("r"));break;
		  	case 60: circle60.style("fill","orange"); radiusarray.push(circle60.attr("r"));break;
		  
	  	}
	}
	var average = 0;
	for(var k = 0; k<5; k++){
		average = average+parseFloat(radiusarray[k]);
	}
	average = average/5;
	d3.select("p").text('Average diameter: '+average);

})

var resetbutton = d3.select("#resetbutton")
resetbutton.on("click",function(){
	var allCircles2 = d3.selectAll("circle");
	allCircles2.style("fill","purple");
	d3.select("p").text('Average diameter: ');
	})
});