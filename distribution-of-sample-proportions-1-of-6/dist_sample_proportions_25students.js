

$(document).ready(function(){
var newplot = dotplot().plot("#dotplot", 0, 1);
//stores all circles in an array
var circArray = [0];
var Fcircle = d3.select("#Fcircle");
var Mcircle = d3.select("#Mcircle");
var circle1 = d3.select("#circle1"); circArray.push(circle1);
var circle2 = d3.select("#circle2"); circArray.push(circle2);
var circle3 = d3.select("#circle3"); circArray.push(circle3);
var circle4 = d3.select("#circle4"); circArray.push(circle4);
var circle5 = d3.select("#circle5"); circArray.push(circle5);
var circle6 = d3.select("#circle6"); circArray.push(circle6);
var circle7 = d3.select("#circle7"); circArray.push(circle7);
var circle8 = d3.select("#circle8"); circArray.push(circle8);
var circle9 = d3.select("#circle9"); circArray.push(circle9);
var circle10 = d3.select("#circle10"); circArray.push(circle10);
var circle11 = d3.select("#circle11"); circArray.push(circle11);
var circle12 = d3.select("#circle12"); circArray.push(circle12);
var circle13 = d3.select("#circle13"); circArray.push(circle13);
var circle14 = d3.select("#circle14"); circArray.push(circle14);
var circle15 = d3.select("#circle15"); circArray.push(circle15);
var circle16 = d3.select("#circle16"); circArray.push(circle16);
var circle17 = d3.select("#circle17"); circArray.push(circle17);
var circle18 = d3.select("#circle18"); circArray.push(circle18);
var circle19 = d3.select("#circle19"); circArray.push(circle19);
var circle20 = d3.select("#circle20"); circArray.push(circle20);
var circle21 = d3.select("#circle21"); circArray.push(circle21);
var circle22 = d3.select("#circle22"); circArray.push(circle22);
var circle23 = d3.select("#circle23"); circArray.push(circle23);
var circle24 = d3.select("#circle24"); circArray.push(circle24);
var circle25 = d3.select("#circle25"); circArray.push(circle25);

var pushcounter = 0;
var SPlist = d3.select("#SP");
var SP2list = d3.select("#SP2");
var Fmarker = d3.select("#Fmarker");
var Mmarker = d3.select("#Mmarker");
var girlarray = [];

//randomly assigns circles genders when button is clicked
var button = d3.select("#samplebutton");
button.on("click",function(){
	d3.select("#svg").attr("display","block");
	d3.select("#textbox").attr("display","block");
	d3.selectAll(".arrow").attr("display","block")
	if(pushcounter < 10){
		pushcounter++;
		var girlcount = 0;
		var randInt;
		for(var i = 1; i < 26; i++){
	  		randInt = Math.random();
	  		if(randInt > 0.6){
	  			circArray[i].style("fill","blue");
	  		}
	  		else{
	  			circArray[i].style("fill","red");
	  			girlcount++;
	  		}
		}
		Fmarker.text('= F = ' + girlcount);
		Mmarker.text('= M = ' + (25-girlcount));
		d3.select("#SS").text('Sample statistic: ' + d3.select("#phat").text() + ' = '  + girlcount+"/25 = "+(girlcount/25).toFixed([2]));
		girlarray.push(girlcount/25);
		newplot.update(girlarray);
		if(pushcounter < 6){
			SPlist.text(SPlist.text() + "\u00A0" +"\u00A0" + (girlcount/25).toFixed([2]));
		}
		else{
			SP2list.text(SP2list.text() + "\u00A0" +"\u00A0" + (girlcount/25).toFixed([2]));
		}
	}

})

//reloads the window when reset button is clicked
var reset = d3.select("#resetbutton");
	reset.on("click",function(){
	window.location.reload();
})
});
