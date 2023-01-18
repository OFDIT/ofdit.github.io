

$(document).ready(function(){
var newplot = dotplot().plot("#dotplot", 0, 1);
var Marray = [];

katex.render("Chi" + "^2" + " = ",equation);

function calculatechi(c1, c2, c3, c4, c5, c6){
	var x = Math.pow((c1-39),2)/39;
	x+= Math.pow((c2-39),2)/39;
	x+= Math.pow((c3-42),2)/42;
	x+= Math.pow((c4-72),2)/72;
	x+= Math.pow((c5-60),2)/60;
	x+= Math.pow((c6-48),2)/48;
	return x;
}

//alert("before button");
var button = d3.select("#samplebutton");
button.on("click",function(){
		var colors = [0,0,0,0,0,0];
		for(var i=0; i<300; i++){
			var randNumb = Math.random() * (301 - 1);
			if(0 <= randNumb && randNumb < 39){
				colors[0]++;
			}
			else if(39 <= randNumb && randNumb < 78){
				colors[1]++;
			}
			else if(78 <= randNumb && randNumb < 120){
				colors[2]++;
			}
			else if(120 <= randNumb && randNumb < 192){
				colors[3]++;
			}
			else if(192 <= randNumb && randNumb < 252){
				colors[4]++;
			}
			else if(252 <= randNumb && randNumb < 300){
				colors[5]++;
			}
		}
		d3.select("#Brown").text(colors[0]);
		d3.select("#Red").text(colors[1]);
		d3.select("#Yellow").text(colors[2]);
		d3.select("#Blue").text(colors[3]);
		d3.select("#Orange").text(colors[4]);
		d3.select("#Green").text(colors[5]);

		Marray.push(calculatechi(colors[0],colors[1],colors[2],colors[3],colors[4],colors[5])/20);






		newplot.update(Marray);


	katex.render("Chi" + "^2" + " = " + "(" + colors[0] + "-39)^2/39" + " + " + "(" + colors[1] + "-39)^2/39"
			+ " + " + "(" + colors[2] + "-42)^2/42" + " + " + "(" + colors[3] + "-72)^2/72" + " + " + "(" + colors[4] + "-60)^2/60" + " + " + "(" + colors[5] + "-48)^2/48"
			+ " = " + calculatechi(colors[0],colors[1],colors[2],colors[3],colors[4],colors[5]).toFixed([2]), equation);

})
var reset = d3.select("#resetbutton");
reset.on("click",function(){
window.location.reload();
})
});
