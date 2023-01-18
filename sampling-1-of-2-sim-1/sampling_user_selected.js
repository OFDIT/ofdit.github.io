$(document).ready(function(){
	var ar = 0;
	var circles = d3.selectAll('circle');
	circles.attr("fill", "purple");
	console.log(avgRadius(circles));
	var allcircles = d3.selectAll('circle');
	var display = d3.select("p");


//changes the color of the circles when clicked on
	allcircles.on("click", function(){
		if(d3.select(this).attr("fill")=="purple"){
		d3.select(this).attr("fill","orange");
		}
		else if(d3.select(this).attr("fill")=="orange"){
			d3.select(this).attr("fill","purple");
		}
		ar = avgRadius(circles);
		display.text("Average diameter: " +ar.toPrecision(3));
	})

//reverts all circles to purple when reset button is clicked
	var button = d3.select("#samplebutton");
	button.on("click",function(){
		allcircles.attr("fill","purple");
		ar = avgRadius(circles);
		display.text("Average radius: " +ar.toPrecision(3));
	})

//calculates the average radius
	function avgRadius(circles){
		var total = 0,
			active = 0;

		circles.each(function(d, i){
			var c = d3.select(this);
			if(c.attr("fill")=="orange"){
				console.log(c.attr("fill"));
				 total += parseInt(c.attr("r"));
				 active ++;
			}
		})
		var average = total/active;
		return average || 0;
	}
})

