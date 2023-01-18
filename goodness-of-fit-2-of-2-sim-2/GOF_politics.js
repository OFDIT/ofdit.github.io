

$(document).ready(function(){
var newplot = dotplot().plot("#dotplot", 0, 1);
var Marray = [];
katex.render("Chi" + "^2" + " = ",equation);

function calculatechi(c1, c2, c3){
	var x = Math.pow((c1-72),2)/72;
	x+= Math.pow((c2-114),2)/114;
	x+= Math.pow((c3-114),2)/114;
	x=parseFloat(x).toFixed(2);

	return x;
}

//alert("before button");
var button = d3.select("#samplebutton");
button.on("click",function(){
		var colors = [0,0,0,0,0,0];
		for(var i=0; i<300; i++){
			var randNumb = Math.random() * (301 - 1);
			if(0 <= randNumb && randNumb < 72){
				colors[0]++;
			}
			else if(72 <= randNumb && randNumb < 186){
				colors[1]++;
			}
			else if(186 <= randNumb && randNumb < 300){
				colors[2]++;
			}
		}
		d3.select("#lib").text(colors[0]);
		d3.select("#mod").text(colors[1]);
		d3.select("#con").text(colors[2]);


		Marray.push(calculatechi(colors[0],colors[1],colors[2])/20);

		//alert(Marray);
		var two = "2";

		/*d3.select("#equation").text(d3.select("#chi").text() + "^2" + " = " + "(" + colors[0] + "-39)^2/39" + " + " + "(" + colors[1] + "-39)^2/39"
			+ " + " + "(" + colors[2] + "-42)^2/42"+ " = " + calculatechi(colors[0],colors[1],colors[2]));
		*/newplot.update(Marray);

		katex.render("Chi" + "^2" + " = " + "(" + colors[0] + "-72)^2/72" + " + " + "(" + colors[1] + "-114)^2/114"  + " + " + "(" + colors[2] + "-114)^2/114"+ " = " + calculatechi(colors[0],colors[1],colors[2]),equation);
		newplot.update(Marray);

})
var reset = d3.select("#resetbutton");
reset.on("click",function(){
window.location.reload();
})
});
